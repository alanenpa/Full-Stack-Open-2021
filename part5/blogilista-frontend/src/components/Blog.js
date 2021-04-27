import React, { useState } from 'react'

const Blog = ({ blog, user, like, remove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenToggled = { display: showDetails ? '' : 'none' }

  const showWhenUserLoggedIn = { display: user.username === blog.user.username ? '' : 'none' }

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  return (
    <li id='blog' style={blogStyle}>
      <div onClick={toggleVisibility} style={ { cursor: 'pointer' } }>{blog.title} {blog.author} </div>
      <div style={showWhenToggled} className='hiddenContent'>
        {blog.url}<br/>
        {blog.likes} <button id='like' onClick={() => like(blog)}>like</button><br/>
        {blog.author}<br/>
        <button id='remove' style={showWhenUserLoggedIn} onClick={() => remove(blog)}>remove</button>
      </div>
    </li>
  )
}

export default Blog