import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ value, handler }) => (
  <div>
    find countries: <input value={value} onChange={handler} />
  </div>
)

const Country = ({ country }) => {
  const [weather, setWeather] = useState('')

  useEffect(() => {
    const params = {
      access_key: process.env.REACT_APP_API_KEY,
      query: `${country.capital}, ${country.name}`
    }
    axios
      .get('http://api.weatherstack.com/current', { params })
      .then(response => {
        console.log(response)
        const current = response.data.current
        const apiResponse = {
          location: response.data.location.name,
          temperature: current.temperature,
          icon: current.weather_icons[0],
          wind_speed: current.wind_speed,
          wind_direction: current.wind_dir
        }
        setWeather(apiResponse)
      })
  }, [])

  return (
    <div>
      <h1>{country.name}</h1>
      <p>
        capital {country.capital} <br />
        population {country.population}
      </p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language =>
          <li key={language.name}>
            {language.name}
          </li>
        )}
      </ul>
      <img src={country.flag} alt='country flag' width='125' />
      <h2>Weather in {weather.location} </h2>
      <p><strong>temperature:</strong> {weather.temperature} Celcius</p>
      <img src={weather.icon} alt='weather icon' />
      <p><strong>wind:</strong> {weather.wind_speed} m/s, direction {weather.wind_direction} </p>
    </div>
  )
}

const CountryList = ({ countries, handleClick }) => {
  const n = countries.length
  if (n >= 10) {
    return (
      <p> Too many matches ({countries.length}), specify another filter</p>
    )
  } else if (n === 1) {
    return <Country country={countries[0]} />
  } else {
    return (
      <ul>
        {countries.map(country =>
          <li key={country.name}>
            {country.name} <button id={country.name} onClick={() => handleClick(country)}>show</button>
          </li>
        )}
      </ul>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleClick = country => {
    setFilter(country.name)
  }

  const entriesToShow = filter.length === 0
    ? countries
    : countries.filter(country =>
      String(country.name).toLowerCase().includes(filter.toLowerCase())
    )

  return (
    <div>
      <Filter value={filter} handler={handleFilterChange} />
      <CountryList countries={entriesToShow} handleClick={handleClick} />
    </div>
  )
}

export default App;
