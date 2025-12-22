import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faPinterest,
  faFacebook,
  faXTwitter,
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
import ReactMarkdown from "react-markdown";
import { BlogInterface } from "@/interfaces/blog";
import Link from "next/link";
import nasaGalaxy from "@/assets/images/nasa-earth.jpg";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { sampleSize } from "lodash";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import { DefaultPageProps } from "../_app";
import Jumbotron from "@/elements/jumbotron";
import { useRouter } from "next/router";
import Image from "next/image";
import ProfileImage from "@/assets/images/profile.png";

interface BlogTemplatePageProps extends DefaultPageProps {
  current: BlogInterface;
}

const BlogTemplate = ({
  current,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const shareIcons = "mr-5 my-5 text-5xl";
  // let imgPath = current.frontmatter.img
  let imgPath = "";
  const router = useRouter();
  const sharedButtonProps = {
    url: `https://nirmalhk7.com${router.asPath}`,
  };

  const shareButtons = [
    {
      Component: TwitterShareButton,
      Payload: {
        hashtags: current.frontmatter?.tags,
        title: current.frontmatter?.title,
        className: "hover:shadow-none hover:scale-110 cursor-pointer text-accent transition-colors duration-200",
      },
      Icon: faXTwitter,
      iconHoverClass: "hover:text-[#000000]"
    },
    {
      Component: LinkedinShareButton,
      Payload: {
        summary: `${current.frontmatter?.title} by Nirmal Khedkar`,
        source: `https://nirmalhk7.com`,
        className: "hover:shadow-none hover:scale-110 cursor-pointer text-accent transition-colors duration-200",
      },
      Icon: faLinkedin,
      iconHoverClass: "hover:text-[#0077b5]"
    },
    {
      Component: FacebookShareButton,
      Payload: {
        hashtag: `#${current.frontmatter?.category}`,
        quote: `${current.frontmatter?.title} by Nirmal Khedkar`,
        className: "hover:shadow-none hover:scale-110 cursor-pointer text-accent transition-colors duration-200",
      },
      iconHoverClass: "hover:text-[#1877F2]",
      Icon: faFacebook,
    },
    {
      Component: PinterestShareButton,
      Payload: {
        media: `https://nirmalhk7.com/assets/${current.frontmatter?.img}`,
        description: `${current.frontmatter?.title} by Nirmal Khedkar`,
        className: "hover:shadow-none hover:scale-110 cursor-pointer text-accent transition-colors duration-500",
      },
      iconHoverClass: "hover:text-[#E60023]",
      Icon: faPinterest,
    },
    {
      Component: WhatsappShareButton,
      Payload: {
        separator: " ",
        className: "hover:shadow-none hover:scale-110 cursor-pointer text-accent transition-colors duration-200",
      },
      iconHoverClass: "hover:text-[#25D366]",
      Icon: faWhatsapp,
    },
    {
      Component: TelegramShareButton,
      Payload: {
        title: `${current.frontmatter?.title} by Nirmal Khedkar`,
        className: "hover:shadow-none hover:scale-110 cursor-pointer text-accent transition-colors duration-200",
      },
      iconHoverClass: "hover:text-[#0088cc]",
      Icon: faTelegram,
    },
    {
      Component: EmailShareButton,
      Payload: {
        body: "Nirmal Khedkar is a fullstack software engineer. I this blog article he wrote online that you might like:",
        subject: "Check out this blog article by Nirmal Khedkar",
        separator: " ",
        className: "hover:shadow-none hover:scale-110 cursor-pointer text-accent transition-colors duration-200",
      },
      iconHoverClass: "hover:text-[#FFC107]",
      Icon: faEnvelope,
    },
  ];

  return (
    <main>
      <article className="bg-white has-bottom-sep">
        <Jumbotron.mini
          backgroundImage={current.frontmatter?.img as any}
          backgroundImageAlt="Earth from Space"
          title={current.frontmatter?.title || ""}
          centerAlign={true}
          subtitle=""
          DescriptionComponent={() => (
            <div className="page-header__info">
              <div className="page-header__cat">
                {current.frontmatter?.category?.map((category: string) => (
                  <React.Fragment key={category}>
                    <Link
                      className="text-white no-underline uppercase"
                      href={`/blog#${category}`}
                    >
                      {category}
                    </Link>
                    <div>{current.frontmatter?.date}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        />
        <div className="container mx-auto pt-20">
          <div className="w-full">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h3 {...props} className="text-black mt-5" />
                ),
                h2: ({ node, ...props }) => (
                  <h4 {...props} className="text-black mt-5" />
                ),
                h3: ({ node, ...props }) => (
                  <h5 {...props} className="text-black mt-5" />
                ),
                h4: "b",
                h5: "b",
                h6: "b",
                blockquote(props) {
                  const { children, node, ...rest } = props;
                  return (
                    <blockquote {...rest} className="scale-75 w-full">
                      {children}
                    </blockquote>
                  );
                },
                ul(props) {
                  const { children, node, ...rest } = props;
                  return (
                    <ul className="list-disc pl-5 leading-10">{children}</ul>
                  );
                },
                ol(props) {
                  const { children, node, ...rest } = props;
                  return (
                    <ol className="list-decimal pl-5 leading-10">{children}</ol>
                  );
                },
                p(props) {
                  const { children, node, ...rest } = props;
                  return <p className="mt-4 leading-10">{children}</p>;
                },
              }}
              skipHtml={false}
              className="text-black mb-14"
            >
              {current.content || ""}
            </ReactMarkdown>
            <div className="relative border-y-2 border-gray-100 my-24 py-5 grid grid-cols-8 gap-5">
              <div className="col-span-8 tablet:col-span-6 ">
                <h6 className="boxfont text-uppercase mt-0">
                  Share the article
                </h6>
                {shareButtons.map((shareSocialMedia, index) => {
                  const Component = shareSocialMedia.Component;
                  return (
                    <Component
                      key={index}
                      url={`https://nirmalhk7.com${router.asPath}`}
                      media={`https://nirmalhk7.com${current.frontmatter.img}`}
                      {...shareSocialMedia.Payload}
                    >
                      <FontAwesomeIcon
                        className={`mr-5 my-5 text-5xl text-accent ${shareSocialMedia.iconHoverClass}`}
                        icon={shareSocialMedia.Icon}
                      />
                    </Component>
                  );
                })}
                <p className="blog-content__tags">
                  <span></span>
                  <span className="blog-content__tag-list">
                    {current.frontmatter?.tags.map((element: string, index: number) => (
                      <a href="#0" key={index}>
                        {element}
                      </a>
                    ))}
                  </span>
                </p>
              </div>

              <div className="col-span-8 tablet:col-span-2 pr-5">
                <button
                  disabled
                  className="button-accent-fill w-full text-center h-fit my-2"
                  onClick={() => alert("Yes!")}
                >
                  Subscribe (WIP)
                </button>
                <Link
                  className="block button button-accent w-full text-center h-fit my-2"
                  href="/blog"
                >
                  View All Posts
                </Link>
              </div>
            </div>
            <div className="relative bg-gray-100 p-5 grid grid-cols-12 gap-5">
              <div className="col-span-12 tablet:col-span-1">
                <Image
                  src={ProfileImage}
                  width={500}
                  height={500}
                  alt="my profile image"
                  className="rounded-full"
                />
              </div>

              <div className="col-span-12 tablet:col-span-8 pl-10">
                Looking to boost your engineering team's performance and
                reliability? Hire Nirmal Khedkar. With two years of full-stack
                experience at Visa,{" "}
                <u>
                  he's your man to improve your system performance and handle
                  any runtime errors
                </u>
                . Nirmal is passionate about writing secure and efficient
                "fortress" code, and has a track record of working in all major
                languages (Java, JS, Python) and all major frameworks
                (Springboot, MERN/MEAN, NextJS, etc). Nirmal is ready than ever
                to make an immediate and positive impact to your team.
              </div>
              <div className="col-span-12 tablet:col-span-3">
                <Link
                  className="block button button-accent-fill hover:scale-50 w-full text-center h-fit my-2 animate-bounce"
                  href="/resume?utm_source=pitch"
                >
                  Hire Nirmal Now!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = loadMarkdownFiles("content/blog", {
    getContent: false,
    getExcerpt: false,
  });

  const paths = blogs.map((file) => {
    return {
      params: {
        blogId: file.slug,
      },
    };
  });

  return {
    paths,
    fallback: false, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps<BlogTemplatePageProps> = async (
  context
) => {
  const allQuotesYaml: QuoteInterface[] = require("../../../content/yml/quotes.yaml");
  const blogId = context.params?.blogId as string;
  const currentBlog = loadMarkdownFile(
    "content/blog/" + blogId + ".md",
    blogId,
    { getContent: true, getExcerpt: false }
  );

  return {
    props: {
      current: currentBlog,
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: currentBlog.frontmatter.title,
          description: currentBlog.frontmatter.description,
          openGraph: {
            type: "website",
            url: `https://nirmalhk7.com/blog/${blogId}`,
            images: [
              {
                url: `https://nirmalhk7.com${currentBlog.frontmatter.img}`,
                alt: currentBlog.frontmatter.title,
                width: 900,
                height: 800
              },
            ],
          },
          twitter: {
            site: `https://nirmalhk7.com/blog/${blogId}`,
            
          },
        },
      },
    },
  };
};

export default BlogTemplate;
