import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, Rocket } from 'lucide-react';
import { useTheme } from '../hooks/useTheme'; // UPDATED IMPORT PATH
import { toast } from 'react-hot-toast';

// NAVBAR COMPONENT
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // BASIC AUTHENTICATION STATE MANAGEMENT USING LOCALSTORAGE
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // EFFECT TO UPDATE ISAUTHENTICATED WHEN LOCALSTORAGE CHANGES (E.G., AFTER LOGIN/LOGOUT)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // HANDLES USER LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token'); // REMOVE TOKEN INSTEAD OF ISLOGGEDIN
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    toast.success("Logged out successfully!");
    navigate('/login'); // REDIRECT TO LOGIN PAGE AFTER LOGOUT
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-nav bg-white/30 dark:bg-vision-dark/50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-6xl font-bold font-cursive text-vision-primary flex items-center">
          <Rocket size={40} className="mr-2" /> SwiftCompile
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors">
            Home
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-md bg-vision-primary text-white hover:bg-vision-secondary transition-colors">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          )}
          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-vision-text-light dark:text-vision-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-vision-primary focus:ring-offset-2"
          >
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-vision-text-light dark:text-vision-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-vision-primary focus:ring-offset-2"
          >
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-vision-text-light dark:text-vision-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-vision-primary focus:ring-offset-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-vision-dark/90 py-4 shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <Link to="/" className="text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-md bg-vision-primary text-white hover:bg-vision-secondary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-vision-text-light dark:text-vision-text-dark hover:text-vision-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;