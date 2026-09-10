import { GetStaticProps } from 'next';
import React from 'react';
import { DefaultPageProps } from './_app';
import { trackEvent, trackSelectContent } from '@/util/analytics';

interface ResumePageProps extends DefaultPageProps{}

const ResumePage: React.FC<ResumePageProps> = () => {
  const resumeUrl = `/Resume.pdf?v=${process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? "dev"}`;
  const [showPreview, setShowPreview] = React.useState(false);

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
    <main className="h-screen w-screen flex flex-col bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="flex items-center justify-between gap-6 px-6 py-4">
        <div>
          <h1 className="m-0 text-3xl text-white">Nirmal Khedkar&apos;s Resume</h1>
          <p className="m-0 text-base text-gray-300">
            Software engineering experience, skills, education, and selected projects.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="button button-accent whitespace-nowrap"
            onClick={() => setShowPreview((current) => !current)}
          >
            {showPreview ? "Hide preview" : "Preview PDF"}
          </button>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-accent-fill whitespace-nowrap"
          >
            Open PDF
          </a>
        </div>
      </header>
      {showPreview ? (
        <iframe
          title="Resume of Nirmal Khedkar"
          src={resumeUrl}
          className="w-full flex-1 border-none bg-white"
        />
      ) : (
        <section className="flex flex-1 items-center justify-center px-6 text-center">
          <div className="max-w-3xl">
            <h2 className="mb-6 text-5xl text-white">Software Engineer</h2>
            <p className="text-2xl leading-relaxed text-gray-300">
              Experience building reliable distributed systems, cloud infrastructure,
              full-stack products, automation, and developer tooling. Open the PDF for
              complete work history, education, skills, and project details.
            </p>
          </div>
        </section>
      )}
    </main>
  );
};

export default ResumePage;

export const getStaticProps: GetStaticProps<ResumePageProps> = async () => {
  return {
    props: {
      pageMetadata: {
        enableWrap: false,
        seoMetadata: {
          title: "Software Engineering Resume",
          description: "Review Nirmal Khedkar's software engineering resume, including experience building reliable systems, cloud infrastructure, full-stack applications, and developer tools.",
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
                url: "https://nirmalhk7.com/api/og?title=Nirmal%20Khedkar%27s%20Resume",
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
