import React from "react";
import "./App.css";
import { Example } from "./components/Example";
import Header from "./components/Header";
import "./index.scss";

function App() {
  return (
    <div className="container">
      <Header />
        <Example />
    </div>
  );
}

export default App;
