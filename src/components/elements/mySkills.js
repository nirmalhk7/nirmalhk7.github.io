import React from "react";

export const MySkills = ({ frameworksLibraries, languages }) => (
  <>
    <h5 style={{ paddingTop: "0.5em" }}>
      Familiar Languages, Frameworks and Libraries
    </h5>
    <hr />
    <div className="grid grid-cols-4" style={{ marginBottom: "5em" }}>
      {[...frameworksLibraries, ...languages].map((element, index) => (
        <div className="minicard" key={index}>
          {element}
        </div>
      ))}
    </div>
  </>
);
