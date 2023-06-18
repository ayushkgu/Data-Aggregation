// import { initializeApp } from "firebase/app";
// import { getDoc, getFirestore } from "firebase/firestore";
import * as firebaseALL from "firebase/firestore";
// compat packages are API compatible with namespaced code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import axios from "axios";
import newsAPIKey from './newsAPIKey';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
import firebaseConfig from "./firebaseConfig";
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const db = firebaseALL.getFirestore(app);

const db = firebase.firestore();


async function printQuery()
{
    // const query  = await firebaseALL.getDocs(firebaseALL.collection(db, '/weather'));

    
    // query.forEach((doc) => {
    //     console.log(`${doc.id} => ${doc.data()["time"]}`);
    //   });

    const query = await db.collection('weather').get();
    query.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()["time"]}`);
      });
    console.log('change to something');
    // query.docs[0].
    const response = await axios.get(`https://newsapi.org/v2/everything?q=technology&from=2023-06-12&to=2023-06-12&sortBy=popularity&apiKey=${newsAPIKey}`);

    
}

async function getArticles() {
    const docRef = db.collection('news-articles').doc('tech');
    const doc = await docRef.get();
    // var data;
    // If the document exists...
    if (doc.exists && doc.data()) {
        const data = doc.data();
        if (data) {
        // Get the date when the articles were last updated.
        const lastUpdate = new Date(data.time);
        const now = new Date();

        // If the articles were updated within the last day...
        console.log("day is" + now.getTime());
        if (now.getTime() - lastUpdate.getTime() <= 24 * 60 * 60 * 1000) {
            // Return the articles directly from the database.
            // console.log(data.articles);
            console.log("fetched from firestore db")
            return data.articles;
        }
    }
    }

    // Otherwise, fetch the articles from the API.
    console.log("fetched from NEWS API");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month: any = currentDate.getMonth() + 1; // getMonth() is zero-indexed, so we add one
    let day: any = currentDate.getDate();
    
    // padStart will add a 0 to the beginning of the string if month or day is less than 10
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');
    
    const dateString = `${year}-${month}-${day-1}`;
        // const response = await axios.get(`https://newsapi.org/v2/everything?q=technology&from=2023-06-15&to=2023-06-15&sortBy=popularity&apiKey=${newsAPIKey}`);


    console.log("date string is  " + dateString);
    const response = await axios.get(`https://newsapi.org/v2/everything?q=technology&from=${dateString}&to=${dateString}&sortBy=popularity&apiKey=${newsAPIKey}`);
    console.log("this is JSON OF RESPONSE: " + JSON.stringify(response));
    const articles = response.data.articles.slice(0, 12);

    // Update the document with the new articles and the current time.
    await docRef.set({
        time: new Date().toISOString(),
        articles: articles
    });

    // Return the fetched articles.
    console.log(articles);
    return articles;
}



export {printQuery, getArticles}