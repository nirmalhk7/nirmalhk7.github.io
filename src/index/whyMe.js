import { Fragment } from "react";
export const MySkills = ({ frameworksLibraries, languages }) => (
  <>
    <h5 style={{ paddingTop: "0.5em" }}>
      Familiar Languages, Frameworks and Libraries
    </h5>
    <hr />
    <div className="row" style={{ marginBottom: "5em" }}>
      {[...frameworksLibraries, ...languages].map((element, index) => (
        <div className="col-3 minicard" key={index}>
          {element}
        </div>
      ))}
    </div>
  </>
);

export const OnlineCourses = ({ onlineCourses }) => (
  <>
    {" "}
    <h5>Online Certification and Courses Taken</h5>
    <hr />
    <div className="row m-0">
      <ul className="disc">
        {onlineCourses.map((element, index) => (
          <li key={index}>
            {element.name} by {element.provider}- (
            <a href={element.link}>link</a>)
          </li>
        ))}
      </ul>
    </div>
  </>
);

export const Memberships = ({ membership }) => (
  <>
    <h5>Memberships</h5>
    <hr />
    <div className="row m-0">
      <ul className="disc">
        {membership.map((element, index) => (
          <li key={index}>
            {element.position} at&nbsp;
            <a href={element.clubwebsite} key={index}>
              {element.club}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </>
);
export const CollegeCourses = ({ collegeCourses }) => (
  <>
    <h5>Prominent College Courses Taken</h5>
    <hr />
    <div className="row mr-0 ml-0">
      <div className="disc">
        {collegeCourses.map((element, index) => (
          // eslint-disable-next-line react/jsx-no-undef
          <Fragment key={index}>
            {index + 1 !== collegeCourses.length
              ? `${element.name}, `
              : `${element.name}.`}
          </Fragment>
        ))}
      </div>
    </div>
  </>
);

export const WorkExperience = ({ experience }) => (
  <div className="container about-content about-content--timeline">
    <div className="col text-center">
      <h3>My Work Experience</h3>
    </div>
    <div className="row">
      {experience.map((element, index) => (
        <div className="col-lg-6 col-md-6 col-sm-12 left" key={index}>
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
