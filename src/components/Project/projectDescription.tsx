import React from "react";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ProjectDescription = () => (
  <p className="narrow">
    I&apos;m a fullstack and hybrid product developer, currently understanding
    and exploring cloud platforms. I love building stuff!{" "}
    <FontAwesomeIcon className="ml-2 text-accent" icon={faWrench} />
  </p>
);
