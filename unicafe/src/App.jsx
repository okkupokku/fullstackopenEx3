import { useState } from 'react'


const Header = (props) => {
  return (
    <h1>
      {props.text}
    </h1>
  )
 
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}


const StatisticsLine = (props) => {
  return (
    <tr>
      <td>
        {props.text} 
      </td>
      <td>
        {props.value} {props.textEnd}
      </td>
    </tr>
    
    
  )
}

const Statistics = (props) => {
  const g = props.good
  const n = props.neutral
  const b = props.bad
  return (
    <table>
      <tbody>
        <StatisticsLine text={'good'} value={g} />  
        <StatisticsLine text={'neutral'} value={n} />
        <StatisticsLine text={'bad'} value={b} />
        <StatisticsLine text={'all'} value={g + n + b} />
        <StatisticsLine text={'average'} value={(g - b) / (g + n + b)} />
        <StatisticsLine text={'positive'} value={(g / (g + n + b)) * 100} textEnd={'%'} />
      </tbody>  
    </table>

    
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const feedbackHeader = 'give feedback'
  const StatisticsLineHeader = 'StatisticsLine'

  return (
    <div>
      <Header text={feedbackHeader}/>
      <Button handleClick={() => setGood(good+1)} text={'good'} />
      <Button handleClick={() => setNeutral(neutral+1)} text={'neutral'} />
      <Button handleClick={() => setBad(bad+1)} text={'bad'} />
 
      <Header text={StatisticsLineHeader}/>
      {good !== 0 || neutral !== 0 || bad !== 0 ? (
        <>
         <Statistics good={good} neutral={neutral} bad={bad} />
        </>
      ) : (
        <p>No feedback given</p>
      )}

    </div>
  )
}

export default App
