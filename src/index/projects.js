import Link from "../components/link";

const Projects = ({ projects, isOpen, handleClick }) => (
  <section className="bg-gray" id="projects">
    <div className="container mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-1">
        <div className="w-full right">
          <div className="pb-6 relative">
            <div className="">
              <h3 className="font-heading text-3xl font-semibold mb-0 mt-0 uppercase text-accent">Projects</h3>
              <h1 className="text-6xl font-bold leading-snug mt-0">See My Latest Projects</h1>
              <p className="lead">
                Find my projects <Link to="/projects">categorized here</Link>.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 w-full left">
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
