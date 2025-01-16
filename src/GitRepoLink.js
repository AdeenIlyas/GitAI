import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import logoLight from './assets/logo-light.png';
import logoDark from './assets/logo-dark.png';
import videoBackground from './assets/vid.mp4';
import './GitRepo.css';

const GitRepoLink = () => {
  const [repoLink, setRepoLink] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isSplashActive, setIsSplashActive] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Video import path:', videoBackground);
    if (!videoBackground) {
      console.error('Video import failed');
    }
  }, []);

  useEffect(() => {
    const video = document.querySelector('.background-video');
    if (video) {
      video.addEventListener('play', () => {
        console.log('Video started playing');
      });
      video.addEventListener('error', (e) => {
        console.error('Video error:', e);
      });
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded');
      });
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  const isValidGitHubRepo = (url) => {
    // Regex to validate a GitHub repository URL
    const regex = /^(https:\/\/github\.com\/[\w-]+\/[\w-]+)$/;
    return regex.test(url);
  };

  const handleAskGitAI = async () => {
    if (!repoLink || !isValidGitHubRepo(repoLink)) {
      alert("Please enter a valid GitHub repository link.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/chatbot", { state: { repoLink } });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = () => {
    setIsSplashActive(false);
  };

  const handleInputBlur = () => {
    setIsSplashActive(true);
  };

  return (
    <>
      <div className="video-background">
        <video
          autoPlay
          loop
          muted
          className="background-video"
          playsInline
          onError={(e) => {
            console.error("Video loading error:", e);
            setVideoError(true);
          }}
        >
          <source src={videoBackground} type="video/mp4" />
          {videoError ? (
            <div className="video-error">Video failed to load</div>
          ) : (
            "Your browser does not support the video tag."
          )}
        </video>
      </div>

      <div className="top-buttons">
        <button
          type="button"
          id="theme-toggle"
          onClick={toggleTheme}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
            border: "none",
            padding: "10px 20px",
            borderRadius: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className={`container ${isDarkMode ? "dark-mode" : ""}`}>
        <img
          src={logoDark}
          alt="GitAI Logo"
          className="logo"
        />

        <p
          style={{
            fontFamily: "monospace",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Enter the link to your GitHub repository below:
        </p>

        <input
          type="text"
          placeholder="https://github.com/example/repo"
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={loading}
          style={{
            color: isDarkMode ? "#fff" : "#000",
            backgroundColor: isDarkMode ? "#000" : "#fff",
          }}
        />

        <button
          id="ask-gitai"
          onClick={handleAskGitAI}
          disabled={loading}
          style={{ position: "relative" }}
        >
          {!loading ? (
            <>
              <FontAwesomeIcon icon={faRobot} /> Ask GitAI
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="spinner"></div>
              Processing...
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default GitRepoLink;
