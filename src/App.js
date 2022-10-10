import React from "react";
import "./App.css";
import { Camera } from "./components/Camera";
import Header from "./components/Header";
import "./index.scss";

function App() {
  return (
    <div className="container">
      <Header />
        <Camera />
    </div>
  );
}

export default App;
