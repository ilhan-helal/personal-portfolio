"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Code2, Sparkles, Zap } from "lucide-react";
import HeroSocialOverlay from "@/components/HeroSocialOverlay";
import FeatureProjects from "@/components/FeatureProjects";
import CommandBar from "@/components/CommandBar";

/* Floating Tech Icons */
function FloatingIcon({ delay, duration, xRange, yRange }) {
  const icons = [Code2, Sparkles, Zap];
  const IconRef = useRef(icons[Math.floor(Math.random() * icons.length)]);
  const Icon = IconRef.current;

  return (
    <motion.div
      className="absolute text-white/10"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.3, 0],
        x: [0, xRange, 0],
        y: [0, yRange, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon size={24} />
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <motion.div
      className="min-h-screen bg-black text-white overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      
      {/* HERO SECTION */}
      <div
        className="min-h-screen flex flex-col items-center justify-start pt-28 sm:justify-center sm:pt-0 px-6 relative overflow-hidden"
        style={{
          background: `
  linear-gradient(
    135deg,
    #020617 0%,
    #05010d 30%,
    #07020f 55%,
    #020617 100%
  )
`,
        }}
      >
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 md:w-[600px] md:h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-0 right-0 w-52 h-52 md:w-[500px] md:h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #eab308 0%, transparent 70%)'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/3 w-48 h-48 md:w-[400px] md:h-[400px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)'
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Tech Icons */}
        {Array.from({ length: typeof window !== "undefined" && window.innerWidth < 768 ? 3 : 8 }).map((_, i) => (
          <FloatingIcon
            key={i}
            delay={i * 1.5}
            duration={10 + i * 2}
            xRange={(i % 2 === 0 ? 100 : -100) + i * 10}
            yRange={(i % 3 === 0 ? -80 : 80) + i * 5}
          />
        ))}

        {/* Grid Overlay */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Scanline */}
        {/* <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        /> */}
        
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none sm:hidden" />
        <HeroSocialOverlay />
        <motion.div
          className="text-center relative z-10 mt-6 sm:mt-0 space-y-4 sm:space-y-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Hello Label */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-tr-3xl rounded-bl-3xl border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-sm mb-8 sm:mb-6"
            animate={{
              borderColor: ['rgba(6, 182, 212, 0.2)', 'rgba(34, 197, 94, 0.3)', 'rgba(6, 182, 212, 0.2)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white/60 font-mono text-xs md:text-sm tracking-widest">HELLO, I&apos;M</span>
          </motion.div>

          {/* Name */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 sm:mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span 
              className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
              style={{
                textShadow: '0 0 80px rgba(234, 179, 8, 0.5)',
              }}
            >
              ILHAN HELAL
            </span>
          </motion.h1>

          {/* Divider */}
          <motion.div
            className="h-0.5 w-32 mx-auto mb-6 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, transparent, #06b6d4, #22c55e, transparent)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
            }}
            initial={{ width: 0 }}
            animate={{ width: "128px" }}
            transition={{ duration: 1, delay: 0.6 }}
          />

          {/* Title with gradient */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl font-light mb-10 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Web Developer & Creative Technologist
            </span>
          </motion.p>

          {/* Description */}
          <motion.p 
            className="max-w-lg sm:max-w-xl mx-auto text-white/70 text-sm sm:text-base leading-relaxed mb-14 sm:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Specializing in modern web technologies and interactive interfaces.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <a href="#feature">
              <motion.button
  className="group relative px-6 sm:px-8 py-3 
  bg-gradient-to-r from-cyan-300 to-blue-500 
  hover:from-green-400 hover:to-cyan-500
  transition-all duration-300
  text-white font-medium rounded-md overflow-hidden"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={18} />
                  View Projects
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </a>
            
            <motion.button 
              className="group relative px-6 sm:px-8 py-3 border border-white/30 text-white font-medium rounded-2xl overflow-hidden backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(234, 179, 8, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent group-hover:text-white transition-all">
                Contact Me
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1.5 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* FEATURED PROJECTS and Command Bar*/}
      <CommandBar />
      <FeatureProjects />
    </motion.div>
  );
}