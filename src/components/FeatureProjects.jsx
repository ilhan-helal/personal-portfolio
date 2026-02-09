"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import CommandBar from "@/components/CommandBar";
import{
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Code2,
} from "lucide-react";
import Image from "next/image";

/* ================= DATA ================= */

const projects = [
  {
    id: 1,
    title: "COIN TRACE",
    description:
      "A cryptocurrency tracking platform built with Next.js that displays real-time crypto prices using trusted APIs. Focused on performance, SEO, reusable UI components, and smooth data visualization for tracking and analysis.",
    image: "/ctim.jpg",
    tags: ["Next.js", "ShadCN UI", "Crypto API", "Charts"],
    liveUrl: "https://cointrace-app.vercel.app",
  },
  {
    id: 2,
    title: "AAM JOB",
    description:
      "A job portal web application developed using React.js that allows users to browse, search, and explore job listings. Built with reusable components and responsive design to ensure smooth usability across devices.",
    image: "/ajii.png",
    tags: ["React.js", "JavaScript", "Responsive UI"],
    liveUrl: "https://aamjob.netlify.app",
  },
  {
    id: 3,
    title: "WE CARE",
    description:
      "A hospital appointment booking system built using the MERN stack. Enables patients to schedule appointments easily while allowing doctors to manage bookings efficiently.",
    image: "/wecare.png",
    tags: ["MERN Stack", "MongoDB", "Express", "React", "Node.js"],
    liveUrl: "https://iwecare.netlify.app",
  },
];

const projectBackgrounds = [
  {
    bgColor: "#0d001a",
    gradient:
      "radial-gradient(circle at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6,182,212,0.15) 0%, transparent 50%)",
    accentColor: "from-red-400 to-purple-400",
  },
  {
    bgColor: "#0a0a14",
    gradient:
      "radial-gradient(circle at 80% 20%, rgba(255, 204, 63, 0.22) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(234, 179, 8, 0.18) 0%, transparent 55%)",
    accentColor: "from-yellow-400 to-orange-400",
  },
  {
    bgColor: "#111a00",
    gradient:
      "radial-gradient(circle at 50% 50%, rgba(20,184,166,0.18) 0%, transparent 50%), radial-gradient(circle at 90% 10%, rgba(34,211,238,0.15) 0%, transparent 50%)",
    accentColor: "from-green-400 to-cyan-400",
  },
];

/* ================= COMPONENT ================= */

export default function FeatureProjects() {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
const sectionRef = useRef(null);
const [showCommandBar, setShowCommandBar] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
     ([entry]) => {
      setTimeout(() => {
        setShowCommandBar(entry.isIntersecting);
      }, 200);
    },
    { threshold: 0.15 }
  );

  const section = sectionRef.current;
  if (section) observer.observe(section);

  return () => {
    observer.disconnect();
  };
}, []);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % projects.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

  /* AUTO SLIDE */
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    
    <motion.section
  ref={sectionRef}
  id="feature"
  className="py-24 px-6 border-t border-white/10 relative overflow-hidden"
  style={{
    backgroundColor: projectBackgrounds[currentIndex].bgColor,
    backgroundImage: projectBackgrounds[currentIndex].gradient,
  }}
>
      {/* Animated Background Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -100, 0], opacity: [0, 0.5, 0] }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/20 bg-purple-400/5 mb-4">
            <Code2 size={16} className="text-purple-400" />
            <span className="text-white/60 font-mono text-xs tracking-widest">
              PORTFOLIO
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Featured Projects
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Nav Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20"
          >
            <ChevronLeft className="text-cyan-400" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20"
          >
            <ChevronRight className="text-cyan-400" />
          </button>

          {/* Slides */}
          <div
            ref={sliderRef}
            className="overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsDragging(true)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              {projects.map((project, idx) => (
                <div key={project.id} className="w-full shrink-0 px-2">
                  <div className="grid md:grid-cols-2 bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                    {/* IMAGE */}
                    <div className="relative h-80 md:h-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-8 md:p-12 flex flex-col justify-between">
                      <div>
                        <h3
                          className={`text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r ${projectBackgrounds[idx].accentColor} bg-clip-text text-transparent`}
                        >
                          {project.title}
                        </h3>

                        <p className="text-white/70 mb-6">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          className="px-6 py-3 bg-white text-black rounded-full flex items-center gap-2 hover:bg-black hover:text-white transition-colors duration-300"
                        >
                          <ExternalLink size={16} />
                          Live
                        </a>

                        <a className="px-6 py-3 border border-white/30 rounded-full flex items-center gap-2 text-white hover:bg-white/10 transition-colors duration-300">
                          <Github size={16} />
                          Code
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
            {showCommandBar && <CommandBar />}
    </motion.section>
  );
}
