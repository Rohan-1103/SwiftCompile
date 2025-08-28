import React from 'react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 items-center justify-center bg-vision-light dark:bg-vision-dark text-vision-text-light dark:text-vision-text-dark p-8"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-vision-primary mb-4">Welcome to Your Dashboard!</h1>
        <p className="text-lg">This is a protected route. More features coming soon.</p>
        {/* MANUAL_CHANGE_REQUIRED: Add actual dashboard content here */}
      </div>
    </motion.div>
  );
};

export default DashboardPage;