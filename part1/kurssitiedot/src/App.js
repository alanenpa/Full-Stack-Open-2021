import React from 'react'

const Header = (props) => {
  return (
    <h1>
      Course: {props.course}
    </h1>
  )
}

const Part = ({part}) => {
  return (
    <p>
      {part.name}, number of exercises: <strong>{part.exercises}</strong>
    </p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      <Part part={parts[0]} />
      <Part part={parts[1]} />
      <Part part={parts[2]} />
    </div>
  )
}

const Total = ({parts}) => {
  return (
    <p>
      <br/>
      Total number of exercises: <strong>{parts[0].exercises + parts[1].exercises + parts[2].exercises}</strong>
    </p>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
  
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
export default App