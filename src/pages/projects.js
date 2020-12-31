import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { graphql } from "gatsby";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openIndex: -1,
      hasClicked: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (event) => {
    event.preventDefault();
    event.persist();
    if (this.state.openIndex === parseInt(event.target.id.split("-")[1])) {
      this.setState({
        hasClicked: false,
        openIndex: -1,
      });
    } else {
      this.setState({
        hasClicked: true,
        openIndex: parseInt(event.target.id.split("-")[1]),
      });
    }
  };

  render() {
    return (
      <>
        <Layout>
          <SEO title="Projects" />
          <section className="page-header page-hero parallax bootstrap-wrapper" id="projects-header">
            <div className="container page-header__content">
              <article className="col-full">
                <h1 className="page-header__title">
                  <a href="#0" title="Projects">
                    Projects
                  </a>
                </h1>
                <div className="page-header__info">
                  <div className="page-header__cat">Projects Catalogue of Nirmal Khedkar</div>
                </div>
                <p className="narrow">
                  I'm a fullstack and hybrid product developer, currently understanding how ML models are deployed on
                  cloud platforms. I love building stuff! <FontAwesomeIcon icon={faWrench} className="ml-2" />{" "}
                </p>
              </article>
            </div>
          </section>

          <section className="blog-content-wrap bootstrap-wrapper">
            <div className="container blog-content">
              <div className="">
                <div className="blog-list block-1-2 block-tab-full">
                  <div className="accordion js-accordion">
                    {this.props.data.allFile.group.map((e1, i1) => (
                      <React.Fragment key={i1}>
                        <h6 id={e1.fieldValue}>{e1.fieldValue}</h6>
                        {e1.edges.map((e2, i2) => (
                          <div
                            id={"accordion-" + i1 + i2}
                            key={i1 + "-" + i2}
                            onClick={this.handleClick}
                            className={`accordion__item js-accordion-item ${
                              this.state.hasClicked && i1 * 10 + i2 === this.state.openIndex ? "active" : ""
                            }`}
                          >
                            <div id={"accordionheader-" + i1 + i2} className="accordion-header js-accordion-header">
                              {e2.node.childMarkdownRemark.frontmatter.title}
                            </div>
                            <div
                              className="accordion-body js-accordion-body"
                              style={{
                                display:
                                  this.state.hasClicked && this.state.openIndex === i1 * 10 + i2 ? "block" : "none",
                              }}
                            >
                              <div
                                className="accordion-body__contents"
                                dangerouslySetInnerHTML={{
                                  __html: e2.node.childMarkdownRemark.html,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
    );
  }
}

export const postQuery = graphql`
  query projects {
    allFile(filter: { sourceInstanceName: { eq: "projects" } }, sort: { order: DESC, fields: birthTime }) {
      group(field: childMarkdownRemark___frontmatter___tags) {
        edges {
          node {
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
