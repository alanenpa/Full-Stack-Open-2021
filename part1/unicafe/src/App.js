import React, { useState } from 'react'

const StatisticLine = ({ text, value }) => (
  <tr>
    <th>{text}</th>
    <th>{value}</th>
  </tr>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = ({ good, neutral, bad, all, rating }) => {
  if (all === 0) {
    return (
      <>
        <h1>Statistics</h1>
        No feedback given
      </>
    )
  }

  const average = rating / all
  const pos = (good / all) * 100 + ' %'

  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine
            text='good'
            value={good}
          />
          <StatisticLine
            text='neutral'
            value={neutral}
          />
          <StatisticLine
            text='bad'
            value={bad}
          />
          <StatisticLine
            text='all'
            value={all}
          />
          <StatisticLine
            text='average'
            value={average}
          />
          <StatisticLine
            text='positive'
            value={pos}
          />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [rating, setRating] = useState(0)

  const handleGood = () => {
    setGood(good+1)
    setRating(rating+1)
    setAll(all+1)
  }

  const handleNeutral = () => {
    setNeutral(neutral+1)
    setAll(all+1)
  }

  const handleBad = () => {
    setBad(bad+1)
    setRating(rating-1)
    setAll(all+1)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button
        handleClick={handleGood}
        text='GOOD'
      />
      <Button
        handleClick={handleNeutral}
        text='NEUTRAL'
      />
      <Button
        handleClick={handleBad}
        text='BAD'
      />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        rating={rating}
      />
    </div>
  )
}

export default App