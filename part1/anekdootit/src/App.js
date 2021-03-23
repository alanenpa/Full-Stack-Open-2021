import React, { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
  const n = anecdotes.length
  const [votes, setVotes] = useState(new Array(n).fill(0))
  const [selected, setSelected] = useState(0)

  const pickANumber = () => {
    const value = Math.floor(Math.random() * n)
    setSelected(value)
  }

  const vote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const mostVotes = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}<br/>has {votes[selected]} votes</p>
      <Button
        handleClick={vote}
        text='vote'
      />
      <Button
        handleClick={pickANumber}
        text='next anecdote'
      />
      <h2>Anecdote with the most votes</h2>
      <p>{anecdotes[mostVotes]}<br/>has {votes[mostVotes]} votes</p>
    </div>
  )
}

export default App