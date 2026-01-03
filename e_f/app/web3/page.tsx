"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import ProjectCard from "@/components/ProjectCard";
import { web3Projects } from "@/lib/projects";

export default function Web3Page() {
  return (
    <PageLayout
      title="Web3 Projects"
      subtitle="Next-generation applications leveraging blockchain and crypto technologies"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {web3Projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <ProjectCard
              title={project.title}
              description={project.description}
              link={project.link}
              image={project.image}
            />
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  );
}
