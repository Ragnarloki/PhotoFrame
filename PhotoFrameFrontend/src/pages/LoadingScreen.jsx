import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json"; // Lottie file
import logo from "../assets/logo.png";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading...");

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Change loading text based on progress
  useEffect(() => {
    if (progress < 30) {
      setLoadingText("Getting things ready...");
    } else if (progress < 60) {
      setLoadingText("Almost done...");
    } else if (progress < 90) {
      setLoadingText("Final touches...");
    } else {
      setLoadingText("Ready to go!");
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      {/* Floating Glowing Orbs */}
      <motion.div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-lg"
            initial={{ opacity: 0, x: Math.random() * window.innerWidth, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: window.innerHeight,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      {/* Bouncing Logo */}
      <motion.div
        className="relative w-48 h-48 border-4 border-blue-500 rounded-full shadow-2xl bg-white flex items-center justify-center"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.img
          src={logo}
          alt="Photo Frame"
          className="w-24 h-24 object-cover rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1, 0.8], opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Lottie Animation Below Logo */}
      <div className="w-24 h-24 mt-6">
        <Lottie animationData={loadingAnimation} loop />
      </div>

      {/* Smooth Progress Bar */}
      <div className="w-64 h-2 bg-gray-800 rounded-full mt-6 overflow-hidden shadow-lg">
        <motion.div
          className="h-full bg-blue-500 rounded-full shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Loading Text with a Glowing Effect */}
      <motion.div
        className="mt-4 text-lg font-bold text-blue-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        {loadingText}
      </motion.div>

      {/* Welcome Message with a Subtle Glow */}
      <motion.div
        className="mt-2 text-sm text-gray-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
      >
        Welcome to Our Photo Frame Shop
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
