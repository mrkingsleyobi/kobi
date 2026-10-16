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
          I'm <a class="inline-link" href="/about/">Kingsley Obi</a>, based in Abuja. I work on one
          question: how much more agency can a person, a company, or a whole continent gain when
          intelligence becomes programmable?
        </p>
        <p>
          I build agentic AI systems, help organizations turn AI into measurable outcomes, and look
          for problems worth solving in Africa, where infrastructure, payments, language and trust
          call for different architectures than Silicon Valley assumes.
        </p>
        <p>
          Right now I'm building my own AI operating system and taking on a small number of
          <a class="inline-link" href="/consulting/">consulting engagements</a>. You can see what
          I'm working on in <a class="inline-link" href="/projects/">projects</a>.
        </p>
      </div>
      <div class="linktree">
        <div class="linktree-grid">
          <a
            v-for="item in linktree"
            :key="item.label"
            class="linktree-item"
            :href="item.nav || item.href"
            :target="item.ext ? '_blank' : undefined"
            :rel="item.ext ? 'noopener' : undefined"
            v-html="linktreeHtml(item)"
          />
        </div>
      </div>
    </div>
  </main>
</template>
