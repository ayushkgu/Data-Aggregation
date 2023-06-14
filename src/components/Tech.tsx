import React, { Component } from 'react';
import {useState, useEffect} from 'react';
//import Navbar from './components/Navbar';
//import "./App.css";
import { useRef } from 'react';
//import Dashboard from './components/Dashboard';
import axios from 'axios';

//https://newsapi.org/
import newsAPIKey from '../newsAPIKey';

function Tech() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      axios.get('https://newsapi.org/v2/everything?q=apple&from=2023-06-12&to=2023-06-12&sortBy=popularity&apiKey=' + newsAPIKey)
        .then(response => {
          setPosts(response.data.articles);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);

return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default Tech;
