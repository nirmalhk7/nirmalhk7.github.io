import React from "react";
import SEO from "../components/seo";

import Resume from "../assets/pdf/Resume.pdf";
import Layout from "../components/layout";
const ResumeDisplay = () => {
  return (
    <>
      {/* <Layout> */}
      <SEO title="My Resume" />
      {/* <iframe
          frameBorder="0"
          scrolling="no"
          width="640"
          height="480"
          src={Resume}
        ></iframe> */}
      <object width="100%" height="400" data="http://www.africau.edu/images/default/sample.pdf" type="application/pdf">
        {" "}
      </object>
      {/* </Layout> */}
    </>
  );
};

export default ResumeDisplay;
