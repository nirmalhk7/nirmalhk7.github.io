import React from "react";

import SocialMediaIcons from "../components/Social/socialSection";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import WebSection from "@/elements/WebSection";
import { motion, Variants } from "framer-motion";
import { trackClick } from "@/util/analytics";

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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Jumbotron = {
  mini: ({
    backgroundImage,
    backgroundImageAlt,
    title,
    subtitle,
    DescriptionComponent,
    centerAlign = false,
  }: MiniJumbotronProps) => (
    <WebSection
      className="page-header bg-fixed bg-center bg-no-repeat selection:bg-accent selection:text-white flex justify-center items-center"
      id={`${title}-header`}
    >
      <Image
        fill
        className="object-center object-cover pointer-events-none !h2/5 brightness-25"
        src={backgroundImage}
        alt={backgroundImageAlt}
      />
      <div
        className={`jumbotron container page-header__content ${
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
  ),
  Max: ({
    orangeText,
    HeadingTextComponent,
    buttonDetails,
    bgImg,
  }: MaxJumbotronProps) => (
    <WebSection
      id="max-jumbo"
      className="s-home z-40 py-0 selection:bg-accent selection:text-white"
    >
      <Image
        fill
        className="object-right object-cover pointer-events-none laptop:object-center !h-screen brightness-50"
        src={bgImg}
        placeholder={typeof bgImg === "string" ? undefined : "blur"}
        alt="Nirmal Khedkar - Software Engineer"
      />
      {/* <div className="bg-black h-screen left-0 opacity-50 absolute top-0 w-full" /> */}
      <div className="jumbotron">
        <motion.div 
          className="tablet:container mx-auto home-content__main"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h3 variants={slideUpItem} className="ital-hover">{orangeText}</motion.h3>
          <motion.div variants={slideUpItem}>{HeadingTextComponent}</motion.div>
          <motion.div variants={slideUpItem} className="static text-left gap-4 right-0 bottom-8">
            {buttonDetails.map((item) => (
              <Link
                className="button button-white inline-block mr-4"
                key={item[0]}
                href={item[1]}
                onClick={() => trackClick(item[0], "jumbotron_cta")}
              >
                {item[0]}
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <SocialMediaIcons />
    </WebSection>
  ),
};

export default Jumbotron;
