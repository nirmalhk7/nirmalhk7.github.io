import React from "react";

type WorkExperienceType = {
  timeframe: string,
  company: string,
  post: string,
  description: string
}

const WorkExperience = ({ experience }: {experience: WorkExperienceType[]}) => (
  <div className="container mx-auto">
    <div className="col text-center">
      <h3>My Work Experience</h3>
    </div>
    <div className="columns-2">
      {experience.map((element, index) => (
        <div className="break-inside-avoid left" key={index}>
          <div className="timeline pt-2">
            <div className="timeline__block">
              <div className="timeline__bullet" first={index} />
              <div className="timeline__header">
                <p className="timeline__timeframe hover:text-accent">{element.timeframe}</p>
                <h3>{element.company}</h3>
                <h5>{element.post}</h5>
              </div>
              <div className="timeline__desc">
                <p>{element.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default WorkExperience;
