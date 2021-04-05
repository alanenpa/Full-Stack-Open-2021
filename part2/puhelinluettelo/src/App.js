import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ value, handler }) => (
  <div>
    filter with name or number: <input value={value} onChange={handler} />
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.onSubmit}>
    <div>
      name: <input value={props.newName} onChange={props.nameHandler} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.numberHandler} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const ContactList = ({ selectFrom, handleDeletion }) => (
  <ul>
    {selectFrom.map(person =>
      <li key={person.id}>
        {person.name} {person.number} <button id={person.id} onClick={handleDeletion}>delete</button>
      </li>
    )}
  </ul>
)

const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={error ? "error" : "notification"} >
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const addEntry = event => {
    let found = false
    event.preventDefault()
    const newEntry = {
      name: newName,
      number: newNumber
    }
    
    if (persons.some(person => person.name === newName)) {
      found = true
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const target = persons.find(p => p.name === newName)
        personService
          .update(target.id, newEntry)
          .then(updated => {
            setPersons(persons.map(person => person.name === target.name ? updated : person))
            setMessage(`The number of ${newName} was updated`)
          })
          .catch(error => {
            setMessage(`Information of ${target.name} has already been removed from the server`)
            setPersons(persons.filter(p => p.id !== target.id))
            setError(true)
          })
        setTimeout(() => {
          setMessage(null)
          if (error) setError(false)
        }, 5000)
      }

    }
    setNewName('')
    setNewNumber('')
    if (!found) {
      personService
        .create(newEntry)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${newName}`)
        })
        .catch(error => {
          setMessage(error.response.data.error)
          setError(true)
        })
      setTimeout(() => {
        setMessage(null)
        if (error) setError(false)
      }, 5000)
    }
  }

  const deleteEntry = event => {
    const person = persons.find(p => p.id === event.target.id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id)
      setPersons(persons.filter(p => p.id !== person.id))
      setMessage(`Deleted ${person.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const entriesToShow = showAll
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase()) || person.number.includes(filter)
    )

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    event.target.value.length === 0 ? setShowAll(true) : setShowAll(false)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error} />
      <Filter value={filter} handler={handleFilterChange} />
      <h2>add a new entry</h2>
      <PersonForm
        onSubmit={addEntry}
        newName={newName}
        newNumber={newNumber}
        nameHandler={(event) => setNewName(event.target.value)}
        numberHandler={(event) => setNewNumber(event.target.value)}
      />
      <h2>Numbers</h2>
      <ContactList selectFrom={entriesToShow} handleDeletion={deleteEntry} />
    </div>
  )
}

export default App