"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiGithub,
} from "react-icons/si";

const techItems = [
  { name: "React", icon: SiReact, color: "text-cyan-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-sky-400" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
  { name: "GitHub", icon: SiGithub, color: "text-white" },
];

export default function TechStack() {
  return (
    <section className="relative w-full h-full bg-black flex flex-col items-center justify-center px-6 overflow-hidden">
      
      {/* Background subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/80" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full -bottom-40 -right-40" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-20 relative z-10"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Tech Stack
        </h2>
        <p className="text-white/50 mt-4 text-sm md:text-base max-w-xl mx-auto">
          Technologies I use to craft immersive, performant and scalable digital experiences.
        </p>
      </motion.div>

      {/* Grid
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12">
        {techItems.map((tech, index) => {
          const Icon = tech.icon;

          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
              }}
              className="group relative flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/40 transition-all duration-300"
            >
              <Icon
                className={`text-4xl md:text-5xl ${tech.color} group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all duration-300`}
              />
              <span className="mt-4 text-white/70 text-sm md:text-base">
                {tech.name}
              </span>
            </motion.div>
          );
        })}
      </div> */}
    </section>
  );
}
