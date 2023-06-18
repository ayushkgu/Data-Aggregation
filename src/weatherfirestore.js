import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import axios from "axios";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


export async function fetchWeather(city, latitude, longitude)
{
    const docRef = db.collection('weather').doc(city);
    const doc = await docRef.get();

    if (doc.exists && doc.data()) {
        const data = doc.data();

        // Get the date when the articles were last updated.
        const lastUpdate = new Date(data.time);
        const now = new Date();

        // If the articles were updated within the last day...
        console.log("day is" + now.getTime());
        if (now.getTime() - lastUpdate.getTime() <= 24 * 60 * 60 * 1000) {
            // Return the articles directly from the database.
            // console.log(data.articles);
            console.log("fetched from firestore db for weather")
            // return data.articles;
            return [data.weather, data.data];
        }
    }
    console.log("fetched weather api");
    console.log('latitude is ' + latitude + ", but longitude is " + longitude);
    const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=` + latitude + `&longitude=` + longitude + `&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch`
      );

    const data = response.data;
    if(data!==undefined)
    {
        var Wea = {
            temperature: data.hourly.temperature_2m[0], 
            humidity: data.hourly.relativehumidity_2m[0],
            apparentTemperature: data.hourly.apparent_temperature[0], 
            precipitationProb: data.hourly.precipitation_probability[0], 
            precipitation: data.hourly.precipitation[0], 
            windSpeed: data.hourly.windspeed_10m[0]
          };
        await docRef.set({
            time: new Date().toISOString(),
            weather: Wea,
            data: data
        });
        return [Wea, data];
    }
    var defaultWeather = {
        temperature: "",
        humidity: "",
        apparentTemperature: "", 
        precipitationProb: "", 
        precipitation: "", 
        windSpeed: ""
      }
    return  defaultWeather;

}


export async function fetchAir(city, latitude, longitude)
{
    const docRef = db.collection('airquality').doc(city);
    const doc = await docRef.get();

    if (doc.exists && doc.data()) {
        const data = doc.data();

        // Get the date when the articles were last updated.
        const lastUpdate = new Date(data.time);
        const now = new Date();

        // If the articles were updated within the last day...
        console.log("day is" + now.getTime());
        if (now.getTime() - lastUpdate.getTime() <= 24 * 60 * 60 * 1000) {
            // Return the articles directly from the database.
            // console.log(data.articles);
            console.log("fetched from firestore db for air")
            // return data.articles;
            return data.air;
        }
    }

    console.log("fetched air api");
    const response = await axios.get(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=` + latitude + `&longitude=` + longitude + `&hourly=pm10,pm2_5`
      );

      const data = response.data; 
      if (data.hourly !== undefined)  {
        var AirQ = {
          pm25: data.hourly.pm2_5[0],
          pm10:  data.hourly.pm10[0]
        };
        await docRef.set({
            time: new Date().toISOString(),
            air: AirQ
        });
        return AirQ;
      
    }
    var AirQ = {
        pm25: "",
        pm10:  ""
      };

    return AirQ;
    
    

}