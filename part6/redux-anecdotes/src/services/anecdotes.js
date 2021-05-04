import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const newEntry = async (anecdote) => {
  const object = { content: anecdote, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const voteEntry = async (entry) => {
  const response = await axios.put(`${baseUrl}/${entry.id}`, entry)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, newEntry, voteEntry }