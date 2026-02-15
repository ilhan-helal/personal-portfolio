"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import TechStack from "@/components/TechStack";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const paperRef = useRef(null);
  const textRef = useRef(null);
  const techRevealRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const isMobile = window.innerWidth < 768;

    const split = new SplitType(el, { types: "words" });

    const highlightWords = [
  "Ilhan",
  "Helal",
  "BCA",
  "Lovely",
  "Professional",
  "University",
  "frontend",
  "web",
  "optimizing",
  "React.js",
  "JavaScript",
  "REST",
  "API",
  "leadership",
  "problem-solving",
  "captain",
  "hackathon",
  "curiosity",
  "impactful",
  "functionality",
  "performance",
  "design",
  "excellence",
    ];

    split.words.forEach((word) => {
      if (highlightWords.includes(word.textContent.trim())) {
        word.classList.add("highlight-word");
      }
    });

    const highlighted = el.querySelectorAll(".highlight-word");

    const tl = gsap.timeline({
      scrollTrigger: {
  trigger: sectionRef.current,
  start: "top top",
  end: () => "+=" + window.innerHeight * 3,
  scrub: true,
  pin: true,
  invalidateOnRefresh: true,
},
    });

    /* ========================
       1️⃣ Highlight Glow
    ========================= */
    tl.to(highlighted, {
      color: "#00ffff",
      textShadow: "0 0 15px #00ffff, 0 0 30px #00ffff",
      duration: 1,
    });

    /* ========================
       2️⃣ Distortion (lighter on mobile)
    ========================= */
    tl.to(filterRef.current, {
      attr: { scale: isMobile ? 80 : 120 },
      duration: 1.5,
      ease: "power2.inOut",
    });

    /* ========================
       3️⃣ Crumple Motion (reduced for mobile)
    ========================= */
    tl.to(
      paperRef.current,
      {
        rotateX: isMobile ? 10 : 25,
        rotateY: isMobile ? -8 : -20,
        rotateZ: isMobile ? -3 : -8,
        scale: isMobile ? 0.75 : 0.6,
        duration: 1.8,
        ease: "power3.inOut",
      },
      "-=0.5"
    );

    /* ========================
       4️⃣ Collapse
    ========================= */
    tl.to(paperRef.current, {
      scale: 0.15,
      opacity: 0,
      duration: 1.2,
      ease: "power4.inOut",
    });

    /* ========================
       5️⃣ Reveal Tech Stack
    ========================= */
    tl.to(
  techRevealRef.current,
  {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    ease: "power3.out",
  },
  "-=0.6"
);

    return () => {
      split.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative bg-black flex items-center justify-center overflow-hidden"
      style={{
  perspective: "1000px",
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
      {/* SVG Distortion */}
      <svg width="0" height="0">
        <filter id="paper-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            ref={filterRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* TECH STACK */}
      <div
  ref={techRevealRef}
  className="absolute inset-0 flex items-center justify-center opacity-0 scale-95"
>
  <TechStack />
</div>

      {/* PAPER */}
      <div
        ref={paperRef}
        className="relative w-[95%] sm:w-[92%] md:w-[88%] lg:w-[85%] xl:w-[75%] mx-auto 
px-5 sm:px-8 md:px-12 lg:px-20 
py-8 sm:py-12 md:py-16 
rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
        style={{
          transformStyle: "preserve-3d",
          filter: "url(#paper-distortion)",
        }}
      >
        <div className="absolute -top-6 -left-3 text-6xl sm:text-8xl text-white/10 font-serif">
          "
        </div>

        <h2
          ref={textRef}
          className="text-sm sm:text-lg md:text-2xl lg:text-3xl leading-relaxed text-white/80 font-light"
        >
          I am Ilhan Helal, a BCA student at Lovely Professional University with a strong focus on frontend engineering and modern web development.
I build responsive, high-performance web applications using JavaScript and React.js, with a solid foundation in C, C++, HTML, and CSS. I specialize in component-based architecture, clean code practices, REST API integration, and creating seamless user experiences.
I approach development with a problem-solving mindset — optimizing performance, writing scalable code, and continuously learning emerging technologies.
Beyond coding, I bring leadership and collaboration experience as a former team captain and hackathon participant, thriving in fast-paced, team-driven environments.
Driven by curiosity and execution, I aim to build impactful digital products that combine functionality, performance, and design excellence.
        </h2>

        <div className="absolute -bottom-8 -right-3 text-6xl sm:text-8xl text-white/10 font-serif rotate-180">
          "
        </div>
      </div>
    </section>
  );
}
