import React, { useEffect } from "react";

interface WebSectionProps {
  children: React.ReactNode;
  className?: string;
  id: string; // Make id a required prop
}

const WebSection: React.FC<WebSectionProps> = ({ children, className = "", id }) => {
  useEffect(() => {
    const element = document.getElementById(id);

    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [id]);

  return (
    <section id={id} className={`animate-fadeIn ${className}`}>
      {children}
    </section>
  );
};

export default WebSection;