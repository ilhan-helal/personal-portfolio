"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nameTranslations } from "@/lib/constants";

/* Floating Name Component */
function FloatingName({
  name,
  position,
  size,
  duration,
  direction,
  highlight,
  color,
  isMobile,
}) {
  const sizeClasses = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-2xl",
  };

  const opacityMap = {
    sm: highlight ? 0.6 : 0.2,
    md: highlight ? 0.75 : 0.3,
    lg: highlight ? 0.9 : 0.4,
  };
  return (
    <motion.div
      className={`absolute font-mono whitespace-nowrap pointer-events-none select-none ${sizeClasses[size]} ${
        highlight ? color : "text-white"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        textShadow: highlight
          ? `0 0 20px currentColor, 0 0 40px currentColor`
          : "0 0 10px rgba(255,255,255,0.3)",
      }}
      initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
      animate={{
        opacity: highlight
          ? [
              0,
              opacityMap[size],
              opacityMap[size],
              opacityMap[size] * 0.8,
            ]
          : [0, opacityMap[size], opacityMap[size], 0],
        scale: [0.5, 1, 1, 0.8],
        x: [0, direction.x * 30, direction.x * 50, direction.x * 80],
        y: [0, direction.y * 20, direction.y * 40, direction.y * 60],
        filter: isMobile
  ? ["blur(5px)", "blur(0px)", "blur(0px)", "blur(3px)"]
  : ["blur(10px)", "blur(0px)", "blur(0px)", "blur(5px)"],
      }}
      transition={{
        duration: highlight ? duration * 1.5 : duration,
        ease: "easeOut",
      }}
    >
      {name}
    </motion.div>
  );
}

/* Particle (random values fixed with useRef) */
function Particle({ delay }) {
  const data = useRef({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: 3 + Math.random() * 2,
    repeatDelay: Math.random() * 2,
  });

  return (
    <motion.div
      className="absolute rounded-full bg-cyan-400/30"
      style={{
        left: `${data.current.x}%`,
        top: `${data.current.y}%`,
        width: `${data.current.size}px`,
        height: `${data.current.size}px`,
        boxShadow: `0 0 ${data.current.size * 3}px currentColor`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        y: [0, -100, -200],
      }}
      transition={{
        duration: data.current.duration,
        delay,
        repeat: Infinity,
        repeatDelay: data.current.repeatDelay,
      }}
    />
  );
}

export default function IntroScreen({ onFinish }) {
  
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [floatingNames, setFloatingNames] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isPausedAt99, setIsPausedAt99] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const particleCount = isMobile ? 8 : 20;
  /* Client-only setup */
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const colors = [
    "text-cyan-400",
    "text-blue-400",
    "text-purple-400",
    "text-pink-400",
    "text-indigo-400",
    "text-violet-400",
  ];

  const getRandomPosition = () => ({
    x: Math.random() * 85 + 5,
    y: Math.random() * 85 + 5,
  });

  const getRandomDirection = () => ({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
  });

  const getRandomSize = () => {
    const r = Math.random();
    if (r < 0.4) return "sm";
    if (r < 0.75) return "md";
    return "lg";
  };

  /* Floating names */
  useEffect(() => {
    if (!mounted || isComplete || reducedMotion) return;

    const spawnInterval = isPausedAt99
      ? isMobile
        ? 180
        : 100
      : isMobile
      ? 300
      : 200;

    const interval = setInterval(() => {
      const randomName =
        nameTranslations[
          Math.floor(Math.random() * nameTranslations.length)
        ];

      setFloatingNames((prev) => [
        ...prev.slice(isPausedAt99 ? (isMobile ? -15 : -40) : (isMobile ? -10 : -25)),
        {
          id: crypto.randomUUID(),
          name: randomName.name,
          position: getRandomPosition(),
          size: getRandomSize(),
          duration: isPausedAt99
            ? 5 + Math.random() * 3
            : 3 + Math.random() * 2,
          direction: getRandomDirection(),
          highlight: isPausedAt99,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ]);
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [mounted, isComplete, isPausedAt99, isMobile, reducedMotion]);

  /* Progress */
  useEffect(() => {
    if (!mounted) return;

    const duration = 6000;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const p = Math.min((elapsed / duration) * 99, 99);
      setProgress(p);

      if (p < 99) {
        requestAnimationFrame(tick);
      } else {
        setIsPausedAt99(true);
        setTimeout(() => {
          setProgress(100);
          setIsComplete(true);
          setTimeout(onFinish, 800);
        }, 2500);
      }
    };

    requestAnimationFrame(tick);
  }, [mounted, onFinish]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0b2e 25%, #16213e 50%, #0f172a 75%, #020617 100%)'
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)'
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)'
            }}
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute top-1/2 right-1/3 w-32 h-32 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-full opacity-15 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)'
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -100, 0],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          {!reducedMotion && Array.from({ length: particleCount }).map((_, i) => (
            <Particle key={i} delay={i * 0.2} />
          ))}

          {/* Floating names */}
          {floatingNames.map((item) => (
  <FloatingName key={item.id} {...item} isMobile={isMobile} />
))}

          {/* Animated grid overlay */}
          <motion.div
            className="absolute inset-0 opacity-[0.05]"
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

          {/* Scanline effect */}
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
            animate={{
              top: ['0%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <motion.span 
                  className="inline-block bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent"
                  style={{
                    textShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
                  }}
                  animate={{
                    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  Web
                </motion.span>
                {" "}
                <motion.span 
                  className="inline-block bg-gradient-to-r from-red-500 via-rose-600 to-red-700 bg-clip-text text-transparent"
                  style={{
                    textShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
                  }}
                  animate={{
                    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                >
                  Developer
                </motion.span>
              </motion.h1>

              <motion.div
                className="h-0.5 mt-4 mx-auto overflow-hidden rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #06b6d4, #a855f7, transparent)',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
                }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>

            <div className="flex flex-col items-center gap-4">
              {/* Enhanced Progress Bar */}
              <div className="relative w-52 sm:w-64 md:w-80">
                {/* Glow background */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl opacity-50"
                  style={{
                    background: 'linear-gradient(90deg, #06b6d4, #6366f1, #a855f7)',
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                
                {/* Progress bar container */}
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  {/* Progress fill */}
                  <motion.div
                    className="h-full relative overflow-hidden"
                    style={{ 
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #06b6d4, #6366f1, #a855f7)',
                      boxShadow: '0 0 20px currentColor',
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Progress percentage */}
              <div className="font-mono text-sm tracking-widest flex items-center gap-2">
                <span className="text-cyan-400/60">[</span>
                <motion.span
                  className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                  style={{
                    textShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
                  }}
                >
                  {Math.floor(progress) < 100
  ? Math.floor(progress).toString().padStart(2, "0")
  : "100"}
%
                </motion.span>
                <span className="text-cyan-400/60">]</span>
                <motion.span
                  className="ml-2 text-cyan-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    textShadow: '0 0 10px currentColor',
                  }}
                >
                  ▎
                </motion.span>
              </div>

              {/* Status text */}
              <motion.div
                className="font-mono text-xs tracking-wider px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-sm"
                animate={{ 
                  borderColor: ['rgba(6, 182, 212, 0.2)', 'rgba(99, 102, 241, 0.3)', 'rgba(6, 182, 212, 0.2)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {progress < 30
                    ? "⚡ INITIALIZING SYSTEMS..."
                    : progress < 60
                    ? "📦 LOADING ASSETS..."
                    : progress < 90
                    ? "🎨 PREPARING PORTFOLIO..."
                    : "✨ ALMOST THERE..."}
                </motion.span>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Terminal labels
          <motion.div 
            className="absolute top-6 left-6 font-mono text-xs text-cyan-400/40"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              textShadow: '0 0 10px rgba(6, 182, 212, 0.3)',
            }}
          >
            {"<portfolio>"}
          </motion.div>
          
          <motion.div 
            className="absolute top-6 right-6 font-mono text-xs text-purple-400/40 flex items-center gap-2"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            style={{
              textShadow: '0 0 10px rgba(168, 85, 247, 0.3)',
            }}
          >
          </motion.div> */}

          <motion.div 
            className="absolute bottom-6 left-6 font-mono text-xs text-indigo-400/40"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            style={{
              textShadow: '0 0 10px rgba(99, 102, 241, 0.3)',
            }}
          >
            {"// Frontend Developer"}
          </motion.div>

          <motion.div 
            className="absolute bottom-6 right-6 font-mono text-xs text-cyan-400/40"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            style={{
              textShadow: '0 0 10px rgba(6, 182, 212, 0.3)',
            }}
          >
            {"</intro>"}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
