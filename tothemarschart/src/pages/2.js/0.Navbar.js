import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "../../session/AuthContext";
import { useSelector } from "react-redux";
import Home from "./1.Main";
import Trending from "./2.Trending";
import MyFavorite from "./3.MyFavorite";
import Search from "./4.Search";
import Login from "./5.Login.jsx";
import SignUp from "./6.SignUp.jsx";
import MyPage from "./7.MyPage.jsx";
import "../1.styling/0.Navbar.css";

const Navbar = () => {
  const { user: authUser } = useAuth();
  const reduxUsername = useSelector((state) => state.user.username);
  const username = authUser?.username || reduxUsername;

  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul className="navbar-item" id="home-icon">
            <Link to="/">
              <img 
                src="/resources/0.Navbar/Home.png" 
                alt="Home" 
                style={{display: "flex", width:'200px', margin:'auto', padding:'auto'}}
              />
            </Link>
          </ul>
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/trending">Trending</Link>
            </li>
            <li className="navbar-item">
              <Link to="/myfavorite">My Favorite</Link>
            </li>
            <li className="navbar-item search-bar">
              <input 
                type="text" 
                placeholder="Search" 
                className="search-field" 
                style={{display: "flex", width:'250px'}}
              />
              <Link to="/search" className="search-icon">
                <img 
                  src="/resources/0.Navbar/Vector.png" 
                  alt="Home" 
                  style={{display: "flex", width:"15px"}}
                />
              </Link>
            </li>
            {!username ? (
              <li className="navbar-item">
                <Link to="/login" id="login">Login</Link>
              </li>
            ) : (
              <>
                <li className="navbar-item">
                  <Link to="/mypage" id="mypage">My Page</Link>
                </li>
                <li className="navbar-item">
                  <span style={{color: '#333'}}>Hi, {username}</span>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/myfavorite" element={<MyFavorite />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navbar;