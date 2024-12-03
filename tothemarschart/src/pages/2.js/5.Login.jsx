import React, { useState } from "react";
import "../1.styling/5.Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useAuth } from '../../session/AuthContext.jsx';
import { hashutil } from "./8.Hashutil";
import { setUser } from "../../redux/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

   // hash user password and request login to auth context
   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const hashedPassword = hashutil(formData.email, formData.password);
      
      const result = await login(formData.email, hashedPassword);
      
      if (result.success) {
        console.log("Login successful");
        dispatch(setUser(result.user));
        alert("Login Successful!");
        navigate('/');
      } else {
        console.log("Login failed:", result.message);
        setError(result.message);
        alert(result.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      alert("Login error occurred!");
    }
  };

  // navigate to signup page
  const handleSignUp = () => {
    navigate("/signup")
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          className="login-text-image"
          src="resources/5.Login/LogIn.png"
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
              <img src="resources/5.Login/SignIn.png" alt="Sign In" />
            </button>
            <button type="button" id="Login-sign-up" onClick={handleSignUp}>
              <img
                src="resources/5.Login/clickHereToSignUp.png"
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