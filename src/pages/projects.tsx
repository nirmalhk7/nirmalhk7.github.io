import React from "react";
import { Accordion } from "react-accessible-accordion";
import nasaGalaxy from "@/assets/images/nasa-earth.jpg";
import { groupBy, sampleSize } from "lodash";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { GetStaticProps } from "next";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import Jumbotron from "@/elements/jumbotron";
import WebSection from "@/elements/WebSection";
import { DefaultPageProps } from "./_app";
import { ProjectInterface } from "@/interfaces/projects";
import { ProjectDescription } from "@/components/Project/projectDescription";
import { ProjectCategory } from "@/components/Project/projectCategory";

interface ProjectPageProps extends DefaultPageProps {
  projects: ProjectInterface[];
}

const Projects = ({ projects }: ProjectPageProps) => {
  return (
    <main>
      <Jumbotron.mini
        backgroundImage={nasaGalaxy}
        backgroundImageAlt="Earth from Space"
        title="Projects"
        subtitle="Projects Catalogue of Nirmal Khedkar"
        DescriptionComponent={ProjectDescription}
      />

      <WebSection className="bg-white pt-16 pb-48" id="projectdetailed">
        <div className="container mx-auto">
          {projects.map((project) => (
            <div>{project.frontmatter.title}</div>
          ))}
        </div>
      </WebSection>
    </main>
  );
};

export const getStaticProps: GetStaticProps<ProjectPageProps> = async () => {
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");
  const projects = loadMarkdownFiles("content/projects", {
    getContent: true,
  }).map((project) => ({
    frontmatter: {
      tags: project.frontmatter.tags,
      ...project.frontmatter,
    },
  }));

  return {
    props: {
      projects,
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "Projects",
          description: "I love what I do. Here's all I do.",
        },
      },
    },
  };
};

export default Projects;
