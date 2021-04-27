import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Loginform from './components/Loginform'
import Togglable from './components/Togglable'
import NewEntryForm from './components/NewEntryForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const entryFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      sortByLikesAndSet(blogs)
    )
  }, [])

  useEffect(() => {
    const userLogged = window.localStorage.getItem('loggedInUser')
    if (userLogged) {
      const user = JSON.parse(userLogged)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortByLikesAndSet = (blogs) => {
    const sorted = blogs.sort((a, b) => {
      return b.likes - a.likes
    })
    setBlogs(sorted)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setMessage(`logged in as ${user.name}`)
    } catch (e) {
      setMessage('wrong username or password')
      console.log(e.message)
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const createNewEntry = async (newEntry) => {
    try {
      const response = await blogService.create(newEntry)
      setMessage(`a new blog ${newEntry.title} added!`)
      sortByLikesAndSet(blogs.concat(response))
      entryFormRef.current.toggleVisibility()
    } catch (e) {
      setMessage('blog entry creation failed, check console for details')
      console.log(e.message)
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const likeEntry = async (blog) => {
    const entry = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user.id,
      likes: blog.likes+1
    }
    try {
      const updatedEntry = await blogService.update(blog.id, entry)
      sortByLikesAndSet(blogs.map(b => b.id === updatedEntry.id ? updatedEntry : b))
    } catch (e) {
      console.log('update failed:', e.message)
    }
  }

  const removeEntry = async (blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        sortByLikesAndSet(blogs.filter(b => b.id !== blog.id))
      } catch (e) {
        console.log('deletion failed:', e.message)
      }
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message}/>
        <Loginform
          handleLogin={handleLogin}
          username={username}
          handleUsername={(event) => setUsername(event.target.value)}
          password={password}
          handlePassword={(event) => setPassword(event.target.value)}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
      <p></p>
      <Togglable buttonLabel='new blog' ref={entryFormRef}>
        <NewEntryForm
          addEntry={createNewEntry}
          user={user}
        />
      </Togglable>
      <ul id='bloglist' className='no-bullets'>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} like={likeEntry} remove={removeEntry} />
        )}
      </ul>
    </div>
  )
}

export default App