<script setup lang="ts">
import { linktree } from '../utils/icons'

function linktreeHtml(item: (typeof linktree)[number]): string {
  return `${item.i}<span>${item.label}</span>`
}
</script>
<template>
  <main class="page">
    <div class="page-narrow home-grid">
      <div class="home-copy">
        <p class="home-greet">Hi,</p>
        <p>
          I'm <a class="inline-link" href="/about/">Kingsley Obi</a> — I design and ship agentic AI
          systems: multi-agent orchestration, autonomous research and fraud-detection swarms, and the
          infrastructure that lets a handful of agents do the work of a team.
        </p>
        <p>
          Most "AI features" today are a single model bolted onto a workflow. I build systems of
          agents with names, memory, and judgment — software that can be handed a genuinely
          ambiguous problem and come back with a defensible answer, not just an autocomplete.
        </p>
        <p>
          That's shown up as an ultra-low-latency trading platform processing 500K orders/sec, a
          66-agent research assistant that reads 1,000 papers a minute, and a multi-agent
          fraud-detection swarm catching bad actors in under two seconds. See the
          <a class="inline-link" href="/projects/">full project list</a>.
        </p>
        <p>
          Right now I split my time between <a class="inline-link" href="/projects/">building</a>,
          <a class="inline-link" href="/blog/">writing</a> about where agentic systems are headed, and
          a small number of <a class="inline-link" href="/consulting/">consulting engagements</a> with
          teams trying to move past prototype-stage AI.
        </p>
      </div>
      <div class="linktree">
        <div class="linktree-grid">
          <a
            v-for="item in linktree"
            :key="item.label"
            class="linktree-item"
            :href="item.nav || '#'"
            :target="item.ext ? '_blank' : undefined"
            :rel="item.ext ? 'noopener' : undefined"
            v-html="linktreeHtml(item)"
          />
        </div>
      </div>
    </div>
  </main>
</template>
