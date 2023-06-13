import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './components/Dashboard.tsx'
import Dashboard from './components/Dashboard';
import News from './components/News'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isNewsVisible, setNewsVisible] = useState(false);

  const handleButtonClick = () => {
    setNewsVisible(!isNewsVisible);
  };

  return (
    <div className="App">
      <Dashboard/>
      
      <br />

      <button onClick={handleButtonClick}>
        {isNewsVisible ? 'Hide News' : 'Show News'}
      </button>
      {isNewsVisible && <News />}
    </div>
  );
}

export default App;
