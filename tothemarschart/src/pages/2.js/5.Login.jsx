import React, { useState } from "react";
import "../1.styling/5.Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {};

  const handleSignUp = () => {
    navigate("/signup")
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          className="login-text-image"
          src="resources/5.Login/Log in.png"
          alt="Log in"
        />
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" id="Login-sign-in">
              <img src="resources/5.Login/Sign in.png" alt="Sign In" />
            </button>
            <button type="button" id="Login-sign-up" onClick={handleSignUp}>
              <img
                src="resources/5.Login/click here to sign up.png"
                alt="Sign Up"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;