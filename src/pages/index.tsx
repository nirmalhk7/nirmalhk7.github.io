import React from "react";
import { Link, graphql } from "gatsby";
import Blog from "../elements/blogIntroSection";
import SearchEnggOp from "../elements/seoUtil";
import WorkExperience from "../elements/workExperienceSection";
import Layout from "../layouts/mainLayout";
import { StaticImage } from "gatsby-plugin-image";
import Jumbotron from "../elements/jumbotron";
import ReactSafelySetInnerHTML from 'react-safely-set-inner-html';

class IndexPage extends React.Component {
  render() {
    const {
      mainContent,
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
        <Jumbotron.Max
          HeadingTextComponent={
            <h1>
              I'm Nirmal Khedkar, <br />
              Software Engineer
              {"\n"}
              based in <br />
              Bangalore.
            </h1>
          }
          bgImg="bg-milkyWay laptop:bg-beachNirmal"
          buttonDetails={[
            ["Latest Projects", "#projects"],
            ["More About Me", "#about"],
          ]}
          smallText="Hey!"
          showScrollDown
        />
        <section className="bg-white relative " id="about">
          <div className="container mx-auto ">
            <div className="columns-1 mobile-l:columns-2 gap-16 gap-y-16">
              <div className="container mx-auto break-inside-avoid">
                <ReactSafelySetInnerHTML>{mainContent.childMarkdownRemark.html}</ReactSafelySetInnerHTML>
              </div>
              <div className="break-inside-avoid laptop:hidden tablet:block mobile-l:block">
                <StaticImage
                  alt="Nirmal Khedkar"
                  className="break-inside-avoid"
                  placeholder="blurred"
                  src="https://avatars.githubusercontent.com/u/25480443"
                  style={{
                    borderRadius: "70%",
                    padding: "1rem",
                    width: "70%",
                    height: "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />
              </div>
              <div className="break-inside-avoid">
                <h5 className="mt-0">
                  Familiar Languages, Frameworks and Libraries
                </h5>
                <hr />
                <div
                  className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4"
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
            </div>
          </div>
        </section>
        <section className="bg-white relative " id="about">
          <div className="container mx-auto ">
            <div className="columns-1 mobile-l:columns-2 gap-16 gap-y-16">
     
            </div>
          </div>
          <WorkExperience experience={workexperience.nodes} />
        </section>
        <Blog name={site.siteMetadata.blogName} />
      </Layout>
    );
  }
}

export default IndexPage;
export const postQuery = graphql`
  query x {
    mainContent: file(name: { eq: "mainContent" }) {
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
        description
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
    skills: allSkillsYaml(sort: { fields: priority, order: DESC }, limit: 16) {
      nodes {
        name
      }
    }
  }
`;
