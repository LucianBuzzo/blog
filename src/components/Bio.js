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
          It's me, Lucian Buzzo, and this is my personal blog, where I write about things that interest me.
          <br />
          You can check out my GitHub profile <a href="https://github.com/LucianBuzzo">here</a> and my Twitter profile <a href="https://twitter.com/LucianBuzzo">here</a>.
        </p>
      </div>
    )
  }
}

export default Bio
