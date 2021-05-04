const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_MSG':
      return action.message
    case 'CLEAR_MSG':
      return null
    default: return state
  }
}

let timeout

export const setMessage = (message, time) => {
  return dispatch => {
    dispatch({
      type: 'SET_MSG',
      message: message
    })
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      dispatch({
        type: 'CLEAR_MSG'
      })
    }, time*1000)

  }
}

export default reducer