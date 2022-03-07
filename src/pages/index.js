import React from "react";
import { Link, withPrefix, graphql } from "gatsby";
// import data from '../../public/static/data.json'
import Layout from "../layouts/main";
// import Image from "../components/image"
import SearchEnggOp from "../components/seo";
import { StaticImage } from "gatsby-plugin-image";
import { MegaJumbotron } from "../components/jumbotron";

const WorkExperience = ({ experience }) => (
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

const PersonalInfo = () => (
  <div>
    <h3 id="howdy">Greetings!</h3>
    <p>
      I’m from India, and I’m final year student at National Institute of
      Technology, Karnataka. Programming, reading books, reading news, table
      tennis and
      <strong>making applications that eliminate iterative work</strong> is my
      hobby. I like to constantly challenge myself with problems. I also have a
      knack for finance and investment.
    </p>
    <h5 id="academics">Academics</h5>
    <p>
      I completed my 10th grade in Bangalore with <strong>9.4 CGPA</strong> and
      my 12th grade with 87.9%. I currently study in{" "}
      <strong>National Institute of Technology Karnataka</strong> doing BTech in
      Information Technology.
    </p>

    <h5 id="technical-projects-and-activities">
      Technical Projects and Activities
    </h5>
    <p>
      My projects are listed below. Most of them are open-sourced on GitHub.
      I’ve worked on several MERN Stack based, Native Android and Ruby on Rails
      projects. I’m also member Web Developer of IRIS NITK, which is NITK’s
      student-run university management portal. I’m also passionate about
      Machine Learning and its applications.
    </p>
  </div>
);
const HireMe = () => (
  <>
    <a
      className="btn btn-accent full-width text-decoration-none"
      href={withPrefix("./Resume.pdf")}
      rel="noreferrer"
      style={{ marginTop: "1em" }}
      target="_blank"
    >
      Download My Resume
    </a>
    <Link
      className="smoothscroll btn btn-outline-accent full-width text-decoration-none"
      to="#contact"
    >
      Want to Hire?
    </Link>
  </>
);

const Blog = ({ name }) => (
  <section className="bg-gradient-accent  bootstrap-wrapper" id="blog">
    <div className="narrow section-intro has-bottom-sep m-auto">
      <div className="col-12">
        <h3 className="text-white">{name}</h3>
        <h1 className="text-white">Latest From The Blog</h1>
        <p className="lead">
          I have strong views on topics like Finance, Technology, Future and
          Environment. Find me&nbsp;
          <Link className="text-white" title={name} to="/blog">
            blogging about them here
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
);

const Projects = ({ projects, isOpen, handleClick }) => (
  <section className="bg-gray bootstrap-wrapper" id="projects">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 tab-full right">
          <div className="narrow section-intro has-bottom-sep">
            <div className="">
              <h3 className="text-accent">Projects</h3>
              <h1>See My Latest Projects</h1>
              <p className="lead">
                Find my projects <Link to="/projects">categorized here</Link>.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 tab-full left">
          <div className="accordion js-accordion">
            {projects.nodes.map((element, index) => (
              <div
                className={`accordion__item js-accordion-item ${
                  isOpen[index] ? "active" : ""
                }`}
                id={`accordion-${index}`}
                key={index}
              >
                <div
                  className="accordion-header bg-gray js-accordion-header"
                  id={`accordionheader-${index}`}
                  onClick={handleClick}
                  onKeyDown={handleClick}
                  role="button"
                  tabIndex={0}
                >
                  {element.childMarkdownRemark.frontmatter.title}
                </div>
                <div
                  className="accordion-body js-accordion-body bg-white"
                  id={`accordionbody-${index}`}
                  style={{
                    display: `${isOpen[index] ? "block" : "none"}`,
                  }}
                >
                  <div className="accordion-body__contents">
                    <p>{element.childMarkdownRemark.excerpt}</p>
                    <Link to={`/projects?id=${element.id}`}>
                      Find more here
                    </Link>
                    .&nbsp;&nbsp;&nbsp;
                    <code>
                      {element.childMarkdownRemark.frontmatter.tags[0]}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MySkills = ({ frameworksLibraries, languages }) => (
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

const OnlineCourses = ({ onlineCourses }) => (
  <>
    {" "}
    <h5>Online Certification and Courses Taken</h5>
    <hr />
    <div className="row m-0">
      <ul className="disc">
        {onlineCourses.nodes.map((element, index) => (
          <li key={index}>
            {element.name} by {element.provider}- (
            <a href={element.link}>link</a>)
          </li>
        ))}
      </ul>
    </div>
  </>
);

const Memberships = ({ membership }) => (
  <>
    <h5>Memberships</h5>
    <hr />
    <div className="row m-0">
      <ul className="disc">
        {membership.nodes.map((element, index) => (
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
const CollegeCourses = ({ collegeCourses }) => (
  <>
    <h5>Prominent College Courses Taken</h5>
    <hr />
    <div className="row mr-0 ml-0">
      <div className="disc">
        {collegeCourses.nodes.map((element, index) => (
          <React.Fragment key={index}>
            {index + 1 !== collegeCourses.nodes.length
              ? `${element.name}, `
              : `${element.name}.`}
          </React.Fragment>
        ))}
      </div>
    </div>
  </>
);

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: [false, false, false, false, false],
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (event) => {
    event.preventDefault();
    event.persist();
    console.log(event.target.id);
    const clickedOn = parseInt(event.target.id.split("-")[1]);
    const newState = this.state.isOpen;
    newState.forEach((element, index) => {
      if (index === clickedOn) {
        newState[clickedOn] = !newState[clickedOn];
      } else {
        newState[index] = false;
      }
    });
    this.setState({
      isOpen: newState,
    });
  };
  render() {
    const {
      projects,
      workexperience,
      onlineCourses,
      collegeCourses,
      membership,
      ymlYaml,
      site,
    } = this.props.data;
    return (
      <Layout location={this.props.location}>
        <SearchEnggOp
          description="Welcome to Nirmal Khedkar's Official Website"
          title="Home"
        />
        <MegaJumbotron
          buttonsSection={
            <>
              <Link
                className="smoothscroll  btn btn-outline-white"
                to="#projects"
              >
                Latest Projects
              </Link>
              <Link className="smoothscroll  btn btn-outline-white" to="#about">
                More About Me
              </Link>
            </>
          }
          header={
            <>
              I'm Nirmal Khedkar, <br />
              product developer
              {"\n"}
              based in <br />
              Surathkal, India.
            </>
          }
          id="home"
          miniHeader="Hey!"
          scrollSection={
            <Link
              className="scroll-link smoothscroll text-decoration-none"
              to="#about"
            >
              <span>Scroll Down</span>
            </Link>
          }
        />
        <section className="s-about bootstrap-wrapper" id="about">
          <div className="w-100 text-center">
            <div className="narrow section-intro has-bottom-sep m-auto">
              <div className="col-12 text-center">
                <h3 className="text-accent">Nirmal Khedkar</h3>
                <h1>More About Me</h1>
                <p className="lead">
                  I'm a student in National Institute of Technology Karnataka
                  Surathkal doing a Bachelors in Technology (Information
                  Technology) constantly looking for new and interesting
                  challenges.
                </p>
              </div>
            </div>
          </div>
          <div className="container about-content">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <PersonalInfo />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <StaticImage
                  alt="Nirmal Khedkar"
                  className="header-image"
                  imgStyle={{ borderRadius: "70%" }}
                  placeholder="blurred"
                  src="../assets/images/profile.png"
                />

                <MySkills
                  frameworksLibraries={ymlYaml.frameworks_libraries}
                  languages={ymlYaml.languages}
                />
                <HireMe />
              </div>
            </div>
          </div>
          <div className="container about-content">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <OnlineCourses onlineCourses={onlineCourses} />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <CollegeCourses collegeCourses={collegeCourses} />
                <Memberships membership={membership} />
              </div>
            </div>
          </div>
          <WorkExperience experience={workexperience.nodes} />
        </section>
        <Projects
          handleClick={this.handleClick}
          isOpen={this.state.isOpen}
          projects={projects}
        />
        <Blog name={site.siteMetadata.blogName} />
      </Layout>
    );
  }
}

export default IndexPage;
export const postQuery = graphql`
  query x {
    projects: allFile(
      filter: { sourceInstanceName: { eq: "projects" } }
      sort: { order: DESC, fields: birthTime }
      limit: 5
    ) {
      nodes {
        id
        childMarkdownRemark {
          frontmatter {
            title
            tags
          }
          excerpt
        }
        birthTime
      }
    }
    site: site {
      siteMetadata {
        blogName
      }
    }
    workexperience: allWorkexperiencesYaml {
      nodes {
        timeframe
        post
        company
        description
      }
    }
    membership: allMembershipsYaml {
      nodes {
        club
        clubwebsite
        position
      }
    }
    onlineCourses: allCoursesYaml(filter: { provider: { ne: null } }) {
      nodes {
        name
        link
        provider
      }
    }
    collegeCourses: allCoursesYaml(filter: { provider: { eq: null } }) {
      nodes {
        name
        link
      }
    }
    cv: allProfilesYaml(filter: { type: { eq: "cv" } }) {
      nodes {
        name
        url
        icon
        initial
      }
    }
    ymlYaml {
      frameworks_libraries
      languages
    }
  }
`;
