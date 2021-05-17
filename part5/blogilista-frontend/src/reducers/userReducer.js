import blogService from '../services/blogs'

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data
    case 'CLEAR_USER':
      return null
    default: return state
  }
}

export const setUser = (user) => {
  return async dispatch => {
    window.localStorage.setItem(
      'loggedInUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    dispatch({
      type: 'SET_USER',
      data: user
    })
  }
}

export const clearUser = () => {
  return async dispatch => {
    window.localStorage.clear()
    dispatch({
      type: 'CLEAR_USER'
    })
  }
}

export default reducer