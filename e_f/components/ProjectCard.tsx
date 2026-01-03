"use client";

import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  image: string;
}

export default function ProjectCard({
  title,
  description,
  link,
  image,
}: ProjectCardProps) {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      <div className="group h-full bg-gray-800 rounded overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col">
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-700">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23374151%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239CA3AF%22%3EImage Not Found%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Content Container */}
        <div className="flex-1 p-6 flex flex-col min-h-64">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-300 flex-1 line-clamp-5 overflow-hidden">
            {description}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <span className="inline-block text-blue-400 font-semibold text-sm group-hover:text-blue-300 transition-colors">
              View Project →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
