import React from 'react';
import logo from './logo.svg';
import './App.css';
import Input from './input.js';
import Navbar from './Navbar.js';
import Routes from './Router';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <br></br>
      <br></br>
      <Routes/>
      
    </div>
  );
}

export default App;
