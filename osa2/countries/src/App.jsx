import React, { useState, useEffect } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCountryInfo, setSelectedCountryInfo] = useState(null);
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_MY_KEY




  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const response = await fetch('https://studies.cs.helsinki.fi/restcountries/api/all');
        const data = await response.json();
        setAllCountries(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('An error occurred while fetching data');
      }
    };

    fetchAllCountries();
  }, []);

  useEffect(() => {
      handleSearch();
  }, [searchTerm]);

  const handleSearch = () => {
    const filteredCountries = allCountries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (filteredCountries.length > 10) {
      setSearchResults([]);
      setErrorMessage('Too many matches, specify another filter');
    } else {
      setSearchResults(filteredCountries.map(country => country.name.common));
      setErrorMessage('');
    }
    if (filteredCountries.length === 1) {
      const countryName = filteredCountries[0].name.common;
      handleShowDetails(countryName)
    
    } else {
      setSelectedCountryInfo(null);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    
  };


  const handleShowDetails = (country) => {
    fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
    .then(response => response.json())
    .then(data => {
      setSelectedCountryInfo(data);
      // Fetch weather data using the capital city
      console.log("capital: ", data.capital)
      const capital = data.capital;
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
        .then(response => response.json())
        .then(weatherData => {
          setWeather(weatherData);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          setErrorMessage('An error occurred while fetching weather data');
        });
    })
    .catch(error => {
      console.error('Error fetching country info:', error);
      setErrorMessage('An error occurred while fetching country info');
    })
  };

  return (
    <div className="App">
      <h1>Country Search</h1>
      <input
        type="text"
        placeholder="Enter country name..."
        value={searchTerm}
        onChange={handleChange}
      />
      <div className="results">
        {errorMessage && <p className="error">{errorMessage}</p>}
        {searchResults.length > 1 && (
          <ul>
            {searchResults.map((country, index) => (
              <li key={index}>
                {country} 
                <button onClick={() => handleShowDetails(searchResults[index])}>Show</button>
              </li>
            ))}
          </ul>
        )}
        {selectedCountryInfo && (
          <div>
            <h2>{selectedCountryInfo.name.common}</h2>
            <p>Official Name: {selectedCountryInfo.name.official}</p>
            <p>Capital: {selectedCountryInfo.capital}</p>
            <p>Area: {selectedCountryInfo.area}</p>
            <p>Region: {selectedCountryInfo.region}</p>
            <h3>Languages:</h3>
            <ul>
              {Object.keys(selectedCountryInfo.languages).map(languageCode => (
                <li key={languageCode}>
                  {selectedCountryInfo.languages[languageCode]}
                </li>
              ))}
            </ul>
            <img src={selectedCountryInfo.flags.png} alt={selectedCountryInfo.flags.alt} />
            {weather && (
              <div>
                <h2>Weather in {selectedCountryInfo.capital}</h2>
                <p>Temperature {(weather.main.temp - 273.15).toFixed(2)} Celcius</p>
                <p>Main description for icon: {weather.weather[0].description} , icon: {weather.weather[0].icon} </p>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
                <p>Wind: {weather.wind.speed} m/s</p>
              </div>
            )}
            
          </div>
        )}
     
      </div>
    </div>
  );
}

export default App;
