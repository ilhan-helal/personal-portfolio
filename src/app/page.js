"use client";

import { useState } from "react";
import IntroScreen from "@/components/IntroScreen";
import HomePage from "@/components/HomePage";

export default function Page() {
  const [showIntro, setShowIntro] = useState(true);

  return showIntro ? (
    <IntroScreen onFinish={() => setShowIntro(false)} />
  ) : (
    <HomePage />
  );
}
