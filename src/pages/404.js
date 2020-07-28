import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <section className="page-header page-hero parallax" style={{ backgroundImage: "url(assets/images/blog-bg-01.jpg)" }}>
      <div className="row page-header__content">
        <article className="col-full">
          <h1 className="page-header__title">
            <a href="#0" title="404 Not Found">
              404
            </a>
          </h1>
          <div className="page-header__info">
            <div className="page-header__cat">
              Page Not Found
                </div>
          </div>
        </article>
      </div>
    </section>
    <section className="blog-content-wrap">
      <div className="row blog-content">
        <div className="col-full">
          <h6 style={{ textAlign: "center" }}>Lost your way? Search what you need here.</h6>
          <div className="blog-list block-1-2 block-tab-full">
            <input className="full-width" type="text" placeholder="Search Here" id="sampleInput" />
          </div>
        </div>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage
