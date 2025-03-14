import Link from "next/link";
import React from "react";
import WebSection from "@/elements/WebSection";

const BlogIntroSection = ({ name }: { name: string }) => (
  <WebSection
    className="bg-gradient-to-r from-accent/50 to-accent selection:bg-white selection:text-accent bg-white text-white"
    id="blog"
  >
    <div className="narrow mx-auto text-center  pb-6 relative">
      <div className="w-full">
        <h3 className="leading-tight text-white my-0">
          {name}
        </h3>
        <h1 className="mt-0">
          Latest From The Blog
        </h1>
        <p className="text-center m-0 p-0 font-normal">
          I have strong views on topics like Finance, Technology, Future and
          Environment. Find me&nbsp;
          <Link className="text-white" title={name} href="/blog">
            blogging about them here
          </Link>
          .
        </p>
      </div>
    </div>
  </WebSection>
);

export default BlogIntroSection;
