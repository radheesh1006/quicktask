import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const url = isLogin
      ? `${API_BASE_URL}/api/auth/login`
      : `${API_BASE_URL}/api/auth/register`;

    console.log('🔁 API_BASE_URL →', API_BASE_URL); // ✅ confirm it's correct in browser console

    try {
      const res = await axios.post(url, form);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        alert('Login successful');
        window.location.href = '/dashboard';
      } else {
        alert('Registration successful. You can now log in.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error('❌ Auth failed:', err);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="main-title">🚀 QuickTask</h1>
        <h2>{isLogin ? 'Login to Your Dashboard' : 'Register a New Account'}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

