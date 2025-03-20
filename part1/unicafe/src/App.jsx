import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [score, setScore] = useState(0)

  const handleGoodFeedback = () =>{
    //New good value
    const UpdateGood = good + 1
    //Updates good value 
    setGood(UpdateGood);
    //updates total amount of feedback
    const newTotal = bad + neutral + UpdateGood
    setTotal(newTotal)
    
    const NewScore = score + 1;
    setScore(NewScore)

  }
  const handleNeutralFeedback = () =>{
    const UpdateNeutral = neutral + 1
    setNeutral(UpdateNeutral);

    const newTotal = good + UpdateNeutral + bad
    setTotal(newTotal)

    const NewScore = score + 0;
    setScore(NewScore)

  }
  const handleBadFeedback = () =>{
    const UpdateBad = bad + 1
    setBad(UpdateBad);

    const newTotal = good + neutral + UpdateBad
    setTotal(newTotal)
    
    const NewScore = score - 1;
    setScore(NewScore)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGoodFeedback} text="Good"/>
      <Button onClick={handleNeutralFeedback} text="Neutral"/>
      <Button onClick={handleBadFeedback} text="Bad"/>

      <h1>Statistics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>

      <Statistics good={good} total={total} score={score} />
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value}) =>{
  return(
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>

  )
}

const Statistics = ({good, total, score}) =>{
  if(total === 0){
    return(
      <p>No feedback given</p>
    )
  }
  return(
    <div>
      <table>
        <tbody>
          <StatisticLine text="Total" value={total}/>
          <StatisticLine text="Average" value={(score/total).toFixed(1)}/>
          <StatisticLine text="Positive" value={(good/total*100).toFixed(1)}/>
        </tbody>
      </table>
    </div>
  )
}



export default App