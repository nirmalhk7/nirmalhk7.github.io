import React from "react";
import BlogIntroSection from "@/components/Blog/blogIntroSection";
import WorkExperience from "@/elements/workExperienceSection";
import Jumbotron from "@/elements/jumbotron";
import Link from "next/link";
import sampleSize from "lodash/sampleSize";
import { GetStaticProps } from "next";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import ReactMarkdown from "react-markdown";
import ProjectIntroSection from "@/components/Project/projectIntroSection";
import {
  CourseInterface,
  MembershipInterface,
  ProfilesInterface,
  SkillsInterface,
  WorkExperienceInterface,
} from "@/interfaces";
import WebSection from "@/elements/WebSection";
import { DefaultPageProps } from "./_app";
import { ProjectInterface } from "@/interfaces/projects";
import { CommonHeader } from "@/components/header";

interface IndexPageProps extends DefaultPageProps {
  mainContent: string;
  collegeCourses: CourseInterface[];
  onlineCourses: CourseInterface[];
  skills: SkillsInterface[];
  cv: ProfilesInterface[];
  membership: MembershipInterface[];
  workexperience: WorkExperienceInterface[];
  projects: ProjectInterface[];
}

const IndexPage = ({
  mainContent,
  projects,
  workexperience,
  onlineCourses,
  collegeCourses,
  membership,
  skills
}: IndexPageProps) => {
  
  return (
      <main>
      <Jumbotron.Max
        HeadingTextComponent={
          <h1 className="text-white">
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
      <WebSection
        className="pt-32 pb-32 bg-white relative selection:bg-accent selection:text-white"
        id="about"
      >
        <div className="w-full text-center">
          <div className="narrow text-center relative section-intro has-bottom-sep m-auto">
            <div className="w-full text-center">
              <h3>
                Nirmal Khedkar
              </h3>
              <h1>
                More About Me
              </h1>
              <p className="font-lead font-blocky mb-16 text-lg">
                Fortress code, lightning fast: Hi, I&apos;m Nirmal Khedkar.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="columns-1 mobile-l:columns-2 gap-16 gap-y-16">
            <ReactMarkdown>
              {mainContent}
            </ReactMarkdown>
            <div className="break-inside-avoid">
              <CommonHeader headerName="Familiar Languages, Frameworks and Libraries" />
              <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-4">
                {skills.map((element, index) => (
                  <div
                    className="p-2 text-center text-2xl text-black uppercase font-blocky hover:shadow-md transition duration-300"
                    key={index}
                  >
                    {element.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="break-inside-avoid">
              {/* TODO NK  This looks too wordy */}
              <CommonHeader headerName="Online Certification and Courses Taken" />
              <div className="m-0">
                <ul className="list-disc pl-5">
                  {onlineCourses.map((element, index) => (
                    <li key={index} className="py-1">
                      {element.name} by {element.provider} - (
                      <a
                        href={element.link}
                      >
                        link
                      </a>
                      )
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="break-inside-avoid">
              <CommonHeader headerName="Prominent College Courses Taken" />
              <div className="m-0">
                <ul className="list-disc pl-5">
                  {collegeCourses.map((element) => element.name).join(", ")}.
                </ul>
              </div>
            </div>
            <div className="break-inside-avoid">
              <CommonHeader headerName="Volunteer Experience" />
              <div className="m-0">
                <ul className="list-disc pl-5">
                  {membership.map((element, index) => (
                    <li key={index} className="py-1">
                      {element.position} at&nbsp;
                      <a
                        href={element.clubwebsite}
                      >
                        {element.club}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="break-inside-avoid pt-16">
              <div className="grid gap-4 font-blocky uppercase text-center text-button font-bold">
                <Link
                  className="button button-accent w-full"
                  href={"/resume"}
                  rel="noreferrer"
                  target="_blank"
                >
                  Download My Resume
                </Link>
                <Link
                  className="button button-accent-fill w-full"
                  href="#contact"
                >
                  Want to Hire?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </WebSection>
      <WorkExperience experience={workexperience} />
      <ProjectIntroSection projects={projects} />
      <BlogIntroSection name="The Blue Green Manual" />
      </main>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  const allCoursesYaml: CourseInterface[] = require("../../content/yml/courses.yaml");
  const allSkillsYaml: SkillsInterface[] = require("../../content/yml/skills.yaml");
  const allProfilesYaml: ProfilesInterface[] = require("../../content/yml/profiles.yaml");
  const allMembershipsYaml: MembershipInterface[] = require("../../content/yml/memberships.yaml");
  const allWorkExperiencesYaml: WorkExperienceInterface[] = require("../../content/yml/workexperiences.yaml");
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");
  const fiveProjects = sampleSize(
    loadMarkdownFiles("content/projects", { getExcerpt: true, getContent: false }),
    5
  );

  
  return {
    props: {
      mainContent: loadMarkdownFile(
        "content/yml/mainContent.md",
        "mainContent",
        { getContent: true, getExcerpt: false }
      ).content || "",
      collegeCourses: allCoursesYaml.filter((val) => !val.provider),
      onlineCourses: allCoursesYaml.filter((val) => val.provider),
      skills: allSkillsYaml,
      cv: allProfilesYaml,
      membership: allMembershipsYaml,
      workexperience: allWorkExperiencesYaml,
      projects: fiveProjects,
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          defaultTitle: "Official Website of Nirmal Khedkar",
          description: "Fortress Code Lightning Fast. This is Nirmal Khedkar's Official Website"
        }
      }
    },
  };
};
