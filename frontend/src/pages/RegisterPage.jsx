import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async ({ email, password }) => {
    setIsLoading(true);
    try {
      // MANUAL_CHANGE_REQUIRED: Replace with your actual backend register endpoint
      const response = await axios.post('http://localhost:3000/api/auth/register', { email, password });
      toast.success(response.data.message || 'Registration successful!');
      // MANUAL_CHANGE_REQUIRED: Handle successful registration (e.g., redirect to login)
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
        className="hidden md:flex md:w-1/2 items-center justify-center p-8 bg-vision-secondary text-white"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="text-lg">Create an account and unleash your coding creativity.</p>
          {/* MANUAL_CHANGE_REQUIRED: Add a sleek, abstract graphic or rotating testimonial here */}
          <img src="https://via.placeholder.com/400x300?text=Abstract+Graphic+2" alt="Abstract Graphic" className="mt-8 mx-auto rounded-lg shadow-lg" />
        </div>
      </motion.div>

      {/* Right Panel - Register Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-1 items-center justify-center p-4 md:p-8"
      >
        <AuthForm type="register" onSubmit={handleRegister} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};

export default RegisterPage;