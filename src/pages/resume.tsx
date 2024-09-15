import { NextSeo } from 'next-seo';
import React from 'react';

type PDFViewerProps = {
  pdfUrl: string;
};

const PDFViewer: React.FC<PDFViewerProps> = () => {
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

export default PDFViewer;