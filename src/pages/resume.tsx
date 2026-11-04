import React from "react";
import { GetStaticProps } from "next";
import { DefaultPageProps } from "./_app";
import { editorialStyles as styles } from "@/components/Site/Editorial";
import { openGraphImage } from "@/util/openGraph";
import { trackEvent } from "@/util/analytics";

export default function ResumePage() {
  const started=React.useRef<number | null>(null);
  React.useEffect(() => { started.current=Date.now(); }, []);
  const record = (action: string) => trackEvent('embed_status',{content_id:'resume',content_type:'pdf',action,duration_msec:started.current===null?undefined:Date.now()-started.current});
  return (
    <iframe
      title="Nirmal Khedkar résumé"
      src={`/Resume.pdf?v=${process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? "dev"}#view=FitH`}
      className={styles.resumePreview}
      onLoad={() => record('load')}
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
