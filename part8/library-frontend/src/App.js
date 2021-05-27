import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Loginform'
import { useApolloClient, useSubscription } from '@apollo/client'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED } from './queries'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const showWhenLoggedIn = { display: token ? '' : 'none' }
  const hideWhenLoggedIn = { display: token ? 'none' : '' }

  useEffect(() => {
    const token = window.localStorage.getItem('userToken')
    if (token) {
      setToken(token)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData.data.bookAdded)
      const title = subscriptionData.data.bookAdded.title
      const author = subscriptionData.data.bookAdded.author
      window.alert(`book ${title} by ${author.name} added!`)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button style={showWhenLoggedIn} onClick={() => setPage('add')}>add book</button>
        <button style={showWhenLoggedIn} onClick={() => setPage('recommendations')}>recommendations</button>
        <button style={showWhenLoggedIn} onClick={logout}>logout</button>
        <button style={hideWhenLoggedIn} onClick={() => setPage('login')}>login</button>
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <Recommendations
        show={page === 'recommendations'} token={token}
      />

      <Login
        show={page === 'login'}
        setPage={setPage}
        setToken={setToken}
      />

    </div>
  )
}

export default App