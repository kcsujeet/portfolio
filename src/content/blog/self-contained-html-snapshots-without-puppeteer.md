---
title: "Generating self-Contained HTML Snapshots Without Puppeteer"
description: "Learn how to generate portable, responsive snapshots of web pages without relying on Puppeteer, by inlining CSS and images directly into HTML"
pubDate: 2026-02-25
tags: ["ruby", "rails", "html", "typescript"]
devto: "https://dev.to/kcsujeet/generating-self-contained-html-snapshots-inlining-css-and-images-without-puppeteer-2ak7"
---

## The Problem

I needed to preserve a webpage exactly as it appears (layout, styles, images, and all) in a format that stayed responsive across device sizes. That last part was the dealbreaker. Screenshots and PDFs are static, fixed-dimension artifacts. They don't reflow. On a phone, you're pinch-zooming into a blurry mess. On a tablet, the layout doesn't adapt. For our use case, the snapshot had to behave like a real web page: fluid, responsive, and readable on any screen.

That immediately ruled out the screenshot/PDF route. Services like ResPack, Browserless.io, and Cloudflare's browser rendering API are built around producing flat outputs. Puppeteer itself can capture HTML via `page.content()`, but it gives you a raw DOM with the same broken external dependencies and missing CSSOM styles. None of these tools solve the real problem: producing a single self-contained file that actually renders correctly on its own.

So I went down a different path: capturing the actual DOM and inlining every asset into one self-contained HTML file. It was harder than I expected, and the roadblocks were genuinely bizarre.

## Starting Point: Raw HTML Is Just a Skeleton

My first instinct was simple: run `document.documentElement.outerHTML` in the browser console, save the result, and open it in a new tab.

```javascript
const html = document.documentElement.outerHTML
```

The result was barely recognizable. Inline styles and any CSS written directly in `<style>` tags survived, but all externally linked stylesheets, images, and fonts were missing. The page was mostly unstyled, and I couldn't tell yet whether that accounted for *all* the breakage. Raw HTML gives you the bone structure, but nothing else. I needed a way to capture the skin too.

## The Frontend's Job: Extracting Hidden CSS

I figured I could write a quick JavaScript function to grab all the `<link rel="stylesheet">` tags, fetch their contents, and replace them with inline `<style>` blocks.

```javascript
// Naive approach: fetch each stylesheet and inline it
// (Note: forEach doesn't await async callbacks, so this is a simplified illustration)
document.querySelectorAll('link[rel="stylesheet"]').forEach(async (link) => {
  const response = await fetch(link.href)
  const css = await response.text()
  const style = document.createElement('style')
  style.textContent = css
  link.replaceWith(style)
})
```

I wrote the script, captured the DOM, saved the file, and opened it.

Still broken. The layout was completely gone.

### The Invisible CSS Problem

The culprit was MUI (Material UI), which uses Emotion for styling under the hood. Emotion is a CSS-in-JS library that dynamically generates styles at runtime based on component props and state. In production, it injects these styles using `CSSStyleSheet.insertRule`, which writes directly into the browser's CSS Object Model (CSSOM) without ever placing readable CSS text into the DOM.

Because these styles never exist as text content in the DOM, my HTML extraction completely missed them. The fix was to manually crawl `document.styleSheets`, extract those hidden rules, and inject them into a physical `<style>` tag before capturing anything.

```javascript
// Extract styles that were injected via CSSStyleSheet.insertRule
let css = ''
const sheets = Array.from(document.styleSheets)
for (const sheet of sheets) {
  if (sheet.href) continue // skip external sheets
  const rules = Array.from(sheet.cssRules || [])
  for (const rule of rules) {
    css += rule.cssText + '\n'
  }
}
```

### Then Came CORS

With the CSS problem solved, I tried adding `fetch` calls to grab images and convert them to base64 strings right there in the browser.

```javascript
// Attempt to inline images from the frontend
// (Note: forEach doesn't await async callbacks, so this is a simplified illustration)
document.querySelectorAll('img').forEach(async (img) => {
  const response = await fetch(img.src)
  const blob = await response.blob()
  const reader = new FileReader()
  reader.onloadend = () => { img.src = reader.result }
  reader.readAsDataURL(blob)
})
```

The console lit up red with CORS errors. The browser was blocking my attempts to read image data from our external S3 buckets.

This was the moment I realized the frontend couldn't do everything. Its job was to prepare a clean DOM (including those hidden styles) and then hand it off to a backend server that could fetch external assets without CORS restrictions.

### The Code: Preparing the DOM

Here's the complete TypeScript function. It extracts the hidden dynamic styles, strips out unwanted scripts and UI elements, and produces a clean HTML string ready for the server:

```typescript
/**
 * Iterates over document.styleSheets to find rules injected by libraries
 * like MUI, Emotion, or Styled Components.
 */
const extractCssFromStyleSheets = (): string => {
  let css = ''
  const sheets = Array.from(document.styleSheets)

  for (const sheet of sheets) {
    // Skip external stylesheets (these will be handled by the backend)
    if (sheet.href) continue

    try {
      const rules = Array.from(sheet.cssRules || [])
      for (const rule of rules) {
        css += rule.cssText + '\n'
      }
    } catch (e) {
      // Silently fail for cross-origin sheets that deny access
      console.warn('Cannot access cssRules for stylesheet', e)
    }
  }

  return css
}

export const prepareDomForSnapshot = (ignoreSelectors: string[] = []): string => {
  // 1. Clone the document to avoid mutating the live page
  const domElement = document.documentElement.cloneNode(true) as HTMLElement

  // 2. Remove scripts (we want a static snapshot, not a running app)
  domElement.querySelectorAll('script').forEach((script) => script.remove())

  // 3. Remove favicons (they reference external URLs that would fail silently
  //    in a standalone file, and aren't visually relevant to the snapshot)
  domElement
    .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
    .forEach((el) => el.remove())

  // 4. Remove specific UI elements we don't want captured (e.g., '.chat-widget')
  if (ignoreSelectors.length > 0) {
    ignoreSelectors.forEach((selector) => {
      domElement.querySelectorAll(selector).forEach((el) => el.remove())
    })
  }

  // 5. Extract CSSOM styles and physically inject them into the head
  const dynamicCss = extractCssFromStyleSheets()
  if (dynamicCss) {
    const style = document.createElement('style')
    style.setAttribute('data-snapshot', 'dynamic-css')
    style.textContent = dynamicCss
    domElement.querySelector('head')?.appendChild(style)
  }

  // 6. Return the full HTML string including DOCTYPE
  return '<!DOCTYPE html>\n' + domElement.outerHTML
}
```

At this point I had a clean HTML string with all the hidden styles baked in. Time to hand it to the server.

## The Backend's Job: Inlining Everything Else

I pushed the remaining work to a Ruby on Rails service. Since the backend makes plain HTTP requests, CORS is irrelevant.

The plan was straightforward: parse the prepared HTML, fetch external stylesheets and replace `<link>` tags with inline `<style>` blocks, then fetch images and convert them to base64 data URIs.

There was one catch I hadn't anticipated: base64 encoding increases file size by roughly 33%. A 1MB image becomes about 1.33MB when inlined. With multiple images on a page, the snapshot would balloon quickly. To keep things manageable, I added a resizing step that scales images down to a max width of 800px before encoding. This brought the file sizes back to something reasonable without noticeably hurting visual quality.

I also ran into intermittent failures where some images would come out broken. Network hiccups, slow responses, or transient errors during download or processing meant that occasionally an image just wouldn't make it. I added a retry mechanism that wraps the entire pipeline (fetch, resize, and base64 encode) with a few attempts per image to handle this gracefully.

I wrote the service, ran it, and opened the result. The CSS worked perfectly, the layout was an exact match. But as I scrolled down, every single image was broken.

### The Active Storage Redirect Trap

This one took serious debugging. Our app uses Rails Active Storage for image uploads. In the DOM, image `src` attributes look like `/rails/active_storage/blobs/redirect/...`. When a browser hits that URL, Rails validates the request and issues an HTTP 302 redirect to a short-lived, signed S3 URL where the actual binary lives.

My Ruby HTTP client wasn't a browser. It hit the URL, received the 302, and stopped. Even configuring Faraday to follow redirects didn't fully solve it, since those Active Storage endpoints sometimes rely on session cookies or specific headers that a server-to-server background job doesn't have.

The fix was to bypass Active Storage's redirect controller entirely. Before fetching an image, I check whether the URL matches an Active Storage path and, if so, resolve it directly to the underlying authenticated S3 URL.

### The Code: The Complete Inlining Service

Here's the full Ruby service. It handles stylesheet fetching, image resizing, and the Active Storage bypass. I also added `concurrent-ruby` to fetch assets in parallel and keep generation fast:

```ruby
require 'nokogiri'
require 'base64'
require 'addressable/uri'
require 'faraday'
require 'concurrent-ruby'
require 'mini_magick'

class DomSnapshotService
  # Configuration
  TIMEOUT_SECONDS = 10
  USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  THREAD_POOL_SIZE = 8

  # Image Optimization (base64 adds ~33% size overhead, so resize first)
  DEFAULT_MAX_WIDTH = 800
  DEFAULT_MAX_HEIGHT = 800
  DEFAULT_QUALITY = 80
  DEFAULT_FORMAT = 'jpeg'
  MAX_RETRIES = 3

  def initialize(html, base_url:)
    @doc = Nokogiri::HTML.parse(html)
    @base_url = base_url
  end

  def call
    @http_client = build_http_client

    inline_stylesheets!
    convert_images_to_base64!
    remove_script_tags!

    "<!DOCTYPE html>\n" + @doc.to_html
  end

  private

  def full_absolute_url(href)
    return nil if href.blank?
    return href if href.start_with?('data:')

    begin
      url = Addressable::URI.join(@base_url, href).to_s

      # Bypass Active Storage redirects for direct S3 URLs
      if url.include?('/rails/active_storage/')
        url = resolve_direct_s3_url(url)
      end

      url
    rescue Addressable::URI::InvalidURIError, URI::Error
      nil
    end
  end

  def resolve_direct_s3_url(active_storage_url)
    # Implementation depends on your app. Generally:
    # blob_signed_id = extract_id_from_url(active_storage_url)
    # blob = ActiveStorage::Blob.find_signed!(blob_signed_id)
    # blob.url(expires_in: 5.minutes)
    active_storage_url # Placeholder
  end

  def build_http_client
    Faraday.new do |faraday|
      faraday.options.timeout = TIMEOUT_SECONDS
      faraday.options.open_timeout = TIMEOUT_SECONDS
      faraday.headers['User-Agent'] = USER_AGENT
      faraday.adapter Faraday.default_adapter
    end
  end

  def fetch_content(url)
    return nil unless url
    return nil if url.start_with?('data:')

    response = @http_client.get(url)
    response.success? ? response.body : nil
  rescue => e
    Rails.logger.warn("Snapshot Warning: Failed to fetch #{url} - #{e.message}")
    nil
  end

  def inline_stylesheets!
    links = @doc.css('link[rel="stylesheet"]').to_a
    return if links.empty?

    execute_in_threads(links) do |link|
      href = full_absolute_url(link['href'])
      css = fetch_content(href)

      if css
        sanitized_css = css.gsub(/@font-face\s*{[^}]*}/, '')
        { node: link, content: sanitized_css, success: true }
      else
        { node: link, success: false }
      end
    end.each do |result|
      if result[:success]
        style = Nokogiri::XML::Node.new('style', @doc)
        style.content = result[:content]
        result[:node].replace(style)
      end
    end
  end

  def convert_images_to_base64!
    images = @doc.css('img').to_a
    return if images.empty?

    execute_in_threads(images) do |img|
      src_url = full_absolute_url(img['src'])

      if src_url&.start_with?('data:')
        { node: img, content: src_url, success: true }
      else
        result = with_retries(MAX_RETRIES) do
          image_data = fetch_content(src_url)
          raise "Failed to download #{src_url}" unless image_data

          processed = process_and_resize(image_data)
          raise "Failed to process #{src_url}" unless processed

          processed
        end

        if result
          { node: img, content: result, success: true }
        else
          { node: img, success: false }
        end
      end
    end.each do |result|
      if result[:success]
        result[:node]['src'] = result[:content]
        result[:node].remove_attribute('srcset')
        result[:node].remove_attribute('loading')
      end
    end
  end

  def remove_script_tags!
    @doc.css('script').each(&:remove)
  end

  def execute_in_threads(items, &block)
    pool = Concurrent::ThreadPoolExecutor.new(
      min_threads: 1,
      max_threads: [THREAD_POOL_SIZE, items.size].min,
      max_queue: 0
    )

    promises = items.map do |item|
      Concurrent::Promise.execute(executor: pool) { block.call(item) }
    end

    promises.map(&:value)
  ensure
    pool&.shutdown
    pool&.wait_for_termination(5)
  end

  def with_retries(max_attempts)
    attempts = 0
    begin
      attempts += 1
      yield
    rescue => e
      if attempts < max_attempts
        sleep(0.5 * attempts)
        retry
      end
      Rails.logger.warn("Snapshot Warning: Failed after #{max_attempts} attempts - #{e.message}")
      nil
    end
  end

  def process_and_resize(image_data)
    image = MiniMagick::Image.read(image_data)
    image.resize "#{DEFAULT_MAX_WIDTH}x#{DEFAULT_MAX_HEIGHT}>"
    image.format DEFAULT_FORMAT
    image.quality DEFAULT_QUALITY

    base64 = Base64.strict_encode64(image.to_blob)
    image.destroy!

    "data:image/#{DEFAULT_FORMAT};base64,#{base64}"
  rescue => e
    Rails.logger.warn("Snapshot Warning: Image processing failed - #{e.message}")
    nil
  end
end
```

### Wiring It Up

Here's the controller that ties everything together:

```ruby
def create
  raw_html = params[:html]
  base_url = request.base_url

  snapshot_html = DomSnapshotService.new(raw_html, base_url: base_url).call

  filename = "snapshots/#{Time.current.to_i}_#{SecureRandom.hex(4)}.html"
  S3_BUCKET.object(filename).put(
    body: snapshot_html,
    content_type: 'text/html'
  )

  render json: { url: S3_BUCKET.object(filename).public_url }
end
```

## Why This Was Worth the Effort

What I love about this approach is that the result is a single HTML file with zero external dependencies. The browser loads one file with no additional network requests for stylesheets, fonts, or images. It's a moment frozen in time. External references break as assets get deleted or CDNs change, but an inlined snapshot stays exactly as it was.

And unlike screenshots or PDFs, these snapshots remain fully responsive. They look right on every screen size. If you ever need a PDF or image later, you can generate one *from* this HTML, but you can't go the other direction. You can't generate responsive HTML from a flat image.

The journey to get here was full of bizarre debugging sessions (invisible CSS rules, silent CORS failures, redirect traps) but each one taught me something real about how browsers render pages and how little of that rendering lives in the DOM you can see.

If you're building something similar, my advice boils down to this: let the frontend prepare the DOM (including those hidden styles), offload asset fetching to the server (where CORS can't touch you), and inline everything so the result is truly self-contained.

Thanks for reading! If you have thoughts, improvements, or questions, drop a comment below. 👋