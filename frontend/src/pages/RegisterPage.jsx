import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AuthForm from '../components/AuthForm';

// REGISTER PAGE COMPONENT
const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // HANDLES USER REGISTRATION
  const handleRegister = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', { email, password });
      toast.success(res.data.message || 'Registration successful!');
      navigate('/login'); // REDIRECT TO LOGIN PAGE AFTER SUCCESSFUL REGISTRATION
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-vision-light dark:bg-vision-dark p-8">
      <AuthForm type="register" onSubmit={handleRegister} isLoading={isLoading} />
    </div>
  );
};

export default RegisterPage;
