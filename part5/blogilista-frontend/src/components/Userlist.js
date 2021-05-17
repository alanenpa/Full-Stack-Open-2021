import React, { useState, useEffect } from 'react'
import userService from '../services/users'
import {
  Switch, Route,
  Link,
  useParams
} from 'react-router-dom'
import { Table } from 'react-bootstrap'


const User = ({ users }) => {
  const id = useParams().id
  const user = users.find(u => u.id === id)
  if (!user) {
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <br />
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

const UserLine = ({ user }) => (
  <tr>
    <td>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </td>
    <td><strong>{user.blogs.length}</strong></td>
  </tr>
)

const Userlist = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll()
      .then(response => setUsers(response))
  }, [])

  return (
    <Switch>
      <Route path='/users/:id'>
        <User users={users} />
      </Route>
      <Route path='/users'>
        <div>
          <h2>users</h2>
          <Table striped>
            <tbody>
              <tr>
                <th></th>
                <th>blogs created</th>
              </tr>
              {users.map(user =>
                <UserLine key={user.id} user={user} />
              )}
            </tbody>
          </Table>
        </div>
      </Route>
    </Switch>

  )
}

export default Userlist