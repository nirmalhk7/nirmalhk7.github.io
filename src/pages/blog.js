import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql, Link } from "gatsby"
// import SocialMediaSideIcons from "../components/partials/social"

const Blog = () => {
  let data = useStaticQuery(
    graphql`
    query {
      allFile(filter: {sourceInstanceName: {eq: "pages-markdown"}}) {
        edges {
          node {
            childMarkdownRemark {
              frontmatter {
                title
                tags
                img
                description
                category
              }
            }
            name
          }
        }
      }
    }
    `
  )
  const getDatefromFilename = (name) => {
    let d = new Date(name.split("-").slice(0, 3).join("-"))
    return d
  }
  data = data.allFile.edges
  data = data.sort((a, b) => { return getDatefromFilename(b.node.name) - getDatefromFilename(a.node.name) })
  
  return (
    <Layout>
      <SEO title="Spaceride" />
      <section className="blog-wallpaper s-home page-hero target-section parallax" data-parallax="scroll" data-natural-width="3000" data-natural-height="2000" data-position-y="center">
        <div className="overlay"></div>
        <div className="home-content">
          <div className="row home-content__main">
            <h3>Official Blog of Nirmal Khedkar</h3>
            <h1 className="page-header__title">
              <a href="/blog" title="">
                Spaceride
              </a>
            </h1>
            <div className="page-header__info">
              <div className="page-header__cat">
                <div className="typewriter">
                  Technology, Finance, Environment and Future.
                </div>
              </div>
            </div>
            <div className="home-content__buttons">
              <a href="#blog" className="smoothscroll btn btn--stroke">
                Liftoff!
                </a>
            </div>
          </div>
        </div>
      </section>
      <section className="s-works inv target-section" id="blog">
        <div className="row blog-content">
          <div className="col-full">
            <div className="blog-list block-1-2 block-tab-full" style={{ marginTop: "0rem" }}>
              <div className="row">
                <div className="col-block">
                  <img src={data[0].node.childMarkdownRemark.frontmatter.img} alt="" />
                </div>
                <div className="col-block">
                  <h3 className="inv-header" style={{ color: "antiquewhite" }}>Latest on Spaceride</h3>
                  <h1 className="entry-title">
                    <Link className="white-text title-inv" to={'/blog/' + data[0].node.name.split("-").slice(3, data[0].node.name.length)}>{data[0].node.childMarkdownRemark.frontmatter.title}</Link>
                  </h1>
                  <div className="entry-content white-text"><p>
                    {data[0].node.childMarkdownRemark.frontmatter.description}
                  </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="blog-content-wrap">
        <div className="row blog-content">
          <div className="col-full">
            <div className="row narrow section-intro has-bottom-sep" style={{ paddingTop: "5em" }}>
              <div className="col-full text-center">
                <h3>Spaceride</h3>
                <h1>All Posts</h1>
                <p className="lead">
                </p>

              </div>
            </div>
            <div className="blog-list block-1-2 block-tab-full">
              <div className="row masonry-wrap">
                <div className="masonry">
                  {data.map((element, index) =>
                    <div key={index} className="masonry__brick">
                      <div className="item-folio">
                        <div className="item-folio__thumb">
                          <Link to={'/blog/' + element.node.name.split("-").slice(3, element.node.name.length)} className=""
                            title={element.node.childMarkdownRemark.frontmatter.description}>
                            <img src={element.node.childMarkdownRemark.frontmatter.img} alt={element.node.childMarkdownRemark.frontmatter.title} />
                          </Link>
                        </div>
                        <div className="item-folio__text">
                          <h3 className="item-folio__title">
                            {element.node.childMarkdownRemark.frontmatter.title}
                          </h3>
                          <p className="item-folio__cat">
                            <a href={"#" + element.node.childMarkdownRemark.frontmatter.category}>{element.node.childMarkdownRemark.frontmatter.category}</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="s-works target-section">
        <div className="row narrow section-intro has-bottom-sep" style={{ paddingTop: "5em" }}>
          <div className="col-full text-center">
            <h3>Browse by Category</h3>
          </div>
        </div>
        <div className="row blog-content">
          <div className="col-full">
            <div className="blog-list block-1-2 block-tab-full">
              {data.map((a, i) => {
                let category= a.node.childMarkdownRemark.frontmatter.category
                let xfilter= data.filter((e) => e.node.childMarkdownRemark.frontmatter.category === category)
                return (
                  <article key={i} className="col-block">
                    <h2 className="h01">{category}</h2>
                    <ul>
                      {xfilter && xfilter.map((element, index) =>
                        {
                          let title= element.node.childMarkdownRemark.frontmatter.title
                          let url= '/blog/' + element.node.name.split("-").slice(3, element.node.name.length);
                          return (
                            <li key={index}><Link title={title} to={url}>{title}</Link></li>
                          );
                        })}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Blog
