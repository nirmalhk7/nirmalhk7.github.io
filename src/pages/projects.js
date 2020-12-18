import React from "react";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { graphql } from "gatsby";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: [],
      openIndex: 0,
      hasClicked: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillReceiveProps(props) {
    this.setState({ isOpen: new Array(this.props.data.allFile.nodes.length).fill(false) });
  }
  handleClick = (event) => {
    event.preventDefault();
    event.persist();
    console.log(event.target.id, event.target.value);
    if (this.state.openIndex === parseInt(event.target.id.split("-")[1])) {
      this.setState({
        hasClicked: false,
        openIndex: 0,
      });
    } else {
      this.setState({
        hasClicked: true,
        openIndex: parseInt(event.target.id.split("-")[1]),
      });
    }
  };

  render() {
    let data = this.props.data.allFile.nodes;
    let projectIndex = 0;
    return (
      <>
        <Layout>
          <SEO title="Projects" />
          {/*TODO Fix Projects background*/}
          <section className="page-header page-hero parallax projects-img">
            <div className="row page-header__content">
              <article className="col-full">
                <h1 className="page-header__title">
                  <a href="#0" title="Projects">
                    Projects
                  </a>
                </h1>
                <div className="page-header__info">
                  <div className="page-header__cat">Project Catalogue of Nirmal Khedkar</div>
                </div>
                <p>I love building stuff.</p>
              </article>
            </div>
          </section>

          <section className="blog-content-wrap">
            <div className="row blog-content">
              <div className="col-full">
                <div className="blog-list block-1-2 block-tab-full">
                  <div className="accordion js-accordion">
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Language/Framework</th>
                            <th>Project</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((a, i) => {
                            let xd = data.filter(
                              (e) =>
                                e.childMarkdownRemark.frontmatter.medium === a.childMarkdownRemark.frontmatter.medium
                            );
                            let medium = a.childMarkdownRemark.frontmatter.medium;
                            return (
                              <tr key={"x" + i}>
                                <td>{medium}</td>
                                <td>
                                  {xd &&
                                    xd.map((element, index) => (
                                      <div
                                        id={"accordion-" + projectIndex}
                                        key={medium + "-" + index}
                                        onClick={this.handleClick}
                                        className={`accordion__item js-accordion-item ${
                                          this.state.hasClicked && projectIndex === this.state.openIndex ? "active" : ""
                                        }`}
                                      >
                                        <div
                                          id={"accordionheader-" + projectIndex}
                                          className="accordion-header js-accordion-header"
                                        >
                                          {element.childMarkdownRemark.frontmatter.name}
                                        </div>
                                        <div
                                          className="accordion-body js-accordion-body"
                                          style={{
                                            display:
                                              this.state.hasClicked && this.state.openIndex === projectIndex
                                                ? "block"
                                                : "none",
                                          }}
                                        >
                                          <div
                                            value={(projectIndex += 1)}
                                            className="accordion-body__contents"
                                            dangerouslySetInnerHTML={{ __html: element.childMarkdownRemark.html }}
                                          ></div>
                                        </div>
                                      </div>
                                    ))}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <br />
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
      nodes {
        sourceInstanceName
        childMarkdownRemark {
          frontmatter {
            name
            medium
          }
          html
        }
        birthtime
      }
    }
  }
`;

export default Projects;
