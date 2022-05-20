// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, {useState, useEffect} from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [])
  const [step, setStep] = useLocalStorageState('step', 0)

  //if history[step] is undefined, then set it
  if (!history[step]) {
    const historyCopy = [...history]
    historyCopy.push(Array(9).fill())
    setHistory(historyCopy)

    // I want to return here so that the component will be called again when the history state has been updated
    // I'm sure this isn't a proper react way of doing this, but it works (I hope there's no side effects I hadn't though of)
    return
  }

  const currentSquares = history[step]

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (winner || square[square]) return

    //make a copy of the history, then set the new value
    const historyCopy = [...history]
    historyCopy[step][square] = nextValue

    //we need to add a new set of squares to the history array
    //and it needs to be a copy of the most recent squares (to carry the history along)
    //so make a copy and push it onto the history array
    const newSquares = [...historyCopy[step]]
    historyCopy.push(newSquares)
    setHistory(historyCopy)

    setStep(prevStep => prevStep + 1)
  }

  function restart() {
    setHistory([])
    setStep(0)
  }

  const moves = () => {
    return (
      <>
        <li>
          <button>Go to game start</button>
        </li>
        {history.map((squares, index) => {
          return index < step ? (
            <li key={index}>
              <button>Go to move #{index}</button>
            </li>
          ) : null
        })}
      </>
    )
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves()}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
