import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async ({ email, password }) => {
    setIsLoading(true);
    try {
      // MANUAL_CHANGE_REQUIRED: Replace with your actual backend login endpoint
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      toast.success(response.data.message || 'Login successful!');
      // MANUAL_CHANGE_REQUIRED: Handle successful login (e.g., store token, redirect)
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row bg-vision-light dark:bg-vision-dark">
      {/* Left Panel - Graphic/Testimonial */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden md:flex md:w-1/2 items-center justify-center p-8 bg-vision-primary text-white"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Unlock Your Coding Potential</h2>
          <p className="text-lg">Join a community of developers and bring your ideas to life.</p>
          {/* Replaced image with a dynamic, abstract background using CSS gradients */}
          <div className="w-64 h-64 bg-gradient-to-br from-vision-accent to-vision-secondary rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-lg">
            🚀
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-1 items-center justify-center p-4 md:p-8"
      >
        <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};

export default LoginPage;