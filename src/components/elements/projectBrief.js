import { Link } from "gatsby";

const Projects = ({ projects, isOpen, handleClick }) => (
  <section className="bg-gray" id="projects">
    <div className="sm:container mx-auto">
      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
        <div className="">
          <div className="pb-6 relative">
            <div className=" text-center">
              <h3 className="font-blocky font-semibold mb-0 mt-0 uppercase text-accent">
                Projects
              </h3>
              <h1 className="font-bold leading-snug mt-0">
                See My Latest Projects
              </h1>
              <p className="font-lead font-blocky mb-16">
                Find my projects <Link to="/projects">categorized here</Link>.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full left">
          <div className="rounded my-auto mx-0 js-accordion">
            {projects.map((element, index) => (
              <div
                className={`accordion__item js-accordion-item`}
                id={`accordion-${index}`}
                key={index}
              >
                <div
                  className={`uppercase cursor-pointer text-mini 
                  transition p-5 font-blocky font-semibold 
                  after:content-['+'] after:text-accent after:float-right 
                  after:relative after:font-bold after:text-base ${
                    isOpen[index]
                      ? "bg-accent after:content-['-'] after:font-bold  text-white after:text-white"
                      : ""
                  }`}
                  id={`accordionheader-${index}`}
                  onClick={handleClick}
                  onKeyDown={handleClick}
                  role="button"
                  tabIndex={0}
                >
                  {element.frontmatter.title}
                </div>
                <div
                  className="hidden bg-white | js-accordion-body"
                  id={`accordionbody-${index}`}
                  style={{
                    display: `${isOpen[index] ? "block" : "none"}`,
                  }}
                >
                  <div className="p-5">
                    <p>{element.excerpt}</p>
                    <Link to={`/projects?id=${element.id}`}>
                      Find more here
                    </Link>
                    .&nbsp;&nbsp;&nbsp;
                    <code>{element.frontmatter.tags[0]}</code>
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
