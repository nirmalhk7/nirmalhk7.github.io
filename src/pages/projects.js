import React from "react";
import Layout from "../layouts/main";
import SearchEnggOp from "../elements/seo";
import { graphql } from "gatsby";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionItem, AccordionItemPanel, AccordionItemHeading, AccordionItemButton } from "react-accessible-accordion";


const Projects = ({ location, data }) => (
  <Layout location={location}>
    <SearchEnggOp title="Projects" />
    <section
      className="page-header page-hero bg-fixed bg-center bg-no-repeat bg-nasaEarth"
      id="projects-header"
    >
      <div className="container mx-auto page-header__content">
        <article className="">
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
            understanding and exploring cloud platforms. I love building
            stuff!{" "}
            <FontAwesomeIcon className="ml-2 text-accent" icon={faWrench} />
          </p>
        </article>
      </div>
    </section>

    <section className="bg-white pt-16 pb-48 ">
      <div className="container mx-auto">
        <div className="">
          <Accordion className="my-0 mx-auto rounded js-accordion">
            <div className="gap-y-16 lg:columns-2 sm:columns-1">
              {data.allFile.group.map((e1, i1) => (
                <div className="break-inside-avoid" key={i1}>
                  <h6 id={e1.fieldValue}>{e1.fieldValue}</h6>
                  {e1.edges.map((e2, i2) => (
                    <AccordionItem
                      className="accordion__item"
                      key={i2}
                    >

                      <AccordionItemHeading>
                        <AccordionItemButton className="accordion-header bg-white">
                          {e2.node.childMarkdownRemark.frontmatter.title}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel
                        className="p-6 bg-gray"
                      >
                        <div
                          className="accordion-body__contents"
                          dangerouslySetInnerHTML={{
                            __html: e2.node.childMarkdownRemark.html,
                          }}
                        />
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
