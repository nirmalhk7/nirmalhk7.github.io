import React from "react";
import Blog from "../elements/blogIntroSection";
import SearchEnggOp from "../elements/seoUtil";
import WorkExperience from "../elements/workExperienceSection";
import Layout from "../layouts/mainLayout";
// import { StaticImage } from "gatsby-plugin-image";
import Jumbotron from "../elements/jumbotron";
// import ReactSafelySetInnerHTML from 'react-safely-set-inner-html';
import Link from "next/link";
import sampleSize from "lodash/sampleSize";
import { GetStaticProps } from "next";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import Image from "next/legacy/image";
import { QuoteInterface } from "@/elements/quoteSection";

const IndexPage = ({
  mainContent,
  projects,
  workexperience,
  onlineCourses,
  collegeCourses,
  membership,
  skills,
  site,
  quote
}: any) => {
  return (
    <Layout location="/" quote={quote}>
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
        orangeText="Hey!"
        showScrollDown
      />
      <section className="pt-56 pb-32 bg-white relative " id="about">
        <div className="w-100 text-center">
          <div className="narrow text-center relative section-intro has-bottom-sep m-auto">
            <div className="w-full text-center">
              <h3 className="text-accent">Nirmal Khedkar</h3>
              <h1>More About Me</h1>
              <p className="font-lead font-blocky mb-16">
                SWE, Cloud Enthusiast, learner and motorsport enthusiast: Hi, I'm Nirmal Khedkar.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto ">
          <div className="columns-1 mobile-l:columns-2 gap-16 gap-y-16">
            {/* <ReactSafelySetInnerHTML>{mainContent.childMarkdownRemark.html}</ReactSafelySetInnerHTML> */}
            <div className="laptop:hidden tablet:block mobile-l:block">
              <Image src="https://avatars.githubusercontent.com/u/25480443"
              // placeholder="blur"
              width={500}
              height={500}
              alt="Nirmal Khedkar"
              className="break-inside-avoid"
              style={{
                borderRadius: "70%",
                padding: "1rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            </div>

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
                  href="#contact"
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
                className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4"
                style={{ marginBottom: "5em" }}
              >
                {skills.map((element, index) => (
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
                  {onlineCourses.map((element, index) => (
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
                  {collegeCourses
                    .map((element) => element.name)
                    .join(", ")}
                  .
                </ul>
              </div>
            </div>
            {/* TODO: This is causing some weird padding issues. */}
            {/* <div className="break-inside-avoid">
            <h5>Memberships</h5>
            <hr />
            <div className="m-0">
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
          </div> */}
          </div>
        </div>
        <WorkExperience experience={workexperience} />
      </section>

      <Blog name="Pitlane Chat" />
    </Layout>
  );
}


export default IndexPage;


export const getStaticProps: GetStaticProps<any> = async () => {
  const allCoursesYaml: any[] = require("../../content/yml/courses.yaml");
  const allSkillsYaml: any[] = require("../../content/yml/skills.yaml");
  const allProfilesYaml: any[] = require("../../content/yml/profiles.yaml");
  const allMembershipsYaml: any[] = require("../../content/yml/memberships.yaml");
  const allWorkExperiencesYaml: any[] = require("../../content/yml/workexperiences.yaml");
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml")

  return {
    props: {
      mainContent: "", collegeCourses: allCoursesYaml.filter(val => val.provider === null),
      onlineCourses: allCoursesYaml.filter(val => val.provider !== null),
      skills: allSkillsYaml, cv: allProfilesYaml, membership: allMembershipsYaml,
      workexperience: allWorkExperiencesYaml, projects: loadMarkdownFiles("content/projects"),
      quote: sampleSize(allQuotesYaml)[0]
    }
  }
}