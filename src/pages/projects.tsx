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
  tag: string;
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
          <Accordion className="my-0 mx-auto rounded js-accordion">
            <div className="gap-y-16 laptop:columns-2 mobile-l:columns-1">
              {/* TODO NK Fix this */}
              {/* {groupBy(projects,} */}
              {/* {projects.map((project) => (
               <ProjectCategory tag={project.childMarkdownRemark.frontmatter.tags} projects={projects} key={tag} />
            ))} */}
            </div>
          </Accordion>
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

  console.log(projects[0]);

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
