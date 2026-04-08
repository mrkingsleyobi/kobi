<script setup lang="ts">
</script>

<template>
  <div class="landing-page">
    <!-- Header Section -->
    <header class="landing-header">
      <div class="avatar">👨‍💻</div>
      <h1 class="name">KINGSLEY OBI</h1>
      <p class="introduction">
        Exploring the intersection of cybersecurity, AI, technology, and philosophy
      </p>
      <div class="separator"></div>
    </header>

    <!-- Main Content Section -->
    <main class="landing-content">
      <div class="bio">
        <p>
          I'm a <strong>cybersecurity professional</strong> and <strong>AI researcher</strong> focused on
          understanding how technology shapes humanity's future. I write about
          <strong>security</strong>, <strong>artificial intelligence</strong>, <strong>technology</strong>,
          and the <strong>philosophical questions</strong> that arise from their convergence.
        </p>

        <p>
          Through my work in cybersecurity and my explorations in AI, I investigate how we can build
          systems that are not only powerful but also aligned with human values. I believe that
          understanding the intersection of these fields is crucial for navigating the challenges
          and opportunities that lie ahead.
        </p>

        <p>
          Here you'll find my thoughts on <a href="/blog/">emerging technologies</a>,
          <a href="/telos/">life optimization</a>, <a href="/manifesto/">my core beliefs</a>,
          and <a href="/projects/">projects</a> I'm working on.
        </p>

        <p class="closing">
          I hope you find something here worth your time.
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.landing-page {
  max-width: 1000px;
  margin: 0 auto;
  /*padding: 120px 40px 80px;*/
  min-height: 100vh;
}

/* Header Section */
.landing-header {
  text-align: center;
  margin-bottom: 60px;
}

.avatar {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 12px color-mix(in srgb, var(--vp-c-text-1) 15%, transparent));
}

.name {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.introduction {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.separator {
  width: 60px;
  height: 2px;
  background: var(--vp-c-brand-1);
  margin: 0 auto;
}

/* Main Content Section */
.landing-content {
  margin-bottom: 40px;
}

.bio {
  max-width: 680px;
  margin: 0 auto;
}

.bio p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
}

.bio strong {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.bio a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s ease;
}

.bio a:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.bio .closing {
  font-style: italic;
  color: var(--vp-c-text-2);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .landing-page {
    /*padding: 80px 20px 60px;*/
  }

  .name {
    font-size: 1.5rem;
  }

  .introduction {
    font-size: 1rem;
  }

  .bio p {
    font-size: 0.9375rem;
    line-height: 1.7;
  }
}
</style>
