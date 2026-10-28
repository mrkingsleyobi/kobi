---
slug: 2011-laptop-ai
title: "Building AI Infrastructure on a 2011 Laptop"
subtitle: "What a dual-core machine with a spinning disk taught me about where AI speed actually goes"
created_at: 2026-10-28T12:00:00
updated_at: 2026-10-28T12:00:00
tags: ai | engineering | technology | personal
ail: 4
meta_default_title: "Building AI Infrastructure on a 2011 Laptop"
meta_default_description: "I run a multi-vendor AI agent system from a 2011 dual-core laptop with 6GB of RAM and a spinning disk. Measuring it showed me where AI tooling actually spends its time."
meta_og_title: "Building AI Infrastructure on a 2011 Laptop"
meta_og_description: "I run a multi-vendor AI agent system from a 2011 dual-core laptop with 6GB of RAM and a spinning disk. Measuring it showed me where AI tooling actually spends its time."
meta_twitter_title: "Building AI Infrastructure on a 2011 Laptop"
meta_twitter_description: "I run a multi-vendor AI agent system from a 2011 dual-core laptop with 6GB of RAM and a spinning disk. Measuring it showed me where AI tooling actually spends its time."
status: published
description: "I run a multi-vendor AI agent system from a 2011 dual-core laptop with 6GB of RAM and a spinning disk. Measuring it showed me where AI tooling actually spends its time."
---

![Building AI Infrastructure on a 2011 Laptop](/images/2011-laptop-ai.jpg) <!-- width="1200" height="630" -->

I run my personal AI system on a laptop from 2011.

It has an Intel i5-2435M, two cores, 6GB of RAM, and a spinning SATA hard drive. From it I route work across four AI vendors: Claude, OpenAI's coding agents, Gemini, and Grok. Agents write code, audit each other, research, and publish to this site.

It works. It's also slow in ways a new machine would hide, which turned out to be useful.

## The machine tells you the truth

On fast hardware, waste disappears. A startup step that costs a second on an SSD costs ten on a spinning disk. Old hardware turns small inefficiencies into numbers you can't ignore.

So I measured instead of guessing.

Calls to OpenAI's coding agent were slow to start, often a minute or more. The model wasn't slow. The machine was slow at *starting the tool that talks to the model*.

## Where the time actually went

I found three things eating the time. Two of them were fixable.

**1. Startup hooks.** The agent ran three helper hooks every time it started, each costing 9–15 seconds. My scripted calls didn't need any of them.

Turning them off took a warm call from **21–24 seconds to 7–9 seconds**.

**2. A network refresh nobody asked for.** On a cold start, the agent re-downloaded its list of available models before doing any work.

One flag pointed it at a local copy of that list. Cold calls that had been taking 48–72 seconds dropped to **9.7 and 8.1 seconds**.

**3. The disk.** With both fixes in place, I flushed the system's memory and measured a truly cold start: **93.5 seconds**. The same call, warm, took **19.4 seconds**.

Even printing the agent's version number took 2.39 seconds cold and 0.18 seconds warm.

That gap is the hard drive. The agent ships as a 254MB binary, and reading it off this disk takes 5–7 seconds, even right after using it.

With 6GB of RAM and heavy swap (283,000 pages swapped out), the operating system never keeps it fully in memory. So every truly cold start pays to read it again.

## What I didn't fix

The disk is still the disk. Two of the three problems were configuration, and a faster laptop would have made them smaller without making them go away.

I could buy my way out of the third. I haven't yet, because the constraint keeps paying for itself: the hooks and the network refresh cost time on fast machines too, just less of it, on every call, for everyone running the tool.

## Why I think this matters beyond my desk

Most AI tooling is built and tested on new laptops with fast disks and plenty of memory, on reliable, cheap internet. That's a reasonable default for the people building it.

It isn't the default for a lot of the world. I build from Abuja, on this machine.

For anyone working on older hardware or paying for data by the megabyte, a tool that quietly downloads its model list on every cold start isn't a small inefficiency.

I think this is where the Africa-first argument becomes practical. Building under tighter constraints forces you to find waste that richer environments never see.

Fix it, and the tool gets better for everyone, not only for people on old hardware.

That's the version of "local constraint, global advantage" I believe in. It's something you can measure.

## What I'd tell anyone building on constrained hardware

- **Measure cold and warm separately.** Warm numbers flatter you. Cold numbers show what a fresh session actually costs.
- **Look at startup before the model.** In my case the model was never the bottleneck. Starting the tool was.
- **Check what runs on every call.** Hooks, plugins, and update checks are easy to add and easy to forget.
- **Keep the old machine around, even if you upgrade.** It's the cheapest performance test you'll ever own.

The laptop is fifteen years old. It still runs the whole system. And it's the reason I know exactly where that system's time goes.
