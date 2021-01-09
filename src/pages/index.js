import React from "react";
import { Link, withPrefix } from "gatsby";
// import data from '../../public/static/data.json'
import Layout from "../components/layout";
// import Image from "../components/image"
import SEO from "../components/seo";
import experience from "../../content/yml/workexperiences.yaml";
import courses from "../../content/yml/courses.yaml";
import clubs from "../../content/yml/memberships.yaml";
import skills from "../../content/yml/skills.yaml";
import SocialMediaIcons from "../components/partials/social";
import Resume from "../../static/Resume.pdf";
import { graphql } from "gatsby";

const Jumbotron = (props) => (
  <section
    id="home"
    className="s-home page-hero target-section parallax"
    data-parallax="scroll"
    data-natural-width="3000"
    data-natural-height="2000"
    data-position-y="center"
  >
    <div className="overlay"></div>
    <div className="home-content bootstrap-wrapper">
      <div className="container home-content__main">
        <h3>Hey!</h3>
        <h1>
          I'm Nirmal Khedkar, <br />
          product developer
          {"\n"}
          based in <br />
          Surathkal, India.
        </h1>
        <div className="home-content__buttons">
          <Link to="#projects" className="smoothscroll btn btn--stroke">
            Latest Projects
          </Link>
          <Link to="#about" className="smoothscroll btn btn--stroke">
            More About Me
          </Link>
        </div>
        <div className="home-content__scroll">
          <Link to="#about" className="scroll-link smoothscroll">
            <span>Scroll Down</span>
          </Link>
        </div>
      </div>
    </div>
    <SocialMediaIcons />
  </section>
);

const OnlineCertification = ({ courses }) => (
  <>
    <h5>Online Certification and Courses Taken</h5>
    <hr style={{ borderColor: "#af2b2b" }} />
    <div className="row m-0">
      <ul className="disc">
        {courses.online.map((element, index) => (
          <li key={index}>
            {element.name} by {element.provider}- (<a href={element.link}>link</a>)
          </li>
        ))}
      </ul>
    </div>
  </>
);

const Memberships = ({ clubs }) => (
  <>
    <h5>Memberships</h5>
    <hr style={{ borderColor: "#af2b2b" }} />
    <div className="row m-0">
      <ul className="disc">
        {clubs.map((element, index) => (
          <li key={index}>
            {element.position} at{" "}
            <a key={index} href={element.clubwebsite}>
              {element.club}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </>
);
const LanguageLibraries = ({ skills }) => (
  <>
    <h5 style={{ paddingTop: "0.5em" }}>Languages, Frameworks, Libraries and Tools</h5>
    <hr style={{ borderColor: "#af2b2b" }} />
    <div className="row">
      {Object.values(skills).map((e) => e.map((f) => <div className="col-3 minicard">{f}</div>))}
    </div>
  </>
);

const CollegeCourses = ({ courses }) => (
  <>
    <h5>College Courses Taken</h5>
    <hr style={{ borderColor: "#af2b2b" }} />
    <div className="row mr-0 ml-0">
      <div className="disc">
        {courses.college.map((element, index) => (
          <React.Fragment key={index}>
            {index + 1 !== courses.college.length ? element + ", " : element + "."}
          </React.Fragment>
        ))}
      </div>
    </div>
  </>
);

const WorkExperience = ({ experience }) => (
  <div className="container about-content about-content--timeline">
    <div className="col text-center">
      <h3>My Work Experience.</h3>
    </div>
    <div className="row">
      {experience.map((element, index) => (
        <div key={index} className="col-lg-6 col-md-6 col-sm-12 left">
          <div className="timeline">
            <div className="timeline__block">
              <div className="timeline__bullet"></div>
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

const AboutMe = (props) => (
  <section id="about" className="s-about bootstrap-wrapper">
    <div className="w-100 text-center">
      <div className="narrow section-intro has-bottom-sep m-auto">
        <div className="col-12 text-center">
          <h3>Nirmal Khedkar</h3>
          <h1>More About Me</h1>
          <p className="lead">
            I'm a student in National Institute of Technology Karnataka Surathkal doing a Bachelors in Information
            Technology constantly looking for new and interesting challenges.
          </p>
        </div>
      </div>
    </div>

    <div className="container about-content">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="padding-bottom:1em">
            <h3 id="howdy">Howdy!</h3>
            <p>
              I’m from India, and I’m second year student at National Institute of Technology, Karnataka. Programming,
              reading books, reading news, table tennis and{" "}
              <strong>making applications that eliminate iterative work</strong> is my hobby. I like to constantly
              challenge myself with problems. I also have a knack for finance and investment.
            </p>
            <h5 id="academics">Academics</h5>
            <p>
              I completed my 10th grade in Bangalore with <strong>9.4 CGPA</strong> and my 12th grade with 87.9%. I
              currently study in <strong>National Institute of Technology Karnataka</strong> doing BTech in Information
              Technology and have <em>7.06</em> CGPA
              <small>(as of May 2019)</small>
            </p>

            <h5 id="technical-projects-and-activities">Technical Projects and Activities</h5>
            <p>
              My projects are listed below. Most of them are open-sourced on GitHub. I’ve worked on several MERN Stack
              based, Native Android and Ruby on Rails projects. I’m also member Web Developer of IRIS NITK, which is
              NITK’s student-run university management portal. I’m also passionate about Machine Learning and its
              applications.
            </p>

            <h5 id="finance">Finance</h5>
            <p>
              I strongly think that the best way to earn more is to read more about exactly how money works. As a
              student, I love to read about money, stock markets and financial incidents around the world.
            </p>
          </div>

          <a
            rel="noopener noreferrer"
            className="btn btn--primary full-width"
            style={{ marginTop: "1em" }}
            href={withPrefix("./Resume.pdf")}
            target="_blank"
          >
            Download My Resume
          </a>
          <Link to="#contact" className="smoothscroll btn btn--stroke full-width">
            Want to Hire?
          </Link>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h3 className="text-center">I've got some skills.</h3>
          <LanguageLibraries skills={skills} />
          <OnlineCertification courses={courses} />
          <CollegeCourses courses={courses} />
          <Memberships clubs={clubs} />
        </div>
      </div>
    </div>
    <WorkExperience experience={experience} />
  </section>
);

const Blog = ({ name }) => (
  <section id="blog" className="s-works target-section bootstrap-wrapper">
    <div className="narrow section-intro has-bottom-sep m-auto">
      <div className="col-12">
        <h3>{name}</h3>
        <h1>Latest From The Blog.</h1>
        <p className="lead">
          I have strong views on topics like Finance, Technology, Future and Environment. Find me{" "}
          <Link title="blog link" to="/blog">
            blogging about them here
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
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
    let clickedOn = parseInt(event.target.id.split("-")[1]);
    let newState = this.state.isOpen;
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
    let projects = this.props.data.allFile.nodes.slice(0, 5);
    return (
      <Layout location={this.props.location}>
        <SEO title="Home" />
        <Jumbotron />
        <AboutMe />
        <section id="projects" className="s-works target-section bootstrap-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 tab-full right">
                <div className="narrow section-intro has-bottom-sep">
                  <div className="col-full">
                    <h3>Projects</h3>
                    <h1>See My Latest Projects.</h1>
                    <p className="lead">
                      Find my projects <Link to="/projects">categorized here</Link>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 tab-full left">
                <div className="accordion js-accordion">
                  {/*TODO Fix this projects part*/}
                  {projects &&
                    projects.map((element, index) => (
                      <div
                        key={index}
                        id={"accordion-" + index}
                        onClick={this.handleClick}
                        className={`accordion__item js-accordion-item ${this.state.isOpen[index] ? "active" : ""}`}
                      >
                        <div id={"accordionheader-" + index} className="accordion-header js-accordion-header">
                          {element.childMarkdownRemark.frontmatter.title}
                        </div>
                        <div
                          id={"accordionbody-" + index}
                          className="accordion-body js-accordion-body"
                          style={{
                            display: `${this.state.isOpen[index] ? "block" : "none"}`,
                          }}
                        >
                          <div className="accordion-body__contents">
                            <p>{element.childMarkdownRemark.excerpt}</p>
                            <Link to="/project#Silver-Scrapper">Find more here</Link>
                            .&nbsp;&nbsp;&nbsp;
                            <code>{element.childMarkdownRemark.frontmatter.tags[0]}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Blog name={this.props.data.site.siteMetadata.blogName} />
      </Layout>
    );
  }
}

export const postQuery = graphql`
  query x {
    allFile(filter: { sourceInstanceName: { eq: "projects" } }, sort: { order: DESC, fields: birthTime }) {
      nodes {
        sourceInstanceName
        childMarkdownRemark {
          frontmatter {
            title
            tags
          }
          excerpt
        }
        birthtime
      }
    }
    site {
      siteMetadata {
        blogName
      }
    }
  }
`;

export default IndexPage;
