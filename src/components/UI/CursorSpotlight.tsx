import React, { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

export const CursorSpotlight: React.FC = () => {
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const matchMedia = window.matchMedia("(pointer: fine)");
    setIsPointerDevice(matchMedia.matches);

    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    if (matchMedia.matches) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseX, mouseY]);

  if (!isPointerDevice) return null;

  return (
    <m.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: "transparent",
      }}
    >
      <m.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-60 mix-blend-screen"
        style={{
          width: 650,
          height: 650,
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(255, 115, 0, 0.12) 0%, rgba(255, 115, 0, 0.04) 40%, transparent 70%)",
        }}
      />
    </m.div>
  );
};

export default CursorSpotlight;
