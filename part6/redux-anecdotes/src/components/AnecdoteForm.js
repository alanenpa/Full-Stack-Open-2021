import React from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setMessage } from "../reducers/notificationReducer"
import { connect } from 'react-redux'


const AnecdoteForm = (props) => {

  const newAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
    props.setMessage(`new anecdote '${content}' added`, 5)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={newAnecdote} >
        <div><input name='anecdote' /></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

const connectedAnecdoteForm = connect(null, { createAnecdote, setMessage })(AnecdoteForm)
export default connectedAnecdoteForm