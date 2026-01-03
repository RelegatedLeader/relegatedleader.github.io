"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedinIn, FaFileAlt } from "react-icons/fa";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed left-0 top-0 w-full h-screen sm:h-auto sm:w-80 bg-gradient-to-b sm:bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:justify-between sm:items-center z-50">
      {/* Title */}
      <div className="mb-8 sm:mb-0">
        <h1 className="text-3xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Francisco Alfaro
        </h1>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-6 mb-12 sm:mb-0 sm:flex-row sm:gap-8">
        <li>
          <Link
            href="/"
            className={`text-lg sm:text-base transition-colors ${
              isActive("/")
                ? "text-blue-400 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Portfolio
          </Link>
        </li>
        <li>
          <Link
            href="/misc"
            className={`text-lg sm:text-base transition-colors ${
              isActive("/misc")
                ? "text-blue-400 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Misc
          </Link>
        </li>
        <li>
          <Link
            href="/web3"
            className={`text-lg sm:text-base transition-colors ${
              isActive("/web3")
                ? "text-blue-400 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Web3
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className={`text-lg sm:text-base transition-colors ${
              isActive("/about")
                ? "text-blue-400 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className={`text-lg sm:text-base transition-colors ${
              isActive("/contact")
                ? "text-blue-400 font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Social Links */}
      <div className="flex gap-6 mt-auto sm:mt-0">
        <a
          href="https://github.com/RelegatedLeader"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-gray-400 hover:text-blue-400 transition-colors"
          title="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/falfaro105"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-gray-400 hover:text-blue-400 transition-colors"
          title="LinkedIn"
        >
          <FaLinkedinIn />
        </a>
        <a
          href="images/alfaro_francisco_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-gray-400 hover:text-blue-400 transition-colors"
          title="Resume"
        >
          <FaFileAlt />
        </a>
      </div>
    </nav>
  );
}
