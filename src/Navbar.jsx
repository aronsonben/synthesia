import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../public/DCWW_white.png';
import './Home.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="Navbar">
        <span onClick={() => navigate("/synthesia/")}>eject</span>
    </div>
  );
};

export default Navbar;
