import { useState } from 'react';
import logo from '../public/DCWW_white.png';
import './Home.css';
import Navbar from './Navbar';


const App = () => {

  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" href={`/synthesia`}>synthesia</a>
        <p style={{"font-size": "13px", "text-decoration": "underline"}}>start new synthesia set (coming soon)</p>
      </header>
    </div>
  );
};

export default App;
