import { useState, ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "./SearchBar.css";

interface SearchBarProps {
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
}
  
  export const SearchBar: React.FC<SearchBarProps> = ({ setResults }) => {
    const [city, setCity] = useState<string>("");
  
    const fetchData = (value: string) => {
      axios.get( `https://geocoding-api.open-meteo.com/v1/search?name=` + city + `&count=10&language=en&format=json`, {
          params: {
            name: city,
            count: 10,
            language: "en",
            format: "json",
          },
        })
        .then((response) => {
          const results = response.data.results;
          setResults(results);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    };
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCity(value);
      fetchData(value);
    };
  
    return (
      <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input id="inputSearch"
          placeholder="Enter a city ..."
          value={city}
          onChange={handleChange}
        />
      </div>
    );
  };