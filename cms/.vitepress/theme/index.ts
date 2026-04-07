import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Layout from './Layout.vue'
import Tutorial from './components/Tutorial.vue'
import BottomNote from './components/BottomNote.vue'
import Callout from './components/Callout.vue'
import Definition from './components/Definition.vue'
import Term from './components/Term.vue'
import DescriptionText from './components/DescriptionText.vue'
import Usage from './components/Usage.vue'
import Cite from './components/Cite.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register custom content components
    app.component('tutorial', Tutorial)
    app.component('bottomNote', BottomNote)
    app.component('callout', Callout)
    app.component('definition', Definition)
    app.component('term', Term)
    app.component('description', DescriptionText)
    app.component('usage', Usage)
    app.component('cite', Cite)
  },
  Layout: Layout
}
