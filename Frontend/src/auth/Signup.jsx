import React, { useState, useEffect} from "react";
import { signup } from "../utils/api";
import { useNavigate } from "react-router-dom"; // ← import
import "./auth.css";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate(); // ← initialize
  const [form, setForm] = useState({ name: "", email: "", password: "" });

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
    const res = await signup(form);
    if (res.success && res.token) {
      localStorage.setItem("token", res.token);
      // alert("Signup successful!");
      toast.success("Signup successful!");
      navigate("/"); 
    } else toast.error(res.error || "Signup failed");
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
