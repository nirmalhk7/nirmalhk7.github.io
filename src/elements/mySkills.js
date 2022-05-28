import React from "react";

export const MySkills = ({ skills }) => (
  <>
    <h5 style={{ paddingTop: "0.5em" }}>
      Familiar Languages, Frameworks and Libraries
    </h5>
    <hr />
    <div className="grid grid-cols-4" style={{ marginBottom: "5em" }}>
      {skills.map((element, index) => (
        <div className="p-2 text-center text-base text-black uppercase font-blocky" key={index}>
          {element}
        </div>
      ))}
    </div>
  </>
);
