// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function useActiveTabs() {
//   const [count, setCount] = useState(1);
//   const myIdRef = useRef(null);
//   const channelRef = useRef(null);
//   const peersRef = useRef(new Set());

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!("BroadcastChannel" in window)) {
//       setCount(1);
//       return;
//     }

//     const myId = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
//     myIdRef.current = myId;

//     const channel = new BroadcastChannel("portfolio-presence");
//     channelRef.current = channel;

//     const announce = () => {
//       channel.postMessage({ type: "HELLO", id: myId });
//     };

//     const updateCount = () => {
//       setCount(peersRef.current.size + 1);
//     };

//     channel.onmessage = (event) => {
//       const { type, id } = event.data || {};
//       if (!id || id === myId) return;

//       if (type === "HELLO") {
//         peersRef.current.add(id);
//         updateCount();
//         channel.postMessage({ type: "HI", id: myId });
//       }

//       if (type === "HI") {
//         peersRef.current.add(id);
//         updateCount();
//       }

//       if (type === "BYE") {
//         peersRef.current.delete(id);
//         updateCount();
//       }

//       if (type === "PING") {
//         peersRef.current.add(id);
//         updateCount();
//         channel.postMessage({ type: "HI", id: myId });
//       }
//     };

//     announce();

//     const pingInterval = setInterval(() => {
//       channel.postMessage({ type: "PING", id: myId });
//     }, 3000);

//     const handleUnload = () => {
//       channel.postMessage({ type: "BYE", id: myId });
//     };
//     window.addEventListener("beforeunload", handleUnload);
//     window.addEventListener("pagehide", handleUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleUnload);
//       window.removeEventListener("pagehide", handleUnload);
//       clearInterval(pingInterval);
//       channel.postMessage({ type: "BYE", id: myId });
//       channel.close();
//     };
//   }, []);

//   return count;
// }

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts real tabs of this site open in the SAME browser
 * (via BroadcastChannel), then adds a small random bonus
 * so the displayed number feels alive and natural.
 *
 * - 1 real tab  → shows 1 + random(0–2)  → 1, 2, or 3
 * - 2 real tabs → shows 2 + random(0–2)  → 2, 3, or 4
 * - 3 real tabs → shows 3 + random(0–2)  → 3, 4, or 5
 *
 * The bonus drifts slowly over time. Real count stays accurate.
 */
export default function useActiveTabs() {
  const [realCount, setRealCount] = useState(1);
  const [bonus, setBonus] = useState(0);
  const myIdRef = useRef(null);
  const channelRef = useRef(null);
  const peersRef = useRef(new Set());

  /* -------------------------------------------------------
     REAL TAB COUNT (BroadcastChannel)
  ------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("BroadcastChannel" in window)) {
      setRealCount(1);
      return;
    }

    const myId = `tab-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}`;
    myIdRef.current = myId;

    const channel = new BroadcastChannel("portfolio-presence");
    channelRef.current = channel;

    const announce = () => {
      channel.postMessage({ type: "HELLO", id: myId });
    };

    const updateCount = () => {
      setRealCount(peersRef.current.size + 1);
    };

    channel.onmessage = (event) => {
      const { type, id } = event.data || {};
      if (!id || id === myId) return;

      if (type === "HELLO") {
        peersRef.current.add(id);
        updateCount();
        channel.postMessage({ type: "HI", id: myId });
      }

      if (type === "HI") {
        peersRef.current.add(id);
        updateCount();
      }

      if (type === "BYE") {
        peersRef.current.delete(id);
        updateCount();
      }

      if (type === "PING") {
        peersRef.current.add(id);
        updateCount();
        channel.postMessage({ type: "HI", id: myId });
      }
    };

    announce();

    const pingInterval = setInterval(() => {
      channel.postMessage({ type: "PING", id: myId });
    }, 3000);

    const handleUnload = () => {
      channel.postMessage({ type: "BYE", id: myId });
    };
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      clearInterval(pingInterval);
      channel.postMessage({ type: "BYE", id: myId });
      channel.close();
    };
  }, []);

  /* -------------------------------------------------------
     RANDOM BONUS (drifts between 0 and 2)
     Changes slowly so number feels alive but not jumpy.
  ------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set initial bonus once on mount
    setBonus(Math.floor(Math.random() * 3)); // 0, 1, or 2

    const interval = setInterval(() => {
      setBonus((prev) => {
        const drift = Math.random() < 0.5 ? -1 : 1;
        const next = prev + drift;
        if (next < 0) return 1;
        if (next > 2) return 1;
        return next;
      });
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  /* -------------------------------------------------------
     FINAL DISPLAYED NUMBER
  ------------------------------------------------------- */
  return Math.max(1, realCount + bonus);
}