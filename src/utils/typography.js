import Typography from 'typography'

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.45,
  headerFontFamily: [ 'sans-serif' ],
  bodyFontFamily: [ 'serif' ],
  bodyColor: '#26251C',
  overrideStyles: () => ({
    a: {
      color: '#2467C7',
      textDecoration: 'none'
    },
    'a:hover': {
      color: '#1e4e8a',
      textDecoration: 'underline'
    }
  })
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
