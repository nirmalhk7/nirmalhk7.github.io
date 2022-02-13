import Link from "../components/link";

const Projects = ({ projects, isOpen, handleClick }) => (
  <section className="bg-gray bootstrap-wrapper" id="projects">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 tab-full right">
          <div className="narrow section-intro has-bottom-sep">
            <div className="">
              <h3 className="text-accent">Projects</h3>
              <h1>See My Latest Projects</h1>
              <p className="lead">
                Find my projects <Link to="/projects">categorized here</Link>.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 tab-full left">
          <div className="accordion js-accordion">
            {projects.map((element, index) => (
              <div
                className={`accordion__item js-accordion-item ${
                  isOpen[index] ? "active" : ""
                }`}
                id={`accordion-${index}`}
                key={index}
              >
                <div
                  className="accordion-header bg-gray js-accordion-header"
                  id={`accordionheader-${index}`}
                  onClick={handleClick}
                  onKeyDown={handleClick}
                  role="button"
                  tabIndex={0}
                >
                  {element.childMarkdownRemark.frontmatter.title}
                </div>
                <div
                  className="accordion-body js-accordion-body bg-white"
                  id={`accordionbody-${index}`}
                  style={{
                    display: `${isOpen[index] ? "block" : "none"}`,
                  }}
                >
                  <div className="accordion-body__contents">
                    <p>{element.childMarkdownRemark.excerpt}</p>
                    <Link to={`/projects?id=${element.id}`}>
                      Find more here
                    </Link>
                    .&nbsp;&nbsp;&nbsp;
                    <code>
                      {element.childMarkdownRemark.frontmatter.tags[0]}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default Projects;