"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";

export default function AboutPage() {
  const skills = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "Web3",
    "Blockchain",
  ];

  return (
    <PageLayout title="About Me">
      <div className="max-w-4xl space-y-12">
        {/* Bio Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Who I Am
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            I'm a passionate full-stack developer and digital designer with a
            love for creating innovative solutions that combine beautiful design
            with robust functionality. With expertise in modern web
            technologies, I specialize in building scalable applications that
            solve real-world problems.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Beyond code, I'm fascinated by emerging technologies like blockchain
            and Web3, constantly exploring new ways to push the boundaries of
            what's possible on the web.
          </p>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Skills & Technologies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Experience
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Full Stack Developer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Freelance | 2020 - Present
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Developed multiple web applications using React, Next.js, and
                Node.js. Designed and implemented RESTful APIs and database
                solutions.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Web Developer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Various Tech Companies | 2018 - 2020
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Built responsive web applications and maintained existing
                codebases. Collaborated with design teams and product managers.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </PageLayout>
  );
}
