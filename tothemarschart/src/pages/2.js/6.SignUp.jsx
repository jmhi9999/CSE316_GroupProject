import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../1.styling/6.SignUp.css";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordCheck: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    if (formData.password !== formData.passwordCheck) {
      alert("Passwords do not match. Please check your password.");
    } else {
        alert("Passwords match!")
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

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