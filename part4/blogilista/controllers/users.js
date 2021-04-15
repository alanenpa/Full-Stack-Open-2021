const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (body.username === undefined && body.password === undefined) {
    return response.status(400).json({ error: 'username and password missing' })
  } else if (body.password.length < 3) {
    return response.status(400).json({ error: 'password needs to be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    blogs: body.blogs,
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { user: 0 })
  response.json(users.map(u => u.toJSON()))
})

usersRouter.put('/:id', async (request, response) => {
  const body = request.body

  const user = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    blogs: body.blogs
  }

  const updatedEntry = await User.findByIdAndUpdate(request.params.id, user, { new: true })
  response.json(updatedEntry)
})

module.exports = usersRouter