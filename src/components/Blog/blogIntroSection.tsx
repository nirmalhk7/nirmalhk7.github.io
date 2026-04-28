import Link from "next/link";
import React, { useRef } from "react";
import WebSection from "@/elements/WebSection";
import { useMotionValue, useTransform, useSpring } from "framer-motion";

const BlogIntroSection = ({ name }: { name: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement even more
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 200 });

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
    // Initial state or far from center: keep it "to right" (90deg)
    if (latestX === 0 && latestY === 0) return "linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(217, 56, 56, 1) 100%)";
    
    const angle = Math.atan2(latestY, latestX) * (180 / Math.PI);
    // Gradient from white to accent color
    return `linear-gradient(${angle + 90}deg, rgba(255, 255, 255, 1) 0%, rgba(217, 56, 56, 1) 100%)`;
  });

  return (
    <WebSection
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="selection:bg-accent selection:text-white bg-white text-white transition-[background] duration-500 ease-out"
      id="blog"
      style={{ background }}
    >
      <div className="narrow mx-auto text-center pb-6 relative">
        <div className="w-full">
          <h3 className="leading-tight text-accent my-0 drop-shadow-sm">
            {name}
          </h3>
          <h1 className="mt-0 text-black">
            Latest From The Blog
          </h1>
          <p className="text-center m-0 p-0 font-normal text-black/80">
            I have strong views on topics like Finance, Technology, Future and
            Environment. Find me&nbsp;
            <Link className="text-accent font-bold" title={name} href="/blog">
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
