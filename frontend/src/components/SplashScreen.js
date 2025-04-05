import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./SplashScreen.css";

const VideoSplashScreen = ({ videoSrc, onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);
  const text = "Student Notes";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      onComplete();
    }, 4000); // Increased duration for better effect

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="video-container">
      {showSplash ? (
        <div className="splash-container">
          <motion.div className="splash-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                className="splash-char"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.3, rotate: Math.random() * 10 - 5 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
          <motion.div
            className="glitch-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
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
