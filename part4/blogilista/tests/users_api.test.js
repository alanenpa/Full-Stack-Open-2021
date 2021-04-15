const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('../utils/test_helper')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    blogs: [],
    username: 'eka',
    name: 'Sylvester',
    passwordHash
  })

  await user.save()
})

describe('when there is initially one user at db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const passwordHash = await bcrypt.hash('salasana', 10)
    const newUser = new User({
      blogs: [],
      username: 'toka',
      name: 'Matti Meikäläinen',
      passwordHash
    })

    await newUser.save()

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('when the request is malformatted', () => {
  test('no username nor password', async () => {
    const newUser = {
      name: 'Galileo Galilei',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({"error": "username and password missing"})
  })

  test('password too short', async () => {
    const newUser = {
      name: 'Galileo Galilei',
      username: 'GGalilei',
      password: 'qw'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({"error": "password needs to be at least 3 characters"})
  })
  
})


afterAll(() => {
  mongoose.connection.close()
})