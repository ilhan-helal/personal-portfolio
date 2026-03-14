"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default function TechStack() {
  const containerRef = useRef(null);
  const pillsRef = useRef([]);
  const physicsInitialized = useRef(false);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const bodiesRef = useRef([]);
  const [activeTab, setActiveTab] = useState("tech");

  const techStacks = [
    { name: "ReactJS", icon: "⚛️", color: "from-cyan-400 to-blue-500" },
    { name: "NextJS", icon: "▲", color: "from-gray-300 to-gray-600" },
    { name: "JavaScript", icon: "🟨", color: "from-yellow-400 to-amber-500" },
    { name: "TypeScript", icon: "🔷", color: "from-blue-400 to-indigo-500" },
    { name: "HTML5", icon: "🌐", color: "from-orange-400 to-red-500" },
    { name: "CSS3", icon: "🎨", color: "from-pink-400 to-rose-500" },
    { name: "Tailwind", icon: "🌊", color: "from-sky-400 to-cyan-500" },
    { name: "GSAP", icon: "🌀", color: "from-emerald-400 to-teal-500" },
    { name: "Framer", icon: "🎭", color: "from-purple-400 to-pink-500" },
    { name: "Sanity", icon: "⚡", color: "from-red-400 to-orange-500" },
    { name: "Supabase", icon: "🟢", color: "from-green-400 to-emerald-500" },
    { name: "REST API", icon: "🔗", color: "from-amber-400 to-yellow-500" },
    { name: "GraphQL", icon: "📊", color: "from-pink-400 to-purple-500" },
    { name: "Node.js", icon: "🟢", color: "from-green-500 to-emerald-600" },
    { name: "ReactJS", icon: "⚛️", color: "from-cyan-400 to-blue-500" },
    { name: "NextJS", icon: "▲", color: "from-gray-300 to-gray-600" },
    { name: "JavaScript", icon: "🟨", color: "from-yellow-400 to-amber-500" },
    { name: "TypeScript", icon: "🔷", color: "from-blue-400 to-indigo-500" },
    { name: "HTML5", icon: "🌐", color: "from-orange-400 to-red-500" },
    { name: "CSS3", icon: "🎨", color: "from-pink-400 to-rose-500" },
    { name: "Tailwind", icon: "🌊", color: "from-sky-400 to-cyan-500" },
    { name: "GSAP", icon: "🌀", color: "from-emerald-400 to-teal-500" },
    { name: "Framer", icon: "🎭", color: "from-purple-400 to-pink-500" },
    { name: "Sanity", icon: "⚡", color: "from-red-400 to-orange-500" },
    { name: "Supabase", icon: "🟢", color: "from-green-400 to-emerald-500" },
    { name: "REST API", icon: "🔗", color: "from-amber-400 to-yellow-500" },
    { name: "GraphQL", icon: "📊", color: "from-pink-400 to-purple-500" },
    { name: "Node.js", icon: "🟢", color: "from-green-500 to-emerald-600" },
  ];

  const moreSkills = [
    {
      name: "Headless CMS",
      icon: "🧠",
      color: "from-purple-400 to-indigo-500",
    },
    { name: "No Code", icon: "🧩", color: "from-indigo-400 to-blue-500" },
    { name: "Web Apps", icon: "📱", color: "from-orange-400 to-red-500" },
    {
      name: "API Integration",
      icon: "🔌",
      color: "from-amber-400 to-orange-500",
    },
    {
      name: "Creative Frontend",
      icon: "🎨",
      color: "from-pink-400 to-rose-500",
    },
    {
      name: "AI Integration",
      icon: "🤖",
      color: "from-purple-400 to-pink-500",
    },
    { name: "Performance", icon: "⚡", color: "from-yellow-400 to-amber-500" },
    { name: "SEO", icon: "🔥", color: "from-red-400 to-orange-500" },
    { name: "Motion Design", icon: "🎯", color: "from-cyan-400 to-blue-500" },
    { name: "eCommerce", icon: "🛒", color: "from-green-400 to-emerald-500" },
    { name: "Full Stack", icon: "🛠", color: "from-gray-400 to-gray-600" },
    { name: "Webflow", icon: "🌊", color: "from-blue-400 to-indigo-500" },
    { name: "Figma", icon: "🎨", color: "from-purple-400 to-pink-500" },
    {
      name: "Headless CMS",
      icon: "🧠",
      color: "from-purple-400 to-indigo-500",
    },
    { name: "No Code", icon: "🧩", color: "from-indigo-400 to-blue-500" },
    { name: "Web Apps", icon: "📱", color: "from-orange-400 to-red-500" },
    {
      name: "API Integration",
      icon: "🔌",
      color: "from-amber-400 to-orange-500",
    },
    {
      name: "Creative Frontend",
      icon: "🎨",
      color: "from-pink-400 to-rose-500",
    },
    {
      name: "AI Integration",
      icon: "🤖",
      color: "from-purple-400 to-pink-500",
    },
    { name: "Performance", icon: "⚡", color: "from-yellow-400 to-amber-500" },
    { name: "SEO", icon: "🔥", color: "from-red-400 to-orange-500" },
    { name: "Motion Design", icon: "🎯", color: "from-cyan-400 to-blue-500" },
    { name: "eCommerce", icon: "🛒", color: "from-green-400 to-emerald-500" },
    { name: "Full Stack", icon: "🛠", color: "from-gray-400 to-gray-600" },
    { name: "Webflow", icon: "🌊", color: "from-blue-400 to-indigo-500" },
    { name: "Figma", icon: "🎨", color: "from-purple-400 to-pink-500" },
  ];

  const data = activeTab === "tech" ? techStacks : moreSkills;

  const cleanupPhysics = () => {
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
    }
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
    }
    bodiesRef.current = [];
    physicsInitialized.current = false;
  };

  const initPhysics = () => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    cleanupPhysics();

    const engine = Matter.Engine.create();
    engineRef.current = engine;

    engine.gravity.y = 0.8;
    engine.gravity.scale = 0.001;

    const world = engine.world;

    const floor = Matter.Bodies.rectangle(
      width / 2,
      height - 30,
      width - 40,
      20,
      {
        isStatic: true,
        restitution: 0.2,
        friction: 0.8,
        render: { fillStyle: "transparent" },
      },
    );

    const leftWall = Matter.Bodies.rectangle(10, height / 2, 20, height - 60, {
      isStatic: true,
      restitution: 0.3,
      friction: 0.5,
      render: { fillStyle: "transparent" },
    });

    const rightWall = Matter.Bodies.rectangle(
      width - 10,
      height / 2,
      20,
      height - 60,
      {
        isStatic: true,
        restitution: 0.3,
        friction: 0.5,
        render: { fillStyle: "transparent" },
      },
    );

    const ceiling = Matter.Bodies.rectangle(width / 2, 100, width - 40, 20, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "transparent" },
    });

    Matter.World.add(world, [floor, leftWall, rightWall, ceiling]);

    const bodies = [];
    const pills = pillsRef.current.filter(Boolean);

    pills.forEach((pill, i) => {
      if (!pill) return;

      const pillWidth = pill.offsetWidth || 100;
      const pillHeight = pill.offsetHeight || 40;

      const body = Matter.Bodies.rectangle(
        width / 2 + (Math.random() - 0.5) * 40,
        -100 - i * 30,
        pillWidth - 4,
        pillHeight - 4,
        {
          restitution: 0.5,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.002,
          angle: (Math.random() - 0.5) * 0.3,
          render: {
            fillStyle: "transparent",
            strokeStyle: "transparent",
          },
        },
      );

      bodies.push(body);
      Matter.World.add(world, body);
    });

    bodiesRef.current = bodies;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    Matter.Events.on(engine, "afterUpdate", () => {
      bodies.forEach((body, i) => {
        const pill = pills[i];
        if (!pill || !body.position) return;

        pill.style.transform = `translate(${body.position.x - pill.offsetWidth / 2}px, ${body.position.y - pill.offsetHeight / 2}px) rotate(${body.angle}rad)`;
        pill.style.opacity = "1";
      });
    });

    physicsInitialized.current = true;
  };

  useEffect(() => {
    const pills = pillsRef.current.filter(Boolean);

    gsap.to(pills, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      onComplete: () => {
        cleanupPhysics();
        setTimeout(() => {
          initPhysics();
        }, 100);
      },
    });

    return cleanupPhysics;
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (physicsInitialized.current) {
        cleanupPhysics();
        initPhysics();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Floating Glow Orbs */}
<div className="absolute inset-0 overflow-hidden">

  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-800" />

  <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[120px] animate-pulse" />

  <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-cyan-400/30 rounded-full blur-[120px] animate-pulse" />


  <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/70 to-transparent" />

</div>

      {/* Header */}
      <div className="relative z-20 flex flex-col items-center pt-12 sm:pt-16 md:pt-20 px-4 sm:px-6">
        {/* Tabs */}
        <div className="flex gap-6 sm:gap-8 md:gap-12 text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] uppercase">
          <button
            onClick={() => setActiveTab("tech")}
            className={`relative pb-1 sm:pb-2 transition-colors duration-300 whitespace-nowrap ${
              activeTab === "tech"
                ? "text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            TECH STACKS
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 ${
                activeTab === "tech" ? "w-full" : "w-0"
              }`}
            />
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`relative pb-1 sm:pb-2 transition-colors duration-300 whitespace-nowrap ${
              activeTab === "skills"
                ? "text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            MORE SKILLS
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500 ${
                activeTab === "skills" ? "w-full" : "w-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Physics Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 top-12 sm:top-16 md:top-20 bottom-0 left-0 right-0 overflow-hidden"
      >
        {/* Pills */}
        {data.map((item, i) => (
          <div
            key={`${activeTab}-${item.name}-${i}`}
            ref={(el) => (pillsRef.current[i] = el)}
            className={`absolute px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm lg:text-base bg-gradient-to-br ${item.color} text-white font-medium shadow-lg shadow-black/30 border border-white/20 backdrop-blur-sm flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap cursor-grab active:cursor-grabbing select-none opacity-0 z-10`}
            style={{
              willChange: "transform",
              left: 0,
              top: 0,
              pointerEvents: "auto",
              transform: "translate(0px, 0px)",
              transition: "box-shadow 0.2s ease",
            }}
          >
            <span className="text-sm sm:text-base md:text-lg">{item.icon}</span>
            <span className="truncate max-w-[70px] sm:max-w-[100px] md:max-w-none">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
