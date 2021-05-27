import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'

const AuthorUpdateForm = ({ authors }) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const submit = async (event) => {
    event.preventDefault()
    updateAuthor({ variables: { name, year } })
    setName('')
    setYear('')
  }

  return (
    <div>
      <h3>set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value="" defaultValue disabled hidden>Choose an author</option>
            {authors.map(author => 
              <option key={author.id}>
                {author.name}
              </option>
            )}
          </select>
        </div>
        <div>
          born
          <input
            value={year}
            onChange={({ target }) => setYear(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorUpdateForm