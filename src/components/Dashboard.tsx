import React, { useState } from 'react';
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
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [coordinates, setCoordinates] = useState<GeocodingResult | null>(null);

  //Fetching latitude and longitude using Geocoding Open-Meteo API
  const getCoordinates = async () => {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=` + {city} + `&count=1&language=en&format=json`
      );
      const data = response.data;

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ latitude: lat, longitude: lng });
        console.log(lat);
        console.log(lng);
      } else {
        setCoordinates(null);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setCoordinates(null);
    }
  };

  //Fetching Weather Data using Weather Forecast Open-Meteo API
  const fetchWeatherData = async () => {
      try {
        const response = await axios.get<WeatherData>(
          `https://api.open-meteo.com/v1/forecast?latitude=` + coordinates?.latitude + `&longitude=` + coordinates?.longitude + `&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,windspeed_10m`
        );

        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

//Fetching Air Quality Data using Air Quality Open-Meteo API
  const fetchAirQualityData = async () => {
    try {
      const response = await axios.get<WeatherData>(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=` + coordinates?.latitude + `&longitude=` + coordinates?.longitude + `&hourly=pm10,pm2_5`
      );

      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getCoordinates();
    fetchWeatherData();
    fetchAirQualityData();
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




