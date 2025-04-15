import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { BookOpen, Share2, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-container">\
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Student Notes</h1>
          <p className="hero-subtitle">
            Share your knowledge and excel in your studies with our collaborative learning platform.
          </p>
          <div className="cta-buttons">
            <Link to="/notes" className="cta-button primary-button">
              Read Notes
            </Link>
            <Link to="/post-notes" className="cta-button secondary-button">
              Post Notes
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <BookOpen className="feature-icon" />
            <h3 className="feature-title">Quality Notes</h3>
            <p>Access comprehensive study materials from top students across various subjects.</p>
          </div>

          <div className="feature-card">
            <Share2 className="feature-icon" />
            <h3 className="feature-title">Easy Sharing</h3>
            <p>Share your knowledge effortlessly and help others while earning recognition.</p>
          </div>

          <div className="feature-card">
            <Users className="feature-icon" />
            <h3 className="feature-title">Strong Community</h3>
            <p>Join a supportive community of students helping each other succeed.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 Student Notes. All Rights Reserved.</p>
        <p>Developed by Krish Modi</p>
      </footer>
    </div>
  );
};

export default LandingPage;
