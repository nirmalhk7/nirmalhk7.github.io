import React from "react";
import { Link, withPrefix, graphql } from "gatsby";
import Blog from "../elements/blogIntro";
import SearchEnggOp from "../elements/seo";
import WorkExperience from "../elements/workExperience";
import { MySkills } from "../elements/mySkills";
import Layout from "../layouts/main";
import SocialMediaIcons from "../elements/social/social";
import { StaticImage } from "gatsby-plugin-image";
import { Accordion, AccordionItem, AccordionItemPanel, AccordionItemHeading, AccordionItemButton } from "react-accessible-accordion";

const Jumbotron = () => (
  <section
    className="s-home page-hero  bg-fixed bg-center bg-no-repeat"
    data-natural-height="2000"
    data-natural-width="3000"
    data-parallax="scroll"
    data-position-y="center"
    id="home"
  >
    <div className="overlay" />
    <div className="home-content ">
      <div className="container mx-auto home-content__main">
        <h3 className="ital-hover">Hey!</h3>
        <h1>
          I'm Nirmal Khedkar, <br />
          product developer
          {"\n"}
          based in <br />
          Surathkal, India.
        </h1>
        <div className="static text-left gap-4 right-0 bottom-8  text-button font-blocky uppercase font-bold">
          <Link
            className="inline-block mr-4 smoothscroll border-4 no-underline px-5 text-white border-white hover:bg-white hover:text-black"
            to="#projects"
          >
            Latest Projects
          </Link>
          <Link
            className="inline-block mr-4 smoothscroll border-4 no-underline px-5 text-white border-white hover:bg-white hover:text-black"
            to="#about"
          >
            More About Me
          </Link>
        </div>
        <div className="home-content__scroll">
          <Link
            className="scroll-link smoothscroll no-underline hover:text-white"
            to="#about"
          >
            <span>Scroll Down</span>
          </Link>
        </div>
      </div>
    </div>
    <SocialMediaIcons />
  </section>
);



const Projects = ({ projects }) => (
  <section className="bg-gray" id="projects">
    <div className="sm:container mx-auto">
      <div className="grid grid-cols-2  md:grid-cols-2 sm:grid-cols-1">
        <div className="">
          <div className="pb-6 relative">
            <div className=" text-center">
              <h3 className="font-blocky font-semibold mb-0 mt-0 uppercase text-accent">
                Projects
              </h3>
              <h1 className="font-bold  font-heading leading-snug mt-0">
                See My Latest Projects
              </h1>
              <p className="lead">
                Find my projects <Link to="/projects">categorized here</Link>.
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <Accordion className="accordion">
            {projects.nodes.map((element, index) => (
              <AccordionItem
                className="accordion__item"
              >
                <AccordionItemHeading>
                  <AccordionItemButton className="accordion-header bg-gray">
                    {element.childMarkdownRemark.frontmatter.title}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel
                  className="p-6 bg-white"
                >
                  <p className="accordion-body__contents">
                    <p>{element.childMarkdownRemark.excerpt}</p>
                    <Link to={`/projects?id=${element.id}`}>
                      Find more here
                    </Link>
                    .&nbsp;&nbsp;&nbsp;
                    <code>
                      {element.childMarkdownRemark.frontmatter.tags[0]}
                    </code>
                  </p>
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  </section>
);

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      projects,
      workexperience,
      onlineCourses,
      collegeCourses,
      membership,
      skills,
      site,
    } = this.props.data;
    return (
      <Layout location={this.props.location}>
        <SearchEnggOp
          description="Welcome to Nirmal Khedkar's Official Website"
          title="Home"
        />
        <Jumbotron />
        <section className="pt-56 pb-32 bg-white relative " id="about">
          <div className="w-100 text-center">
            <div className="narrow text-center relative section-intro has-bottom-sep m-auto">
              <div className="w-full text-center">
                <h3 className="text-accent">Nirmal Khedkar</h3>
                <h1>More About Me</h1>
                <p className="font-lead font-blocky mb-16">
                  I'm a student in National Institute of Technology Karnataka
                  Surathkal doing a Bachelors in Technology (Information
                  Technology) constantly looking for new and interesting
                  challenges.
                </p>
              </div>
            </div>
          </div>
          <div className="container mx-auto ">
            <div className="columns-2 gap-16 gap-y-16">
              <div  className="break-inside-avoid">
                <h3 id="howdy">Greetings!</h3>
                <p>
                  I'm from India, and I'm final year student at National Institute of
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
                  I've worked on several MERN Stack based, Native Android and Ruby on Rails
                  projects. I'm also member Web Developer of IRIS NITK, which is NITK's
                  student-run university management portal. I'm also passionate about
                  Machine Learning and its applications.
                </p>
              </div>
              <StaticImage
                alt="Nirmal Khedkar"
                className="lg:hidden md:block sm:block break-inside-avoid"
                src="https://avatars.githubusercontent.com/u/25480443"
                style={{
                  borderRadius: "70%",
                  padding: "1rem",
                  width: "70%",
                  height: "auto",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                placeholder="blurred"
              />

              <div  className="break-inside-avoid py-4">
                <div className="grid gap-4 font-blocky uppercase text-center  text-button font-bold">
                  <a
                    className="bg-accent border-4 border-accent text-white  no-underline w-full"
                    href={"./Resume.pdf"}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Download My Resume
                  </a>
                  <Link
                    className="smoothscroll border-4 no-underline border-accent  text-accent w-full"
                    to="#contact"
                  >
                    Want to Hire?
                  </Link>
                </div>
              </div >
              <div className="break-inside-avoid">
                <MySkills
                  skills={skills.nodes.map(element => element.name)}
                />
              </div>
              <div  className="break-inside-avoid">
                <h5>Online Certification and Courses Taken</h5>
                <hr />
                <div className="m-0">
                  <ul className="disc">
                    {onlineCourses.nodes.map((element, index) => (
                      <li key={index}>
                        {element.name} by {element.provider}- (
                        <a href={element.link}>link</a>)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="break-inside-avoid">
                <h5>Prominent College Courses Taken</h5>
                <hr />
                <div className="mr-0 ml-0">
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
              </div>
              <div className="break-inside-avoid">
                <h5>Memberships</h5>
                <hr />
                <div className="m-0">
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
              </div>
            </div>
          </div>
          <WorkExperience experience={workexperience.nodes} />
        </section >
        <Projects
          projects={projects}
        />
        <Blog name={site.siteMetadata.blogName} />
      </Layout >
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
      }
    }
    skills: allSkillsYaml(sort: {fields: priority, order: DESC}, limit: 12) {
      nodes {
        name
      }
    }
  }
`;
