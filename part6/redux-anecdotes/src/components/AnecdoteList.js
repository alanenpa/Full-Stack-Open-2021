import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setMessage } from "../reducers/notificationReducer"

const Anecdote = ({ anecdote, handleClick }) => (
  <div key={anecdote.id}>
    <div>
      {anecdote.content}
    </div>
    <div>
      has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
    </div>
  </div>
)

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return filter.length === 0
      ? anecdotes
      : anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
  })

  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(voteAnecdote(anecdote.id))
    dispatch(setMessage(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      )}
    </div>
  )
}

export default AnecdoteList