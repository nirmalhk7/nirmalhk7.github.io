import React from "react";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionItem,
  AccordionItemPanel,
  AccordionItemHeading,
  AccordionItemButton,
} from "react-accessible-accordion";
import nasaGalaxy from "@/assets/images/nasa-earth.jpg";
import ReactMarkdown from "react-markdown";
import ProjectInterface from "@/interfaces/projectInterface";
import { groupBy, sampleSize } from "lodash";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { GetStaticProps } from "next";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import Jumbotron from "@/elements/jumbotron";
import WebSection from "@/elements/WebSection";

interface ProjectsPageTypes {
  allFile: {
    group: {
      fieldValue: string;
      edges: {
        node: {
          childMarkdownRemark: ProjectInterface;
        };
      }[];
    }[];
  };
}

const ProjectDescription = () => (
  <p className="narrow">
    I&apos;m a fullstack and hybrid product developer, currently
    understanding and exploring cloud platforms. I love building stuff!{" "}
    <FontAwesomeIcon className="ml-2 text-accent" icon={faWrench} />
  </p>
);

const ProjectAccordionItem = ({ project }: { project: any }) => (
  <AccordionItem className="accordion__item" key={project.id}>
    <AccordionItemHeading>
      <AccordionItemButton className="accordion-header bg-white">
        {project.childMarkdownRemark.frontmatter.title}
      </AccordionItemButton>
    </AccordionItemHeading>
    <AccordionItemPanel className="p-6 bg-gray">
      <ReactMarkdown>{project.content}</ReactMarkdown>
    </AccordionItemPanel>
  </AccordionItem>
);

const ProjectCategory = ({ tag, projects }: { tag: string; projects: any[] }) => (
  <div className="break-inside-avoid mb-4" key={tag}>
    <h6 id={tag}>{tag}</h6>
    {projects.map((project) => (
      <ProjectAccordionItem project={project} key={project.id} />
    ))}
  </div>
);

const Projects = ({ location, projects, quote }: any) => (
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
            {projects.map(({ tag, projects }: any) => (
              <ProjectCategory tag={tag} projects={projects} key={tag} />
            ))}
          </div>
        </Accordion>
      </div>
    </WebSection>
  </main>
);

export const getStaticProps: GetStaticProps<any> = async () => {
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");
  const projects = Object.entries(
    groupBy(
      loadMarkdownFiles("content/projects", { getContent: true }),
      (project) => project.childMarkdownRemark.frontmatter.tags
    )
  ).map((element) => ({ tag: element[0], projects: element[1] }));

  return {
    props: {
      projects,
      quote: sampleSize(allQuotesYaml)[0],
    },
  };
};

export default Projects;