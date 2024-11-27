import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./1.Main";
import Trending from "./2.Trending";
import MyFavorite from "./3.MyFavorite";
import Search from "./4.Search";
import Login from "./5.Login.jsx";
import SignUp from "./6.SignUp.jsx"
import "../1.styling/0.Navbar.css";

const Navbar = () => {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul className="navbar-item" id="home-icon">
            <Link to="/"><img src="/resources/0.Navbar/Home.png" alt="Home" style={{display: "flex", width:'200px', margin:'auto', padding:'auto'}}/></Link>
          </ul>
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/trending">Trending</Link>
            </li>
            <li className="navbar-item">
              <Link to="/myfavorite">My Favorite</Link>
            </li>
            <li className="navbar-item search-bar">
              <input type="text" placeholder="Search" className="search-field" style={{display: "flex", width:'250px'}}/>
              <Link to="/search" className="search-icon"><img src="/resources/0.Navbar/Vector.png" alt="Home" style={{display: "flex", width:"15px"}}/></Link>
            </li>
            <li className="navbar-item" >
              <Link to="/login" id="login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/myfavorite" element={<MyFavorite />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navbar;
