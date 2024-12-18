import { useState } from 'react'



const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  //const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0, 0])

  const handleAnecRandom = () => {
    const random = Math.floor(Math.random() * anecdotes.length)
    setSelected(random)
  }

  const handleVote = () => {
    const vote = [...votes]
    vote[selected] +=1
    setVotes(vote)
  }

let votesMax = votes[0];
let votesIndex =0;

for (let i =1; i < votes.length; i++) {
  if (votes[i] > votesMax) {
    votesMax = votes[i]
    votesIndex = i
  }
}

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button text="vote" handleClick={() => handleVote(selected)} />
      <Button text="next anecdote" handleClick={handleAnecRandom}/>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[votesIndex]}</p>
      <p>has {votesMax} votes</p>
    </div>
  )
}

export default App