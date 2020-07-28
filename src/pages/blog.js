import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Blog = () => (
  <Layout>
    <SEO title="Spaceride" />
    <section id="blog" className="blog-wallpaper s-home page-hero target-section parallax" data-parallax="scroll" data-natural-width="3000" data-natural-height="2000" data-position-y="center">
      <div className="overlay"></div>
      <div className="home-content">
        <div className="row home-content__main">
          <h3>Official Blog of Nirmal Khedkar</h3>
          <h1 className="page-header__title">
            <a href="#0" title="">
              Spaceride
                </a>
          </h1>
          <div className="page-header__info">
            <div className="page-header__cat">
              <div className="typewriter">
                Technology, Finance, Environment and Future.
                        {/* <br />
                                Plain and Simple. */}
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
      <ul className="home-social">

        <li>
          <a title="socialprofile" href="https://www.linkedin.com/in/nirmalhk7/">
            <i className="fab fa-linkedin ln" aria-hidden="true"></i>
            <span>LinkedIn</span>
          </a>
        </li>

        <li>
          <a title="socialprofile" href="https://www.github.com/nirmalhk7">
            <i className="fab fa-github gi" aria-hidden="true"></i>
            <span>GitHub</span>
          </a>
        </li>

        <li>
          <a title="socialprofile" href="https://angel.co/nirmalhk7">
            <i className="fab fa-angellist an" aria-hidden="true"></i>
            <span>Angellist</span>
          </a>
        </li>

        <li>
          <a title="socialprofile" href="https://www.goodreads.com/user/show/93069537-nirmal">
            <i className="fab fa-goodreads go" aria-hidden="true"></i>
            <span>Goodreads</span>
          </a>
        </li>

        <li>
          <a title="socialprofile" href="/feed.xml">
            <i className="fas fa-rss-square srr" aria-hidden="true"></i>
            <span>RSS</span>
          </a>
        </li>

        <li>
          <a title="socialprofile" href="https://dev.to/nirmalhk7">
            <i className="fab fa-dev dev" aria-hidden="true"></i>
            <span>DEV</span>
          </a>
        </li>

      </ul>
    </section>
  </Layout>
)

export default Blog
