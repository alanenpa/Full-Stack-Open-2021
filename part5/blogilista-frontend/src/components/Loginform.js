import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'


const Loginform = (props) => (
  <Form onSubmit={props.handleLogin}>
    <Form.Group>
      <Form.Label>username:</Form.Label>
      <Form.Control
        id='username'
        type="text"
        value={props.username}
        name="Username"
        onChange={props.handleUsername}
      />
      <Form.Label>password:</Form.Label>
      <Form.Control
        id='password'
        type="text"
        value={props.password}
        name="Password"
        onChange={props.handlePassword}
      />
      <Button type="submit">
        login
      </Button>
    </Form.Group>
  </Form>
)

Loginform.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  handleUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  handlePassword: PropTypes.func.isRequired
}

export default Loginform