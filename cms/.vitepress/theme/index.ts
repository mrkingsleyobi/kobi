import DefaultTheme from 'vitepress/theme'
import './custom.css'
import HomeLayout from './layouts/HomeLayout.vue'
import BlogLayout from './layouts/BlogLayout.vue'
import PostLayout from './layouts/PostLayout.vue'
import PostMeta from './components/PostMeta.vue'
import Tutorial from './components/Tutorial.vue'
import BottomNote from './components/BottomNote.vue'
import Callout from './components/Callout.vue'
import Definition from './components/Definition.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register custom layout components
    app.component('HomeLayout', HomeLayout)
    app.component('BlogLayout', BlogLayout)
    app.component('PostLayout', PostLayout)
    app.component('PostMeta', PostMeta)

    // Register custom content components
    app.component('tutorial', Tutorial)
    app.component('bottomNote', BottomNote)
    app.component('callout', Callout)
    app.component('definition', Definition)
  },
  Layout: DefaultTheme.Layout
}
