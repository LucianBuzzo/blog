import React from 'react'
import styled from 'styled-components'
import SunSVG from '../assets/sun-svgrepo-com.svg'
import MoonSVG from '../assets/moon-svgrepo-com.svg'

const IconImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;

  &:hover {
    cursor: pointer;
  }
`

const GUTTER = 15
const ICON_SIZE = 50
const ANIMATION_TIMING = 500
const THEME_CSS_ID = 'theme-css'

const LIGHT_THEME = `
  body {
    transition: color ${ANIMATION_TIMING}ms ease-in-out, background ${ANIMATION_TIMING}ms ease-in-out;
    color: #26251C;
  }

  a {
    transition: color ${ANIMATION_TIMING}ms ease-in-out;
    color: #2467C7;
  }

  a:hover {
    color: #1e4e8a;
    textDecoration: underline;
  }
`

const DARK_THEME = `
  body {
    transition: color ${ANIMATION_TIMING}ms ease-in-out, background ${ANIMATION_TIMING}ms ease-in-out;
    background: #002b36;
    color: #eee8d5;
  }

  a {
    transition: color ${ANIMATION_TIMING}ms ease-in-out;
    color: #F2A73D;
  }

  a:hover {
    color: #B58900;
    textDecoration: underline;
  }
`

export class Controls extends React.Component {
  constructor() {
    super()

    const currentTheme = window.name || 'light'

    this.state = {
      theme: currentTheme,
      rotate: currentTheme === 'light' ? 0 : 180
    }

    this.toggleTheme = this.toggleTheme.bind(this)

    const style = document.getElementById(THEME_CSS_ID)

    if (style) {
      this.style = style
    } else {
      this.style = document.createElement('style')
      this.style.type = 'text/css'
      document.head.appendChild(this.style)
    }

    this.style.innerHTML = this.state.theme === 'light' ? LIGHT_THEME : DARK_THEME
  }

  toggleTheme() {
    console.log('toggling theme')
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light'
    this.setState({
      theme: newTheme,
      rotate: this.state.rotate - 180
    })
    this.style.innerHTML = newTheme === 'light' ? LIGHT_THEME : DARK_THEME
    window.name = newTheme
  }

  render() {
    return (
      <div
        style={{
          position: 'fixed',
          left: -GUTTER - ICON_SIZE,
          top: -GUTTER - ICON_SIZE,
          width: GUTTER * 2 + ICON_SIZE * 2,
          height: GUTTER * 2 + ICON_SIZE * 2,
          transition: `transform ${ANIMATION_TIMING}ms ease-in-out`,
          transform: `rotate(${this.state.rotate}deg)`
        }}
      >
        <IconImage
          width={ICON_SIZE}
          src={MoonSVG}
          onClick={this.toggleTheme}
        />

        <IconImage
          width={ICON_SIZE}
          src={SunSVG}
          onClick={this.toggleTheme}
          style={{
            bottom: 0,
            right: 0,
            top: 'auto',
            left: 'auto'
          }}
        />
      </div>
    )
  }
}
