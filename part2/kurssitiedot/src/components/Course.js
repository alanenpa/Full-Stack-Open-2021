import React from 'react'

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>
)

const Header = (props) => {
  return (
    <h1>
      {props.course}
    </h1>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Total = ({ parts }) => {
  return (
    <p>
      <strong>Total of {parts.reduce( (sum, part) => sum + part.exercises, 0)} exercises</strong>
    </p>
  )
}

export default Course