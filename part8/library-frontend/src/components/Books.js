import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const [booksByGenre, result2] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "no-cache"
  })
  const [booksToShow, setBooksToShow] = useState([])
  const [genres, setGenres] = useState([])

  useEffect(() => {
    getBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const extractGenres = (books) => {
    let array = []
    books.forEach(b => {
      b.genres.forEach(g => {
        if (!array.includes(g)) {
          array.push(g)
        }
      })
    })
    setGenres(array)
  }

  useEffect(() => {
    if (result.data) {
      setBooksToShow(result.data.allBooks)
      extractGenres(result.data.allBooks)
    }
  }, [result])

  useEffect(() => {
    if (result2.data) {
      setBooksToShow(result2.data.allBooks)
    }
  }, [result2])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <p>loading...</p>
  }

  const books = result.data.allBooks


  const filterBooks = (genre) => {
    if (!genre) {
      setBooksToShow(books)
      return
    }
    booksByGenre({ variables: { genre: `${genre}` } })
  }

  return (
    <div>
      <h2>books</h2>
      {genres.map(genre =>
        <button key={genre} onClick={() => filterBooks(genre)} >{genre}</button>
      )}
      <button onClick={() => filterBooks(null)}>all genres</button>
      <p></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksToShow.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books