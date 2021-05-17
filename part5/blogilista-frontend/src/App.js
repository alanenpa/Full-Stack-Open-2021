import React, { useState, useEffect, useRef } from 'react'
import { Navbar, Nav, Button as button } from 'react-bootstrap'
import Loginform from './components/Loginform'
import Togglable from './components/Togglable'
import NewEntryForm from './components/NewEntryForm'
import Notification from './components/Notification'
import Bloglist from './components/Bloglist'
import Userlist from './components/Userlist'
import BlogView from './components/BlogView'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import { setMessage } from './reducers/notificationReducer'
import { initialize, createBlog } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Switch, Route, Link,
} from 'react-router-dom'



const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  let user = useSelector(state => state.user)
  const entryFormRef = useRef()
  const dispatch = useDispatch()

  const padding = {
    fontWeight: 'bold',
    textDecorationLine: 'none',
    padding: 5
  }


  useEffect(() => {
    dispatch(initialize())
  }, [])

  useEffect(() => {
    const userLogged = window.localStorage.getItem('loggedInUser')
    if (userLogged) {
      const user = JSON.parse(userLogged)
      dispatch(setUser(user))
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      user = await loginService.login({
        username, password
      })
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (e) {
      dispatch(setMessage('wrong username or password', 5))
      console.log(e.message)
    }
  }

  const createNewEntry = async (newEntry) => {
    dispatch(createBlog(newEntry))
    entryFormRef.current.toggleVisibility()
  }

  const handleLogout = () => {
    dispatch(clearUser())
  }

  if (user === null) {
    return (
      <div className='container'>
        <h2>Log in to application</h2>
        <Notification />
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
    <div className='container'>
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link style={ { ...padding, marginLeft: '15px' } } to='/'>blogs</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to='/users'>users</Link>
              </Nav.Link>
            </Nav>
            <Navbar.Text style={{ marginLeft: '20px' }}>
              {user.name} logged in
            </Navbar.Text>
            <button style={{ marginLeft: '10px' }} onClick={handleLogout}>logout</button>
          </Navbar.Collapse>
        </Navbar>
        <Notification />
        <p></p>
        <Switch>
          <Route path='/blogs/:id'>
            <BlogView />
          </Route>
          <Route path='/users'>
            <Userlist />
          </Route>
          <Route path='/'>
            <h2>blogs</h2>
            <Togglable buttonLabel='new blog' ref={entryFormRef} >
              <NewEntryForm
                addEntry={createNewEntry}
                user={user}
              />
            </Togglable>
            <Bloglist user={user} />
          </Route>
        </Switch>
      </Router >
    </div>
  )
}

export default App