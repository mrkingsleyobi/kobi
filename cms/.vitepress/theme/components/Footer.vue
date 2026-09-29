<script setup lang="ts">
import { footerSocial } from '../utils/icons'
import ThemeSwitcher from './ThemeSwitcher.vue'
</script>
<template>
  <footer class="site-footer">
    <div class="footer-copy ui-face">© 2024 — {{ new Date().getFullYear() }} Kingsley Obi. All rights reserved.</div>
    <div class="footer-links">
      <a
        v-for="s in footerSocial"
        :key="s.label"
        href="#"
        :title="s.label"
        :aria-label="s.label"
        v-html="s.i"
      />
    </div>
    <ThemeSwitcher />
  </footer>
</template>
