module.exports = {
  content: [
    './cms/**/*.vue',
    './cms/**/*.md',
    './cms/.vitepress/theme/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3c8772',
          dark: '#2d6656',
          darker: '#1f443a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif']
      }
    }
  },
  plugins: []
}
