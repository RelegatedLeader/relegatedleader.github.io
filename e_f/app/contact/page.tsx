"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log(formData);
    alert("Thank you for your message! I will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <PageLayout title="Get in Touch">
      <div className="max-w-2xl space-y-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <a
            href="mailto:falfaro105@gmail.com"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
          >
            <div className="text-4xl mb-4 flex justify-center group-hover:text-blue-600 transition-colors">
              <FaEnvelope />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              Email
            </h3>
            <p className="text-gray-600 dark:text-gray-400 break-all">
              falfaro105@gmail.com
            </p>
          </a>

          <a
            href="https://github.com/RelegatedLeader"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
          >
            <div className="text-4xl mb-4 flex justify-center group-hover:text-blue-600 transition-colors">
              <FaGithub />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              GitHub
            </h3>
            <p className="text-gray-600 dark:text-gray-400">RelegatedLeader</p>
          </a>

          <a
            href="https://www.linkedin.com/in/falfaro105"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
          >
            <div className="text-4xl mb-4 flex justify-center group-hover:text-blue-600 transition-colors">
              <FaLinkedinIn />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              LinkedIn
            </h3>
            <p className="text-gray-600 dark:text-gray-400">falfaro105</p>
          </a>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Send me a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </PageLayout>
  );
}
