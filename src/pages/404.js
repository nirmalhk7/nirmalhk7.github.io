import React from "react";

import Layout from "../layouts/main";
import SearchEnggOp from "../elements/seo";

const NotFoundPage = ({ location }) => (
  <Layout location={location}>
    <SearchEnggOp title="404: Not Found" />
    <section className="page-header page-hero bg-fixed bg-center bg-no-repeat notfound-img">
      <div className="page-header__content  m-auto">
        <article className="container mx-auto">
          <h1 className="page-header__title">
            <a href="#0" title="404 Not Found">
              404
            </a>
          </h1>
          <div className="page-header__info">
            <div className="page-header__cat">Page Not Found</div>
          </div>
        </article>
      </div>
    </section>
    <section className="bg-white pt-16 pb-48">
      <div className=" max-w-screen-lg m-auto">
        <div className="w-full">
          <h6 style={{ textAlign: "center" }}>
            Lost your way? Search what you need here.
          </h6>
          <div className="blog-list block-1-2 block-tab-full">
            <input
              className="w-full"
              id="sampleInput"
              placeholder="Search Here"
              type="text"
            />
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default NotFoundPage;
