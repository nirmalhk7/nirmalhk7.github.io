import React from "react";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Router from 'next/router'
import { ProjectsService } from "../services/projectService";

export async function getStaticProps(context) {
  const projectsService = new ProjectsService();
  const projects = await projectsService.detailed().then(() => projectsService.groupBy("tags"));
  return {
    props: {
      projects
    }
  };
}


class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openIndex: -1,
      hasClicked: false,
      // routeKey: new URLSearchParams(props.location.search).get("id"),
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.state.openIndex === -1 && this.state.routeKey) {
      this.setState({
        openIndex: parseInt(this.state.routeKey),
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
        openIndex: parseInt(key),
      });
    }
  };

  render() {
    return (
      <>
        <section
          className="page-header page-hero parallax"
          id="projects-header"
        >

          <div className="sm:container mx-auto page-header__content">
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

        <section className="bg-white">
          <div className="sm:container mx-auto blog-content">
            <div className="blog-list block-1-2 block-w-full">
              <div className="accordion js-accordion">
                <div className="grid grid-cols-2 gap-4">

                  {typeof (this.props.projects) === 'object' && Object.keys(this.props.projects).map((projectField) => (
                    <div className="mb-10" key={projectField}>
                      <h6 className="font-blocky font-bold uppercase" id={projectField}>{projectField}</h6>
                      {this.props.projects[projectField].map((element) => (
                        <div
                          className={`accordion__item js-accordion-item ${this.state.hasClicked &&
                            element.index === this.state.openIndex
                            ? "active"
                            : ""
                            }`}
                          id={`acc@${element.index}`}
                          key={element.index}
                        >
                          <div
                            className={`uppercase cursor-pointer text-mini 
                            transition p-5 font-blocky font-semibold 
                            ${element.detailedPage ? "after:content-['→']" : "after:content-['+']"} after:text-accent after:float-right 
                            after:relative after:font-bold after:text-base  ${this.state.hasClicked &&
                                this.state.openIndex === element.index
                                ? "bg-accent after:content-['-'] after:font-bold  text-white after:text-white"
                                : ""
                              }`}
                            id={`header@${element.index}`}
                            onClick={element.detailedPage ? false : this.handleClick}
                            onKeyDown={this.handleClick}
                            role="button"
                            tabIndex={0}
                          >
                            {element.frontmatter.title}
                          </div>
                          <div
                            className="hidden bg-gray p-5 | js-accordion-body"
                            style={{
                              display:
                                this.state.hasClicked &&
                                  this.state.openIndex === element.index
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <div
                              className="accordion-body__contents"
                              dangerouslySetInnerHTML={{
                                __html: element.content,
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
      </>
    );
  }
}

export default Projects;
