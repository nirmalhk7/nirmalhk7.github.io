import React from "react";
import { GetStaticProps } from "next";
import { DefaultPageProps } from "./_app";
import { editorialStyles as styles } from "@/components/Site/Editorial";
import { openGraphImage } from "@/util/openGraph";

export default function ResumePage() {
  return (
    <iframe
      title="Nirmal Khedkar résumé"
      src={`/Resume.pdf?v=${process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? "dev"}#view=FitH`}
      className={styles.resumePreview}
    />
  );
}

export const getStaticProps: GetStaticProps<DefaultPageProps> = async () => ({
  props: {
    pageMetadata: {
      enableWrap: false,
      layoutVariant: "portfolio",
      seoMetadata: {
        title: "Résumé",
        description: "View Nirmal Khedkar’s résumé, with software engineering experience at Visa and ZOLL Data Systems, education, and technical skills.",
        canonical: "https://nirmalhk7.com/resume",
        openGraph: { url: "https://nirmalhk7.com/resume", images: [openGraphImage("My Résumé", "Engineering experience, education, and skills.", "resume")] },
      },
    },
  },
});
