import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Dashboard.css';
import { SearchResultsList } from './SearchResultsList';
import { SearchResult } from './SearchResult';
import { SearchBar } from './SearchBar';

interface GeocodingResult {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  precipitationProb: number; 
  precipitation: number;
  windSpeed: number; 
}

interface AirQualityData {
  pm25: number;
  pm10: number;
}

const Dashboard: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);

  const [city, setCity] = useState('');

  const initialCoordinates: GeocodingResult = { latitude: 0, longitude: 0 };
  const [coordinates, setCoordinates] = useState<GeocodingResult>(initialCoordinates);

  const initialWeather: WeatherData = {temperature: 0, humidity: 0, apparentTemperature: 0, precipitationProb: 0, precipitation: 0, windSpeed:0};
  const [weather, setWeather] = useState<WeatherData>(initialWeather);

  const initialAirQuality: AirQualityData = { pm25: 0, pm10: 0 };
  const [airQuality, setAirQuality] = useState<AirQualityData>(initialAirQuality);

  var Geo: GeocodingResult;
  var Wea: WeatherData;
  var AirQ: AirQualityData;

  //Fetching latitude and longitude using Geocoding Open-Meteo API
  const getCoordinates = async () => {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=` + city + `&count=10&language=en&format=json`
      );
      const data = response.data;

      if (data.results !== undefined && data.results.length > 0)  {
        Geo = {
          latitude: data.results[0].latitude,
          longitude: data.results[0].longitude
        };

        setCoordinates(prevCoordinates => ({
          ...prevCoordinates,
          latitude: Geo.latitude,
          longitude: Geo.longitude
        }));

        fetchWeatherData();
        fetchAirQualityData();
      } 
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setCoordinates({latitude: 0,longitude: 0});
    }
  };

  //Fetching Weather Data using Weather Forecast Open-Meteo API
  const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=` + Geo.latitude + `&longitude=` + Geo.longitude + `&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch`
        );
      
        const data = response.data; 
        
        if (data.hourly !== undefined){
          
          Wea = {
            temperature: data.hourly.temperature_2m[0], 
            humidity: data.hourly.relativehumidity_2m[0],
            apparentTemperature: data.hourly.apparent_temperature[0], 
            precipitationProb: data.hourly.precipitation_probability[0], 
            precipitation: data.hourly.precipitation[0], 
            windSpeed: data.hourly.windspeed_10m[0]
          };

          setWeather(prevWeather => ({
            ...prevWeather,
            temperature: Wea.temperature, 
            humidity: Wea.humidity,
            apparentTemperature: Wea.apparentTemperature, 
            precipitationProb: Wea.precipitationProb, 
            precipitation: Wea.precipitation, 
            windSpeed: Wea.windSpeed
          }));

        }
        
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

//Fetching Air Quality Data using Air Quality Open-Meteo API
  const fetchAirQualityData = async () => {
    try {
      const response = await axios.get(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=` + Geo.latitude + `&longitude=` + Geo.longitude + `&hourly=pm10,pm2_5`
      );

      const data = response.data; 

      if (data.hourly !== undefined)  {
        AirQ = {
          pm25: data.hourly.pm2_5[0],
          pm10:  data.hourly.pm10[0]
        };

        setAirQuality(prevAirQuality => ({
          ...prevAirQuality,
          pm25: AirQ.pm25,
          pm10: AirQ.pm10
        }));
      }

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getCoordinates();
  };

  return (
    <div className='App'>
        <h3>Weather and Air Quality Dashboard</h3>
        
    {/* Search Bar */}
      <div className="">
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList results={results} />}
      </div>
    </div>

      <div className = "big-card">
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 mt-4">
            <div className="card">

              <div className="card-header">
                <h3>Weather and Air Quality Dashboard</h3>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group" id="formCity">
                    <label htmlFor="city">Enter a city name:</label>
                    <input type="text" className="form-control" placeholder="E.g., New York" id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>

                  <br />

                  <button className="btn btn-primary" type="submit">Submit</button>
                </form>

                
              
              </div>

            </div>
          </div>
        </div>
      </div>

      <br />
      <h3>Temperature: {weather.temperature}°F</h3>
      <br />

<h4 className=''>More details of today's Weather </h4>
      <div className="container">
    <div className="row">

      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h6 className="card-title float-start">Humidity</h6> <br /> <br />
            <h4 className="card-text">{weather.humidity}%</h4>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h6 className="card-title float-start">Wind</h6> <br /> <br />
            <h4 className="card-text">{weather.windSpeed} km/hr</h4>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h6 className="card-title float-start">Precipitation</h6> <br /> <br />
            <h4 className="card-text">{weather.precipitation} inch</h4>

          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h6 className="card-title float-start">Feels like</h6> <br /> <br />
            <h4 className="card-text">{weather.apparentTemperature} °F</h4>
          </div>
        </div>
      </div>


      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h6 className="card-title float-start">Chance of rain</h6> <br /> <br />
            <h4 className="card-text">{weather.precipitationProb}%</h4>
          </div>
        </div>
      </div>


      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h6 className="card-title float-start">Air Quality</h6> <br /> <br />
            <h5 className="card-text">PM2.5: {airQuality.pm25}</h5>
            <h5 className="card-text">PM10: {airQuality.pm10}</h5>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
    </div>

  );
};

export default Dashboard; 