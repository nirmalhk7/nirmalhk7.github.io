import React, { useRef } from "react";

import SocialMediaIcons from "../components/Social/socialSection";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import WebSection from "@/elements/WebSection";
import {
  motion,
  Variants,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { trackClick, trackSelectContent } from "@/util/analytics";
import Magnetic from "@/components/Magnetic";

type MiniJumbotronProps = {
  backgroundImage: StaticImageData | string;
  backgroundImageAlt: string;
  title: string;
  subtitle: string;
  DescriptionComponent: React.ComponentType;
  centerAlign?: boolean;
};

type MaxJumbotronProps = {
  bgImg: StaticImageData | string;
  orangeText: string;
  HeadingTextComponent: React.ReactNode;
  buttonDetails: [string, string][];
  showScrollDown?: boolean;
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const slideUpItem: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)", clipPath: "inset(0 0 100% 0)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const Mini = React.forwardRef<HTMLElement, MiniJumbotronProps>(({
  backgroundImage,
  backgroundImageAlt,
  title,
  subtitle,
  DescriptionComponent,
  centerAlign = false,
}, ref) => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.08, 1.18]);

  return (
    <WebSection
      ref={ref}
      className="page-header bg-fixed bg-center bg-no-repeat selection:bg-accent selection:text-white flex justify-center items-center overflow-hidden"
      id={`${title}-header`}
    >
      <div ref={containerRef} className="absolute inset-0 z-0">
        <motion.div style={{ y, scale: imageScale }} className="relative h-full w-full">
          <Image
            fill
            priority={true}
            className="object-center object-cover pointer-events-none !h2/5 brightness-25"
            src={backgroundImage}
            alt={backgroundImageAlt}
            sizes="100vw"
          />
        </motion.div>
      </div>
      <HeroTexture shouldReduceMotion={shouldReduceMotion} />
      <div
        className={`jumbotron container page-header__content z-10 ${
          centerAlign ? "text-center" : ""
        }`}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={slideUpItem} className="page-header__title text-white">{title}</motion.h1>
          <motion.div variants={slideUpItem} className="page-header__info">
            <div className="page-header__cat text-white inline-block uppercase">
              {subtitle}
            </div>
          </motion.div>
          <motion.div variants={slideUpItem}>
            <DescriptionComponent />
          </motion.div>
        </motion.div>
      </div>
    </WebSection>
  );
});

Mini.displayName = "Jumbotron.Mini";

const Max = React.forwardRef<HTMLElement, MaxJumbotronProps>(({
  orangeText,
  HeadingTextComponent,
  buttonDetails,
  bgImg,
  showScrollDown = false,
}, ref) => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 90, damping: 28, mass: 0.25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 90, damping: 28, mass: 0.25 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(255, 255, 255, 0.22), rgba(217, 56, 56, 0.08) 36%, transparent 70%)`;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.08, 1.22]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  return (
    <WebSection
      ref={ref}
      id="max-jumbo"
      className="s-home z-40 py-0 selection:bg-accent selection:text-white overflow-hidden snap-start"
    >
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        onMouseMove={handleMouseMove}
        role="presentation"
      >
        <motion.div style={{ y, scale: imageScale }} className="relative h-full w-full">
          <Image
            fill
            priority={true}
            className="object-right object-cover pointer-events-none laptop:object-center !h-screen brightness-50"
            src={bgImg}
            placeholder={typeof bgImg === "string" ? undefined : "blur"}
            alt="Nirmal Khedkar - Software Engineer"
            sizes="100vw"
          />
        </motion.div>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 z-[2] opacity-90"
        style={{ background: spotlight }}
      />
      <div className="jumbotron z-10 relative">
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          className="tablet:container mx-auto home-content__main"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h3 variants={slideUpItem} className="ital-hover">{orangeText}</motion.h3>
          <motion.div variants={slideUpItem}>{HeadingTextComponent}</motion.div>
          <motion.div variants={slideUpItem} className="static text-left gap-4 right-0 bottom-8">
            {buttonDetails.map((item) => (
              <motion.span
                key={item[0]}
                variants={buttonVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="inline-block mr-4"
              >
                <Magnetic className="inline-block">
                  <Link
                    className="button button-white inline-block"
                    href={item[1]}
                    onClick={() => {
                      trackSelectContent("hero_cta", item[0], {
                        destination: item[1],
                      });
                      trackClick(item[0], "jumbotron_cta");
                    }}
                  >
                    {item[0]}
                  </Link>
                </Magnetic>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
      {showScrollDown && (
        <motion.div
          className="absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/80 tablet:flex"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-blocky text-[1rem] font-bold uppercase tracking-[0.25rem]">Scroll</span>
          <motion.span
            className="block h-16 w-px origin-top bg-white/70"
            animate={shouldReduceMotion ? undefined : { scaleY: [0.35, 1, 0.35], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
      <SocialMediaIcons />
    </WebSection>
  );
});

Max.displayName = "Jumbotron.Max";

const Jumbotron = { Mini, Max };

export default Jumbotron;

function HeroTexture({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-35 mix-blend-screen"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                backgroundPosition: ["0px 0px", "52px 52px"],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "linear-gradient(to bottom, transparent, black 24%, black 78%, transparent)",
        }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 via-transparent to-transparent"
        animate={shouldReduceMotion ? undefined : { y: ["-18%", "18%", "-18%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0)_35%,rgba(0,0,0,0.42))]" />
    </div>
  );
}
