import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';
// import SplashCursor from './SplashCursor';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSplashEnabled, setIsSplashEnabled] = useState(true); // New state to control SplashCursor
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'password' || name === 'confirmPassword') {
      if (
        name === 'password' &&
        formData.confirmPassword !== '' &&
        value !== formData.confirmPassword
      ) {
        setPasswordMatchError('Passwords do not match');
      } else if (
        name === 'confirmPassword' &&
        formData.password !== '' &&
        formData.password !== value
      ) {
        setPasswordMatchError('Passwords do not match');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const disableSplash = () => {
    setIsSplashEnabled(false); // Disable splash cursor
  };

  const enableSplash = () => {
    setIsSplashEnabled(true); // Re-enable splash cursor
  };

  return (
    <div
      className="login-container"
      // onMouseEnter={enableSplash} // Re-enable splash when hovering outside input fields
    >
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onFocus={disableSplash} // Disable splash when focusing on input fields
            onBlur={enableSplash} // Re-enable splash when focus is lost
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={disableSplash}
            onBlur={enableSplash}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={disableSplash}
            onBlur={enableSplash}
            placeholder="Create a password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={disableSplash}
            onBlur={enableSplash}
            placeholder="Confirm your password"
            required
          />
          {passwordMatchError && (
            <div className="error-message" style={{ color: 'red', fontSize: '0.85rem' }}>
              {passwordMatchError}
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>

      <div className="checkbox-container">
        <input type="checkbox" id="terms" required />
        <label htmlFor="terms">
          I agree to the <span onClick={togglePopup} style={{ color: 'orange', cursor: 'pointer' }}>Privacy Policy</span>
        </label>
      </div>

      {isPopupVisible && (
        <div className="overlay">
          <div className="popup">
            <h3>Privacy Policy</h3>
            <p>Property of Adeen Ilyas, Abdul Hanan and Talha Asghar.</p>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}

      <div className="auth-links">
        Already have an account? <Link to="/login">Log in</Link>
      </div>

      {/* {isSplashEnabled && <SplashCursor />} Render SplashCursor conditionally */}
    </div>
  );
};

export default SignUp;

