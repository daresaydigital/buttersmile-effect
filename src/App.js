import './App.css';
import React from 'react'
import Header from './components/Header'
import Camera from "./components/Camera";

function App() {

  return (
    <div className="container">
        <Header/>
        <Camera/>
    </div>
  );
}

export default App;
