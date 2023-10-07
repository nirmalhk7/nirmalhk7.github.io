import React from "react";
import Layout from "../layouts/mainLayout";
import SearchEnggOp from "../elements/seoUtil";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionItem,
  AccordionItemPanel,
  AccordionItemHeading,
  AccordionItemButton,
} from "react-accessible-accordion";
import nasaGalaxy from "../assets/images/nasa-earth.jpg";
import ReactMarkdown from "react-markdown";
// import ReactSafelySetInnerHTML from 'react-safely-set-inner-html';
import ProjectInterface from "../interfaces/projectInterface";
import { groupBy, sampleSize } from "lodash";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import { GetStaticProps } from "next";
import { QuoteInterface } from "@/elements/quoteSection";
import Image from "next/legacy/image";
import Jumbotron from "@/elements/jumbotron";

interface ProjectsPageTypes {
  allFile: {
    group: {
      fieldValue: string,
      edges: {
        node: {
          childMarkdownRemark: ProjectInterface
        }
      }[]
    }[]
  }
}

const Projects = ({ location, projects, quote }: any) => (
  <Layout location={location} quote={quote}>
    <SearchEnggOp title="Projects" />
    <Jumbotron.mini
      bgImg={nasaGalaxy}
      bgImgAlt="Earth from Space"
      title="Projects"
      subtitle="Projects Catalogue of Nirmal Khedkar"
      DescriptionComponent={()=><p className="narrow">
        I&apos;m a fullstack and hybrid product developer, currently
        understanding and exploring cloud platforms. I love building stuff!{" "}
        <FontAwesomeIcon className="ml-2 text-accent" icon={faWrench} />
      </p>}
    />

    <section className="bg-white pt-16 pb-48 ">
      <div className="container mx-auto">
        <div>
          <Accordion className="my-0 mx-auto rounded js-accordion">
            <div className="gap-y-16 laptop:columns-2 mobile-l:columns-1">
              {projects.map(({ tag, projects }: any) => (
                <div className="break-inside-avoid mb-4" key={tag}>
                  <h6 id={tag}>{tag}</h6>
                  {projects.map((e2: any) => (
                    <AccordionItem className="accordion__item" key={e2.id}>
                      <AccordionItemHeading>
                        <AccordionItemButton className="accordion-header bg-white">
                          {e2.childMarkdownRemark.frontmatter.title}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel className="p-6 bg-gray">
                        <ReactMarkdown>{e2.content}</ReactMarkdown>
                      </AccordionItemPanel>
                    </AccordionItem>
                  ))}
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>
    </section>
  </Layout>
);

export const getStaticProps: GetStaticProps<any> = async () => {
  const allQuotesYaml: QuoteInterface[] = require("../../content/yml/quotes.yaml");
  const projects = Object.entries(
    groupBy(loadMarkdownFiles("content/projects", { getContent: true }), project => project.childMarkdownRemark.frontmatter.tags))
    .map(element => ({ tag: element[0], projects: element[1] }))

  return {
    props: {
      projects,
      quote: sampleSize(allQuotesYaml)[0]
    }
  }
}

export default Projects;
