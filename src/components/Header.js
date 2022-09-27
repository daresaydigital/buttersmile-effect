import React from 'react'
const Header = ({ title }) => {
  return (
      <header>
          <h1 style={headingStyle}>
              {title}
          </h1>
      </header>
  )
}

Header.defaultProps = {
    title: 'Butter Smile'
}

const headingStyle = {
    color: 'red'
}

export default Header