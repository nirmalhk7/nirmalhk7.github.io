import React from "react";
import Layout from "../layouts/main";
import SearchEnggOp from "../elements/seo";
import { graphql } from "gatsby";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openIndex: -1,
      hasClicked: false,
      routeKey: new URLSearchParams(props.location.search).get("id"),
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.state.openIndex === -1 && this.state.routeKey) {
      this.setState({
        openIndex: this.state.routeKey,
        hasClicked: true,
      });
    }
  }
  handleClick = (event) => {
    event.preventDefault();
    event.persist();
    const key = event.target.id.split("@")[1];
    if (this.state.openIndex === key && this.state.hasClicked) {
      this.setState({
        hasClicked: false,
        openIndex: -1,
      });
    } else {
      this.setState({
        hasClicked: true,
        openIndex: key,
      });
    }
  };

  render() {
    return (
      <Layout location={this.props.location}>
        <SearchEnggOp title="Projects" />
        <section
          className="page-header page-hero bg-fixed bg-center bg-no-repeat "
          id="projects-header"
        >
          <div className="container page-header__content">
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
          <div className="container max-w-screen-lg">
            <div className="blog-list block-1-2 block-tab-full">
              <div className="my-0 mx-auto rounded js-accordion">
                <div className="grid grid-cols-2 md:grid-cols-1">
                  {this.props.data.allFile.group.map((e1, i1) => (
                    <div className="" key={i1}>
                      <h6 id={e1.fieldValue}>{e1.fieldValue}</h6>
                      {e1.edges.map((e2, i2) => (
                        <div
                          className={`accordion__item ${
                            this.state.hasClicked &&
                            e2.node.id === this.state.openIndex
                              ? "active"
                              : ""
                          }`}
                          id={`acc@${e2.node.id}`}
                          key={i2}
                        >
                          <div
                            className="accordion-header js-accordion-header"
                            id={`header@${e2.node.id}`}
                            onClick={this.handleClick}
                            onKeyDown={this.handleClick}
                            role="button"
                            tabIndex={0}
                          >
                            {e2.node.childMarkdownRemark.frontmatter.title}
                          </div>
                          <div
                            className="accordion-body bg-gray"
                            style={{
                              display:
                                this.state.hasClicked &&
                                this.state.openIndex === e2.node.id
                                  ? "block"
                                  : "none",
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

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
