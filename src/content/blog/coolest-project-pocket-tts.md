---
title: "The Coolest Piece of Software I've Come Across in a While"
description: "I spent weeks trying to get high-quality, on-device text-to-speech working in a mobile browser. I was about to give up. Then I found pocket-tts, and it ran on my four-year-old phone like a charm."
pubDate: 2026-06-18T19:36:22-03:00
tags: ["typescript", "tts", "webassembly", "web-audio"]
draft: false
---

## Where it started

The last few weeks, I've been on quite a ride. The kind where you pick up a feature thinking it's a couple of days of work, and somewhere around day ten you're squinting at a debug panel at midnight, genuinely wondering whether the thing you're trying to build is even possible yet.

It started simply enough. I was building a reading app (EPUBs, PDFs, the usual), but the feature I actually cared about was narration: a real, natural voice that could read a book aloud.

The first version was almost too easy. Browsers ship their own text-to-speech, the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), and it's free, runs on-device, and takes about three lines of code. I wired it up, hit play, and felt pretty pleased with myself. Done, basically.

Then I showed it to my wife.

She listened for all of ten seconds and said, flatly, that it sounded robotic. And she was right. The Web Speech API uses whatever voices your operating system happens to ship, so quality is all over the map ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)), and the default on most devices is exactly the flat, clipped voice you're picturing. Once I'd heard it through her ears, I couldn't unhear it. That voice was never going to read anyone a novel.

So began the hunt for a real one. Two constraints made it interesting. This is a personal project, so I had no intention of paying ElevenLabs by the character. I wanted something **free**. And I still wanted it to run **on-device**: no servers, no shipping the book you're reading off to someone else's cloud.

That's where the ride really started.

## The wall

My first real lead was **Kokoro**, a small neural TTS model that runs right in the browser. On my laptop, it sounded genuinely good. I was thrilled; I figured I was basically done. Then I loaded it on my phone.

It fell apart.

Here's the thing nobody tells you about browser-based ML: **desktop and mobile are two completely different planets.** On my phone, the same model that sang beautifully on my laptop produced garbled noise. So I started the long march through every knob I had:

- **WebGPU, full precision** → garbled audio. Mobile GPUs have tighter buffer limits, and the model's larger tensors just corrupted.
- **WebGPU, half precision** → *silence*. The debug panel cheerfully told me it had played 5.88 seconds of audio. My ears disagreed. Nothing came out.
- **WebGPU, 4-bit quantized** → also silent. Same lie from the debug panel.
- **WASM on the CPU** (the "it always works" fallback) → it worked! Correct, clear audio. At roughly **46 seconds to synthesize a single sentence.** Unusable.

I want to be honest about how this actually felt, because the blog posts always make debugging sound tidy. It was not tidy. I burned a real amount of time chasing ghosts:

- The narration would "stop after one sentence" with no error in the console. Turned out the model wasn't reentrant and I was firing two generations at once (prefetching the next sentence while the current one was still going). I wrote a serial queue to fix it, and the symptom *partly* improved, which sent me down the wrong path for another day, because the deeper problem was still the broken mobile GPU.
- WebGPU silently refused to turn on at all over my local network, but worked in production. That one took embarrassingly long to figure out: **WebGPU requires a secure context**, meaning HTTPS or `localhost`. A plain `http://192.168.x.x` LAN address doesn't qualify, so the worker quietly fell back and behaved differently than prod. I'd been comparing two environments that weren't the same.

I tried every precision, every backend, every quantization. The matrix had exactly zero cells that were both *correct* and *fast enough* on mobile.

And it wasn't only Kokoro. I worked through the other free, on-device options too: Piper, and a handful of ONNX-on-web ports. A few sounded decent, but they were sluggish; none of them cleared the bar I actually needed, which was natural *and* fast *and* genuinely working on a phone. After weeks of this, I was ready to concede that "good, fast, on-device TTS in a mobile browser" just wasn't a thing yet, and that I'd have to give up one of those three.

## The stumble

I did one last research pass, the kind you do when you've already half-decided to quit.

Then I tried **[pocket-tts](https://github.com/kyutai-labs/pocket-tts)**, from the folks at Kyutai. There's a browser build (compiled from Rust to WebAssembly). I opened the demo on my phone, a four-year-old Android that's not exactly a flagship, fully expecting the same disappointment.

It started talking in about a fifth of a second. And it sounded *great*. On my old phone. With no GPU heroics, no precision roulette. Just WASM on the CPU, the same fallback that took 46 seconds with the other model, except this one was **faster than real time.**

I was genuinely blown away. After weeks of fighting, the answer was a model that didn't need any of the things I'd been fighting *with*.

## Why it actually works

A couple of things make pocket-tts a fundamentally better fit for the browser than what I'd been doing.

**It streams.** Instead of synthesizing a whole sentence and then playing it, it's autoregressive: it emits audio in small chunks as it generates. Per the project, you get the first chunk in **~200ms** and it runs at roughly **6× real time on a CPU** ([pocket-tts](https://github.com/kyutai-labs/pocket-tts)). That streaming property is the whole game on mobile: you don't wait, and you never depend on the GPU.

**It's tiny and CPU-friendly.** The optimized Rust→WASM build means I don't need WebGPU to be fast. WebGPU was the source of every single one of my mobile bugs. Deleting it from the equation deleted the bugs.

On my side, the integration came down to two nice pieces of browser plumbing.

First, **streaming the PCM chunks through the Web Audio API**, scheduled back-to-back so there are no gaps:

```ts
// Each chunk arrives from the worker as Float32 PCM; schedule it
// to start exactly where the previous one ends.
const buf = ctx.createBuffer(1, chunk.length, sampleRate);
buf.copyToChannel(chunk, 0);

const src = ctx.createBufferSource();
src.buffer = buf;
src.connect(gain);

const startAt = Math.max(nextStartTime, ctx.currentTime);
src.start(startAt);
nextStartTime = startAt + buf.duration;
```

A bonus I didn't expect: this also fixed mobile autoplay. An unlocked `AudioContext` doesn't need a fresh user gesture for every clip the way `HTMLAudioElement.play()` does. You unlock it once on the play tap, and then you can keep scheduling audio freely.

Second, **caching the model so it downloads once.** The model is a few hundred megabytes, and I learned the hard way that the browser's normal HTTP cache happily evicts large cross-origin responses, so it re-downloaded on every reload. The fix is the [Cache Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Cache), which persists until you explicitly clear it and ignores HTTP cache heuristics entirely:

```ts
const cache = await caches.open("pocket-tts-v1");

const hit = await cache.match(url);
if (hit) return new Uint8Array(await hit.arrayBuffer()); // no network

const bytes = await downloadWithProgress(url);
await cache.put(url, new Response(new Uint8Array(bytes))); // persist
return bytes;
```

(One gotcha worth knowing: `caches` is only available in a [secure context](https://developer.mozilla.org/en-US/docs/Web/API/Cache), HTTPS or `localhost`, so on a plain-http LAN address it's `undefined` and you fall back to the network. Yes, the *same* secure-context rule that bit me with WebGPU. I clearly needed to learn that lesson twice.)

## The one honest caveat

pocket-tts has no native speed control. Generation takes a voice and a temperature, and that's it. So to add a playback-speed slider, I lean on `AudioBufferSourceNode.playbackRate`. That **resamples** the audio, which means faster playback also raises the pitch, going a little chipmunk-y above 1.25× ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/playbackRate)). Web Audio's buffer source has no pitch-preservation option; `preservesPitch` only exists on `<audio>` and `<video>` elements. The proper fix is a pitch-preserving time-stretch (something like SoundTouch), and I'll get there. For now it's a small, honest trade-off, and I'd take it ten times out of ten over what I had before.

## Why it stuck with me

For weeks I was convinced I'd hit a real limit. That you simply could not have natural-sounding, fast, fully on-device narration on an ordinary phone in 2026. pocket-tts proved that wrong on a four-year-old handset, on the CPU, in a browser tab.

I find that kind of thing genuinely impressive. Not the technology that adds one more option to a list, but the kind that makes a whole class of problems you'd been fighting disappear. I deleted more code than I added. The hardest part of the feature became the easy part. It's the voice that reads books aloud in [SublimeRead](https://sublimeread.com) today, and if you want to hear it for yourself, that's the place.

If you're doing on-device speech in the browser, stop fighting the GPU and try [pocket-tts](https://github.com/kyutai-labs/pocket-tts). It might save you the weeks it nearly cost me.
