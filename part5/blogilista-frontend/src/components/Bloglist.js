import React from 'react'
import { Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  return (
    <tr id='blog'>
      <td>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title}
        </Link>
      </td>
      <td>
        {blog.author}
      </td>
    </tr>
  )
}

const Bloglist = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <Table striped>
      <tbody>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </tbody>
    </Table>
  )
}

export default Bloglist