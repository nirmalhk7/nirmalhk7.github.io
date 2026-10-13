import { GetStaticProps } from "next";
import Link from 'next/link';
import path from "path";
import React from "react";
import { DefaultPageProps } from "./_app";
import { SkillsInterface, WorkExperienceInterface } from "@/interfaces";
import { trackEvent, trackSelectContent } from "@/util/analytics";
import loadYaml from "@/util/loadYaml";
import { experienceHighlights } from "@/util/experienceHighlights";
import { PageHero, PageSection, editorialStyles as styles } from "@/components/Site/Editorial";
import resumeStyles from "@/components/Site/ResumeSummary.module.scss";
import { openGraphImage } from "@/util/openGraph";

type ResumeExperience = Omit<WorkExperienceInterface, "description"> & {
  description: string[];
};

interface ResumePageProps extends DefaultPageProps {
  experience: ResumeExperience[];
  skills: string[];
}

const systemsSkillOrder = [
  "JAVA",
  "SpringBoot",
  "Project Reactor",
  "Python",
  "GraphQL",
  "MySQL",
  "React",
];

const ResumePage: React.FC<ResumePageProps> = ({ experience, skills }) => {
  const resumeUrl = `/Resume.pdf?v=${process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? "dev"}`;
  const [canPreview, setCanPreview] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewState, setPreviewState] = React.useState<"idle" | "loading" | "loaded" | "error">("idle");

  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const updatePreviewAvailability = () => {
      setCanPreview(query.matches);
      if (!query.matches) {
        setShowPreview(false);
        setPreviewState("idle");
      }
    };

    updatePreviewAvailability();
    query.addEventListener?.("change", updatePreviewAvailability);
    return () => query.removeEventListener?.("change", updatePreviewAvailability);
  }, []);

  const trackPdfAction = (interactionType: "view" | "download") => {
    trackSelectContent("resume", "Resume.pdf", {
      interaction_type: interactionType,
    });
  };

  const togglePreview = () => {
    if (showPreview) {
      setShowPreview(false);
      setPreviewState("idle");
      return;
    }

    setShowPreview(true);
    setPreviewState("loading");
    trackSelectContent("resume", "Resume.pdf", {
      interaction_type: "preview",
    });
    trackEvent("resume_preview", {
      source: "resume_page_iframe",
      preview_type: "embedded_pdf",
    });
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nirmalhk7.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resume",
        item: "https://nirmalhk7.com/resume",
      },
    ],
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        eyebrow="Experience / Résumé"
        title="The résumé."
        description="Backend services, production infrastructure, and product engineering at Visa and ZOLL Data Systems."
        compact
      >
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.actionPrimary}
          onClick={() => trackPdfAction("view")}
        >
          Open PDF
        </a>
        <a
          href={resumeUrl}
          download="Nirmal-Khedkar-Resume.pdf"
          className={styles.action}
          onClick={() => trackPdfAction("download")}
        >
          Download PDF
        </a>
        {canPreview && (
          <button
            type="button"
            className={styles.action}
            onClick={togglePreview}
            aria-expanded={showPreview}
            aria-controls="resume-preview"
          >
            {showPreview ? "Hide preview" : "Preview PDF"}
          </button>
        )}
      </PageHero>

      <PageSection
        title="Experience"
        description="Roles, responsibilities, and the production work behind them."
      >
        <div className={resumeStyles.experienceList}>
          {experience.map((role) => (
            <article className={resumeStyles.role} key={`${role.company}-${role.post}-${role.timeframe}`}>
              <p className={resumeStyles.timeframe}>{role.timeframe}</p>
              <div className={resumeStyles.roleBody}>
                <h3>{role.company}</h3>
                <p className={resumeStyles.roleTitle}>{role.post}</p>
                <ul>
                  {role.description.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        tone="muted"
        title="Education and systems"
        description="Formal study and the tools used across backend, data, and product work."
      >
        <div className={resumeStyles.foundationGrid}>
          <section aria-labelledby="education-heading" className={resumeStyles.education}>
            <h3 id="education-heading">Education</h3>
            <div className={resumeStyles.credential}>
              <p>University of Colorado Boulder</p>
              <strong>Master of Science in Computer Science</strong>
              <p className={resumeStyles.educationDates}>August 2024 – May 2026</p>
            </div>
            <div className={resumeStyles.credential}>
              <p>National Institute of Technology Karnataka, Surathkal</p>
              <strong>Bachelor of Technology in Information Technology</strong>
              <p className={resumeStyles.educationDates}>July 2018 – May 2022</p>
            </div>
          </section>
          <section aria-labelledby="skills-heading" className={resumeStyles.skills}>
            <h3 id="skills-heading">Key systems skills</h3>
            <ul>
              {skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
            <h3 className={resumeStyles.homelabHeading}>In the homelab</h3>
            <p>Kubernetes, Terraform, and FluxCD. Ansible is a work in progress.</p>
            <Link href="/blog/homelab_architect">Read the architecture</Link>
          </section>
        </div>
      </PageSection>

      {showPreview && canPreview && (
        <PageSection title="PDF preview" description="A browser preview of the downloadable résumé.">
          <div id="resume-preview" className={resumeStyles.preview}>
            <p className={resumeStyles.previewStatus} role="status" aria-live="polite">
              {previewState === "loading" && "Loading PDF preview…"}
              {previewState === "loaded" && "Preview loaded."}
              {previewState === "error" && "The PDF preview could not load."}
            </p>
            <p className={resumeStyles.previewFallback}>
              Some browsers cannot display embedded PDFs. Open or download the PDF if the preview stays blank.
            </p>
            <iframe
              title="Resume of Nirmal Khedkar"
              src={resumeUrl}
              className={resumeStyles.previewFrame}
              onLoad={() => setPreviewState("loaded")}
              onError={() => setPreviewState("error")}
            />
          </div>
        </PageSection>
      )}
    </main>
  );
};

export default ResumePage;

export const getStaticProps: GetStaticProps<ResumePageProps> = async () => {
  const contentDir = path.join(process.cwd(), "content", "yml");
  const sourceExperience = loadYaml<WorkExperienceInterface[]>(path.join(contentDir, "workexperiences.yaml"));
  const sourceSkills = loadYaml<SkillsInterface[]>(path.join(contentDir, "skills.yaml"));

  const experience = sourceExperience.map((role) => {
    const descriptions = Array.isArray(role.description) ? role.description : [role.description];
    return {
      ...role,
      description: role.company === 'Twzzr' ? [descriptions[0], descriptions[2]].filter(Boolean) : experienceHighlights(role.company, role.post, descriptions),
    };
  });
  const availableSkills = new Set(sourceSkills.map((skill) => skill.name));

  return {
    props: {
      experience,
      skills: systemsSkillOrder.filter((skill) => availableSkills.has(skill)),
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "Software Engineering Resume",
          description: "Review Nirmal Khedkar's software engineering resume, including experience building reliable systems, cloud infrastructure, full-stack applications, and developer tools.",
          canonical: "https://nirmalhk7.com/resume",
          openGraph: {
            type: "profile",
            url: "https://nirmalhk7.com/resume",
            profile: {
              firstName: "Nirmal",
              lastName: "Khedkar",
              username: "nirmalhk7",
              gender: "male",
            },
            images: [openGraphImage("Experience that delivers.", "Backend services. Production systems. Product engineering.", "resume")],
          },
        },
      },
    },
  };
};
