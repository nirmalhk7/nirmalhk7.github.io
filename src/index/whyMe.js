import { Fragment } from "react";
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
  <div className="sm:container mx-auto ">
    <div className="col text-center  my-14">
      <h3 className="text-h3 font-blocky">My Work Experience</h3>
    </div>
    <div className="grid grid-cols-2 gap-x-6">
      {experience.map((element, index) => (
        <div key={index}>
          <div className="relative before:content-[''] before:block before:h-full before:absolute before:top-0 before:w-px before:bg-gray">
            <div className="pl-32 timeline__block">
              <div
                className={`bg-${
                  index === 0 ? "accent" : "black"
                } h-6 -ml-3 left-0 absolute w-6 rounded-full shadow-workexp | timeline__bullet`}
              />
              <div className="timeline__header">
                <p className="text-darkgray font-bold font-blocky leading-normal mb-4 uppercase text-h6">
                  {element.timeframe}
                </p>
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
