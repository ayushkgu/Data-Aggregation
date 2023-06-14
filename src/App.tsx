import './App.css';
import './components/Dashboard.tsx'
import './components/Tech.tsx'
import Dashboard from './components/Dashboard';
import Tech from './components/Tech';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, {useState, useEffect, useRef} from 'react';

function App() {
  return (
    <div className="App">
    <Router>
      <Navbar />
      <Routes> 
        <Route path="/" element={<Navigate to="/components/Dashboard"/>} />
        <Route path="/components/Dashboard" element={<Dashboard />}></Route>
        <Route path="/components/Tech" element={<Tech />}></Route>
      </Routes>
    </Router> 
    </div>
  );
}

export default App;
