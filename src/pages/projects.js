import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

class Projects extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isOpen: []
    }
  }
  componentWillReceiveProps(props){
    this.setState({isOpen:new Array(this.props.data.allFile.nodes.length).fill(false)})
  }
  render() {
    let data = this.props.data.allFile.nodes
    return (
      <>
        <Layout>
          <SEO title="Projects" />
          <section class="page-header page-hero parallax" style={{ backgroundImage: "url(/assets/images/blog-bg-01.jpg)" }}>
            <div class="row page-header__content">
              <article class="col-full">
                <h1 class="page-header__title">
                  <a href="#0" title="Projects">
                    Projects
                  </a>
                </h1>
                <div class="page-header__info">
                  <div class="page-header__cat">
                    Project Catalogue of Nirmal Khedkar
                  </div>
                </div>
                <p>I love building stuff.</p>
              </article>
            </div>
          </section>

          <section class="blog-content-wrap" id="blog">
            <div class="row blog-content">
              <div class="col-full">
                <div class="blog-list block-1-2 block-tab-full">
                  <div class="accordion js-accordion">
                    <div class="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Language/Framework</th>
                            <th>Project</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {data.map((a, i) =>
                <article index={i} className="col-block">
                  <h2 className="h01">{a.category}</h2>
                  <ul>
                    {data.filter((e) => e.category === a.category) && data.filter((e) => e.category === a.category).map((element, index) =>
                      <li key={index}><a title={element.title} href={element.URL}>{element.title}</a></li>
                    )}
                  </ul>
                </article>
              )} */}
                          {data.map((a, i) =>
                            {
                              let xd=data.filter((e) => e.childMarkdownRemark.frontmatter.medium === a.childMarkdownRemark.frontmatter.medium);
                              let medium=a.childMarkdownRemark.frontmatter.medium;
                              return(
                              <tr>
                                <td>{medium}</td>
                                <td>
                                  {xd && xd.map((element,index)=>
                                    <div key={medium+"-"+index} className="accordion__item js-accordion-item">
                                      <div className="accordion-header js-accordion-header">
                                        {element.childMarkdownRemark.frontmatter.name}
                                      </div>
                                      <div className="accordion-body js-accordion-body">
                                        <div className="accordion-body__contents" dangerouslySetInnerHTML={{__html: element.childMarkdownRemark.html}}>

                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {/* {xd && xd.map((element, index) =>
                                    <div className="accordion__item js-accordion-item">
                                      <div className="accordion-header js-accordion-header">{element.childMarkdownRemark.frontmatter.name}</div>
                                      <div className="accordion-body js-accordion-body">
                                        <div className="accordion-body__contents" dangerouslySetInnerHTML={{ __html: element.childMarkdownRemark.html}} >
                                        </div>
                                    </div>
                                  )} */}
                                </td>
                              </tr>
                            )}
                          )}
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
    allFile(filter: {sourceInstanceName: {eq: "projects"}}, sort: {order: DESC, fields: birthTime}) {
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

export default Projects