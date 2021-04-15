const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const token = request.token
  const user = request.user
  if (!token || user === null) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (body.title === undefined && body.url === undefined) {
    return response.status(400).json({ error: 'title and url missing' })
  }

  const blog = new Blog({
    likes: body.likes,
    author: body.author,
    url: body.url,
    title: body.title,
    user: user._id
  })
  const savedEntry = await blog.save()
  user.blogs = user.blogs.concat(savedEntry._id)
  await user.save()

  response.json(savedEntry.toJSON())
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const token = request.token
  const user = request.user
  if (!token || user === null) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (blog === null) {
    return response.status(404).json({ error: `blog entry with id ${request.params.id} not found`})
  }

  if (user._id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(blog._id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'unauthorized user' })
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
  const token = request.token
  const user = request.user
  if (!token || user === null) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const body = request.body

  const entry = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  }
  const blog = await Blog.findById(request.params.id)

  if (blog === null) {
    return response.status(404).json({ error: `blog entry with id ${request.params.id} not found`})
  }

  if (user._id.toString() === blog.user.toString()) {
    const updatedEntry = await Blog.findByIdAndUpdate(request.params.id, entry, { new: true })
    response.json(updatedEntry)
  } else {
    response.status(401).json({ error: 'unauthorized user' })
  }
})

module.exports = blogsRouter
