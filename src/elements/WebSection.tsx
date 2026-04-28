import React from "react";
import { motion, useMotionValue, useTransform, MotionValue, HTMLMotionProps } from "framer-motion";
import { trackView } from "@/util/analytics";

interface WebSectionProps {
  children: React.ReactNode;
  className?: string;
  id: string; // Make id a required prop
  style?: HTMLMotionProps<"section">["style"];
  onMouseMove?: (e: React.MouseEvent) => void;
}

const WebSection = React.forwardRef<HTMLElement, WebSectionProps>(
  ({ children, className = "", id, style, onMouseMove }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleLocalMouseMove(e: React.MouseEvent) {
      const { currentTarget, clientX, clientY } = e;
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
      if (onMouseMove) onMouseMove(e);
    }

    return (
      <motion.section
        ref={ref}
        id={id}
        className={`${className} group relative`}
        onViewportEnter={() => trackView(id)}
        viewport={{ once: true, margin: "-50px" }}
        onMouseMove={handleLocalMouseMove}
        style={style}
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
  }
);

WebSection.displayName = "WebSection";

function useTemplateStyle(mouseX: MotionValue<number>, mouseY: MotionValue<number>) {
  return useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(234, 88, 12, 0.06), transparent 80%)`
  );
}

export default WebSection;
