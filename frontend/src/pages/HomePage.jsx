import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Cloud, Rocket, Shield } from 'lucide-react';
import TypingEffect from '../components/TypingEffect';

const codeSnippets = [
  `def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(5))`, // Python - Factorial
  `const fibonacci = (num) => {
    let a = 1, b = 1, temp;
    while (num > 0) {
      temp = a;
      a = a + b;
      b = temp;
      num--;
    }
    return b;
  };
console.log(fibonacci(8));`, // JavaScript - Fibonacci
  `#include <vector>
#include <algorithm>

int main() {
    std::vector<int> arr = {5, 2, 8, 1, 9};
    std::sort(arr.begin(), arr.end());
    for (int x : arr) {
        // std::cout << x << " ";
    }
    return 0;
}`, // C++ - Sorting Vector
  `public class QuickSort {
    static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }
    static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
}`, // Java - QuickSort
  `package main

import "fmt"

func main() {
	messages := make(chan string)
	go func() { messages <- "ping" }()
	msg := <-messages
	fmt.Println(msg)
}`, // Go - Channels
  `fn main() {
    let mut sum = 0;
    for i in 1..10 {
        sum += i;
    }
    println!("Sum: {}", sum);
}`, // Rust - Loop and Sum
  `<?php
class Car {
  public $color;
  public $model;
  public function __construct($color, $model) {
    $this->color = $color;
    $this->model = $model;
  }
  public function message() {
    return "My car is a " . $this->color . " " . $this->model . "!";
  }
}
$myCar = new Car("red", "Volvo");
// echo $myCar -> message();
?>`, // PHP - Class
];

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

        {/* Animated Code Snippets */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-black bg-opacity-70 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-auto z-10"
        >
          <pre className="text-left font-mono text-green-400 text-lg md:text-xl overflow-x-auto">
            <TypingEffect text={codeSnippets[0]} speed={50} />
          </pre>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="absolute top-1/4 left-10 bg-black bg-opacity-60 p-4 rounded-lg shadow-lg hidden lg:block"
        >
          <pre className="text-left font-mono text-blue-300 text-sm">
            <TypingEffect text={codeSnippets[1]} speed={40} />
          </pre>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-1/4 right-10 bg-black bg-opacity-60 p-4 rounded-lg shadow-lg hidden lg:block"
        >
          <pre className="text-left font-mono text-red-300 text-sm">
            <TypingEffect text={codeSnippets[2]} speed={45} />
          </pre>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.0 }}
          className="absolute top-10 right-1/4 bg-black bg-opacity-60 p-4 rounded-lg shadow-lg hidden md:block"
        >
          <pre className="text-left font-mono text-yellow-300 text-xs">
            <TypingEffect text={codeSnippets[3]} speed={35} />
          </pre>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-10 left-1/4 bg-black bg-opacity-60 p-4 rounded-lg shadow-lg hidden md:block"
        >
          <pre className="text-left font-mono text-purple-300 text-xs">
            <TypingEffect text={codeSnippets[4]} speed={30} />
          </pre>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 z-10"
        >
          <Link
            to="/register"
            className="px-10 py-5 rounded-full bg-vision-primary text-white text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out inline-block glowing-button"
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