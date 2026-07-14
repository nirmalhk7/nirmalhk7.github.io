import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';
import { DefaultPageProps } from './_app';
import { trackEvent, trackSelectContent } from '@/util/analytics';

interface ResumePageProps extends DefaultPageProps{}

const ResumePage: React.FC<ResumePageProps> = () => {
  const resumeUrl = `/Resume.pdf?v=${process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? "dev"}`;

  React.useEffect(() => {
    trackSelectContent("resume", "Resume.pdf", {
      interaction_type: "view",
    });
    trackEvent("resume_preview", {
      source: "resume_page_iframe",
      preview_type: "embedded_pdf",
    });
  }, [resumeUrl]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nirmalhk7.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Resume",
        "item": "https://nirmalhk7.com/resume",
      },
    ],
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NextSeo title="Resume" description='Resume of Nirmal Khedkar' />
      <iframe
        title="Resume of Nirmal Khedkar"
        src={resumeUrl}
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default ResumePage;

export const getStaticProps: GetStaticProps<ResumePageProps> = async () => {
  return {
    props: {
      pageMetadata: {
        enableWrap: false,
        seoMetadata: {
          title: "Resume",
          description: "Looking to boost your engineering team's performance and reliability? Hire Nirmal Khedkar. With two years of full-stack experience at Visa, he's your man to improve your system performance and handle any runtime errors.",
          canonical: "https://nirmalhk7.com/resume",
          openGraph: {
            type: "profile",
            url: `https://nirmalhk7.com/resume`,
            profile: {
              firstName: "Nirmal",
              lastName: "Khedkar",
              username: "nirmalhk7",
              gender: "male",
            },
            images: [
              {
                url: `https://nirmalhk7.com/assets/images/BeachNK_1.jpg`,
                alt: "Hi, I'm Nirmal Khedkar",
                width: 1200,
                height: 630
              },
            ],
            },
            },
            },
            },
            };
            };
