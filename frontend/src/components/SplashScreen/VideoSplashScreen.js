import React, { useState, useEffect, useRef } from "react";
import "./SplashScreen.css";

const VideoSplashScreen = ({ videoSrc, onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const circuitContainer = useRef(null);
  const splashTitle = "Student Notes";
  
  // Create and animate circuit elements
  useEffect(() => {
    if (!showSplash || !circuitContainer.current) return;
    
    // Create circuit lines and nodes
    const createCircuitElements = () => {
      const container = circuitContainer.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      
      // Clear existing elements
      container.innerHTML = '';
      
      // Create horizontal lines
      for (let i = 0; i < 8; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        line.style.top = `${Math.random() * 100}%`;
        line.style.left = '0';
        line.style.width = `${30 + Math.random() * 70}%`;
        line.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(line);
        
        // Animate the line
        setTimeout(() => {
          line.style.opacity = '0.7';
        }, Math.random() * 1000);
        
        setTimeout(() => {
          line.style.opacity = '0';
        }, 2000 + Math.random() * 1000);
      }
      
      // Create vertical lines
      for (let i = 0; i < 8; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line vertical';
        line.style.left = `${Math.random() * 100}%`;
        line.style.top = '0';
        line.style.height = `${30 + Math.random() * 70}%`;
        line.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(line);
        
        // Animate the line
        setTimeout(() => {
          line.style.opacity = '0.7';
        }, Math.random() * 1000);
        
        setTimeout(() => {
          line.style.opacity = '0';
        }, 2000 + Math.random() * 1000);
      }
      
      // Create nodes at intersections
      for (let i = 0; i < 20; i++) {
        const node = document.createElement('div');
        node.className = 'circuit-node';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        container.appendChild(node);
        
        // Animate the node
        setTimeout(() => {
          node.style.opacity = '1';
        }, Math.random() * 1500);
        
        setTimeout(() => {
          node.style.opacity = '0';
        }, 1500 + Math.random() * 1500);
      }
    };
    
    // Initial creation
    createCircuitElements();
    
    // Recreate elements periodically
    const interval = setInterval(createCircuitElements, 3000);
    
    return () => clearInterval(interval);
  }, [showSplash]);
  
  // Handle progress and transition
  useEffect(() => {
    if (!showSplash) return;
    
    let startTime = null;
    const duration = 3000; // 3 seconds
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressValue = Math.min(Math.floor((elapsed / duration) * 100), 100);
      
      setProgress(progressValue);
      
      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        // Transition to video when complete
        setTimeout(() => {
          setShowSplash(false);
          if (onComplete) onComplete();
        }, 300);
      }
    };
    
    requestAnimationFrame(animate);
  }, [showSplash, onComplete]);
  
  return (
    <div className="video-container">
      {showSplash ? (
        <div className="splash-container">
          <div className="circuit-container" ref={circuitContainer}></div>
          
          <h1 className="splash-text" data-text={splashTitle}>
            {splashTitle}
          </h1>
          
          <div className="loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-progress">{progress}%</div>
          </div>
        </div>
      ) : (
        <video className="video-player" controls autoPlay>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoSplashScreen;