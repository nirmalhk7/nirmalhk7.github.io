import React from "react";
import path from "path";
import { GetStaticProps } from "next";
import HomePage from "@/components/Home/HomePage";
import {
  CourseInterface,
  MembershipInterface,
  ProfilesInterface,
  SkillsInterface,
  WorkExperienceInterface,
} from "@/interfaces";
import { ProjectInterface } from "@/interfaces/projects";
import { DefaultPageProps } from "./_app";
import loadYaml from "@/util/loadYaml";
import { loadMarkdownFile } from "@/util/loadMarkdown";
import { selectedProjects } from "@/util/projectCuration";
import { openGraphImage } from "@/util/openGraph";

interface IndexPageProps extends DefaultPageProps {
  collegeCourses: CourseInterface[];
  onlineCourses: CourseInterface[];
  skills: SkillsInterface[];
  cv: ProfilesInterface[];
  membership: MembershipInterface[];
  workexperience: WorkExperienceInterface[];
  projects: ProjectInterface[];
}

const featuredProjectCopy: Record<string, string> = {
  atskit: "A Python toolkit that streams job listings from public applicant tracking system APIs.",
  "k8-autoscaler": "A Kubernetes autoscaler that uses historical traffic patterns to plan resource capacity.",
  scholarhub: "A research and collaboration portal for NIT students. Nirmal contributed all frontend work.",
  MedicalVR: "A browser based medical learning experience built with JavaScript and WebGL.",
};

export default function IndexPage({
  projects,
  workexperience,
  onlineCourses,
  collegeCourses,
  membership,
  skills,
  cv,
}: IndexPageProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nirmal Khedkar",
    jobTitle: "Software Engineer",
    url: "https://nirmalhk7.com",
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "National Institute of Technology Karnataka, Surathkal",
      },
      {
        "@type": "EducationalOrganization",
        name: "University of Colorado Boulder",
      },
    ],
    sameAs: cv.map((profile) => profile.url).filter((url) => /^https?:\/\//.test(url)),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <HomePage
        projects={projects}
        workexperience={workexperience}
        onlineCourses={onlineCourses}
        collegeCourses={collegeCourses}
        membership={membership}
        skills={skills}
        profiles={cv}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  const contentDir = path.join(process.cwd(), "content", "yml");
  const featuredProjectSlugs = ["k8-autoscaler", "atskit", "scholarhub", "MedicalVR"];
  const projects = featuredProjectSlugs.map((slug) => {
    const projectPath = path.join(process.cwd(), "content", "projects", `${slug}.md`);
    try {
      const project = loadMarkdownFile<ProjectInterface["frontmatter"]>(projectPath, slug, {
        getContent: false,
        getExcerpt: true,
      });
      return {
        ...project,
        frontmatter: { ...project.frontmatter, title: selectedProjects[slug].title, tags: selectedProjects[slug].tags, summary: featuredProjectCopy[slug] },
      } as ProjectInterface;
    } catch (error) {
      throw new Error(`Homepage featured project "${slug}" could not be loaded from ${projectPath}: ${String(error)}`);
    }
  });

  const allCourses = loadYaml<CourseInterface[]>(path.join(contentDir, "courses.yaml"));
  return {
    props: {
      collegeCourses: allCourses.filter((course) => !course.provider),
      onlineCourses: allCourses.filter((course) => course.provider),
      skills: loadYaml<SkillsInterface[]>(path.join(contentDir, "skills.yaml")),
      cv: loadYaml<ProfilesInterface[]>(path.join(contentDir, "profiles.yaml")),
      membership: loadYaml<MembershipInterface[]>(path.join(contentDir, "memberships.yaml")),
      workexperience: loadYaml<WorkExperienceInterface[]>(path.join(contentDir, "workexperiences.yaml")),
      projects,
      pageMetadata: {
        enableWrap: true,
        layoutVariant: "portfolio",
        seoMetadata: {
          title: "Nirmal Khedkar | Backend & Infrastructure Software Engineer",
          description: "Nirmal Khedkar is a software engineer with experience building backend services, production systems, and full stack applications at Visa and ZOLL Data Systems.",
          canonical: "https://nirmalhk7.com",
          openGraph: {
            type: "website",
            url: "https://nirmalhk7.com",
            images: [openGraphImage("Built for the real world.", "Product thinking. Engineering depth.", "home")],
          },
        },
      },
    },
  };
};
