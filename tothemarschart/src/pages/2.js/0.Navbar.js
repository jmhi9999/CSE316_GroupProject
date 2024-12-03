// Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../session/AuthContext.jsx";
import { useSelector } from "react-redux";
import "../1.styling/0.Navbar.css";
import axios from 'axios';

const SearchForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.elements.search.value.toUpperCase();
    if (searchValue) {
      navigate(`/search/KRW-${searchValue}`);
    }
  };

  return (
    <li className="navbar-item search-bar">
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        <input 
          name="search"
          type="text" 
          placeholder="Search" 
          className="search-field"
        />
        <button type="submit" className="search-icon">
          <img 
            src="/resources/0.Navbar/Vector.png" 
            alt="Search" 
            style={{width:"15px"}}
          />
        </button>
      </form>
    </li>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const reduxUsername = useSelector((state) => state.user.username);
  const username = authUser?.username || reduxUsername;

  const check = async() => {
    try {
      const authResponse = await axios.get("/check-auth");
      if (!authResponse.data.isAuthenticated) {
        alert("Please login to modify your favorites");
        navigate("/login");
        return;
      }
      navigate("/myfavorite");
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/login");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-item" id="home-icon">
          <Link to="/">
            <img 
              src="/resources/0.Navbar/Home.png" 
              alt="Home" 
              style={{display: "flex", width:'300px', margin:'auto', padding:'auto', marginBottom:'20px'}}
            />
          </Link>
        </ul>
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/trending">Trending</Link>
          </li>
          <li className="navbar-item">
            <Link to="/login" onClick={check}>My Favorite</Link>
          </li>
          <SearchForm />
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
    </div>
  );
};

export default Navbar;