import React from "react";
import WebSection from "@/elements/WebSection";
type WorkExperienceType = {
  timeframe: string;
  company: string;
  post: string;
  description: string | string[];
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
      <div className="columns-1 tablet:columns-2">
        {experience.map((element, index) => (
          <div className="break-inside-avoid left" key={index}>
            <div className="timeline mb-8">
              <div className="timeline__block">
                <div className="timeline__bullet" data-first={index} />
                <div className="timeline__header">
                  <p className="timeline__timeframe hover:text-accent">
                    {element.timeframe}
                  </p>
                  <h3>{element.company}</h3>
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
          </div>
        ))}
      </div>
    </div>
  </WebSection>
);
export default WorkExperienceSection;
