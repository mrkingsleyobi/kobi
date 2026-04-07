import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Tutorial from './components/Tutorial.vue'
import BottomNote from './components/BottomNote.vue'
import Callout from './components/Callout.vue'
import Definition from './components/Definition.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register custom content components
    app.component('tutorial', Tutorial)
    app.component('bottomNote', BottomNote)
    app.component('callout', Callout)
    app.component('definition', Definition)
  }
}
