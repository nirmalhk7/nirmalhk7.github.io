import React from "react";

import SocialMediaIcons from "../components/social";
import Link from "../components/link";
import LatestBlogItem from "../blog/latestBlogItem";
import MasonPanel from "../blog/masonPanel";
import { BlogsService } from "../services/blogService";



export async function getStaticProps(context) {
  const blogService = new BlogsService();
 const blog = await blogService.brief();
  return {
    props: {
      first: blog[0],
      rest: blog.slice(1),
      location: {}
    }
  };
}

const Blog = ({ first, rest }) => {
  return (
    <>
      <section
        className="s-home page-hero  parallax"
        data-natural-height="2000"
        data-natural-width="3000"
        data-parallax="scroll"
        data-position-y="center"
        id="blog-header"
      >
        <div className="overlay" />
        <div className="home-content">
          <div className="sm:container mx-auto home-content__main">
            <h3 className="ital-hover">Official Blog of Nirmal Khedkar</h3>
            <h1 className="page-header__title">
              <Link title="" to="/blog">
                Eclipse
              </Link>
            </h1>
            <div className="page-header__info">
              <div className="page-header__cat">
                Technology, Finance, Environment and the Future.
              </div>
            </div>
            <div className="home-content__buttons">
              <blog
                className="smoothscroll btn btn-outline-white"
                href="#blog-first"
              >
                Explore
              </blog>
            </div>
          </div>
        </div>
        <SocialMediaIcons />
      </section>
      <LatestBlogItem item={first} />
      <MasonPanel
        blogItems={rest}
        sitename
      />
    </>
  );
};

export default Blog;
