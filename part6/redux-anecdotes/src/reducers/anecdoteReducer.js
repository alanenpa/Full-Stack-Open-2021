
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'VOTE':
      const id = action.data.id
      return state.map(a =>
        a.id !== id ? a : action.data
      )
    default: return state
  }

}

export const voteAnecdote = (id) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const target = anecdotes.find(a => a.id === id)
    const voted = {
      ...target,
      votes: target.votes + 1
    }
    const response = await anecdoteService.voteEntry(voted)
    dispatch({
      type: 'VOTE',
      data: response
    })
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.newEntry(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const initialize = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

export default reducer