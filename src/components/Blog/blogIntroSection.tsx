import Link from "next/link";
import React, { useRef } from "react";
import WebSection from "@/elements/WebSection";
import { useMotionValue, useTransform, useSpring } from "framer-motion";

const BlogIntroSection = ({ name }: { name: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Much smoother spring settings
  const smoothX = useSpring(mouseX, { damping: 100, stiffness: 50 });
  const smoothY = useSpring(mouseY, { damping: 100, stiffness: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    
    // Calculate mouse position relative to center of the section
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  // Convert mouse coordinates to an angle for the gradient
  const background = useTransform([smoothX, smoothY], ([latestX, latestY]) => {
    // Initial state: subtle accent gradient
    if (latestX === 0 && latestY === 0) return "linear-gradient(90deg, rgba(217, 56, 56, 0.4) 0%, rgba(217, 56, 56, 1) 100%)";
    
    const angle = Math.atan2(latestY, latestX) * (180 / Math.PI);
    // Gradient from light accent to full accent (less white)
    return `linear-gradient(${angle + 90}deg, rgba(217, 56, 56, 0.4) 0%, rgba(217, 56, 56, 1) 100%)`;
  });

  return (
    <WebSection
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="selection:bg-white selection:text-accent bg-white text-white"
      id="blog"
      style={{ background }}
    >
      <div className="narrow mx-auto text-center pb-6 relative">
        <div className="w-full">
          <h3 className="leading-tight text-white my-0 drop-shadow-sm opacity-90">
            {name}
          </h3>
          <h1 className="mt-0 text-white drop-shadow-md">
            Latest From The Blog
          </h1>
          <p className="text-center m-0 p-0 font-normal text-white/90">
            I have strong views on topics like Finance, Technology, Future and
            Environment. Find me&nbsp;
            <Link className="text-white font-bold underline decoration-white/30 hover:decoration-white transition-all" title={name} href="/blog">
              blogging about them here
            </Link>
            .
          </p>
        </div>
      </div>
    </WebSection>
  );
};

export default BlogIntroSection;
