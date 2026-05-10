---
title: "Reflecting on Seven Years of Ruby on Rails"
description: "Why I stayed with Rails for seven years, where it still wins, and an honest take on the JavaScript ecosystem."
pubDate: 2026-05-09
tags: ["rails", "ruby", "javascript", "career"]
---

I never planned to use Ruby on Rails.

When I joined my first company, Rails was already in the stack. I had no strong opinion about it. I opened the codebase, started writing code, and shipped things. That was it. No deliberate research, no weighing pros and cons, no Reddit thread convincing me it was the right choice. Circumstance made the decision for me.

What kept me around, though, was a choice. And seven years in, with Rails 8 in production and a framework that keeps getting better instead of stagnating, I'm more confident in that choice than I was at year one.

## Convention over configuration

The thing that hooked me early was realizing I didn't have to think about a lot of things. You open a Rails project and there's a shape to everything. Where your models live, how your routes are structured, how you talk to the database. It's all there, waiting. You don't assemble it, you use it.

I've tried building side projects with Node and Express. Every single time, I hit the same wall. Before I could write a single line of actual product logic, I was making decisions: which ORM, which authentication library, how to wire up emails, how to handle background jobs. And not just decisions, but research. Weighing options, reading comparisons, picking a direction and hoping you picked the right one.

In Rails, that conversation is mostly already over. Active Record is your ORM. For years, Devise was the de-facto authentication library, and as of Rails 8 you don't even need it; the framework ships its own authentication generator. Emails? Action Mailer, already there. Background jobs? Active Job with an adapter of your choice. This is what batteries included actually means. Not just having the batteries, but having them pre-installed.

## A word on the JavaScript side

I want to be honest here, because it would be easy to make this sound like Rails is the only framework with a batteries included philosophy. It's not. NestJS exists. AdonisJS exists. Both are genuinely good frameworks with opinionated structure and built-in solutions for the things Express makes you assemble yourself.

The problem isn't that JavaScript lacks good options. The problem is that those options are not what most people end up using.

When I was learning, every tutorial pointed at Express. Every Reddit thread, every YouTube video, every bootcamp curriculum. Today it's mostly the same story, except now Express shares the stage with Next.js for the full stack crowd. NestJS and AdonisJS are out there, but they're a smaller corner of a much louder ecosystem. A junior developer trying to figure out how to build a backend in JavaScript has to navigate dozens of conflicting recommendations before they even get to write code.

That's not the experience I had with Rails. I picked up Rails and there was one obvious path. The tutorials agreed. The community agreed. The conventions agreed. There wasn't a parallel universe of equally popular Rails-but-different frameworks I had to evaluate first.

That ecosystem clarity is, in my opinion, a real and underrated advantage of the Ruby world. Not because batteries included is unique to Rails, but because Rails is the default in a way that no JavaScript backend framework actually is. For a junior developer, the absence of choice paralysis is worth a lot.

## Rails 8 is not the Rails you remember

A lot of people still think Rails peaked years ago. They picture a slow-moving codebase at a company that never modernized, the framework their older colleagues are stuck maintaining. That's not the Rails I'm working with today.

Rails today is faster, simpler, and ships with more out of the box than at any point in its history. Rails 8 introduced the Solid trifecta: Solid Queue, Solid Cache, and Solid Cable. Three pieces of infrastructure that used to be among the most painful parts of any production app, background job runners, caching layers, WebSockets, now ship with the framework. No Redis to provision. No Sidekiq to deploy and scale separately. Your existing database does the job.

I find that genuinely brilliant. It's not a workaround or a compromise. It's the batteries-included philosophy applied to a part of the stack that has historically been painful to set up.

DHH and the Rails core team keep making thoughtful, opinionated decisions. The framework isn't chasing trends. It's doubling down on what it does well and making it simpler.

## The things I don't love

I'd be lying if I said it was all smooth.

The biggest frustration is the lack of a strong type system. Coming from TypeScript, where everything is explicit and traceable, Rails can feel like stepping into fog. You see a method called on an object and the answer to "where does this come from" is sometimes four `included` modules deep, with a `method_missing` somewhere in the chain. Command-click in the editor and it shrugs. The new Ruby LSP has improved this significantly; you can navigate to definitions in VS Code now, but it's not the same as a TypeScript codebase where the type system itself is documentation. That traceability is something I genuinely miss.

The other one is the magic, which is related but distinct. When you're new to Rails, things just work and you don't always know why. A class inherits from `ApplicationRecord` and suddenly has fifty methods you never wrote. A controller action renders a view you never explicitly told it to render. For someone coming from a stack where explicit imports are the norm, the implicit nature of Rails takes real getting used to.

It's a tradeoff. You get speed and convention, you give up some transparency. Once you've been in the codebase long enough, the magic stops feeling like mystery and starts feeling like leverage. But that initial learning curve is real, and I think Rails advocates sometimes oversell how quickly it disappears.

## Seven years in

I've been a full-stack engineer for seven years. Rails on the backend, React and TypeScript on the frontend, every single day. Writing Rails alongside the frontend work is how I've stayed full stack without burning out. I don't fight my tools. I just build.

Working at a product company means there's always more to build than there is time to build it. Every time you context-switch from product thinking to configuration thinking, you lose something. Rails minimizes that switch. The opinions are baked in, and most of the time, those opinions are good ones. That's why I can move as fast as I do on the backend while staying sharp on the frontend. I don't have to choose.

Rails wasn't a deliberate choice. Staying with it has been. When I open a Rails project, I know where I am. I know how to move. I know how to ship.

Seven years is a long time to use one tool in this industry. I don't think I'm done.
