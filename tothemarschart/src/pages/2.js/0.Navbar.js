import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./1.Main";
import Trending from "./2.Trending";
import MyFavorite from "./3.MyFavorite";
import Search from "./4.Search";
import Login from "./5.Login";
import "../1.styling/0.Navbar.css"; 

const Navbar = () => {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/">Home</Link>
            </li>
            <li className="navbar-item">
              <Link to="/trending">Trending</Link>
            </li>
            <li className="navbar-item">
              <Link to="/myfavorite">My Favorite</Link>
            </li>
            <li className="navbar-item">
              <Link to="/search">Search</Link>
            </li>
            <li className="navbar-item">
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/myfavorite" element={<MyFavorite />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navbar;
