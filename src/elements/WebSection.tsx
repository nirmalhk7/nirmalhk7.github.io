import React from "react";
import { motion } from "framer-motion";

interface WebSectionProps {
  children: React.ReactNode;
  className?: string;
  id: string; // Make id a required prop
}

const WebSection: React.FC<WebSectionProps> = ({ children, className = "", id }) => {
  return (
    <motion.section
      id={id}
      className={`snap-start ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

export default WebSection;