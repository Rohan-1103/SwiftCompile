import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Rocket } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-nav bg-white/30 dark:bg-vision-dark/50 shadow-md m-4 rounded-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-7xl font-extrabold text-vision-primary flex items-center">
          <Rocket size={48} className="mr-2" /> SwiftCompile
        </Link>

        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-semibold text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors" style={{marginRight: '20px'}}>
            Home
          </Link>
          <Link to="/about" className="text-xl font-semibold text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors" style={{marginRight: '20px'}}>
            About
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-xl font-semibold text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors" style={{marginRight: '20px'}}>
                Sign In
              </Link>
              <Link to="/register" className="px-6 py-3 rounded-md bg-vision-primary text-white hover:bg-vision-secondary transition-colors font-bold" style={{marginRight: '20px'}}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-xl font-semibold text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors" style={{marginRight: '20px'}}>
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-bold" style={{marginRight: '20px'}}
              >
                Logout
              </button>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-vision-text-light dark:text-vision-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-vision-primary focus:ring-offset-2"
          >
            {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;