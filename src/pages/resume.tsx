import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

type ResumePageProps = {
  pdfUrl: string;
};

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

export const getStaticProps: GetStaticProps<any> = async () => {
  return {
    props: {
      pageMetadata: {
        enableWrap: false,
        seoMetadata: {
          title: "Resume"
        }
      }
    },
  };
};