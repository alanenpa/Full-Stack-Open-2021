import React from 'react'
import PropTypes from 'prop-types'

const Loginform = (props) => (
  <form onSubmit={props.handleLogin}>
    <div>
      username
      <input
        id='username'
        type="text"
        value={props.username}
        name="Username"
        onChange={props.handleUsername}
      />
    </div>
    <div>
      password
      <input
        id='password'
        type="text"
        value={props.password}
        name="Password"
        onChange={props.handlePassword}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

Loginform.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  handleUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  handlePassword: PropTypes.func.isRequired
}

export default Loginform