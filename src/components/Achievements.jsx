"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Achievements() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const achievements = [
    {
      title: "Meta",
      desc: "Programming with JavaScript",
      icon: "💻",
      color: "from-blue-500 to-cyan-400",
      image: "/certificates/meta.png",
    },
    {
      title: "Free Code Camp",
      desc: "Responsive Web Design",
      icon: "🌐",
      color: "from-green-500 to-emerald-400",
      image: "/certificates/resweb.png",
    },
    {
      title: "Coursera",
      desc: "Software Testing and Maintenance Strategies",
      icon: "🔧",
      color: "from-purple-500 to-pink-400",
      image: "/certificates/st.png",
    },
    {
      title: "HackerRank",
      desc: "Advanced SQL",
      icon: "📊",
      color: "from-green-500 to-teal-400",
      image: "/certificates/sql.png",
    },
    {
      title: "Mind Luster",
      desc: "Communication Skills",
      icon: "🗣️",
      color: "from-orange-500 to-red-400",
      image: "/certificates/com.png",
    },
    {
      title: "IEEE",
      desc: "Digital Marketing",
      icon: "📱",
      color: "from-indigo-500 to-purple-400",
      image: "/certificates/dm.png",
    },
  ];

  /* ---------------- DESKTOP GSAP (UNCHANGED LOGIC) ---------------- */

  useEffect(() => {
    if (isMobile) return;

    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const cardWidth = 260;
    const cardHeight = 300;

    const gapX = 120;
    const gapY = 60;

    const leftX = -(cardWidth + gapX);
    const centerX = 0;
    const rightX = cardWidth + gapX;

    const topY = -(cardHeight / 2 + gapY);
    const bottomY = cardHeight / 2 + gapY;

    const positions = [
      { x: leftX, y: topY, rotation: -4 },
      { x: centerX, y: topY, rotation: 0 },
      { x: rightX, y: topY, rotation: 4 },

      { x: leftX, y: bottomY, rotation: -2 },
      { x: centerX, y: bottomY, rotation: 0 },
      { x: rightX, y: bottomY, rotation: 2 },
    ];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        once: true,
      },
    });

    tl.set(cards, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0,
      scale: 0.8,
      transformOrigin: "center center",
    });

    tl.to(cards, {
      opacity: 1,
      y: -10,
      stagger: 0.08,
      duration: 0.5,
      ease: "back.out(1.2)",
    });

    tl.to(cards, {
      x: (i) => positions[i]?.x || 0,
      y: (i) => positions[i]?.y || 0,
      rotation: (i) => positions[i]?.rotation || 0,
      scale: 1,
      duration: 1.2,
      stagger: {
        each: 0.1,
        from: "center",
      },
      ease: "elastic.out(1, 0.5)",
    });
  }, [isMobile]);

  /* ---------------- FLIP ---------------- */

  const flipCard = (el, index) => {
    const inner = el.querySelector(".card-inner");

    if (el.classList.contains("flipped")) {
      gsap.to(inner, { rotateY: 0, duration: 0.6 });
      el.classList.remove("flipped");
      setActiveCard(null);
    } else {
      gsap.to(inner, { rotateY: 180, duration: 0.6 });

      if (activeCard !== null && activeCard !== index) {
        const prev = cardsRef.current[activeCard];
        const prevInner = prev?.querySelector(".card-inner");
        if (prevInner) gsap.to(prevInner, { rotateY: 0 });
        prev?.classList.remove("flipped");
      }

      el.classList.add("flipped");
      setActiveCard(index);
    }
  };

  const topCards = achievements.slice(0, 3);
  const bottomCards = achievements.slice(3, 6);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-black py-20 overflow-hidden"
    >
      {/* HEADER */}
      <div className="absolute top-15 w-full text-center z-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-sm text-white/80 tracking-wider">
            ACHIEVEMENTS & CERTIFICATES
          </span>
        </div>
      </div>

      {/* ---------------- MOBILE ONLY ---------------- */}
      {isMobile && (
        <div className="mt-24 flex flex-col gap-10 px-4">
          {[topCards, bottomCards].map((group, idx) => (
            <div key={idx} className="flex gap-4 overflow-x-auto snap-x snap-mandatory">
              {group.map((item, i) => (
                <div
                  key={i}
                  className="min-w-[85%] snap-center h-[200px] perspective"
                  onClick={(e) => flipCard(e.currentTarget, i)}
                >
                  <Card item={item} showCTA />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ---------------- DESKTOP EXACT ---------------- */}
      {!isMobile && (
        <div className="relative w-full max-w-6xl h-[600px] flex items-center justify-center mt-20 mx-auto">
          {achievements.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: "-=8" })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: "+=8" })}
              onClick={(e) => flipCard(e.currentTarget, i)}
              className="absolute top-1/2 left-1/2 w-[280px] sm:w-[320px] h-[180px] sm:h-[220px] perspective cursor-pointer"
style={{ 
  zIndex: 10 - i,
  transform: "translate(-50%, -50%)"
}}
            >
              <Card item={item} showCTA />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* CARD */
function Card({ item, showCTA }) {
  return (
    <div className="card-inner w-full h-full relative">
      <div className="card-face card-front flex flex-col justify-between">
        <div>
          <span className="text-4xl mb-3 block">{item.icon}</span>
          <h3 className="text-xl font-black mb-2">
            <span className={`bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
              {item.title}
            </span>
          </h3>
          <p className="text-white/90 text-sm">{item.desc}</p>
        </div>

        {showCTA && (
          <div className="flex items-center justify-between">
            <span className="text-cyan-300/80 text-xs">
              Click to flip →
            </span>
            <svg
                    className="w-4 h-4 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
          </div>
        )}
      </div>

      <div className="card-face card-back flex items-center justify-center p-2">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}