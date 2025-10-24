import React, { useState, useEffect } from "react";
import { login } from "../utils/api";
import { useNavigate } from "react-router-dom"; // ← import
import "./auth.css";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate(); // ← initialize
  const [form, setForm] = useState({ email: "", password: "" });
  
  // Add body class when component mounts, remove when unmounts
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.success && res.token) {
      localStorage.setItem("token", res.token);
      // alert("Login successful!");
      toast.success("Login successful!");
      navigate("/"); 
    } else toast.error(res.error || "Login failed");
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account?{" "}
        <span style={{color: "blue", cursor: "pointer"}} onClick={() => navigate("/signup")}>
          Sign up
        </span>
      </p>

    </div>
  );
}
