import React from "react";
import Layout from "../layouts/mainLayout";
import SearchEnggOp from "../elements/seoUtil";
import { graphql, PageProps } from "gatsby";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionItem,
  AccordionItemPanel,
  AccordionItemHeading,
  AccordionItemButton,
} from "react-accessible-accordion";
import Utils from "../elements/utils";
import ReactSafelySetInnerHTML from 'react-safely-set-inner-html';

interface ProjectsPageTypes{
  allFile: {
    group: {
      fieldValue: string,
      edges: {
        node: {
          childMarkdownRemark: {
            frontmatter: {
              title: string
            }
          }
        }
      }[]
    }[]
  }
}

const Projects = ({ location, data }: PageProps<ProjectsPageTypes>) => (
  <Layout location={location}>
    <SearchEnggOp title="Projects" />
    <section
      className="page-header  bg-fixed bg-center bg-no-repeat bg-nasaEarth"
      id="projects-header"
    >
      <div className="container mx-auto page-header__content">
        <article>
          <h1 className="page-header__title">
            <a href="#0" title="Projects">
              Projects
            </a>
          </h1>
          <div className="page-header__info">
            <div className="page-header__cat">
              Projects Catalogue of Nirmal Khedkar
            </div>
          </div>
          <p className="narrow">
            I&apos;m a fullstack and hybrid product developer, currently
            understanding and exploring cloud platforms. I love building stuff!{" "}
            <FontAwesomeIcon className="ml-2 text-accent" icon={faWrench} />
          </p>
        </article>
      </div>
    </section>

    <section className="bg-white pt-16 pb-48 ">
      <div className="container mx-auto">
        <div>
          <Accordion className="my-0 mx-auto rounded js-accordion">
            <div className="gap-y-16 laptop:columns-2 mobile-l:columns-1">
              {data.allFile.group.map((e1) => (
                <div className="break-inside-avoid mb-4" key={e1.fieldValue}>
                  <h6 id={e1.fieldValue}>{e1.fieldValue}</h6>
                  {e1.edges.map((e2, i2) => (
                    <AccordionItem className="accordion__item" key={i2}>
                      <AccordionItemHeading>
                        <AccordionItemButton className="accordion-header bg-white">
                          {Utils.getFrontmatter(e2.node).title}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel className="p-6 bg-gray">

                        <ReactSafelySetInnerHTML >
                          {e2.node.childMarkdownRemark.html}</ReactSafelySetInnerHTML>
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

export const postQuery = graphql`
  query projects {
    allFile(
      filter: { sourceInstanceName: { eq: "projects" } }
      sort: { order: DESC, fields: birthTime }
    ) {
      group(field: childMarkdownRemark___frontmatter___tags) {
        edges {
          node {
            id
            childMarkdownRemark {
              frontmatter {
                title
                tags
              }
              html
            }
          }
        }
        fieldValue
      }
    }
  }
`;

export default Projects;
