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
import beachImage from "../assets/images/BeachNK_1.jpg";
import WebSection from "@/elements/WebSection";
import { DefaultPageProps } from "./_app";
import { ProjectFrontmatterInterface, ProjectInterface } from "@/interfaces/projects";
import { CommonHeader } from "@/components/header";
import loadYaml from "@/util/loadYaml";
import path from "path";
import { trackClick, trackView } from "@/util/analytics";

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
  
  React.useEffect(() => {
    trackView("home_page");
  }, []);

  return (
      <main>
      <Jumbotron.Max
        HeadingTextComponent={
          <h1 className="text-white">
            I&apos;m Nirmal Khedkar, <br />
            Software Engineer.
          </h1>
        }
        // bgImg="bg-milkyWay laptop:bg-beachNirmal"
        bgImg={beachImage}
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
              <p className="font-lead font-blocky mb-16 text-3xl">
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
                    role="button"
                    tabIndex={0}
                    className="p-2 text-center text-2xl text-black uppercase font-blocky hover:font-bold hover:text-accent hover:scale(.5) transition duration-300 cursor-pointer"
                    key={index}
                    onClick={() => trackClick(element.name, "skill_click")}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        trackClick(element.name, "skill_click");
                      }
                    }}
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
                        onClick={() => trackClick(element.name, "online_course_click")}
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
              <div className="grid gap-4 font-blocky uppercase text-center text-xl leading-[4.8rem] tracking-[0.3rem] font-bold">
                <Link
                  className="button button-accent w-full"
                  href={"/resume"}
                  rel="noreferrer"
                  target="_blank"
                  onClick={() => trackClick("download_resume", "engagement")}
                >
                  Download My Resume
                </Link>
                <Link
                  className="button button-accent-fill w-full"
                  href="#contact"
                  onClick={() => trackClick("want_to_hire", "engagement")}
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
  const contentDir = path.join(process.cwd(), "content", "yml");
  const allCoursesYaml = loadYaml<CourseInterface[]>(path.join(contentDir, "courses.yaml"));
  const allSkillsYaml = loadYaml<SkillsInterface[]>(path.join(contentDir, "skills.yaml"));
  const allProfilesYaml = loadYaml<ProfilesInterface[]>(path.join(contentDir, "profiles.yaml"));
  const allMembershipsYaml = loadYaml<MembershipInterface[]>(path.join(contentDir, "memberships.yaml"));
  const allWorkExperiencesYaml = loadYaml<WorkExperienceInterface[]>(path.join(contentDir, "workexperiences.yaml"));
  const allQuotesYaml = loadYaml<QuoteInterface[]>(path.join(contentDir, "quotes.yaml"));
  const fiveProjects = sampleSize(
    loadMarkdownFiles<ProjectFrontmatterInterface>("content/projects", { getExcerpt: true, getContent: false }),
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
          title: "Official Website of Nirmal Khedkar",
          description: "Looking to boost your engineering team's performance and reliability? Hire Nirmal Khedkar. With two years of full-stack experience at Visa, he's your man to improve your system performance and handle any runtime errors.",
          openGraph: {
            type: "website",
            url: `https://nirmalhk7.com`,
            images: [
              {
                url: `https://nirmalhk7.com${beachImage.src}`,
                alt: "Hi, I'm Nirmal Khedkar",
                width: 900,
                height: 800
              },
            ],
          },
          twitter: {
            site: `https://nirmalhk7.com`,
          },
        }
      }
    },
  };
};
