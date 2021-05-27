import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'

const Recommendations = ({ show, token }) => {
  const [findUser, result] = useLazyQuery(ME, {
    fetchPolicy: "no-cache"
  })
  const [booksByGenre, result2] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "no-cache"
  })

  useEffect(() => {
    findUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (result.data && result.data.me !== null) {
      const genre = result.data.me.favoriteGenre
      booksByGenre({ variables: { genre: `${genre}` } })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  if (!show || !token) {
    return null
  }

  if (result.loading || result2.loading) {
    return <p>loading...</p>
  }
  const user = result.data.me
  if (user === null || !result2.data) {
    findUser()
    return <p>loading...</p>
  }
  const books = result2.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <br />
      <p>books in your favorite genre <strong>{user.favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(b =>
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

export default Recommendations