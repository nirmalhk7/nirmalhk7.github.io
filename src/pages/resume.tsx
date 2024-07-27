import { NextSeo } from 'next-seo';
import React from 'react';

type PDFViewerProps = {
  pdfUrl: string;
};

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <NextSeo title="Resume" description='Resume of Nirmal Khedkar' />
      <iframe
        src="https://drive.google.com/file/d/1uiBM20zWZrbdRYfJAP-2mr_2aoyL3wac/preview"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default PDFViewer;