import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
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
import ReactMarkdown from "react-markdown";

interface ProjectPageProps extends DefaultPageProps {
  projects: ProjectInterface[];
  allTags: string[];
}

const Projects = ({ projects, allTags }: ProjectPageProps) => {
  const [filter, setFilter] = useState("X");
  const accordionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && accordionRefs.current[hash]) {
      accordionRefs.current[hash]?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleHeadingClick = (title: string) => {
    console.log(title)
    window.location.hash = title;
  };
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
          <h3 className="mb-10">{filter === "X" ? "All" : filter} Projects</h3>
          <div className="inline-block my-2 mx-2">
            <code
              onClick={() => setFilter("X")}
              className={filter === "X" ? "code-selected" : ""}
            >
              X
            </code>
          </div>
          {allTags.map((tag) => (
            <div className="inline-block my-2 mx-2">
              <code
                className={tag === filter ? "code-selected" : ""}
                key={tag}
                onClick={() => setFilter(tag)}
              >
                {tag}
              </code>
            </div>
          ))}
          <Accordion className="mt-10">
            {projects
              .filter((project) =>
                filter === "X"
                  ? true
                  : project.frontmatter.tags?.includes(filter)
              )
              .map((project) => (
                <AccordionItem key={project.frontmatter.title}>
                  <AccordionItemHeading>
                    <AccordionItemButton
                      className="bg-gray-100"
                      onClick={() =>
                        handleHeadingClick(project.frontmatter.title)
                      }
                    >
                      <div className="grid grid-cols-5 px-5">
                        <h5 className="col-span-3">
                          {project.frontmatter.title}
                        </h5>
                        <div className="col-span-2 text-end ">
                          {project.frontmatter.tags?.map((tag) => (
                            <div
                              className="inline-block my-2 mx-2"
                              key={tag + "-" + project.frontmatter.title}
                            >
                              <code>{tag}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel className="border-2 border-gray-100 px-5 py-10">
                    <ReactMarkdown>{project.content || ""}</ReactMarkdown>
                  </AccordionItemPanel>
                </AccordionItem>
              ))}
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
    getExcerpt: false,
  });
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.frontmatter.tags || []))
  );

  return {
    props: {
      projects,
      allTags: allTags,
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
