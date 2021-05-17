import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newEntry => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newEntry, config)
  return response.data
}

const createComment = async (id, newComment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, newComment)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const update = async (entry) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${entry.id}`, entry, config)
  return response.data
}

export default { getAll, create, createComment, update, remove, setToken }