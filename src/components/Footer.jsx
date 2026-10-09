"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useActiveTabs from "@/hooks/useActiveTabs";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const linesRef = useRef([]);
  const titleRef = useRef(null);
  const ctaRef = useRef(null);
  const statusRef = useRef(null);
  const signatureRef = useRef(null);
  const gridRef = useRef(null);

  const [showConnect, setShowConnect] = useState(false);
  const activeTabs = useActiveTabs();

  const addLineRef = (el) => {
    if (el && !linesRef.current.includes(el)) {
      linesRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = linesRef.current;

      gsap.set(lines, {
        opacity: 0,
        x: -12,
      });

      gsap.set(titleRef.current, {
        opacity: 0,
        y: 25,
        filter: "blur(8px)",
      });

      gsap.set(ctaRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.96,
      });

      gsap.set(statusRef.current, {
        opacity: 0,
        y: 15,
      });

      gsap.set(signatureRef.current, {
        opacity: 0,
        y: 10,
      });

      gsap.set(gridRef.current, {
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(
        gridRef.current,
        {
          opacity: 0.5,
          duration: 1.2,
          ease: "power2.out",
        },
        0
      )
        .to(
          lines,
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.2
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          "-=0.35"
        )
        .to(
          statusRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.25"
        )
        .to(
          signatureRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.2"
        );

      /*
       * ==========================================================
       * CONNECT BUTTON HEARTBEAT
       * ==========================================================
       */

      const connectButton = ctaRef.current?.querySelector(".connect-button");

      if (connectButton) {
        gsap.to(connectButton, {
          scale: 1.045,
          duration: 0.8,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1,
        });

        gsap.to(connectButton.querySelector(".button-pulse"), {
          opacity: 0.35,
          scale: 1.18,
          duration: 1.2,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1,
        });
      }

      /*
       * ==========================================================
       * CONNECT BUTTON HOVER
       * ==========================================================
       */

      const handleMouseEnter = () => {
        gsap.to(ctaRef.current, {
          y: -5,
          duration: 0.35,
          ease: "power2.out",
        });

        gsap.to(ctaRef.current.querySelector(".cta-arrow"), {
          x: 5,
          y: -5,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(ctaRef.current.querySelector(".cta-glow"), {
          opacity: 1,
          scale: 1.15,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(ctaRef.current, {
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        });

        gsap.to(ctaRef.current.querySelector(".cta-arrow"), {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(ctaRef.current.querySelector(".cta-glow"), {
          opacity: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const cta = ctaRef.current;

      if (cta) {
        cta.addEventListener("mouseenter", handleMouseEnter);
        cta.addEventListener("mouseleave", handleMouseLeave);
      }

      return () => {
        if (cta) {
          cta.removeEventListener("mouseenter", handleMouseEnter);
          cta.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    }, footerRef);

    return () => ctx.revert();
  }, []);

  /*
   * ============================================================
   * ESCAPE KEY
   * ============================================================
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowConnect(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * ============================================================
   * LOCK BODY SCROLL WHEN CONNECTION PANEL IS OPEN
   * ============================================================
   */

  useEffect(() => {
    if (showConnect) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showConnect]);

  return (
    <>
      <footer
        ref={footerRef}
        className="relative w-full overflow-hidden bg-black text-white"
      >
        {/* =========================================================
            BACKGROUND
        ========================================================== */}

        <div
          ref={gridRef}
          className="pointer-events-none absolute inset-0 opacity-0"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            }}
          />

          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-[140px]" />

          <div className="absolute bottom-0 right-[-100px] h-[400px] w-[400px] rounded-full bg-purple-600/[0.05] blur-[120px]" />

          <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        </div>

        {/* =========================================================
            MAIN CONTAINER
        ========================================================== */}

        <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-20 sm:px-8 sm:pb-10 sm:pt-24 lg:px-12 lg:pt-32">
          {/* TOP STATUS BAR */}

          <div className="mb-14 flex items-center justify-between border-b border-white/[0.08] pb-5 sm:mb-20">
            <div
              ref={addLineRef}
              className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-red-800 sm:text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-700" />
              </span>

              SIGNING OFF
            </div>

            <div
              ref={addLineRef}
              className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/30 sm:block"
            >
              BUILT IN CODE. DESIGNED WITH INTENT
            </div>
          </div>

          {/* HERO MESSAGE */}

          <div className="grid gap-16 lg:grid-cols-[1fr_340px] lg:gap-24">
            <div ref={titleRef}>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/70 sm:text-sm">
                SESSION
              </p>

              <h2 className="max-w-4xl text-[18vw] font-semibold leading-[0.78] tracking-[-0.07em] text-white sm:text-[13vw] lg:text-[10vw]">
                COMPLETE
                <span className="text-cyan-400">.</span>
              </h2>

              <p className="mt-8 max-w-xl text-sm leading-7 text-white/50 sm:mt-10 sm:text-base">
                Thanks for exploring my work.
                <br />
                All processes completed successfully.
              </p>

              <div className="mt-10 flex items-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-cyan-400/60 to-transparent" />


              </div>
            </div>

            {/* USER PROFILE */}

            <div className="lg:pt-4">
              <div
                ref={addLineRef}
                className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/70"
              >
                <span className="h-px w-6 bg-cyan-300/40" />
                USER_PROFILE
              </div>

              <div className="relative space-y-6 border-l border-cyan-400/20 pl-6 font-mono text-xs">
                <span className="absolute -left-px top-0 h-full w-px bg-gradient-to-b from-cyan-400/60 via-cyan-400/10 to-transparent" />

                <div ref={addLineRef}>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/25">
                    USER
                  </p>
                  <p className="text-white/80">ILHAN_HELAL</p>
                </div>

                <div ref={addLineRef}>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/25">
                    ROLE
                  </p>
                  <p className="text-white/80">FRONTEND_DEVELOPER</p>
                </div>

                <div ref={addLineRef}>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/25">
                    FOCUS
                  </p>
                  <p className="text-white/80">
                    CREATIVE_WEB_EXPERIENCES
                  </p>
                </div>

                <div ref={addLineRef}>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/25">
                    STATUS
                  </p>

                  <p className="flex items-center gap-2 text-cyan-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                    OPEN_TO_OPPORTUNITIES
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              PRIMARY CTA
          ========================================================== */}

          <div
            ref={ctaRef}
            className="relative mt-28 border-y border-white/[0.08] py-16 sm:mt-36 sm:py-24"
          >
            <span className="absolute -top-px left-0 h-3 w-3 border-l-2 border-t-2 border-cyan-400/60" />
            <span className="absolute -top-px right-0 h-3 w-3 border-r-2 border-t-2 border-cyan-400/60" />
            <span className="absolute -bottom-px left-0 h-3 w-3 border-b-2 border-l-2 border-cyan-400/60" />
            <span className="absolute -bottom-px right-0 h-3 w-3 border-b-2 border-r-2 border-cyan-400/60" />

            <div className="cta-glow pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 scale-100 rounded-full bg-cyan-400/15 opacity-0 blur-[90px]" />

            <div className="relative flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end">
              <div>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/70 sm:text-xs">
                   CONNECTION_STILL_AVAILABLE
                </p>

                <h3 className="max-w-3xl text-5xl font-medium tracking-[-0.045em] text-white sm:text-6xl md:text-7xl">
                  Let&apos;s build
                  <br />
                  something<span className="text-cyan-400">.</span>
                </h3>
              </div>

              {/* =====================================================
                  CONNECT BUTTON
              ====================================================== */}

              <button
                type="button"
                onClick={() => setShowConnect(true)}
                className="connect-button group relative flex shrink-0 items-center gap-4 border border-cyan-400/50 bg-cyan-400/[0.07] px-7 py-5 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300 transition-colors duration-300 hover:border-cyan-300/90 hover:bg-cyan-400/[0.14] hover:shadow-[0_0_45px_-8px_rgba(34,211,238,0.55)] sm:px-8 sm:py-6"
              >
                {/* Heartbeat glow */}
                <span className="button-pulse pointer-events-none absolute inset-0 -z-10 border border-cyan-400/40 opacity-0" />

                <span>Connect</span>

                <span className="cta-arrow inline-block text-lg transition-transform">
                  ↗
                </span>

                {/* Corner decorations */}
                <span className="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-cyan-300" />
                <span className="absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-cyan-300" />
                <span className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-cyan-300" />
                <span className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-cyan-300" />
              </button>
            </div>

            <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
              
              connection request ready
              <span className="ml-2 inline-block h-3 w-1.5 animate-pulse bg-green-400/60 align-middle" />
            </div>
          </div>

          {/* =========================================================
              LINK GRID
          ========================================================== */}

          <div className="grid gap-14 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-[1fr_1fr_1fr] lg:gap-16">
            {/* SOCIALS */}

            <div>
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
                EXTERNAL_CONNECTIONS
              </p>

              <div className="space-y-1">
                {[
                  {
                    num: "01",
                    label: "GitHub",
                    href: "https://github.com/ilhan-helal",
                  },
                  {
                    num: "02",
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/in/ilhan-helal30/",
                  },
                  {
                    num: "03",
                    label: "Email",
                    href: "mailto:ilhanhelal30@gmail.com",
                  },
                ].map((item) => (
                  <a
                    key={item.num}
                    href={item.href}
                    target={
                      item.href.startsWith("mailto")
                        ? undefined
                        : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-white/[0.06] py-3 font-mono text-xs uppercase tracking-[0.15em] text-white/60 transition-all duration-300 hover:border-cyan-400/40 hover:pl-2 hover:text-cyan-300"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-white/20 transition-colors group-hover:text-cyan-400/60">
                        {item.num}
                      </span>

                      {item.label}
                    </span>

                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>

{/* NAVIGATION */}
<div>
  <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
    NAVIGATION
  </p>

  <div className="space-y-1">
    {[
      { label: "About", id: "about", type: "section" },
      { label: "Projects", id: "feature", type: "section" },
      { label: "Contact", id: "contact", type: "page" },
    ].map((item) => (
      <button
        key={item.id}
        onClick={() => {
          if (item.type === "page") {
            window.location.href = "/contact";
            return;
          }

          document.getElementById(item.id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        className="group flex w-full items-center justify-between border-b border-white/[0.06] py-3 font-mono text-xs uppercase tracking-[0.15em] text-white/60 transition-all duration-300 hover:border-cyan-400/40 hover:pl-2 hover:text-cyan-300"
      >
        <span>{item.label}</span>

        <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          ↗
        </span>
      </button>
    ))}
  </div>
</div>

            {/* SYSTEM CONTROL */}

            <div className="sm:col-span-2 lg:col-span-1">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
                SYSTEM_CONTROL
              </p>

              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                className="group relative flex w-full items-center justify-between border border-white/[0.1] bg-white/[0.02] px-5 py-4 font-mono text-xs uppercase tracking-[0.15em] text-white/60 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
              >
                <span>Back to top</span>

                <span className="text-lg transition-transform duration-300 group-hover:-translate-y-1">
                  ↑
                </span>
              </button>

            </div>
          </div>

          {/* SIGNATURE ROW */}

          <div
            ref={signatureRef}
            className="flex flex-col justify-between gap-8 border-t border-white/[0.08] pt-10 sm:flex-row sm:items-end"
          >
            
          {/* SYSTEM STATUS BAR */}

          <div
            ref={statusRef}
            className="flex flex-col gap-4 border-t border-white/[0.08] pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
  <span className="flex items-center gap-2 text-green-300/80">
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
    </span>

    {activeTabs === 1
      ? "1 VISITOR ONLINE"
      : `${activeTabs} VISITORS ONLINE`}
  </span>
</div>
          </div>

            <div className="text-right">
              <div
                className="font-serif text-3xl italic text-white/70"
                style={{
                  fontFamily: "cursive",
                }}
              >
                Ilhan Helal
              </div>

              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                web developer
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* ===========================================================
          CONNECTION SELECTOR
      ============================================================ */}

      {showConnect && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-5 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowConnect(false);
            }
          }}
        >
          <div
            className="relative w-full max-w-lg border border-cyan-400/30 bg-[#03090d] p-6 shadow-[0_0_80px_-20px_rgba(34,211,238,0.35)] sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a connection method"
          >
            {/* Panel corner accents */}

            <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-cyan-400" />
            <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-cyan-400" />
            <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-cyan-400" />
            <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-cyan-400" />

            {/* Header */}

            <div className="mb-8 flex items-start justify-between gap-5">
              <div>


                <h4 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                  Where would you like
                  <br />
                  to connect?
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowConnect(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 font-mono text-sm text-white transition-all duration-300 hover:border-cyan-400/40 hover:text-cyan-300"
                aria-label="Close connection selector"
              >
                ×
              </button>
            </div>

            {/* System prompt */}



            {/* OPTIONS */}

            <div className="space-y-3">
              {/* LINKEDIN */}

              <a
                href="https://www.linkedin.com/in/ilhan-helal30/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowConnect(false)}
                className="group relative flex items-center justify-between border border-white/[0.08] bg-white/[0.015] p-5 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/[0.05] hover:pl-6"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-white/20 transition-colors group-hover:text-cyan-400/70">
                    01
                  </span>

                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.12em] text-white/80 transition-colors group-hover:text-cyan-300">
                      LinkedIn
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Professional connection
                    </p>
                  </div>
                </div>

                <span className="text-lg text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300">
                  ↗
                </span>
              </a>

              {/* EMAIL */}

              <a
                href="mailto:ilhanhelal30@gmail.com"
                onClick={() => setShowConnect(false)}
                className="group relative flex items-center justify-between border border-white/[0.08] bg-white/[0.015] p-5 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/[0.05] hover:pl-6"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-white/20 transition-colors group-hover:text-cyan-400/70">
                    02
                  </span>

                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.12em] text-white/80 transition-colors group-hover:text-cyan-300">
                      Email
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Send me a message
                    </p>
                  </div>
                </div>

                <span className="text-lg text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300">
                  ↗
                </span>
              </a>
            </div>

            {/* Footer prompt */}

            <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                connection_request_ready
              </span>

              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/30">
                ESC / CLOSE
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}