import React from "react";
import Navbar from "./components/partials/navbar";
import RandomQuote from "./components/partials/quote";
import Footer from "./components/partials/footer";
import SEO from "./components/seo";
import { graphql } from "gatsby";
import moment from "moment";

const BlogTemplate = ({ data }) => {
  console.log("DRT", data)
  data = data.markdownRemark
  let postDate = data.parent.name.split('-').slice(0, 3).join("-")
  return (
    <>
      <Navbar />
      <SEO title="Blog Template" />
      <article className="blog-single has-bottom-sep">
        <div className="page-header page-header--single page-hero parallax" style={{ backgroundImage: `url(${data.frontmatter.image})` }}>
          <div className="row page-header__content narrow">
            <article className="col-full">
              <div className="page-header__info">
                <div className="page-header__cat">
                  <a href="/categories/#Future">{data.frontmatter.category ? data.frontmatter.category : "Personal"}</a>
                </div>
              </div>
              <h1 className="page-header__title">
                <a href="#0" title="">
                  {data.frontmatter.title}
                </a>
              </h1>
              <ul className="page-header__meta">
                <li className="date">{moment(postDate,'YYYY-MM-DD').format('MMMM DD, YYYY')}</li>
              </ul>
            </article>
          </div>
        </div>
        <div className="row blog-content">
          <div className="col-full blog-content__main">
            <img src={data.frontmatter.image}/>
            <div className="blogpost" dangerouslySetInnerHTML={{ __html: data.html }} />
            <div className="blog-content__pagenav">
              <p className="boxfont">Spread the love</p>
              <a href="https://www.facebook.com/sharer.php?u=https://nirmalhk7.github.io//future/2019/06/21/onesmallstep&title=One Small Step" className="share">
                <i className="im im-facebook" aria-hidden="true"></i>
              </a>
              <a href="https://twitter.com/share?text=One Small Step- Nirmal Khedkar&url=https://http://localhost:4000//future/2019/06/21/onesmallstep
    " className="share">
                <i className="fab fa-twitter" aria-hidden="true"></i>
              </a>
              <a href="#0" className="share">
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="#0" className="share">
                <i className="fab fa-pinterest" aria-hidden="true"></i>
              </a>
              <a href="#0" className="share">
                <i className="fab fa-linkedin" aria-hidden="true"></i>
              </a>
              <p className="blog-content__tags" style={{ marginTop: "3rem!important" }}>
                <span>
                  <a href="/categories/#Future">{data.frontmatter.category ? data.frontmatter.category : "Personal"}</a>
                </span>
                <span className="blog-content__tag-list">
                  {/* {data.frontmatter.tags && data.frontmatter.tags.map((element,index) =>
                    <a key={index} href="#0">{element}</a>
                  )} */}
                </span>
              </p>
              <div className="blog-content__all">
                <a href="/blog" className="btn btn--primary">
                  View All Post
                        </a>
              </div>
            </div>
          </div>
        </div>
      </article>
      <RandomQuote />
      <Footer />
    </>
  )
}
// 2616b224-2bf8-549d-a342-22543bcfa627
export const postQuery = graphql`
	query($pathSlug: String!) {
    markdownRemark(id: {glob: $pathSlug}) {
      html
      frontmatter {
        title
        tags
        img
        description
        category
      }
      parent {
        ... on File {
          name
        }
      }
    }
	}
`;

export default BlogTemplate;