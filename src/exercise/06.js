// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useEffect, useState} from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false, message: null}
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true, message: error.message}
  }

  // componentDidCatch(error, errorInfo) {
  //   // You can also log the error to an error reporting service
  //   logErrorToMyService(error, errorInfo)
  // }

  render() {
    if (this.state.hasError) {
      console.log('this.state', this.state)
      // You can render any custom fallback UI
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{this.state.message}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })

  useEffect(() => {
    if (!pokemonName) return

    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({status: 'resolved', pokemon})
      })
      .catch(error => {
        setState({status: 'rejected', error})
      })
  }, [pokemonName])

  if (state.status === 'idle') return 'Submit a pokemon'
  if (state.status === 'pending')
    return <PokemonInfoFallback name={pokemonName} />
  if (state.status === 'rejected') throw new Error(state.error.message)

  if (state.status === 'resolved') <PokemonDataView pokemon={state.pokemon} />
}
function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
