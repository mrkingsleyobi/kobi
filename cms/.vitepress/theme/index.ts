import DefaultTheme from 'vitepress/theme'
import './custom.css'
import HomeLayout from './layouts/HomeLayout.vue'
import BlogLayout from './layouts/BlogLayout.vue'
import PostLayout from './layouts/PostLayout.vue'
import PostMeta from './components/PostMeta.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register custom layout components
    app.component('HomeLayout', HomeLayout)
    app.component('BlogLayout', BlogLayout)
    app.component('PostLayout', PostLayout)
    app.component('PostMeta', PostMeta)
  },
  Layout: DefaultTheme.Layout
}
