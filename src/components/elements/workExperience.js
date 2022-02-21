import React from "react";

const WorkExperience = ({ experience }) => (
  <div className="container mx-auto  --timeline">
    <div className="col text-center">
      <h3>My Work Experience</h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
      {experience.map((element, index) => (
        <div className=" left" key={index}>
          <div className="timeline">
            <div className="timeline__block">
              <div className="timeline__bullet" first={index} />
              <div className="timeline__header">
                <p className="timeline__timeframe">{element.timeframe}</p>
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
