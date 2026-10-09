"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import countries from "world-countries";
import { State, City } from "country-state-city";
import { geoCentroid } from "d3-geo";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Compass,
  Globe2,
  Handshake,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[340px] items-center justify-center text-cyan-300 sm:h-[480px]">
      <div className="flex flex-col items-center gap-4">
        <Globe2 className="h-10 w-10 animate-pulse" />
        <p className="text-xs tracking-[0.3em] text-white/50">
          INITIALIZING GLOBE
        </p>
      </div>
    </div>
  ),
});

const countryMetadata = new Map(
  countries
    .filter((country) => country.ccn3)
    .map((country) => [
      String(country.ccn3).padStart(3, "0"),
      {
        name: country.name.common,
        iso2: country.cca2,
        iso3: country.cca3,
      },
    ]),
);

const countryFeatures = feature(world, world.objects.countries)
  .features.map((item) => {
    const id = String(item.id).padStart(3, "0");
    const country = countryMetadata.get(id);
    if (!country) return null;
    return {
      ...item,
      properties: {
        ...item.properties,
        ...country,
      },
    };
  })
  .filter(Boolean);

const PURPOSES = [
  {
    id: "general",
    title: "General Message",
    description: "A question, feedback, or just saying hello.",
    icon: MessageCircle,
    number: "01",
  },
  {
    id: "job",
    title: "Job / Internship",
    description: "An opportunity to work together.",
    icon: BriefcaseBusiness,
    number: "02",
  },
  {
    id: "project",
    title: "Project Inquiry",
    description: "Have a website or product idea in mind?",
    icon: Code2,
    number: "03",
  },
  {
    id: "collaboration",
    title: "Collaboration",
    description: "Let's build or create something together.",
    icon: Handshake,
    number: "04",
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  message: "",
  role: "",
  projectType: "",
  budget: "",
  timeline: "",
};

const STEPS = [
  { number: "01", label: "COUNTRY" },
  { number: "02", label: "REGION" },
  { number: "03", label: "PURPOSE" },
  { number: "04", label: "DETAILS" },
];

export default function Contact() {
  const globeRef = useRef(null);
  const searchRef = useRef(null);

  const [step, setStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);

  const [countrySearch, setCountrySearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");
  const [showCountryResults, setShowCountryResults] = useState(false);
  const [showRegionResults, setShowRegionResults] = useState(false);

  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);

  const [rotation, setRotation] = useState(true);
  const [globeSize, setGlobeSize] = useState({
    width: 600,
    height: 500,
  });

  const regionPins = useMemo(() => {
    if (!selectedCountry || regions.length === 0) return [];
    return regions
      .map((region) => {
        const cities = City.getCitiesOfState(selectedCountry.iso2, region.code);
        if (!cities || cities.length === 0) return null;
        const lat = parseFloat(cities[0].latitude);
        const lng = parseFloat(cities[0].longitude);
        if (isNaN(lat) || isNaN(lng)) return null;
        return {
          name: region.name,
          code: region.code,
          lat,
          lng,
        };
      })
      .filter(Boolean);
  }, [selectedCountry, regions]);

  useEffect(() => {
    const updateSize = () => {
      setGlobeSize({
        width: Math.min(window.innerWidth - 32, 760),
        height: window.innerWidth < 640 ? 340 : 500,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = rotation;
      controls.autoRotateSpeed = 0.32;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 115;
      controls.maxDistance = 500;
    }
  }, [globeReady, rotation]);

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();
    if (!query) return [];
    return countryFeatures
      .filter((country) =>
        country.properties.name.toLowerCase().includes(query),
      )
      .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
      .slice(0, 7);
  }, [countrySearch]);

  const filteredRegions = useMemo(() => {
    const query = regionSearch.trim().toLowerCase();
    if (!query) return regions.slice(0, 60);
    return regions
      .filter((region) => region.name.toLowerCase().includes(query))
      .slice(0, 60);
  }, [regions, regionSearch]);

  const stopRotation = useCallback(() => {
    setRotation(false);
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = false;
    }
  }, []);

  const selectCountry = useCallback(
    (countryFeature) => {
      if (!countryFeature?.properties) return;
      stopRotation();

      const country = countryFeature.properties;
      setSelectedCountry(country);
      setSelectedRegion(null);
      setSelectedPurpose(null);
      setCountrySearch(country.name);
      setRegionSearch("");
      setShowCountryResults(false);
      setShowRegionResults(false);

      const countryRegions = State.getStatesOfCountry(country.iso2).map(
        (region) => ({
          name: region.name,
          code: region.isoCode,
        }),
      );
      setRegions(countryRegions);

      const [longitude, latitude] = geoCentroid(countryFeature);
      globeRef.current?.pointOfView(
        {
          lat: latitude,
          lng: longitude,
          altitude: 0.9,
        },
        1400,
      );

      window.setTimeout(() => setStep(1), 900);
    },
    [stopRotation],
  );

  const selectRegion = useCallback(
    (region) => {
      if (!region) return;
      stopRotation();
      setSelectedRegion(region);
      setRegionSearch(region.name);
      setShowRegionResults(false);

      if (selectedCountry) {
        const cities = City.getCitiesOfState(selectedCountry.iso2, region.code);
        if (cities && cities.length > 0) {
          const lat = parseFloat(cities[0].latitude);
          const lng = parseFloat(cities[0].longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            globeRef.current?.pointOfView({ lat, lng, altitude: 0.45 }, 1200);
          }
        }
      }

      window.setTimeout(() => setStep(2), 750);
    },
    [stopRotation, selectedCountry],
  );

  const selectPurpose = (purpose) => {
    setSelectedPurpose(purpose);
    window.setTimeout(() => setStep(3), 400);
  };

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setStep(4);
    }, 1500);
  };

  const resetExperience = () => {
    setStep(0);
    setSelectedCountry(null);
    setSelectedRegion(null);
    setSelectedPurpose(null);
    setCountrySearch("");
    setRegionSearch("");
    setShowCountryResults(false);
    setShowRegionResults(false);
    setRegions([]);
    setForm(INITIAL_FORM);
    setIsSubmitting(false);
    setIsSuccess(false);
    setRotation(true);

    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 900);
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = true;
    }
  };

  const goBack = () => {
    if (step === 1) {
      setStep(0);
      setSelectedCountry(null);
      setSelectedRegion(null);
      setRegionSearch("");
      setRegions([]);
      setRotation(true);
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 900);
        const controls = globeRef.current.controls();
        if (controls) controls.autoRotate = true;
      }
    } else if (step === 2) {
      setStep(1);
      setSelectedPurpose(null);
      if (selectedCountry) {
        const countryFeature = countryFeatures.find(
          (item) => item.properties.iso3 === selectedCountry.iso3,
        );
        if (countryFeature) {
          const [lng, lat] = geoCentroid(countryFeature);
          globeRef.current?.pointOfView({ lat, lng, altitude: 0.9 }, 1000);
        }
      }
    } else if (step === 3) {
      setStep(2);
    }
  };

  const activePurpose = PURPOSES.find(
    (purpose) => purpose.id === selectedPurpose,
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050608] text-white selection:bg-cyan-300 selection:text-black">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-240px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-[140px]" />
        <div className="absolute bottom-[-220px] right-[-120px] h-[420px] w-[420px] rounded-full bg-blue-600/[0.08] blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-8 lg:px-14">
        {/* Top nav */}
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <a
            href="/"
            className="group flex items-center gap-3"
            aria-label="Back to home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-200 transition group-hover:border-cyan-200/60">
              <Code2 size={19} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">ILHAN HELAL</p>
              <p className="mt-0.5 text-[9px] tracking-[0.25em] text-white/40">
                WEB DEVELOPER
              </p>
            </div>
          </a>

          <div className="flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.04] px-3 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
          </div>
        </header>

        {/* Intro */}
        <section className="mx-auto mb-8 mt-12 max-w-3xl text-center sm:mb-12 sm:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2"
          >
            <Sparkles size={13} className="text-cyan-200" />
            <span className="text-[10px] tracking-[0.22em] text-white/60">
              A DIFFERENT WAY TO CONNECT
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl font-medium tracking-[-0.055em] sm:text-6xl md:text-7xl"
          >
            Let&apos;s start a{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              conversation.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base"
          >
            Choose your place in the world, tell me what brings you here, and
            explore this interactive contact experience.
          </motion.p>
        </section>

        {/* Progress tracker */}
        {step < 4 && (
          <div className="mx-auto mb-8 flex max-w-2xl items-center justify-center sm:mb-12">
            {STEPS.map((item, index) => {
              const active = step === index;
              const complete = step > index;
              return (
                <div key={item.number} className="flex flex-1 items-center">
                  <div className="flex min-w-0 flex-col items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-[10px] transition-all duration-300 sm:h-10 sm:w-10 ${
                        active
                          ? "border-cyan-200 bg-cyan-200 text-black shadow-[0_0_25px_rgba(103,232,249,0.2)]"
                          : complete
                            ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-200"
                            : "border-white/10 bg-white/[0.02] text-white/35"
                      }`}
                    >
                      {complete ? <Check size={14} /> : item.number}
                    </div>
                    <span
                      className={`text-[8px] tracking-[0.13em] sm:text-[9px] ${
                        active || complete ? "text-cyan-100" : "text-white/30"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`mx-2 mb-5 h-px flex-1 sm:mx-4 ${
                        complete ? "bg-cyan-300/50" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Main experience */}
        <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(350px,0.85fr)] lg:gap-8">
          {/* Globe panel */}
          <section className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#090c10]/90 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <Globe2 size={15} className="text-cyan-200" />
                <span className="text-[10px] tracking-[0.2em] text-white/70">
                  {selectedCountry
                    ? `${selectedCountry.name.toUpperCase()} FOCUS`
                    : "GLOBAL CONNECTION"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setRotation((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/50 transition hover:border-cyan-200/40 hover:text-cyan-100"
              >
                <RotateCcw
                  size={11}
                  className={rotation ? "animate-spin" : ""}
                  style={{ animationDuration: "8s" }}
                />
                {rotation ? "AUTO ROTATE" : "PAUSED"}
              </button>
            </div>

            <div className="relative flex min-h-[340px] items-center justify-center sm:min-h-[500px]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/[0.06]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/[0.035]" />

              <Globe
                ref={globeRef}
                width={globeSize.width}
                height={globeSize.height}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                showAtmosphere
                atmosphereColor="#39d9ff"
                atmosphereAltitude={0.16}
                polygonsData={countryFeatures}
                polygonGeoJsonGeometry={(item) => item.geometry}
                polygonCapColor={(item) => {
                  if (selectedCountry?.iso3 === item.properties.iso3) {
                    return "rgba(34, 211, 238, 0.65)";
                  }
                  if (selectedCountry) {
                    return "rgba(26, 60, 80, 0.05)";
                  }
                  return "rgba(26, 120, 150, 0.12)";
                }}
                polygonSideColor={() => "rgba(34, 211, 238, 0.08)"}
                polygonStrokeColor={(item) => {
                  if (selectedCountry?.iso3 === item.properties.iso3) {
                    return "#a5f3fc";
                  }
                  if (selectedCountry) {
                    return "rgba(110, 220, 255, 0.12)";
                  }
                  return "rgba(110, 220, 255, 0.42)";
                }}
                polygonAltitude={(item) =>
                  selectedCountry?.iso3 === item.properties.iso3 ? 0.014 : 0.002
                }
                polygonLabel={(item) => `
                  <div style="
                    background:rgba(4,10,16,.92);
                    border:1px solid rgba(103,232,249,.35);
                    border-radius:8px;
                    padding:8px 12px;
                    color:#cffafe;
                    font-family:Arial,sans-serif;
                    font-size:12px;
                  ">
                    ${item.properties.name}
                  </div>
                `}
                onPolygonClick={selectCountry}
                pointsData={regionPins}
                pointLat="lat"
                pointLng="lng"
                pointColor={(point) =>
                  selectedRegion?.code === point.code ? "#67e8f9" : "#22d3ee"
                }
                pointAltitude={(point) =>
                  selectedRegion?.code === point.code ? 0.12 : 0.02
                }
                pointRadius={(point) =>
                  selectedRegion?.code === point.code ? 0.65 : 0.35
                }
                pointsMerge={false}
                pointLabel={(point) => `
                  <div style="
                    background:rgba(4,10,16,.92);
                    border:1px solid rgba(103,232,249,.5);
                    border-radius:6px;
                    padding:6px 10px;
                    color:#cffafe;
                    font-family:Arial,sans-serif;
                    font-size:11px;
                    white-space:nowrap;
                  ">
                    📍 ${point.name}
                  </div>
                `}
                onPointClick={(point) => {
                  const region = regions.find((r) => r.code === point.code);
                  if (region) selectRegion(region);
                }}
                onGlobeReady={() => {
                  setGlobeReady(true);
                  const controls = globeRef.current?.controls();
                  if (controls) {
                    controls.autoRotate = true;
                    controls.autoRotateSpeed = 0.32;
                    controls.enableDamping = true;
                    controls.dampingFactor = 0.08;
                  }
                }}
              />

              <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 text-[9px] tracking-[0.15em] text-white/35">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                {step === 0
                  ? "SELECT A COUNTRY"
                  : step === 1
                    ? "SELECT A REGION"
                    : selectedRegion?.name.toUpperCase() ||
                      selectedCountry?.name.toUpperCase() ||
                      "GLOBE VIEW"}
              </div>

              <div className="pointer-events-none absolute bottom-5 right-5 hidden items-center gap-2 text-[9px] tracking-[0.12em] text-white/30 sm:flex">
                <Compass size={12} />
                DRAG TO ROTATE
              </div>

              {selectedCountry && regionPins.length > 0 && step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pointer-events-none absolute right-5 top-5 flex items-center gap-2 rounded-full border border-cyan-200/20 bg-black/60 px-3 py-1.5 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                  <span className="text-[9px] tracking-[0.15em] text-cyan-100/80">
                    {regionPins.length} REGIONS MAPPED
                  </span>
                </motion.div>
              )}
            </div>

            <div className="border-t border-white/[0.07] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[9px] tracking-[0.2em] text-white/35">
                    CURRENT DESTINATION
                  </p>
                  <p className="mt-1 truncate text-sm text-white/85">
                    {selectedRegion?.name
                      ? `${selectedRegion.name}, ${selectedCountry?.name}`
                      : selectedCountry?.name || "Planet Earth"}
                  </p>
                </div>

                {(selectedCountry || step > 0) && (
                  <button
                    type="button"
                    onClick={resetExperience}
                    className="flex shrink-0 items-center gap-1.5 text-[10px] text-white/45 transition hover:text-cyan-100"
                  >
                    <RotateCcw size={12} />
                    RESET
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Interactive steps panel */}
          <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#090c10]/90">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="country"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 sm:p-7"
                >
                  <StepHeading
                    eyebrow="STEP 01 / LOCATION"
                    title="Where are you connecting from?"
                    description="Search for your country or select it directly on the rotating globe."
                  />

                  <div className="relative mt-7">
                    <Search
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                    />
                    <input
                      ref={searchRef}
                      type="text"
                      value={countrySearch}
                      onFocus={() => setShowCountryResults(true)}
                      onChange={(event) => {
                        setCountrySearch(event.target.value);
                        setShowCountryResults(true);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setShowCountryResults(false);
                        }
                        if (
                          event.key === "Enter" &&
                          filteredCountries.length > 0
                        ) {
                          event.preventDefault();
                          selectCountry(filteredCountries[0]);
                        }
                      }}
                      placeholder="Search country..."
                      autoComplete="off"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-200/40"
                    />

                    {countrySearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setCountrySearch("");
                          setShowCountryResults(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
                        aria-label="Clear country search"
                      >
                        <X size={14} />
                      </button>
                    )}

                    {showCountryResults && filteredCountries.length > 0 && (
                      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-white/10 bg-[#11151b] shadow-2xl">
                        {filteredCountries.map((country) => (
                          <button
                            type="button"
                            key={country.properties.iso3}
                            onClick={() => selectCountry(country)}
                            className="flex w-full items-center justify-between border-b border-white/[0.05] px-4 py-3.5 text-left text-sm transition last:border-0 hover:bg-cyan-200/[0.07]"
                          >
                            <span>{country.properties.name}</span>
                            <ArrowDownLeft
                              size={14}
                              className="text-cyan-200/60"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {showCountryResults &&
                      countrySearch.trim() &&
                      filteredCountries.length === 0 && (
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-xl border border-white/10 bg-[#11151b] px-4 py-4 text-sm text-white/50">
                          No matching country found.
                        </div>
                      )}
                  </div>

                  <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[9px] tracking-[0.18em] text-white/30">
                      OR EXPLORE THE GLOBE
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="rounded-xl border border-cyan-200/10 bg-cyan-200/[0.035] p-4">
                    <div className="flex gap-3">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-cyan-200"
                      />
                      <div>
                        <p className="text-sm text-white/80">
                          Pick your destination
                        </p>
                        <p className="mt-1 text-xs leading-5 text-white/40">
                          Drag the globe to explore. Click any country to
                          continue.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="region"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 sm:p-7"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="mb-6 flex items-center gap-2 text-xs text-white/45 transition hover:text-cyan-100"
                  >
                    <ArrowLeft size={14} />
                    CHANGE COUNTRY
                  </button>

                  <StepHeading
                    eyebrow="STEP 02 / REGION"
                    title="Narrow it down."
                    description={`Choose a state or region in ${selectedCountry?.name || "your selected country"}.`}
                  />

                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-cyan-200/15 bg-cyan-200/[0.045] p-3.5">
                    <Globe2 size={18} className="shrink-0 text-cyan-200" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white/90">
                        {selectedCountry?.name}
                      </p>
                      <p className="mt-0.5 text-[10px] tracking-[0.1em] text-white/40">
                        {regions.length} REGIONS AVAILABLE
                      </p>
                    </div>
                    <Check size={15} className="ml-auto text-cyan-200" />
                  </div>

                  <div className="relative mt-5">
                    <Search
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                    />
                    <input
                      value={regionSearch}
                      onFocus={() => setShowRegionResults(true)}
                      onChange={(event) => {
                        setRegionSearch(event.target.value);
                        setShowRegionResults(true);
                      }}
                      placeholder="Search state or region..."
                      autoComplete="off"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-white/30 focus:border-cyan-200/40"
                    />
                  </div>

                  <div className="mt-4 grid max-h-[360px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {filteredRegions.map((region) => (
                      <button
                        type="button"
                        key={`${region.code}-${region.name}`}
                        onClick={() => selectRegion(region)}
                        onMouseEnter={() => {
                          if (selectedCountry) {
                            const cities = City.getCitiesOfState(
                              selectedCountry.iso2,
                              region.code,
                            );
                            if (cities && cities.length > 0) {
                              const lat = parseFloat(cities[0].latitude);
                              const lng = parseFloat(cities[0].longitude);
                              if (!isNaN(lat) && !isNaN(lng)) {
                                globeRef.current?.pointOfView(
                                  { lat, lng, altitude: 0.6 },
                                  800,
                                );
                              }
                            }
                          }
                        }}
                        className="group flex min-h-[56px] items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-left transition hover:border-cyan-200/35 hover:bg-cyan-200/[0.05]"
                      >
                        <MapPin
                          size={14}
                          className="shrink-0 text-white/35 transition group-hover:text-cyan-200"
                        />
                        <span className="min-w-0 flex-1 text-xs leading-5 text-white/75 group-hover:text-white">
                          {region.name}
                        </span>
                        <ArrowRight
                          size={13}
                          className="shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-cyan-200"
                        />
                      </button>
                    ))}
                  </div>

                  {regions.length === 0 && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-sm text-white/70">
                        No state or region list is available for this country.
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/40">
                        You can continue by choosing the country itself.
                      </p>
                    </div>
                  )}

                  {regions.length > 0 && filteredRegions.length === 0 && (
                    <p className="mt-4 text-sm text-white/45">
                      No matching regions found. Try another search.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      selectRegion({
                        name: selectedCountry?.name || "Not specified",
                        code: "",
                      })
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3.5 text-xs text-white/60 transition hover:border-cyan-200/30 hover:text-cyan-100"
                  >
                    Skip region selection
                    <ArrowRight size={14} />
                  </button>

                  <p className="mt-4 text-[10px] leading-5 text-white/30">
                    Hover a region to preview its location on the globe. Click
                    to confirm.
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="purpose"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 sm:p-7"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="mb-6 flex items-center gap-2 text-xs text-white/45 transition hover:text-cyan-100"
                  >
                    <ArrowLeft size={14} />
                    GO BACK
                  </button>

                  <StepHeading
                    eyebrow="STEP 03 / INTENTION"
                    title="What brings you here?"
                    description="Choose the option that best matches your reason for reaching out."
                  />

                  <div className="mt-7 space-y-3">
                    {PURPOSES.map((purpose) => {
                      const Icon = purpose.icon;
                      const active = selectedPurpose === purpose.id;
                      return (
                        <button
                          type="button"
                          key={purpose.id}
                          onClick={() => selectPurpose(purpose.id)}
                          className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                            active
                              ? "border-cyan-200/50 bg-cyan-200/[0.08]"
                              : "border-white/[0.08] bg-white/[0.02] hover:border-cyan-200/25 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                              active
                                ? "border-cyan-200/30 bg-cyan-200/10 text-cyan-100"
                                : "border-white/10 bg-white/[0.035] text-white/55 group-hover:text-cyan-100"
                            }`}
                          >
                            <Icon size={19} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">
                                {purpose.title}
                              </p>
                              <span className="text-[9px] text-white/25">
                                {purpose.number}
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-5 text-white/40">
                              {purpose.description}
                            </p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="shrink-0 text-white/25 transition group-hover:translate-x-1 group-hover:text-cyan-200"
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                    <Sparkles
                      size={14}
                      className="mt-0.5 shrink-0 text-cyan-200/70"
                    />
                    <p className="text-[11px] leading-5 text-white/40">
                      Your selection helps me prepare the right response.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 sm:p-7"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="mb-6 flex items-center gap-2 text-xs text-white/45 transition hover:text-cyan-100"
                  >
                    <ArrowLeft size={14} />
                    CHANGE PURPOSE
                  </button>

                  <StepHeading
                    eyebrow="STEP 04 / YOUR DETAILS"
                    title="Let's make it personal."
                    description="Fill out the form below and I'll be in touch."
                  />

                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-cyan-200/15 bg-cyan-200/[0.045] p-3.5">
                    {activePurpose &&
                      (() => {
                        const Icon = activePurpose.icon;
                        return (
                          <Icon size={18} className="shrink-0 text-cyan-200" />
                        );
                      })()}
                    <div className="min-w-0">
                      <p className="text-xs text-white/85">
                        {activePurpose?.title}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-white/40">
                        {[selectedRegion?.name, selectedCountry?.name]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="ml-auto text-[10px] text-cyan-100/70 hover:text-cyan-100"
                    >
                      EDIT
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField label="YOUR NAME" required>
                        <input
                          required
                          maxLength={80}
                          value={form.name}
                          onChange={(event) =>
                            updateForm("name", event.target.value)
                          }
                          placeholder="Enter your name"
                          className={inputClass}
                        />
                      </FormField>

                      <FormField label="EMAIL ADDRESS" required>
                        <input
                          required
                          type="email"
                          maxLength={120}
                          value={form.email}
                          onChange={(event) =>
                            updateForm("email", event.target.value)
                          }
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </FormField>
                    </div>

                    {selectedPurpose === "job" && (
                      <FormField label="ROLE / OPPORTUNITY" required>
                        <input
                          required
                          maxLength={100}
                          value={form.role}
                          onChange={(event) =>
                            updateForm("role", event.target.value)
                          }
                          placeholder="e.g. Frontend Developer Intern"
                          className={inputClass}
                        />
                      </FormField>
                    )}

                    {selectedPurpose === "project" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="PROJECT TYPE" required>
                          <select
                            required
                            value={form.projectType}
                            onChange={(event) =>
                              updateForm("projectType", event.target.value)
                            }
                            className={inputClass}
                          >
                            <option value="">Select type</option>
                            <option value="Portfolio Website">
                              Portfolio Website
                            </option>
                            <option value="Business Website">
                              Business Website
                            </option>
                            <option value="Web Application">
                              Web Application
                            </option>
                            <option value="Landing Page">Landing Page</option>
                            <option value="Other">Other</option>
                          </select>
                        </FormField>

                        <FormField label="ESTIMATED BUDGET">
                          <select
                            value={form.budget}
                            onChange={(event) =>
                              updateForm("budget", event.target.value)
                            }
                            className={inputClass}
                          >
                            <option value="">Choose range</option>
                            <option value="Under ₹10,000">Under ₹10,000</option>
                            <option value="₹10,000–₹25,000">
                              ₹10,000–₹25,000
                            </option>
                            <option value="₹25,000–₹50,000">
                              ₹25,000–₹50,000
                            </option>
                            <option value="₹50,000+">₹50,000+</option>
                            <option value="To be discussed">
                              To be discussed
                            </option>
                          </select>
                        </FormField>
                      </div>
                    )}

                    {selectedPurpose === "collaboration" && (
                      <FormField label="COLLABORATION TYPE">
                        <select
                          value={form.projectType}
                          onChange={(event) =>
                            updateForm("projectType", event.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">Choose an option</option>
                          <option value="Open Source">Open Source</option>
                          <option value="Creative Project">
                            Creative Project
                          </option>
                          <option value="Startup Idea">Startup Idea</option>
                          <option value="Content / Community">
                            Content / Community
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </FormField>
                    )}

                    {selectedPurpose === "project" && (
                      <FormField label="PREFERRED TIMELINE">
                        <select
                          value={form.timeline}
                          onChange={(event) =>
                            updateForm("timeline", event.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">Choose a timeline</option>
                          <option value="ASAP">As soon as possible</option>
                          <option value="Within a month">Within a month</option>
                          <option value="Within 2–3 months">
                            Within 2–3 months
                          </option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </FormField>
                    )}

                    <FormField
                      label={
                        selectedPurpose === "general"
                          ? "YOUR MESSAGE"
                          : selectedPurpose === "job"
                            ? "A LITTLE ABOUT THE OPPORTUNITY"
                            : selectedPurpose === "project"
                              ? "PROJECT DETAILS"
                              : "YOUR IDEA"
                      }
                      required
                    >
                      <textarea
                        required
                        maxLength={1500}
                        rows={4}
                        value={form.message}
                        onChange={(event) =>
                          updateForm("message", event.target.value)
                        }
                        placeholder={
                          selectedPurpose === "general"
                            ? "Write your message here..."
                            : selectedPurpose === "job"
                              ? "Tell me a little about the role..."
                              : selectedPurpose === "project"
                                ? "Describe your idea or requirements..."
                                : "Tell me what you would like to create..."
                        }
                        className={`${inputClass} min-h-[120px] resize-y`}
                      />
                      <p className="mt-1.5 text-right text-[10px] text-white/30">
                        {form.message.length}/1500
                      </p>
                    </FormField>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-200 to-sky-300 px-5 py-4 text-sm font-semibold text-[#041016] transition hover:shadow-[0_0_35px_rgba(103,232,249,0.15)] disabled:cursor-wait disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/25 border-t-black" />
                          Sending message...
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Message
                          <ArrowRight
                            size={15}
                            className="transition group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 4 && isSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex min-h-[520px] flex-col items-center justify-center p-6 sm:p-9"
                >
                  {/* Header */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 12,
                      delay: 0.1,
                    }}
                    className="relative mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-200/[0.08] text-cyan-100"
                  >
                    <div className="absolute inset-[-10px] rounded-full border border-cyan-200/10" />
                    <Check size={32} />
                  </motion.div>

                  <p className="text-[10px] tracking-[0.3em] text-cyan-200/80">
                    CONNECTION ESTABLISHED
                  </p>

                  <h2 className="mt-4 text-center text-3xl font-medium tracking-tight sm:text-4xl">
                    Message <span className="text-cyan-200">received.</span>
                  </h2>

                  <p className="mt-5 max-w-md text-center text-sm leading-7 text-white/55">
                    Thank you for reaching out. Your message has been sent
                    successfully. I&apos;ll get back to you as soon as I can.
                  </p>

                  {/* Direct connection options */}
                  <div className="mt-10 w-full">
                    <p className="mb-4 text-center text-[10px] tracking-[0.25em] text-white/35">
                      PREFER A DIRECT CONNECTION?
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <a
                        href="https://www.linkedin.com/in/ilhan-helal30/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-cyan-200/40 hover:bg-cyan-200/[0.05]"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/70 transition group-hover:border-cyan-200/30 group-hover:text-cyan-200">
                          <Linkedin size={19} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white/90">
                            LinkedIn
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/40">
                            Connect professionally
                          </p>
                        </div>
                        <ArrowRight
                          size={15}
                          className="shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-cyan-200"
                        />
                      </a>

                      <a
                        href="mailto:ilhanhelal30@gmail.com"
                        className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-cyan-200/40 hover:bg-cyan-200/[0.05]"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/70 transition group-hover:border-cyan-200/30 group-hover:text-cyan-200">
                          <Mail size={19} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white/90">
                            Email
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-white/40">
                            ilhanhelal30@gmail.com
                          </p>
                        </div>
                        <ArrowRight
                          size={15}
                          className="shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-cyan-200"
                        />
                      </a>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[11px] leading-6 text-white/35">
                    You can close this page or return to the portfolio.
                  </p>
                  <a
  href="/"
  className="group mt-4 inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-cyan-100/60 transition-colors duration-300 hover:text-cyan-200"
>
  <span className="grid size-8 place-items-center rounded-full border border-cyan-200/20 transition-all duration-300 group-hover:border-cyan-200/70 group-hover:bg-cyan-200/10">
    <ArrowLeft
      size={14}
      className="transition-transform duration-300 group-hover:-translate-x-1"
    />
  </span>
  <span>Back to portfolio</span>
</a>

                  <button
                    type="button"
                    onClick={resetExperience}
                    className="group mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-xs text-white/55 transition hover:border-cyan-200/30 hover:text-cyan-100"
                  >
                    <RotateCcw
                      size={13}
                      className="opacity-0 -ml-6 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100"
                    />
                    <span className="tracking-[0.08em]">
                      Send another message
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Footer */}
        <footer className="relative mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-6 text-center sm:mt-16 sm:flex-row sm:text-left">

  <p className="text-[10px] tracking-[0.12em] text-white/30">
    © {new Date().getFullYear()}
  </p>

  <p className="text-[10px] tracking-[0.12em] text-white/30 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
    ILHAN HELAL
  </p>

  <p className="text-[10px] tracking-[0.12em] text-white/30">
    DESIGNED TO EXPLORE · BUILT TO INTERACT
  </p>

</footer>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1118] px-4 py-3.5 text-sm text-cyan-100 outline-none transition placeholder:text-white/30 focus:border-cyan-200/40 focus:bg-[#0b1118] [color-scheme:dark]";

function StepHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.23em] text-cyan-200/70">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em] sm:text-[28px]">
        {title}
      </h2>
      <p className="mt-3 text-xs leading-6 text-white/45 sm:text-sm">
        {description}
      </p>
    </div>
  );
}

function FormField({ label, required = false, children }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[9px] tracking-[0.15em] text-white/45">
        {label}
        {required && <span className="ml-1 text-cyan-200">*</span>}
      </span>
      {children}
    </label>
  );
}
