import React from "react";
import Blog from "../elements/blogIntroSection";
import WorkExperience from "../elements/workExperienceSection";
import Layout from "../layouts/mainLayout";
import Jumbotron from "../elements/jumbotron";
import Link from "next/link";
import sampleSize from "lodash/sampleSize";
import { GetStaticProps } from "next";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import { QuoteInterface } from "@/elements/quoteSection";
import Utils from "@/elements/utils";
import ReactMarkdown from "react-markdown";
import ProjectIntroSection from "@/elements/projectIntroSection";
import { CourseInterface, MembershipInterface, ProfilesInterface, SkillsInterface, WorkExperienceInterface } from "@/interfaces/interfaces";

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
    <Layout location="/" quote={quote} >
      <Jumbotron.Max
        HeadingTextComponent={
          <h1>
            I&apos;m Nirmal Khedkar, <br />
            Software Engineer. 
          </h1>
        }
        bgImg="bg-milkyWay laptop:bg-beachNirmal"
        buttonDetails={[
          ["Latest Projects", "#projects"],
          ["More About Me", "#about"],
        ]}
        orangeText="Hey!"
        showScrollDown={true}
      />
        <section className="pt-32 pb-32 bg-white relative selection:bg-accent selection:text-white" id="about">
        <div className="w-100 text-center">
          <div className="narrow text-center relative section-intro has-bottom-sep m-auto">
            <div className="w-full text-center">
              <h3 className="text-accent">Nirmal Khedkar</h3>
              <h1 className="hover:text-black transition duration-500">More About Me</h1>
              <p className="font-lead font-blocky mb-16">
                Fortress code, lightning fast: Hi, I&apos;m Nirmal Khedkar.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto ">
          <div className="columns-1 mobile-l:columns-2 gap-16 gap-y-16">
            <ReactMarkdown>
              {mainContent}
            </ReactMarkdown>

            
            <div className="break-inside-avoid">
              <Utils.getHeader headerName="Familiar Languages, Frameworks and Libraries" />
              <div
                className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4"
              >
                {skills.map((element, index) => (
                  <div
                    className="p-2 text-center text-base text-black uppercase font-blocky hover:shadow-md transition duration-300"
                    key={index}
                  >
                    {element.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="break-inside-avoid">
              <Utils.getHeader headerName="Online Certification and Courses Taken" />
              <div className="m-0">
                <ul className="disc">
                  {onlineCourses.map((element, index) => (
                    <li key={index} style={{ paddingTop: "0.4em" }}>
                      {element.name} by {element.provider}- (
                      <a href={element.link}>link</a>)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="break-inside-avoid">
              <Utils.getHeader headerName="Prominent College Courses Taken" />
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
            <div className="break-inside-avoid">
              <Utils.getHeader headerName="Volunteer Experience" />
              <div className="m-0">
                <ul className="disc">
                  {membership.map((element, index) => (
                    <li key={index} className="pt-1">
                      {element.position} at&nbsp;
                      <a href={element.clubwebsite} key={index}>
                        {element.club}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            
            </div>
            <div className="break-inside-avoid pt-16">
              <div className="grid gap-4 font-blocky uppercase text-center  text-button font-bold">
                <Link
                  className="button button-red bg-accent w-full text-white hover:text-accent hover:bg-white"
                  href={"/resume"}
                  rel="noreferrer"
                  target="_blank"
                >
                  Download My Resume
                </Link>
                <Link
                  className="button button-red w-full text-accent hover:text-white hover:bg-accent"
                  href="#contact"
                >
                  Want to Hire?
                </Link>
              </div>
            </div>
          </div>
        </div>
        <WorkExperience experience={workexperience} />
      </section>
      <ProjectIntroSection projects={projects} />
      <Blog name="The Blue Green Manual" />
      
      
    </Layout>
  );
}


export default IndexPage;


export const getStaticProps: GetStaticProps<string> = async () => {
  const allCoursesYaml: CourseInterface[] = require("../../content/yml/courses.yaml");
  const allSkillsYaml: SkillsInterface[] = require("../../content/yml/skills.yaml");
  // Lodash get random 5 projects

  const allProfilesYaml: ProfilesInterface[] = require("../../content/yml/profiles.yaml");
  const allMembershipsYaml: MembershipInterface[] = require("../../content/yml/memberships.yaml");
  const allWorkExperiencesYaml: WorkExperienceInterface[] = require("../../content/yml/workexperiences.yaml");
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml")


  return {
    props: {
      mainContent: loadMarkdownFile("content/yml/mainContent.md", "mainContent", { getContent: true }).content,
      collegeCourses: allCoursesYaml.filter(val => !val.provider),
      onlineCourses: allCoursesYaml.filter(val => val.provider),
      skills: allSkillsYaml,
      cv: allProfilesYaml, membership: allMembershipsYaml,
      workexperience: allWorkExperiencesYaml,
      projects: sampleSize(loadMarkdownFiles("content/projects", { getExcerpt: true }), 5),
      quote: sampleSize(allQuotesYaml)[0]
    }
  }
}