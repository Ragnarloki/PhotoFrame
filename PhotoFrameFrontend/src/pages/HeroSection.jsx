import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { FaArrowRight, FaHeart, FaStar, FaChevronDown } from 'react-icons/fa';
import image from '../assets/OIP.jpeg'; // Ensure the path is correct
import { Link } from 'react-router-dom';

const HeroSection = () => {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 1, duration: 0.5 } },
  };

  const scrollToNextSection = () => {
    document.getElementById('next-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/50"></div>

      {/* Content */}
      <div className="text-center z-10 px-4">
        {/* Typewriter Effect */}
        <h1 className="text-4xl md:text-6xl font-extrabold">
          <Typewriter
            words={["Welcome to Thittani's Photo Frames", "High-Quality Frames for Every Occasion"]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h1>

        {/* Animated Subtitle */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: 0.5 }}
          className="mt-4 text-lg md:text-xl"
        >
          High-quality custom photo frames, mirrors, and more.
        </motion.p>

        {/* Animated Button */}
        <Link to="/Dashboard">
        <motion.a
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
          className="mt-6 inline-flex items-center bg-indigo-500 px-6 py-3 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all"
        >
          
          Browse Products <FaArrowRight className="ml-2" />
        </motion.a>
        </Link>
        {/* Additional Features */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: 1.5 }}
          className="mt-8 flex justify-center space-x-6 flex-wrap"
        >
          <div className="flex items-center hover:scale-110 transition-transform m-2">
            <FaHeart className="text-red-500 mr-2" />
            <span>Handcrafted with Love</span>
          </div>
          <div className="flex items-center hover:scale-110 transition-transform m-2">
            <FaStar className="text-yellow-400 mr-2" />
            <span>5-Star Rated</span>
          </div>
        </motion.div>

     
      </div>
    </div>
  );
};

export default HeroSection;