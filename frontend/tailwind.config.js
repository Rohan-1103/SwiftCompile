/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vision-primary': '#6366F1', // A vibrant purple/blue
        'vision-secondary': '#8B5CF6', // A slightly lighter purple
        'vision-accent': '#EC4899', // A bright pink for call to actions
        'vision-dark': '#1F2937', // Dark gray for backgrounds
        'vision-light': '#F9FAFB', // Light gray for backgrounds
        'vision-text-dark': '#E5E7EB', // Light text on dark backgrounds
        'vision-text-light': '#374151', // Dark text on light backgrounds
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'], // For code snippets
      },
    },
  },
  plugins: [],
}