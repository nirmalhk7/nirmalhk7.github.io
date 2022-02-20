import React from "react";
import Link from "../../components/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faPinterest,
  faTwitter,
  faFacebook,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  
} from "react-share";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Commento from "../../components/commento";
import { ProjectsService } from "../../services/projectService";


export async function getStaticPaths() {
  const fs=require("fs");
  const projectService= new ProjectsService();
  
  return {
    paths:  fs.readdirSync(projectService._directory).map((e)=>`/project/${e.split(".md")[0]}`) ,
    fallback: true
  };
}

export async function getStaticProps(context) {
  const projectsService = new ProjectsService();
 const project = await projectsService.single(context.params.projectId);
  return {
    props: {
      project,
      location: {}
    }
  };
}


const ProjectTemplate = ({ location, project }) => {
  const shareProps = {
    title:444 ,
  };
  return (
    <article className="blog-single has-bottom-sep">
        <div
          className="page-header page-header--single page-hero parallax"
          style={{
         backgroundSize: "cover",
          }}
        >
          <div className="m-auto page-header__content narrow">
            <article className="col-12">
              <div className="page-header__info">
                <div className="page-header__cat" />
              </div>
              <h1 className="page-header__title">
                <a href="#0" title="">
                  {project.frontmatter.title}
                </a>
              </h1>
            </article>
          </div>
        </div>
        <div
          className="row blog-content m-auto"
          style={{ paddingBottom: "72px" }}
        >
          <div className="col-12 blog-content__main">
            <div
              className="blogpost"
              dangerouslySetInnerHTML={{
                __html: project.html,
              }}
              style={{ marginTop: "2em" }}
            />
            <div className="blog-content__pagenav">
              <h6 className="boxfont text-uppercase mt-0">Share the article</h6>
              <TwitterShareButton
                hashtags={project.frontmatter.category}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faTwitter}
                />
              </TwitterShareButton>
              <LinkedinShareButton
                source={location.href}
                summary={project.frontmatter.title}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faLinkedin}
                />
              </LinkedinShareButton>
              <FacebookShareButton
                hashtag={`#${project.frontmatter.category}`}
                quote={`${project.frontmatter.title} by Nirmal Khedkar`}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faFacebook}
                />
              </FacebookShareButton>
              <PinterestShareButton {...shareProps}>
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faPinterest}
                />
              </PinterestShareButton>
              <WhatsappShareButton {...shareProps}>
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faWhatsapp}
                />
              </WhatsappShareButton>
              <TelegramShareButton
                title={`${project.frontmatter.title} by Nirmal Khedkar`}
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faTelegram}
                />
              </TelegramShareButton>
              <EmailShareButton
                body="I found this interesting blog article that you might like:"
                subject="Check out this blog on nirmalhk7.tech"
                {...shareProps}
              >
                <FontAwesomeIcon
                  className="blog-social text-accent"
                  icon={faEnvelope}
                />
              </EmailShareButton>
              <p
                className="blog-content__tags"
                style={{ marginTop: "3rem!important" }}
              >
                <span className="blog-content__tag-list">
                  {project.frontmatter.tags.map(
                    (element, index) => (
                      <a href="#0" key={index}>
                        {element}
                      </a>
                    )
                  )}
                </span>
              </p>
              <div className="blog-content__all">
                <a className="btn btn--primary" href="/blog">
                  View All Posts
                </a>
              </div>
              <hr />

              <Commento id={location.href} />
            </div>
          </div>
        </div>
      </article>
  );
};

export default ProjectTemplate;
