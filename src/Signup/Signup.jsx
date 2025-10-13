// src/pages/Signup.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Handle input changes
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // ✅ Validation
  function validate(values) {
    const e = {};
    if (!values.name.trim()) e.name = "Name is required";
    if (!values.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Enter a valid email";
    if (!values.password) e.password = "Password is required";
    else if (values.password.length < 8) e.password = "Use at least 8 characters";
    if (values.confirm !== values.password) e.confirm = "Passwords do not match";
    return e;
  }

  // ✅ SIGNUP HANDLER
  const handleSignup = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate(form);
    setErrors(validationErrors);

    // ❌ If errors exist, don't continue
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitted(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = cred.user;

      // ✅ Create Firestore user profile
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: user.email,
        role: "user",
        createdAt: Date.now(),
      });

      await sendEmailVerification(user);

      setMessage("✅ Account created. Check your email to verify.");
      setSubmitted(false);
      navigate("/login");
    } catch (err) {
      setMessage(err.message);
      setSubmitted(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card fade-in-up">
        <header className="signup-header">
          <h1>Create your account</h1>
          <p>Fast — secure — easy. No credit card required.</p>
        </header>

        <form onSubmit={handleSignup} noValidate>
          <label className="input-group">
            <span>Full name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </label>

          <label className="input-group">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@email.com"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </label>

          <label className="input-group">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </label>

          <label className="input-group">
            <span>Confirm</span>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat password"
            />
            {errors.confirm && <p className="error-text">{errors.confirm}</p>}
          </label>

          <div className="border-fade-wrapper">
            <button type="submit" className="submit-btn" disabled={submitted}>
              {submitted ? "Creating…" : "Create account"}
            </button>
          </div>

          <p className="terms-text">
            By continuing you agree to our Terms and Privacy Policy.
          </p>

          <div className="login-link">
            <a href="/login">Already have an account? Log in</a>
          </div>
        </form>

        {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
