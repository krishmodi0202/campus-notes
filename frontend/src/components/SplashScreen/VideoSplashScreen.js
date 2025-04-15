import React, { useState, useEffect, useRef } from "react";
import "./SplashScreen.css";

const VideoSplashScreen = ({ videoSrc, onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);
  const circuitContainer = useRef(null);
  const splashTitle = "Student Notes";
  
  // Create and animate circuit elements
  useEffect(() => {
    if (!showSplash || !circuitContainer.current) return;
    
    const createCircuitElements = () => {
      const container = circuitContainer.current;
      container.innerHTML = '';
      
      // Create horizontal lines
      for (let i = 0; i < 8; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        line.style.top = `${Math.random() * 100}%`;
        line.style.width = `${30 + Math.random() * 70}%`;
        line.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(line);
        
        setTimeout(() => {
          line.style.opacity = '0.7';
          setTimeout(() => { line.style.opacity = '0'; }, 2000 + Math.random() * 1000);
        }, Math.random() * 1000);
      }
      
      // Create vertical lines
      for (let i = 0; i < 8; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line vertical';
        line.style.left = `${Math.random() * 100}%`;
        line.style.height = `${30 + Math.random() * 70}%`;
        container.appendChild(line);
        
        setTimeout(() => {
          line.style.opacity = '0.7';
          setTimeout(() => { line.style.opacity = '0'; }, 2000 + Math.random() * 1000);
        }, Math.random() * 1000);
      }
      
      // Create nodes
      for (let i = 0; i < 20; i++) {
        const node = document.createElement('div');
        node.className = 'circuit-node';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        container.appendChild(node);
        
        setTimeout(() => {
          node.style.opacity = '1';
          setTimeout(() => { node.style.opacity = '0'; }, 1500 + Math.random() * 1500);
        }, Math.random() * 1500);
      }
    };
    
    createCircuitElements();
    const interval = setInterval(createCircuitElements, 3000);
    return () => clearInterval(interval);
  }, [showSplash]);
  
  // Handle transition after delay
  useEffect(() => {
    if (!showSplash) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (onComplete) onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showSplash, onComplete]);
  
  return (
    <div className="video-container">
      {showSplash ? (
        <div className="splash-container">
          <div className="circuit-container" ref={circuitContainer}></div>
          <div className="glitch-overlay"></div>
          
          <h1 className="splash-text">
            {splashTitle.split('').map((char, index) => (
              <span 
                key={index} 
                className="splash-char"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
      ) : (
        <video className="video-player" controls autoPlay muted>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoSplashScreen;