import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AuthForm from '../components/AuthForm';

// LOGIN PAGE COMPONENT
const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // HANDLES USER LOGIN
  const handleLogin = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isLoggedIn', 'true'); // SET LOGIN STATUS
      localStorage.setItem('userEmail', email); // STORE USER EMAIL
      toast.success("Logged in successfully!");
      navigate('/dashboard'); // REDIRECT TO DASHBOARD AFTER SUCCESSFUL LOGIN
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-vision-light dark:bg-vision-dark p-8">
      <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  );
};

export default LoginPage;
