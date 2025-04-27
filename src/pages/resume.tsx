import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';
import { DefaultPageProps } from './_app';

interface ResumePageProps extends DefaultPageProps{}

const ResumePage: React.FC<ResumePageProps> = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <NextSeo title="Resume" description='Resume of Nirmal Khedkar' />
      <iframe
        title="Resume of Nirmal Khedkar"
        src={`/Resume.pdf`}
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
          openGraph: {
            type: "website",
            url: `https://nirmalhk7.com/resume`,
            images: [
              {
                url: `https://nirmalhk7.com${beachImage.src}`,
                alt: "Hi, I'm Nirmal Khedkar",
                width: 900,
                height: 800
              },
            ],
          },
          twitter: {
            site: `https://nirmalhk7.com/resume`,
          },
        }
      }
    },
  };
};