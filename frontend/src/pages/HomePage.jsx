import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Cloud, Rocket, Shield } from 'lucide-react';
import TypingEffect from '../components/TypingEffect';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white dark:bg-vision-dark-light p-6 rounded-lg shadow-lg flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
    >
      <Icon size={48} className="text-vision-primary mb-4" />
      <h3 className="text-xl font-semibold text-vision-text-light dark:text-vision-text-dark mb-2">{title}</h3>
      <p className="text-vision-text-light dark:text-vision-text-dark text-sm">{description}</p>
    </motion.div>
  );
};

const HomePage = () => {
  const codeSnippet = `def hello_world():
    print("Hello, World!")

hello_world()`;

  return (
    <div className="flex flex-col min-h-screen bg-vision-light dark:bg-vision-dark text-vision-text-light dark:text-vision-text-dark">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen text-white animated-gradient p-4 text-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Code, Compile, Conquer. Instantly.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-black bg-opacity-70 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-auto"
        >
          <pre className="text-left font-mono text-green-400 text-lg md:text-xl overflow-x-auto">
            <TypingEffect text={codeSnippet} speed={50} />
          </pre>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10"
        >
          <Link
            to="/register"
            className="px-8 py-4 rounded-full bg-vision-accent text-white text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out inline-block glowing-button"
          >
            Get Started for Free
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-vision-light dark:bg-vision-dark">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-vision-text-light dark:text-vision-text-dark">
            Powerful Features at Your Fingertips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Code}
              title="Multi-Language Compiler"
              description="Support for Python, JavaScript, C++, Java, and more. Compile and run your code directly in the browser."
            />
            <FeatureCard
              icon={Cloud}
              title="Cloud Project Storage"
              description="Save your projects securely in the cloud. Access them from anywhere, anytime."
            />
            <FeatureCard
              icon={Rocket}
              title="Blazing Fast Execution"
              description="Experience lightning-fast compilation and execution times for all your coding needs."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Reliable"
              description="Your code and data are safe with us. Built with enterprise-grade security measures."
            />
            <FeatureCard
              icon={Code}
              title="Real-time Collaboration"
              description="Work with your team in real-time on shared projects. See changes as they happen."
            />
            <FeatureCard
              icon={Cloud}
              title="Version Control Integration"
              description="Seamlessly integrate with Git and other version control systems for efficient development workflows."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-vision-dark text-vision-text-dark text-center text-sm">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} SwiftCompile. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;