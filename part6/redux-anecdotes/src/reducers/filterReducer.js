const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter
    default: return state
  }
}

export const setFilter = (filter) => {
  console.log('setFilter')
  return {
    type: 'SET_FILTER',
    filter: filter
  }
}

export default reducer