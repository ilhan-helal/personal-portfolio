"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ActivitiesOrbit() {
  const orbit1 = useRef(null);
  const orbit2 = useRef(null);
  const orbit3 = useRef(null);
  const orbit4 = useRef(null);
  const centerRef = useRef(null);
  const sectionRef = useRef(null);

  // Refs for planet content to counter-rotate
  const planetContent1 = useRef(null);
  const planetContent2 = useRef(null);
  const planetContent3 = useRef(null);
  const planetContent4 = useRef(null);
  const planetContents = [
    planetContent1,
    planetContent2,
    planetContent3,
    planetContent4,
  ];

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
      },
    });

    // Center fade in
    tl.fromTo(
      centerRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" },
    );

    // Orbits fade in
    tl.fromTo(
      [orbit1.current, orbit2.current, orbit3.current, orbit4.current],
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" },
      "-=0.3",
    );

    // Different speeds + directions for each orbit
    gsap.to(orbit1.current, {
      rotate: 360,
      duration: 28,
      repeat: -1,
      ease: "none",
    });

    gsap.to(orbit2.current, {
      rotate: -360,
      duration: 24,
      repeat: -1,
      ease: "none",
    });

    gsap.to(orbit3.current, {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    gsap.to(orbit4.current, {
      rotate: -360,
      duration: 32,
      repeat: -1,
      ease: "none",
    });

    // Counter-rotate planet contents to keep them upright
    gsap.to(planetContent1.current, {
      rotate: -360,
      duration: 28,
      repeat: -1,
      ease: "none",
    });

    gsap.to(planetContent2.current, {
      rotate: 360,
      duration: 24,
      repeat: -1,
      ease: "none",
    });

    gsap.to(planetContent3.current, {
      rotate: -360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    gsap.to(planetContent4.current, {
      rotate: 360,
      duration: 32,
      repeat: -1,
      ease: "none",
    });
  }, []);

  const activities = [
    {
      name: "Poetry",
      icon: "✍️",
      color: "cyan",
      orbitColor: "border-cyan-400/30",
      planetColor: "from-cyan-400 to-cyan-600",
      glowColor: "rgba(34,211,238,0.4)",
      size: 70,
    },
    {
      name: "Cricket",
      icon: "🏏",
      color: "purple",
      orbitColor: "border-purple-400/30",
      planetColor: "from-purple-400 to-purple-600",
      glowColor: "rgba(168,85,247,0.4)",
      size: 80,
    },
    {
      name: "Reading",
      icon: "📚",
      color: "pink",
      orbitColor: "border-pink-400/30",
      planetColor: "from-pink-400 to-pink-600",
      glowColor: "rgba(236,72,153,0.4)",
      size: 75,
    },
    {
      name: "Travelling",
      icon: "✈️",
      color: "orange",
      orbitColor: "border-orange-400/30",
      planetColor: "from-orange-400 to-orange-600",
      glowColor: "rgba(251,146,60,0.4)",
      size: 85,
    },
  ];

  const orbits = [orbit1, orbit2, orbit3, orbit4];
  const orbitSizes = [260, 400, 540, 680];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden py-12"
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0b0b14] to-[#0a0a0f]" />

        {/* Animated nebula glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" />

        {/* Stars */}
        <div
          className="absolute inset-1 opacity-100"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)),
                             radial-gradient(1px 1px at 60px 80px, white, rgba(0,0,0,0)),
                             radial-gradient(3px 3px at 100px 150px, white, rgba(0,0,0,0)),
                             radial-gradient(1.5px 1.5px at 200px 250px, white, rgba(0,0,0,0))`,
            backgroundSize:
              "250px 250px, 300px 300px, 350px 350px, 400px 400px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* Section Header */}
      <div className="absolute top-4 left-0 right-0 text-center z-30">
        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-medium text-white/70 tracking-wider">
            BEYOND CODE
          </span>
        </div>
      </div>
      <div
        ref={centerRef}
        className="absolute z-20 text-center opacity-0 scale-0"
      >
        <div className="relative mt-10">
          <div className="absolute inset-[-25px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
          <div
            className="absolute inset-[-50px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "3s" }}
          />

          {/* Center core */}
          <div className="relative flex flex-col items-center justify-center shadow-2xl">
            <span className="text-yellow-400 font-bold text-md md:text-lg mt-1">
              What
            </span>
            <span className="text-cyan-500 font-bold text-md md:text-lg mt-1">
              derives
            </span>
            <span className="text-orange-400 font-bold text-md md:text-lg mt-1">
              me...
            </span>
          </div>
        </div>
      </div>

      {/* Orbits with Proper Circular Planets */}
      {activities.map((activity, idx) => (
        <div
          key={idx}
          ref={orbits[idx]}
          className={`absolute mt-10 rounded-full border-2 ${activity.orbitColor}`}
          style={{
            width: orbitSizes[idx],
            height: orbitSizes[idx],
            boxShadow: `0 0 30px ${
              activity.color === "cyan"
                ? "rgba(0,255,255,0.08)"
                : activity.color === "purple"
                  ? "rgba(168,85,247,0.08)"
                  : activity.color === "pink"
                    ? "rgba(236,72,153,0.08)"
                    : "rgba(251,146,60,0.08)"
            }`,
          }}
        >
          {/* Planet Structure */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              marginTop: -activity.size / 2,
            }}
          >
            {/* Planet Outer Glow */}
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-50"
              style={{
                backgroundColor:
                  activity.color === "cyan"
                    ? "#06b6d4"
                    : activity.color === "purple"
                      ? "#a855f7"
                      : activity.color === "pink"
                        ? "#ec4899"
                        : "#f97316",
                filter: "blur(10px)",
              }}
            />

            {/* Planet Core - Perfect Circle */}
            <div
              className="relative rounded-full flex flex-col items-center justify-center shadow-2xl"
              style={{
                width: activity.size,
                height: activity.size,
                background: `radial-gradient(circle at 35% 35%, 
                  ${
                    activity.color === "cyan"
                      ? "#22d3ee"
                      : activity.color === "purple"
                        ? "#c084fc"
                        : activity.color === "pink"
                          ? "#f472b6"
                          : "#fb923c"
                  }, 
                  ${
                    activity.color === "cyan"
                      ? "#0891b2"
                      : activity.color === "purple"
                        ? "#7e22ce"
                        : activity.color === "pink"
                          ? "#be185d"
                          : "#ea580c"
                  })`,
                boxShadow: `0 0 35px ${activity.glowColor}`,
                border: `2px solid ${
                  activity.color === "cyan"
                    ? "rgba(34,211,238,0.5)"
                    : activity.color === "purple"
                      ? "rgba(168,85,247,0.5)"
                      : activity.color === "pink"
                        ? "rgba(236,72,153,0.5)"
                        : "rgba(251,146,60,0.5)"
                }`,
              }}
            >
              {/* Planet Content Container - Counter-rotates to stay upright */}
              <div
                ref={planetContents[idx]}
                className="flex flex-col items-center justify-center"
              >
                {/* Planet Icon */}
                <span className="text-3xl md:text-4xl mb-1">
                  {activity.icon}
                </span>

                {/* Planet Name */}
                <span className="text-white font-bold text-sm md:text-base tracking-wide">
                  {activity.name}
                </span>
              </div>

              {/* Decorative Ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: activity.size + 15,
                  height: activity.size + 15,
                  border: `1.5px solid ${
                    activity.color === "cyan"
                      ? "rgba(34,211,238,0.3)"
                      : activity.color === "purple"
                        ? "rgba(168,85,247,0.3)"
                        : activity.color === "pink"
                          ? "rgba(236,72,153,0.3)"
                          : "rgba(251,146,60,0.3)"
                  }`,
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

      {/* Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
