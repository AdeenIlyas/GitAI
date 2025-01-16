import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import './Login.css';
import googleLogo from './assets/google-logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [showSplash, setShowSplash] = useState(true); // State to toggle splash cursor
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const fullMessage = 'Welcome Back';

  // Typing effect for "Welcome Back"
  // useEffect(() => {
  //   let index = 0;
  //   setTypedMessage('W');
  //   const typingInterval = setInterval(() => {
  //     if (index < fullMessage.length) {
  //       setTypedMessage((prev) => prev + fullMessage.charAt(index));
  //       index++;
  //     } else {
  //       clearInterval(typingInterval);
  //     }
  //   }, 35);

  //   return () => clearInterval(typingInterval);
  // }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      fetch('http://localhost:5000/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            login({ ...data.user, token });
            navigate('/gitrepo');
          }
        })
        .catch(() => {
          setError('Failed to verify authentication');
        });
    } else if (error) {
      setError('Authentication failed. Please try again.');
    }
  }, [location, login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        navigate('/gitrepo');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Failed to connect to server');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleFocus = () => {
    setShowSplash(false); // Disable splash cursor on input focus
  };

  const handleBlur = () => {
    setShowSplash(true); // Enable splash cursor when input loses focus
  };

  return (
    <>
      <div className="login-container">
        <h2>Welcome Back{typedMessage}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Log In</button>
        </form>

        <div className="auth-links">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>

        <div className="social-login">
          <p>Or continue with</p>
          <button className="social-btn" onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google" />
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;

