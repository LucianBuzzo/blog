import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(1),
        }}
      >
        <p>
          I'm a Software Engineer at <a href='https://www.balena.io/'>balena.io</a>, BMX rider and hobbyist martial artist who lives and works in Cornwall.
        </p>
      </div>
    )
  }
}

export default Bio
