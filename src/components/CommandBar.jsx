"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Sparkles } from "lucide-react";

const socials = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/yourusername",
    color: "from-purple-500 to-purple-700",
    hoverColor: "rgba(168, 85, 247, 0.4)",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/yourusername",
    color: "from-blue-500 to-blue-700",
    hoverColor: "rgba(59, 130, 246, 0.4)",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:ilhanhelal@gmail.com",
    color: "from-red-500 to-red-700",
    hoverColor: "rgba(239, 68, 68, 0.4)",
  },
];

export default function CommandBar() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [trail, setTrail] = useState([]);
  useEffect(() => {
  const check = () => setIsDesktop(window.innerWidth >= 1024);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);
  
  // Sparkle offsets
  const sparkleOffsets = useRef(
    Array.from({ length: 3 }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
    }))
  );

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Add trail effect
      setTrail((prev) => [
  ...prev.slice(-3),
  { x: e.clientX, y: e.clientY, id: crypto.randomUUID() },
]);

      const nearRight = window.innerWidth - e.clientX < 200;
      const nearBottom = window.innerHeight - e.clientY < 200;
      setActive(nearRight && nearBottom);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Clean up old trail points
  useEffect(() => {
    const timer = setInterval(() => {
      setTrail((prev) => prev.slice(-3));
    }, 50);
    return () => clearInterval(timer);
  }, []);

 if (!isDesktop) return null;

return (
  <>
      {/* Cursor trail effect */}
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="fixed z-40 rounded-full pointer-events-none"
            style={{
              left: point.x - 3,
              top: point.y - 3,
              width: 6,
              height: 6,
              background: `rgba(6, 182, 212, ${0.6 - index * 0.1})`,
              boxShadow: `0 0 ${10 - index * 2}px rgba(6, 182, 212, 0.6)`,
            }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor dot with glow */}
      <motion.div
        className="fixed z-50 rounded-full pointer-events-none"
        style={{
          left: pos.x - 8,
          top: pos.y - 8,
          width: 16,
          height: 16,
        }}
        animate={{ scale: active ? 1.5 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Core */}
        <div
          className="w-full h-full rounded-full bg-white"
          style={{
            boxShadow:
              "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(6, 182, 212, 0.6)",
          }}
        />
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Socials container */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed bottom-8 right-8 z-40 flex gap-3"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, staggerChildren: 0.1 }}
          >
            {socials.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredSocial === item.name;

              return (
                <motion.a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(item.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Glow background */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle, ${item.hoverColor} 0%, transparent 70%)`,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Button */}
                  <div
                    className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${item.color} backdrop-blur-md flex items-center justify-center text-white border border-white/20 overflow-hidden`}
                    style={{
                      boxShadow: isHovered
                        ? `0 0 30px ${item.hoverColor}, 0 0 60px ${item.hoverColor}`
                        : "0 4px 15px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {/* Icon */}
                    <motion.div
                      animate={{ rotate: isHovered ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon size={22} className="relative z-10" />
                    </motion.div>

                    {/* Shimmer effect */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0"
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: "100%", opacity: 1 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 0.5,
                        }}
                      >
                        <div
                          className="h-full w-full"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Sparkles */}
                    {isHovered &&
                      sparkleOffsets.current.map((pos, i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                          animate={{
                            x: pos.x,
                            y: pos.y,
                            opacity: 0,
                            scale: 1,
                          }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                          }}
                        >
                          <Sparkles size={12} className="text-white" />
                        </motion.div>
                      ))}
                  </div>

                  {/* Tooltip */}
                  <motion.div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 5,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white text-xs font-medium">
                      {item.name}
                    </div>
                  </motion.div>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activation hint */}
      <AnimatePresence>
        {!active && (
          <motion.div
            className="fixed bottom-8 right-8 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 text-xs"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={14} className="text-cyan-400" />
              <span>Hover here</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
