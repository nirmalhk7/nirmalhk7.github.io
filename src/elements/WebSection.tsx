import React, { useEffect, useMemo } from "react";
import { m, useMotionValue, useTransform, MotionValue } from "framer-motion";
import { trackSectionView } from "@/util/analytics";
import { createRafThrottled } from "@/util/rafThrottle";

interface WebSectionProps {
  children: React.ReactNode;
  className?: string;
  id: string; // Make id a required prop
  deferRender?: boolean;
}

const WebSection = React.forwardRef<HTMLElement, WebSectionProps>(({ children, className = "", id, deferRender = false }, ref) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const updateSpotlight = useMemo(
    () => createRafThrottled((x: number, y: number) => {
      mouseX.set(x);
      mouseY.set(y);
    }),
    [mouseX, mouseY]
  );

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    updateSpotlight(clientX - left, clientY - top);
  };

  useEffect(() => updateSpotlight.cancel, [updateSpotlight]);

  return (
    <m.section
      ref={ref}
      id={id}
      className={`${className} group relative${deferRender ? " defer-render" : ""}`}
      onViewportEnter={() => trackSectionView(id)}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
    >
      <m.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTemplateStyle(mouseX, mouseY),
        }}
      />
      {children}
    </m.section>
  );
});

WebSection.displayName = "WebSection";

function useTemplateStyle(mouseX: MotionValue<number>, mouseY: MotionValue<number>) {
  return useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(234, 88, 12, 0.06), transparent 80%)`
  );
}

export default WebSection;
