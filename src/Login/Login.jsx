import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import "./Login.css";

// ✅ ADD THESE:
import { useDispatch } from "react-redux";
import { setUser } from "../Store/UserSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [unverifiedUser, setUnverifiedUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ FIXED

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // ✅ DISPATCH FIXED
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
        })
      );

      console.log("✅ User stored in Redux");

      if (!user.emailVerified) {
        await signOut(auth);
        setUnverifiedUser(user);
        setMessage("Your email is not verified. Please verify or resend email.");
        return;
      }

      setMessage("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.message);
    }
  };

  const resendVerification = async () => {
    if (!unverifiedUser) return;
    try {
      await sendEmailVerification(unverifiedUser);
      setMessage("Verification email resent. Check your inbox/spam folder!");
    } catch (err) {
      console.error("Resend error:", err);
      setMessage("Couldn't resend email. Try again later.");
    }
  };

  return (
    <div className="signup-container fade-in-up">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Welcome Back</h1>
          <p>Login to your account</p>
          {message && <p className="message-text">{message}</p>}
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <span>Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="border-fade-wrapper">
            <button className="submit-btn" type="submit">
              Login
            </button>
          </div>
        </form>

        {unverifiedUser && (
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <button className="submit-btn" onClick={resendVerification}>
              Resend Verification Email
            </button>
          </div>
        )}

        <div className="login-link" style={{ marginTop: "20px" }}>
          <Link to="/signup">Don't have an account? Sign up</Link>
          <div style={{ marginTop: "10px" }}>
            <Link to="/ForgetPassword">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
