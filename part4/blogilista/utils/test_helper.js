const Blog = require('../models/blog')
const User = require('../models/user')

const blogsInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  blogsInDb,
  usersInDb,
}