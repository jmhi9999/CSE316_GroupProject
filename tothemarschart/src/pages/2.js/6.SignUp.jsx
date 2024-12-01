import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hashutil } from './8.Hashutil';
import "../1.styling/6.SignUp.css";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    username: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordCheck) {
      alert("Passwords do not match");
      return;
    }

    try {
      const hashedPassword = hashutil(formData.email, formData.password);
      const response = await axios.post("/signUp", {
        email: formData.email,
        username: formData.username,
        password: hashedPassword
      });

      if (response.data.success) {
        alert("Sign Up successful!");
        navigate('/Login')
      } else {
        alert("Sign Up Failed! " + response.data.error);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign Up Failed! " + error.response?.data?.error || error.message);
    }
  };

  const handleSignIn = () => {
    navigate("/login")
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img
          className="signup-text-image"
          src="resources/6.SignUp/Register.png"
          alt="Sign Up"
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
              type="username"
              name="username"
              placeholder="Username"
              value={formData.usernamel}
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

          <div className="input-group">
            <input
              type="password"
              name="passwordCheck"
              placeholder="Confirm Password"
              value={formData.passwordCheck}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" id="SignUp-sign-up">
              <img src="resources/6.SignUp/SignUp.png" alt="Sign Up" />
            </button>
            <button type="button" id="SignUp-sign-in" onClick={handleSignIn}>
              <img
                src="resources/6.SignUp/clickHereToSignIn.png"
                alt="Sign In"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;