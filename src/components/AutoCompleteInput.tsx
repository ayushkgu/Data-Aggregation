import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AutoCompleteInput.css';
import Dashboard from './Dashboard';

interface Location {
  name: string;
  admin1: string;
  country: string;
  latitude: string;
  longitude: string;
}

function AutocompleteInput(props: any) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [selectedOption, setSelectedOption] = useState<Location | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);
        setSuggestions(response.data.results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    if (city) {
      fetchData();
    } else {
      setSuggestions([]);
    }
  }, [city]);

  const handleOptionClick = (location: Location) => {
    setCity(`${location.name}, ${location.admin1}, ${location.country}`);
    setSelectedOption(location);
    props.onChildClick(location.latitude, location.longitude);
  };


  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Eg: New York, New York, United States"
        className="autocomplete-input" 
      />


      <ul className="suggestions-list">
        {suggestions?.map((location, index) => (
          <li
            key={index}
            className={selectedOption === location ? 'selected' : ''}
            onClick={() => handleOptionClick(location)}
          >
            {`${location.name}, ${location.admin1}, ${location.country}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AutocompleteInput;