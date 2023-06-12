import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


interface WeatherData {
  temperature: number;
  humidity: number;
  // Add more weather data fields as needed
}

interface AirQualityData {
  pm25: number;
  pm10: number;
  // Add more air quality data fields as needed
}

const Dashboard: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);

  const fetchWeatherData = async () => {
    // Fetch weather data using an API of your choice
    // Replace 'YOUR_WEATHER_API_KEY' with your actual API key
    const apiKey = 'YOUR_WEATHER_API_KEY';
    const response = await fetch(
      `https://api.example.com/weather?city=${city}&apiKey=${apiKey}`
    );
    const data = await response.json();
    setWeather(data);
  };

  const fetchAirQualityData = async () => {
    // Fetch air quality data using an API of your choice
    // Replace 'YOUR_AIR_QUALITY_API_KEY' with your actual API key
    const apiKey = 'YOUR_AIR_QUALITY_API_KEY';
    const response = await fetch(
      `https://api.example.com/air-quality?city=${city}&apiKey=${apiKey}`
    );
    const data = await response.json();
    setAirQuality(data);
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
                  {/* Add more weather data fields as needed */}
                  <h4>Air Quality:</h4>
                  <p>PM2.5: {airQuality.pm25}</p>
                  <p>PM10: {airQuality.pm10}</p>
                  {/* Add more air quality data fields as needed */}
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




