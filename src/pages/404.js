import React from "react";


const NotFoundPage = ({ location }) => (
  <>
    <section className="page-header page-hero parallax notfound-img">
      <div className="page-header__content m-auto">
        <article className="sm:container mx-auto">
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
    <section className="blog-content-wrap">
      <div className="row blog-content m-auto">
        <div className="col-12">
          <h6 style={{ textAlign: "center" }}>
            Lost your way? Search what you need here.
          </h6>
          <div className="blog-list block-1-2 block-w-full">
            <input
              className="full-width"
              id="sampleInput"
              placeholder="Search Here"
              type="text"
            />
          </div>
        </div>
      </div>
    </section>
  </>
);

export default NotFoundPage;
