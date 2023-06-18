import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Dashboard.css';
import Windpic from './wind.jpeg'
import AutoCompleteInput from './AutoCompleteInput';
import sunrise from './sunrise.png';
import sunset from './sunset.png';


import { Line } from 'react-chartjs-2';
//import { Chart as ChartJS } from 'chart.js/auto'
//import { Chart }            from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { VictoryPie } from 'victory'; // pie chart import

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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
  isDay: number;
  maxTemp: number;
  minTemp: number;
  sunrise: string;
  sunset: string;
}

interface AirQualityData {
  pm25: number;
  pm10: number;
}

const Dashboard: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [city, setCity] = useState('');
  var [cityName, setCityName] = useState('');
  const initialCoordinates: GeocodingResult = { latitude: 0, longitude: 0 };
  const [coordinates, setCoordinates] = useState<GeocodingResult>(initialCoordinates);
  const initialWeather: WeatherData = {
    temperature: 0,
    humidity: 0,
    apparentTemperature: 0,
    precipitationProb: 0,
    precipitation: 0,
    windSpeed: 0,
    isDay: 1,
    maxTemp: 0,
    minTemp: 0,
    sunrise: "",
    sunset: ""
  };
  const [weather, setWeather] = useState<WeatherData>(initialWeather);
  const initialAirQuality: AirQualityData = { pm25: 0, pm10: 0 };
  const [airQuality, setAirQuality] = useState<AirQualityData>(initialAirQuality);
  const [hourlyForecast, setHourlyForecast] = useState<number[]>([]);

  let Geo: GeocodingResult;
  let Wea: WeatherData;
  let AirQ: AirQualityData;
  var data;

  const fetchWeatherData = async (lat: string, lng: string, cityName: string) => {
    try {
      const response = await axios.get(
        // `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch`
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,windspeed_10m,is_day&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch&timezone=auto`
      );


      if (data.hourly !== undefined) {
        Wea = {
          temperature: data.hourly.temperature_2m[0],
          humidity: data.hourly.relativehumidity_2m[0],
          apparentTemperature: data.hourly.apparent_temperature[0],
          precipitationProb: data.hourly.precipitation_probability[0],
          precipitation: data.hourly.precipitation[0],
          windSpeed: data.hourly.windspeed_10m[0],
          isDay: data.hourly.is_day[0],
          maxTemp: data.daily.temperature_2m_max[0],
          minTemp: data.daily.temperature_2m_min[0],
          sunrise: data.daily.sunrise[0].slice(-5),
          sunset: data.daily.sunset[0].slice(-5)
        };

      await setWeather((prevWeather) => ({
          ...prevWeather,
          temperature: Wea.temperature,
          humidity: Wea.humidity,
          apparentTemperature: Wea.apparentTemperature,
          precipitationProb: Wea.precipitationProb,
          precipitation: Wea.precipitation,
          windSpeed: Wea.windSpeed,
          isDay: Wea.isDay,
          maxTemp: Wea.maxTemp,
          minTemp: Wea.minTemp, 
          sunrise: Wea.sunrise, 
          sunset: Wea.sunset 
        }));

        setHourlyForecast(data.hourly.temperature_2m);
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchAirQualityData = async (lat: string, lng: string, cityName: any) => {
    try {
      // const response = await axios.get(
      //   `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=pm10,pm2_5`
      // );

      // const data = response.data;

      var AirQ = await fetchAir(cityName, lat, lng);
      console.log("this is what airq is " + JSON.stringify(AirQ));
      // if(AirQ.hourly)
      // {
        setAirQuality((prevAirQuality) => ({
          ...prevAirQuality,
          pm25: AirQ.pm25,
          pm10: AirQ.pm10,
        }));
      // }
      
    }  catch (error) {
      console.error('Error fetching air quality data:', error);
    }
  }

  async function handleChildEvent(lat: string, lng: string, cityName: any){
    // console.log("city selected from dashboard: " + cityName);
    console.log("lat, long from dashboard: " + lat + "," + lng);
    await fetchWeatherData(lat, lng, cityName); 
    await fetchAirQualityData(lat, lng, cityName);
  };


  const currentHour = new Date().getHours();
  const upcomingHours = Array.from({ length: 6 }, (_, i) => currentHour + i + 1);
  const xLabels = upcomingHours.map(hour => `${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? 'AM' : 'PM'}`);

  const numericalHourlyForecast = hourlyForecast.slice(0, 6).map((value, index) => ({
    x: upcomingHours[index],
    y: value,
  }));

  const humidity = weather.humidity;
  const precipitationProb = weather.precipitationProb;
  
  /** code to display autocontinue search -- place in return() underneath first <h3> tag when ready
   * <h3>Weather and Air Quality Dashboard</h3>
        <div className="">
          <div className="search-bar-container">
            <SearchBar setResults={setResults} />
            {results && results.length > 0 && <SearchResultsList results={results} />}
          </div>
        </div>
   */


    return (
      <div className="App">

        <div className='search-bar-container'>
        <h2>Search for a City</h2>
        <AutoCompleteInput onChildClick = {handleChildEvent}/>
        </div>


        <br />
        <br />
        

        <div className="container">
          <div className="row">
            <div className="col-4">
              <div className="first-card">
              <br />
              <h2>Weather and Air Quality </h2>

                <div className="card-body"> <br />
                
                  <div className="first-card-container">
                    <div className="sun-container">
                      <img className='sun-icon' src={sunrise} alt="Sunrise Icon" /> 
                      <p className="sun-time">Sunrise: {weather.sunrise}</p>
                    </div>
                    <div className="sun-container">
                      <img className='sun-icon' src={sunset} alt="Sunset Icon" />
                      <p className="sun-time">Sunset: {weather.sunset}</p>
                    </div>
                  </div>

     
                  <br /><br />
                  <h3 className = 'cur-temp'> {weather.temperature}°F</h3>
                  <br /><br /><br /><br /> 
                  <div className='minmax'><b>Low:</b> {weather.minTemp}°F,<b> High:</b> {weather.maxTemp}°F </div> <br />
                  <h5 className = 'pm'><b>PM2.5:</b> {airQuality.pm25}, <b>PM10:</b> {airQuality.pm10}</h5>
                </div>
              </div>
          </div>

          <div className="col-8">
            <div className="second-card">
              <br />
              <div className="card-body">
                <h2>Hourly Forecast</h2>
                <div
                  className="chart-container"
                  style={{
                    width: '800px',
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Line
                    data={{
                      labels: xLabels,
                      datasets: [
                        {
                          label: 'Hourly Temperature',
                          data: numericalHourlyForecast,
                          fill: false,
                          backgroundColor: 'rgba(75,192,192,0.4)',
                          borderColor: 'rgba(0,0,0)',
                          borderWidth: 2
                          
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        x: {
                          type: 'category',
                          display: true,
                          title: {
                            display: true,
                            text: 'Time',
                          },
                        },
                        y: {
                          type: 'linear',
                          display: true,
                          title: {
                            display: true,
                            text: 'Temperature',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
       </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col">
            <div className="third-card">
              <div className="card-body">
                <br />
                <h2>More details about today's weather</h2>
                <br />
                <div className="row">
                  <div className="col-md-4">
                    <div className="little-card">
                      <div className="card-body">
                        <h6 className="card-title float-start">Humidity</h6> <br /> 
                        <VictoryPie
                          data={[{ x:  humidity + '%', y: humidity },{ x: ' ', y: 100 - humidity }]}
                          colorScale={['#75baff', '#e4e4e4']}
                          padAngle={3}
                          innerRadius={55}
                          height={180}
                          width={180}
                        />
                      </div>
                    </div>
                  </div>
      
                  <div className="col-md-4">
                    <div className="little-card wind">
                      <div className="card-body">
                        <h6 className="card-title float-start">Wind</h6> <br /> <br />
                        <h4 className="card-text">{weather.windSpeed} m/s</h4>
                      </div>
                    </div>
                  </div>
      
                  <div className="col-md-4">
                    <div className="little-card rain">
                      <div className="card-body">
                        <h6 className="card-title float-start">Precipitation</h6> <br /> <br />
                        <h4 className="card-text">{weather.precipitation} inch</h4>
                      </div>
                    </div>
                  </div>
      
                  <div className="col-md-4">
                    <div className="little-card temp">
                      <div className="card-body">
                        <h6 className="card-title float-start">Feels like</h6> <br /> <br />
                        <h4 className="card-text">{weather.apparentTemperature} °F</h4>
                      </div>
                    </div>
                  </div>
      
                  <div className="col-md-4">
                    <div className="little-card">
                      <div className="card-body">
                        <h6 className="card-title float-start">Chance of rain</h6> <br /> 
                        <VictoryPie
                          data={[{ x:  precipitationProb + '%', y: precipitationProb },{ x: ' ', y: 100 - precipitationProb }]}
                          colorScale={['#75baff', '#e4e4e4']}
                          padAngle={3}
                          innerRadius={55}
                          height={180}
                          width={180}
                        />
                      </div>
                    </div>
                  </div>
                  
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