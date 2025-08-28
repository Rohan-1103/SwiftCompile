import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X, UserCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Dummy auth state for now
  const isAuthenticated = false; // MANUAL_CHANGE_REQUIRED: Replace with actual authentication state
  const userEmail = "user@example.com"; // MANUAL_CHANGE_REQUIRED: Replace with actual user email

  const handleLogout = () => {
    // MANUAL_CHANGE_REQUIRED: Implement actual logout logic
    console.log("Logging out...");
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-nav bg-white/30 dark:bg-vision-dark/50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-vision-primary flex items-center">
          <span className="mr-2">🚀</span> SwiftCompile
        </Link>

        {/* Desktop Navigation */}
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
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-vision-primary text-white font-bold focus:outline-none focus:ring-2 focus:ring-vision-primary focus:ring-offset-2"
              >
                {userEmail.charAt(0).toUpperCase()}
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-vision-dark rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/dashboard" // MANUAL_CHANGE_REQUIRED: Create Dashboard page
                    className="block px-4 py-2 text-sm text-vision-text-light dark:text-vision-text-dark hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-vision-text-light dark:text-vision-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-vision-primary focus:ring-offset-2"
          >
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
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
                  to="/dashboard" // MANUAL_CHANGE_REQUIRED: Create Dashboard page
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