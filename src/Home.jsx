import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../public/DCWW_white.png';
import './Home.css';
import Navbar from './Navbar';


const App = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" href="" onClick={() => navigate('/synthesia')}>synthesia</a>
        <p style={{"fontSize": "13px", "textDecoration": "underline"}}>start new synthesia set (coming soon)</p>
      </header>
    </div>
  );
};

export default App;
