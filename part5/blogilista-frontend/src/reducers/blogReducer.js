/* eslint-disable no-case-declarations */
import blogService from '../services/blogs'
import { setMessage } from '../reducers/notificationReducer'

const byLikes = (a1, a2) => a2.likes - a1.likes

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data.sort(byLikes)
    case 'NEW_BLOG':
      return [...state, action.data]
    case 'LIKE_BLOG':
      const liked = action.data.id
      return state.map(a => a.id !== liked ? a : action.data).sort(byLikes)
    case 'REMOVE_BLOG':
      return state.filter(a => a.id !== action.data)
    case 'NEW_COMMENT':
      const commented = action.data.id
      return state.map(a => a.id !== commented ? a : action.data).sort(byLikes)
    default: return state
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const liked = {
      ...blog,
      likes: blog.likes + 1
    }
    const response = await blogService.update(liked)
    dispatch({
      type: 'LIKE_BLOG',
      data: response
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })
      dispatch(setMessage(`a new blog ${newBlog.title} added!`, 5))
    } catch (e) {
      dispatch(setMessage('blog entry creation failed, check console for details', 5))
      console.log(e.message)
    }

  }
}

export const createComment = (id, comment) => {
  return async dispatch => {
    const commentedBlog = await blogService.createComment(id, comment)
    console.log('commentedBlog', commentedBlog)
    dispatch({
      type: 'NEW_COMMENT',
      data: commentedBlog
    })
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: id
    })
  }
}

export const initialize = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default reducer