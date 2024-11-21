import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../public/DCWW_white.png";
import "./Home.css";
import Navbar from "./Navbar";

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Synthesia</h1>
        <div className="colorPalette">
          <div className="colorBlock" style={{ backgroundColor: "#ef476f" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#ffd166" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#06d6a0" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#118ab2" }}></div>
          <div className="colorBlock" style={{ backgroundColor: "#073b4c" }}></div>
        </div>
        <p>crowdsourced color palettes for your music</p>
        <a className="App-link" href="" onClick={() => navigate("/synthesia")}>
          e n t e r - {">"}
        </a>
      </header>
    </div>
  );
};

export default App;
