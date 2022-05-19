// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect} from 'react'

const useLocalStorage = () => {
  const setValue = (name, value) => {
    window.localStorage.setItem(name, value)
  }

  const getValue = name => {
    return window.localStorage.getItem(name)
  }

  return [setValue, getValue]
}

function Greeting({initialName = ''}) {
  const [setValue, getValue] = useLocalStorage()

  const [name, setName] = React.useState(() => getValue('name') || initialName)

  useEffect(() => {
    setValue('name', name)
  }, [name])

  function handleChange(event) {
    const value = event.target.value
    setName(value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Marc" />
}

export default App
