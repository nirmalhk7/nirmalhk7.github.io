import React from "react";
import { motion } from "framer-motion";
import { trackView } from "@/util/analytics";

interface WebSectionProps {
  children: React.ReactNode;
  className?: string;
  id: string; // Make id a required prop
}

const WebSection: React.FC<WebSectionProps> = ({ children, className = "", id }) => {
  return (
    <motion.section
      id={id}
      className={`${className}`}
      onViewportEnter={() => trackView(id)}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.section>
  );
};

export default WebSection;
