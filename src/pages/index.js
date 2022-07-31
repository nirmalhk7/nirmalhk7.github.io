import React from "react";
import { Link, withPrefix, graphql } from "gatsby";
import Blog from "../elements/blogIntro";
import SearchEnggOp from "../elements/seo";
import WorkExperience from "../elements/workExperience";
import Layout from "../layouts/main";
import { StaticImage } from "gatsby-plugin-image";
import {
  Accordion,
  AccordionItem,
  AccordionItemPanel,
  AccordionItemHeading,
  AccordionItemButton,
} from "react-accessible-accordion";
import Jumbotron from "../elements/jumbotron";
import { getItem } from "../elements/util";

class IndexPage extends React.Component {
  render() {
    const {
      mainIndex,
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
        <Jumbotron.fullHeight
          HeadingTextComponent={
            <h1>
              I'm Nirmal Khedkar, <br />
              product developer
              {"\n"}
              based in <br />
              Surathkal, India.
            </h1>
          }
          orangeText="Hey!"
          buttonDetails={[
            ["Latest Projects", "#projects"],
            ["More About Me", "#about"],
          ]}
          showScrollDown
          bgImg="sm:bg-milkyWay lg:bg-beachNirmal"
        />
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
              <div
                className="break-inside-avoid"
                dangerouslySetInnerHTML={{
                  __html: mainIndex.childMarkdownRemark.html,
                }}
              ></div>
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

              <div className="break-inside-avoid py-4">
                <div className="grid gap-4 font-blocky uppercase text-center  text-button font-bold">
                  <a
                    className="bg-accent border-4 border-accent text-white hover:text-black  no-underline w-full"
                    href={"./Resume.pdf"}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Download My Resume
                  </a>
                  <Link
                    className="border-4 no-underline border-accent  text-accent hover:text-black  w-full"
                    to="#contact"
                  >
                    Want to Hire?
                  </Link>
                </div>
              </div>
              <div className="break-inside-avoid">
                <h5 style={{ paddingTop: "0.5em" }}>
                  Familiar Languages, Frameworks and Libraries
                </h5>
                <hr />
                <div
                  className="grid grid-cols-4"
                  style={{ marginBottom: "5em" }}
                >
                  {skills.nodes.map((element, index) => (
                    <div
                      className="p-2 text-center text-base text-black uppercase font-blocky"
                      key={index}
                    >
                      {element.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="break-inside-avoid">
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
                <div className="m-0">
                  <ul className="disc">
                    {collegeCourses.nodes.join(", ")+"."}
                  </ul>
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
        </section>
        <section className="bg-gray" id="projects">
          <div className="sm:container mx-auto">
            <div className="grid grid-cols-2  md:grid-cols-2 sm:grid-cols-1">
              <div>
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
              <div>
                <Accordion className="accordion">
                  {projects.nodes.map((element, index) => (
                    <AccordionItem className="accordion__item">
                      <AccordionItemHeading>
                        <AccordionItemButton className="accordion-header bg-gray">
                          {getItem(element).title}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel className="p-6 bg-white">
                        <p className="accordion-body__contents">
                          <p>{element.childMarkdownRemark.excerpt}</p>
                          <Link to={`/projects?id=${element.id}`}>
                            Find more here
                          </Link>
                          .&nbsp;&nbsp;&nbsp;
                          <code>
                            {getItem(element).tags[0]}
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
        <Blog name={site.siteMetadata.blogName} />
      </Layout>
    );
  }
}

export default IndexPage;
export const postQuery = graphql`
  query x {
    mainIndex: file(name: { eq: "mainIndex" }) {
      childMarkdownRemark {
        html
      }
    }
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
    skills: allSkillsYaml(sort: { fields: priority, order: DESC }, limit: 12) {
      nodes {
        name
      }
    }
  }
`;
