import { useState } from 'react'

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>
      {text}
      </button>
  )
}

const StatisticLine = ({text, value, type}) => {
  if (type === "pospercent") return (
    //<p>{text} {value} %</p>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
  else return (
    //<p>{text} {value}</p>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  let total = good + neutral + bad
  let average = (good - bad) / total
  let positive = (good / total) * 100


  if (good == 0 & neutral == 0 & bad == 0 ) {
    return (
      <p>No feedback given.</p>
  )
}
  
  return (
    <div>
      <table>
        <tbody>
        <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="total" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine type="pospercent" text="positive" value={positive} />
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

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }


  return (
    <div>
      <h2>give feedback</h2>
      <Button text="good" handleClick={handleGoodClick} />
      <Button text="neutral" handleClick={handleNeutralClick} />
      <Button text="bad" handleClick={handleBadClick} /> 
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
} 

export default App