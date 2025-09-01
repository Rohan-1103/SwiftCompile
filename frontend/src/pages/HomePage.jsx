import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Zap, Layers, GitBranch } from 'lucide-react';

// HOMEPAGE COMPONENT
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-vision-light dark:bg-vision-dark text-vision-text-light dark:text-vision-text-dark p-8">
      {/* HERO SECTION */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-vision-primary mb-4 leading-tight">
          SwiftCompile: Your Cloud-Native IDE
        </h1>
        <p className="text-xl text-vision-text-light dark:text-vision-text-dark mb-8 max-w-2xl mx-auto">
          Develop, compile, and deploy your code seamlessly in the cloud. 
          Experience a powerful and flexible development environment right in your browser.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-vision-primary text-white rounded-lg shadow-lg hover:bg-vision-secondary transition-colors text-lg font-semibold"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border border-vision-primary text-vision-primary rounded-lg shadow-lg hover:bg-vision-primary hover:text-white transition-colors text-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full max-w-5xl mb-12">
        <h2 className="text-4xl font-bold text-center text-vision-primary mb-10">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FEATURE CARD 1 */}
          <div className="bg-white dark:bg-vision-card-dark p-6 rounded-lg shadow-md text-center">
            <Code size={48} className="mx-auto text-vision-secondary mb-4" />
            <h3 className="text-2xl font-semibold text-vision-primary mb-2">Cloud-Powered IDE</h3>
            <p className="text-vision-text-light dark:text-vision-text-dark">
              Write and compile code directly in your browser, no setup required.
            </p>
          </div>
          {/* FEATURE CARD 2 */}
          <div className="bg-white dark:bg-vision-card-dark p-6 rounded-lg shadow-md text-center">
            <Zap size={48} className="mx-auto text-vision-secondary mb-4" />
            <h3 className="text-2xl font-semibold text-vision-primary mb-2">Instant Deployment</h3>
            <p className="text-vision-text-light dark:text-vision-text-dark">
              Deploy your projects with a single click, directly from your IDE.
            </p>
          </div>
          {/* FEATURE CARD 3 */}
          <div className="bg-white dark:bg-vision-card-dark p-6 rounded-lg shadow-md text-center">
            <Layers size={48} className="mx-auto text-vision-secondary mb-4" />
            <h3 className="text-2xl font-semibold text-vision-primary mb-2">Version Control</h3>
            <p className="text-vision-text-light dark:text-vision-text-dark">
              Integrated Git for seamless version control and collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="text-center bg-vision-primary text-white p-10 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Coding?</h2>
        <p className="text-xl mb-8">
          Join SwiftCompile today and bring your ideas to life faster than ever before.
        </p>
        <Link
          to="/register"
          className="px-8 py-3 bg-white text-vision-primary rounded-lg shadow-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
