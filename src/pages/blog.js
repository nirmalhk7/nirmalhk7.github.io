import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { useStaticQuery, graphql, Link } from "gatsby"
// import SocialMediaSideIcons from "../components/partials/social"

const squashBlogData = (data) => {
  let i;
  let ans = []
  for (i in data) {
    let temp = {}
    let postDate = new Date(data[i]["node"]["parent"]["name"].split('-').slice(0, 3).join("-")).getTime()
    let postURL = data[i]["node"]["parent"]["name"].split('-').slice(3, data[i]["node"]["parent"]["name"].length).join("-")
    if (postDate <= new Date().getTime()) {
      temp["wordCount"] = data[i]["node"]["wordCount"]["words"]
      temp["title"] = data[i]["node"]["frontmatter"]["title"]
      temp["description"] = data[i]["node"]["frontmatter"]["description"]
      temp["tags"] = data[i]["node"]["frontmatter"]["tags"]
      temp["category"] = data[i]["node"]["frontmatter"]["category"]
      temp["image"] = data[i]["node"]["frontmatter"]["img"]
      temp["uploadDate"] = postDate
      temp["URL"] = "blog/" + postURL
      ans.push(temp)
    }
  }
  return ans.sort((a, b) => { return b.uploadDate - a.uploadDate })
}
const Blog = () => {
  let data = useStaticQuery(
    graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            wordCount {
              words
            }
            frontmatter {
              title,
              description,
              tags,
              img,
              category
            }
            parent {
              ... on File {
                name
              }
            }
          }
        }
      }
    }
    `
  )["allMarkdownRemark"]["edges"]
  data = squashBlogData(data)
  console.log("Blog", data);
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
                  <img src={data[0].image} alt="" />
                </div>
                <div className="col-block">
                  <h3 className="inv-header" style={{ color: "antiquewhite" }}>Latest on Spaceride</h3>
                  <h1 className="entry-title">
                    <a className="white-text title-inv" href={data[0].URL}>{data[0].title}</a>
                  </h1>
                  <div className="entry-content white-text"><p>
                    {data[0].description}
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
                    <div className="masonry__brick">
                      <div className="item-folio">
                        <div className="item-folio__thumb">
                          <Link to={element.URL} className="" title="My account of the week I spent for NIT Conclave Hackathon at NITRKL.">
                            <img src={element.image} alt={element.title} />
                          </Link>
                        </div>
                        <div className="item-folio__text">
                          <h3 className="item-folio__title">
                            {element.title}
                          </h3>
                          <p className="item-folio__cat">
                            <a href={"#"+element.category}>{element.category}</a>
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
              {data.map((a, i) =>
                <article index={i} className="col-block">
                  <h2 className="h01">{a.category}</h2>
                  <ul>
                    {data.filter((e) => e.category === a.category) && data.filter((e) => e.category === a.category).map((element, index) =>
                      <li key={index}><a title={element.title} href={element.URL}>{element.title}</a></li>
                    )}
                  </ul>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Blog
