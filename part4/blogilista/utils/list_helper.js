const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favorite = (blogs) => {
  let max = blogs[0]
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max.likes) max = blogs[i]
  }
  return {
    title: max.title,
    author: max.author,
    likes: max.likes
  }
}

const mostBlogs = (blogs) => {
  const authors = _.groupBy(blogs, 'author')
  const sorted = _.sortBy(authors, arr => arr.length)
  const author = _.last(sorted)[0].author
  return {
    author: author,
    blogs: _.last(sorted).length
  }  
}

const mostLikes = (blogs) => {
  const authors = _.groupBy(blogs, 'author')
  let mostLiked = {
    author: '',
    likes: 0
  }
  for (const key in authors) {
    const count = authors[key].reduce((acc, cur) => {
      return acc += cur.likes
    }, 0)
    if (count > mostLiked.likes) {
      mostLiked.author = key
      mostLiked.likes = count
    }
  }
  return mostLiked
}

module.exports = {
  dummy,
  totalLikes,
  favorite,
  mostBlogs,
  mostLikes
}