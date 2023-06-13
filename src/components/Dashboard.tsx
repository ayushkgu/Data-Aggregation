import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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

  //Fetching Weather Data using Weather Forecast Open-Meteo API
  const fetchWeatherData = async () => {
      try {
        const response = await axios.get<WeatherData>(
          `https://api.open-meteo.com/v1/forecast?city=${city}&hourly=temperature_2m`
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
        `https://api.open-meteo.com/v1/forecast?city=${city}&hourly=temperature_2m`
      );

      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchWeatherData();
    fetchAirQualityData();
  };

  return (
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
  );
};

export default Dashboard;




