import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.message)
  if (notification === null) {
    return null
  }
  return (
    <div  className="alert alert-primary" role="alert">
      {notification}
    </div>
  )
}

export default Notification