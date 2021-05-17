const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
    .populate('comments', { content: 1, id: 1 })
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

  await savedEntry.populate('user', { username: 1, name: 1, id: 1 }).execPopulate()

  response.json(savedEntry.toJSON())
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const token = request.token
  const user = request.user
  if (!token || user === null) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (blog === null) {
    return response.status(404).json({ error: `blog entry with id ${request.params.id} not found` })
  }

  if (user._id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(blog._id)
    user.blogs = user.blogs.filter(b => b.id.toString() !== request.params.id.toString())
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'unauthorized user' })
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  await updatedBlog.populate('user', { username: 1, name: 1, id: 1 }).execPopulate()
  await updatedBlog.populate('comments', { content: 1, id: 1}).execPopulate()
  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const id = request.params.id

  const comment = new Comment({
    content: body.content,
    blog: request.params.id
  })
  const savedComment = await comment.save()
  const blog = await Blog.findById(id)
  blog.comments = blog.comments.concat(comment._id)
  await blog.save()
  await blog.populate('user', { username: 1, name: 1, id: 1 }).execPopulate()
  await blog.populate('comments', { content: 1, id: 1 }).execPopulate()
  response.json(blog.toJSON())
})

module.exports = blogsRouter
