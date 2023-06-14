import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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
        `https://geocoding-api.open-meteo.com/v1/search?name=` + city + `&count=1&language=en&format=json`
      );
      const data = response.data;

      if (data.results != undefined && data.results.length > 0)  {
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
          `https://api.open-meteo.com/v1/forecast?latitude=` + Geo.latitude + `&longitude=` + Geo.longitude + `&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,windspeed_10m`
        );
      
        const data = response.data; 
        
        if (data.hourly != undefined){
          
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

          fetchAirQualityData();
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

      if (data.hourly != undefined)  {
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

      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }} className="mt-4">
            <Card>

              <Card.Header>
                <h3>Weather and Air Quality Dashboard</h3>
              </Card.Header>

              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formCity">
                    <Form.Label>Enter a city name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="E.g., New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Form.Group>

                  <br />

                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
                {weather && airQuality && (
                  <div className="mt-4">
                    <h4>Weather:</h4>
                    <p>Temperature: {weather.temperature}°C</p>
                    <p>Humidity: {weather.humidity}%</p>
                    <p>Feels like Temperature: {weather.apparentTemperature}°C</p>
                    <p>Precipitation Probability: {weather.precipitationProb}°C</p>
                    <p>Wind Speed: {weather.windSpeed}°C</p>
                    
                    <h4>Air Quality:</h4>
                    <p>PM2.5: {airQuality.pm25}</p>
                    <p>PM10: {airQuality.pm10}</p>

                  </div>
                )}
              </Card.Body>

            </Card>
          </Col>
        </Row>
      </Container>

    </div>

  );
};

export default Dashboard;