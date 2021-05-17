import React, { useState } from 'react'

const NewEntryForm = ({ addEntry }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const createNewEntry = (event) => {
    event.preventDefault()
    addEntry({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createNewEntry} >
        <div>
          title:
          <input
            id='title'
            type="text"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </div>
        <div>
          author:
          <input
            id='author'
            type="text"
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
          />
        </div>
        <div>
          url:
          <input
            id='url'
            type="text"
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
          />
        </div>
        <button id='submit' type="submit">create</button>
      </form>
    </div>
  )
}

export default NewEntryForm