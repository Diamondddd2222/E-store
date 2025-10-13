import React, { useState } from "react";
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (Object.keys(newErrors).length === 0) {
      console.log("Password reset for:", email);
    }
    setErrors(newErrors);
  };

  return (
    <div className="forgot-password-container fade-in-up">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="border-fade-wrapper">
            <button className="submit-btn" type="submit">Reset Password</button>
          </div>
        </form>
        <div className="login-link" style={{ marginTop: "20px" }}>
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;