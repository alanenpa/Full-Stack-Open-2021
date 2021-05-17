import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, createComment } from '../reducers/blogReducer'
import { useParams } from 'react-router-dom'

const CommentForm = () => {
  const [newComment, setNewComment] = useState('')
  const dispatch = useDispatch()
  const id = useParams().id

  const addComment = async (event) => {
    event.preventDefault()
    const comment = {
      content: newComment
    }
    dispatch(createComment(id, comment))
    setNewComment('')
  }

  return (
    <form onSubmit={addComment}>
      <input
        type='text'
        value={newComment}
        onChange={(event) => setNewComment(event.target.value)}
      />
      <button type='submit'>add comment</button>
    </form>
  )
}

const BlogView = () => {
  const dispatch = useDispatch()
  const likeEntry = async (blog) => {
    const entry = {
      ...blog,
      user: blog.user.id,
      comments: blog.comments.map(c => c.id)
    }
    try {
      dispatch(likeBlog(entry))
    } catch (e) {
      console.log('update failed:', e.message)
    }
  }

  const blogs = useSelector(state => state.blogs)
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  if (!blog) {
    return null
  }
  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <p>
        {blog.url}<br />
        {blog.likes}<button onClick={() => likeEntry(blog)}>like</button><br />
        added by {blog.user.name}<br />
      </p>
      <h3>comments</h3>
      <ul>
        {blog.comments.map(comment =>
          <li key={comment.id}>{comment.content}</li>
        )}
      </ul>
      <CommentForm blog={blog} />
    </div>
  )
}

export default BlogView