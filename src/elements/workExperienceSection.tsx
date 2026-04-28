import React from "react";
import WebSection from "@/elements/WebSection";
import { motion } from "framer-motion";

type WorkExperienceType = {
  timeframe: string;
  company: string;
  post: string;
  description: string | string[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const WorkExperienceSection = ({
  experience,
}: {
  experience: WorkExperienceType[];
}) => (
  <WebSection
    className="pt-32 pb-32 bg-white relative selection:bg-accent selection:text-white"
    id="workexperience"
  >
    <div className="container mx-auto ">
      <div className="col text-center">
        <h3 className="mb-24">My Work Experience</h3>
      </div>
      <motion.div 
        className="columns-1 tablet:columns-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {experience.map((element, index) => (
          <motion.div 
            className="break-inside-avoid left" 
            key={index}
            variants={itemVariants}
          >
            <div className="timeline mb-8">
              <div className="timeline__block">
                <div className="timeline__bullet" data-first={index} />
                <div className="timeline__header">
                  <p className="timeline__timeframe hover:text-accent">
                    {element.timeframe}
                  </p>
                  <h4>{element.company}</h4>
                  <h5>{element.post}</h5>
                </div>
                <div className="timeline__desc">
                  {typeof element.description === "string" ? (
                    <p>{element.description}</p>
                  ) : (
                    <ul>
                      {element.description.map((line) => (
                        <li className="pt-2" key={line}>
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </WebSection>
);
export default WorkExperienceSection;
