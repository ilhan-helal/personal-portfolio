"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Github, Mail, FileText, BookOpen } from "lucide-react";

const items = [
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    href: "/resume.pdf",
    position: "top-center",
    delay: 1.5,
    highlight: true,
    gradient: "from-yellow-400/20 via-yellow-500/20 to-yellow-600/20",
    hoverGradient: "from-yellow-400/40 via-yellow-500/40 to-yellow-600/40",
    iconColor: "text-yellow-400",
    glowColor: "rgba(234, 179, 8, 0.4)",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ilhan-helal30/",
    position: "left-top",
    delay: 2.3,
    gradient: "from-blue-500/20 via-blue-600/20 to-blue-700/20",
    hoverGradient: "from-blue-500/40 via-blue-600/40 to-blue-700/40",
    iconColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.4)",
  },
  {
    id: "github",
    label: "GitHub",
    icon: Github,
    href: "https://github.com/ilhan-helal",
    position: "right-top",
    delay: 4.3,
    gradient: "from-purple-500/20 via-purple-600/20 to-purple-700/20",
    hoverGradient: "from-purple-500/40 via-purple-600/40 to-purple-700/40",
    iconColor: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  {
    id: "gmail",
    label: "Gmail",
    icon: Mail,
    href: "mailto:ilhanhelal30@gmail.com",
    position: "left-bottom",
    delay: 3.3,
    gradient: "from-red-500/20 via-red-600/20 to-red-700/20",
    hoverGradient: "from-red-500/40 via-red-600/40 to-red-700/40",
    iconColor: "text-red-400",
    glowColor: "rgba(239, 68, 68, 0.4)",
  },
  {
    id: "medium",
    label: "Medium",
    icon: BookOpen,
    href: "https://medium.com/@ilhanhelal30",
    position: "right-bottom",
    delay: 5.3,
    gradient: "from-green-500/20 via-green-600/20 to-green-700/20",
    hoverGradient: "from-green-500/40 via-green-600/40 to-green-700/40",
    iconColor: "text-green-400",
    glowColor: "rgba(34, 197, 94, 0.4)",
  },
];

const positionMap = {
  "top-center": "top-6 left-1/2 -translate-x-1/2",
  "left-top": "top-32 left-6 md:left-12",
  "left-bottom": "bottom-32 left-6 md:left-12",
  "right-top": "top-32 right-6 md:right-12",
  "right-bottom": "bottom-32 right-6 md:right-12",
};

export default function HeroSocialOverlay() {
  const [visible, setVisible] = useState({});
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    items.forEach((item) => {
      setTimeout(() => {
        setVisible((prev) => ({ ...prev, [item.id]: true }));
      }, item.delay * 1000);
    });
  }, []);

  return (
    <AnimatePresence>
      {items.map((item) => {
        const Icon = item.icon;
        if (!visible[item.id]) return null;

        return (
          <motion.a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ 
              scale: 1.05,
              y: -5,
            }}
            transition={{ 
              duration: 0.4, 
              ease: "easeOut",
              scale: { duration: 0.2 },
            }}
            className={`absolute z-20 group flex items-center gap-3 px-4 py-3 rounded-full
              backdrop-blur-md bg-gradient-to-r ${hovered === item.id ? item.hoverGradient : item.gradient}
              border transition-all duration-300
              ${item.highlight && hovered !== item.id ? 'border-yellow-500/40 shadow-lg shadow-yellow-500/20' : 'border-white/10'}
              ${positionMap[item.position]}
            `}
            style={{
              boxShadow: hovered === item.id 
                ? `0 0 30px ${item.glowColor}, 0 0 60px ${item.glowColor}` 
                : item.highlight 
                  ? `0 0 20px ${item.glowColor}` 
                  : 'none',
            }}
          >
            {/* Glow Background */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl"
              style={{
                background: `radial-gradient(circle, ${item.glowColor} 0%, transparent 70%)`,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon with animation */}
            <motion.div
              animate={{
                rotate: hovered === item.id ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon size={18} className={`${item.iconColor} relative z-10`} />
            </motion.div>

            {/* Label */}
            <span className="text-sm font-medium text-white relative z-10">
              {item.label}
            </span>

            {/* Highlight pulse for resume */}
            {item.highlight && hovered !== item.id && (
              <motion.div
                className="absolute -inset-1 rounded-full border-2 border-yellow-400/30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Shimmer effect on hover */}
            {hovered === item.id && (
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div 
                  className="h-full w-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  }}
                />
              </motion.div>
            )}
          </motion.a>
        );
      })}
    </AnimatePresence>
  );
}
