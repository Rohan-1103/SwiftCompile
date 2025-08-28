import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const AuthForm = ({ type, onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === 'register' && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    await onSubmit({ email, password });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white dark:bg-vision-dark p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-3xl font-bold text-center text-vision-primary mb-6">
        {type === 'login' ? 'Welcome Back!' : 'Join SwiftCompile'}
      </h2>

      <div className="mb-4">
        <label htmlFor="email" className="block text-vision-text-light dark:text-vision-text-dark text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-vision-text-light dark:text-vision-text-dark leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-800 input-focus-highlight"
          placeholder="your@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-vision-text-light dark:text-vision-text-dark text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-vision-text-light dark:text-vision-text-dark leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-800 input-focus-highlight"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {type === 'register' && (
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-vision-text-light dark:text-vision-text-dark text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-vision-text-light dark:text-vision-text-dark leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-800 input-focus-highlight"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="w-full bg-vision-primary hover:bg-vision-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            <>{type === 'login' ? 'Sign In' : 'Register'}</>
          )}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-vision-text-light dark:text-vision-text-dark">Or {type === 'login' ? 'sign in' : 'register'} with:</p>
        <div className="flex justify-center space-x-4 mt-4">
          <button type="button" className="bg-gray-200 dark:bg-gray-700 text-vision-text-light dark:text-vision-text-dark p-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            {/* Google Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12.24 10.24v2.4h3.28c-.14 1.15-.78 2.12-1.82 2.78v2.04h2.62c1.53-1.41 2.42-3.48 2.42-5.94 0-.4-.04-.78-.1-1.15h-7.38z" fill="#4285F4"/>
              <path d="M12.24 17.68c-2.04 0-3.76-1.1-4.68-2.78l-2.78 2.04c1.2 2.36 3.6 3.92 6.46 3.92 3.7 0 6.8-2.5 7.92-5.94l-2.92-.02c-.6 1.7-2.2 2.9-5 2.9z" fill="#34A853"/>
              <path d="M5.56 12.24c0-1.15.3-2.24.82-3.18l-2.8-2.04c-.92 1.5-1.42 3.2-1.42 5.22 0 2.02.5 3.72 1.42 5.22l2.8-2.04c-.52-.94-.82-2.03-.82-3.18z" fill="#FBBC05"/>
              <path d="M12.24 4.32c1.7 0 3.2.6 4.4 1.7l2.3-2.3c-1.5-1.4-3.4-2.2-5.7-2.2-2.86 0-5.26 1.56-6.46 3.92l2.78 2.04c.92-1.68 2.64-2.78 4.68-2.78z" fill="#EA4335"/>
            </svg>
          </button>
          <button type="button" className="bg-gray-200 dark:bg-gray-700 text-vision-text-light dark:text-vision-text-dark p-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            {/* GitHub Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.089 2.91.832.092-.647.35-1.089.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.029-2.682-.103-.253-.446-1.272.098-2.65 0 0 .84-.268 2.75 1.025.798-.222 1.649-.333 2.498-.333.849 0 1.7.111 2.498.333 1.91-1.293 2.75-1.025 2.75-1.025.546 1.378.202 2.397.098 2.65.64.698 1.029 1.592 1.029 2.682 0 3.841-2.335 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.482C21.137 20.166 24 16.419 24 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default AuthForm;