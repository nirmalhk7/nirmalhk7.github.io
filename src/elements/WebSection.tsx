import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { trackView } from "@/util/analytics";

interface WebSectionProps {
  children: React.ReactNode;
  className?: string;
  id: string; // Make id a required prop
}

const WebSection: React.FC<WebSectionProps> = ({ children, className = "", id }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.section
      id={id}
      className={`${className} group relative`}
      onViewportEnter={() => trackView(id)}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTemplateStyle(mouseX, mouseY),
        }}
      />
      {children}
    </motion.section>
  );
};

function useTemplateStyle(mouseX: any, mouseY: any) {
  return useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(234, 88, 12, 0.06), transparent 80%)`
  );
}

export default WebSection;
