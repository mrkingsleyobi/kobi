import type { Theme } from 'vitepress'
import './custom.css'
import Layout from './Layout.vue'
import Tutorial from './components/Tutorial.vue'
import BottomNote from './components/BottomNote.vue'
import Callout from './components/Callout.vue'
import Definition from './components/Definition.vue'
import Term from './components/Term.vue'
import DescriptionText from './components/DescriptionText.vue'
import Usage from './components/Usage.vue'
import DefinitionCite from './components/DefinitionCite.vue'
import BlogHome from './components/BlogHome.vue'
import LandingPage from './components/LandingPage.vue'
import Archives from './components/Archives.vue'

export default {
  Layout,
  enhanceApp({ app }) {
    // Content components authored directly in blog-post markdown - see
    // AGENTS.md "Custom Components".
    app.component('tutorial', Tutorial)
    app.component('bottomNote', BottomNote)
    app.component('callout', Callout)
    app.component('definition', Definition)
    app.component('term', Term)
    app.component('description', DescriptionText)
    app.component('usage', Usage)
    app.component('definition-cite', DefinitionCite)
    // Page-level components referenced from index.md files.
    app.component('BlogHome', BlogHome)
    app.component('LandingPage', LandingPage)
    app.component('Archives', Archives)
  }
} satisfies Theme
