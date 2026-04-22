"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SpotlightAchievement() {
  const sectionRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const glowRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
      },
    });

    // Magazine-style entry sequence
    tl.fromTo(
      titleRef.current,
      {
        y: 80,
        opacity: 0,
        filter: "blur(8px)",
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
      },
    )
      .fromTo(
        leftCardRef.current,
        {
          x: -100,
          opacity: 0,
          rotationY: -15,
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "back.out(1.2)",
        },
        "-=0.6",
      )
      .fromTo(
        rightCardRef.current,
        {
          x: 100,
          opacity: 0,
          rotationY: 15,
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "back.out(1.2)",
        },
        "-=1",
      );

    // Background glow pulse
    gsap.to(glowRef.current, {
      scale: 1.2,
      opacity: 0.5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const achievements = [
    {
      title: "Real World Solution",
      subtitle: "",
      description:
        "Built an AI-powered Hospital Management System that provided real-time patient monitoring, appointment scheduling, and resource management, leading to a 30% increase in operational efficiency.",
      image: "/awards/first.jpg",
    },
    {
      title: "Hackathon Performance",
      subtitle: "",
      description:
        "Achieved top 10 percentile in a competitive hackathon by developing an innovative web application that integrated machine learning for personalized user experiences.",
      image: "/awards/second.jpeg",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center bg-black overflow-hidden py-20"
    >
      {/* Premium Background */}
      <div className="absolute inset-0">
        {/* Main Glow */}
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Diagonal Lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 60px)`,
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8">
        {/* Magazine-Style Header */}
        <div ref={titleRef} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-white/70 tracking-wider uppercase">
              SPOTLIGHT
            </span>
          </div>
        </div>

        {/* Magazine-Style Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Card - Featured */}
          <div
            ref={leftCardRef}
            className={`group relative bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent 
                       backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden
                       hover:border-cyan-400/30 transition-all duration-500`}
          >
            {/* Image Section */}
            <div className="relative h-72 md:h-96 overflow-hidden">
              <img
                src={achievements[0].image}
                alt={achievements[0].title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Category Tag */}
              <div className="mb-4">
                <span className="text-xs text-cyan-400 font-mono tracking-wider bg-cyan-400/10 px-3 py-1 rounded-full">
                  🏆 AWARD WINNER
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {achievements[0].title}
              </h2>

              {/* Subtitle */}
              <p className="text-cyan-300/70 text-sm mb-4 tracking-wide">
                {achievements[0].subtitle}
              </p>

              {/* Description */}
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
                {achievements[0].description}
              </p>
            </div>
          </div>

          {/* Right Card - Press Style */}
          <div
            ref={rightCardRef}
            className={`group relative bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent 
                       backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden
                       hover:border-purple-400/30 transition-all duration-500`}
          >
            {/* Image Section */}
            <div className="relative h-96 md:h-[28rem] overflow-hidden">
              <img
                src={achievements[1].image}
                alt={achievements[1].title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Category Tag */}
              <div className="mb-4">
                <span className="text-xs text-purple-400 font-mono tracking-wider bg-purple-400/10 px-3 py-1 rounded-full">
                  ⚡ PERFORMANCE
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {achievements[1].title}
              </h2>

              {/* Subtitle */}
              <p className="text-purple-300/70 text-sm mb-4 tracking-wide">
                {achievements[1].subtitle}
              </p>

              {/* Description */}
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
                {achievements[1].description}
              </p>
            </div>
          </div>
        </div>

        {/* Magazine-Style Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 text-white/30 text-xs font-mono">
            <span>✦ RECOGNITION</span>
            <div className="w-8 h-px bg-white/20" />
            <span>✦ EXCELLENCE</span>
            <div className="w-8 h-px bg-white/20" />
            <span>✦ ACHIEVEMENT</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}
