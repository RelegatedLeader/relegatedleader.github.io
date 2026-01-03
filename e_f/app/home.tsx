"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 sm:pt-0">
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Francisco Alfaro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Full Stack Developer & Digital Designer
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-12 leading-relaxed"
          >
            Crafting innovative digital experiences with modern web
            technologies. Specializing in React, Next.js, and full-stack
            development.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/misc">
              <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                View My Work
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors">
                Get in Touch
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Sections */}
      <div className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <Link href="/misc">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Misc Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore my diverse collection of innovative projects and
                experiments
              </p>
            </motion.div>
          </Link>

          <Link href="/web3">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Web3 Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Next-generation applications leveraging blockchain and crypto
                technologies
              </p>
            </motion.div>
          </Link>

          <Link href="/about">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer sm:col-span-2 lg:col-span-1"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                About Me
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn more about my skills, experience, and passion for
                technology
              </p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
