const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
  {
    "title": "Ruokablogi",
    "author": "Hans Välimäki",
    "url": "safka.net",
    "likes": 1053
  },
  {
    "title": "Test",
    "author": "Jari Piippola",
    "url": "joo.org",
    "likes": 501
  },
  {
    "title": "Matkustelu",
    "author": "Kyösti Kallio",
    "url": "net.org",
    "likes": 925
  }
]

const initialUser = {
  "blogs": [],
  "name": "Arnold",
  "username": "testUser",
  "password": "qwerty"
}

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
  await User.deleteMany({})
  // create initial user for tests
  await api
    .post('/api/users')
    .send({
      name: initialUser.name,
      username: initialUser.username,
      password: initialUser.password
    })
  // create token for initial user
  await api
    .post('/api/login')
    .send({
      username: initialUser.username,
      password: initialUser.password
    })
    .expect(response => {
      token = response.body.token
    })
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three initial blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
})

test('blogs have an id field', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  });
})

test('a valid entry can be added', async () => {
  const newEntry = {
    title: "TestBlog",
    author: "John Smith",
    url: "bl.org",
    likes: "241"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newEntry)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  const testEntry = response.body.find(b => b.title === 'TestBlog')
  expect(testEntry.user.username).toBe('testUser')

})

test('likes has a default value', async () => {
  const newEntry = {
    title: "A Blog Without Likes Specified",
    author: "Isaac Newton",
    url: "bl.org",
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newEntry)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const testEntry = response.body.find(b => b.author === "Isaac Newton")
  expect(testEntry.likes).toBe(0)
})

test('a new entry must have title and url', async () => {
  const newEntry = {
    author: "Galileo Galilei",
    likes: 4434
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newEntry)
    .expect(400)
    .expect('Content-Type', /application\/json/)
    .expect({error: 'title and url missing'})
})

test('no new entries without a token', async () => {
  const newEntry = {
    title: "Blog Of The Tokens",
    author: "Richard Feynman",
    url: "bl.org",
    likes: "234"
  }

  await api
    .post('/api/blogs')
    .send(newEntry)
    .expect(401)
    .expect('Content-Type', /application\/json/)
    .expect({error: 'token missing or invalid'})
})


afterAll(() => {
  mongoose.connection.close()
})