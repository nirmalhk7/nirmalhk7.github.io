import React, { useRef } from "react";
import { useRouter } from "next/router";
import { useHashScroll } from "@/hooks/useHashScroll";
import { useContentReveal } from "@/hooks/useContentReveal";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { trackSelectContent } from "@/util/analytics";
import {
  CourseInterface,
  MembershipInterface,
  ProfilesInterface,
  SkillsInterface,
  WorkExperienceInterface,
} from "@/interfaces";
import { ProjectInterface } from "@/interfaces/projects";
import { experienceHighlights } from "@/util/experienceHighlights";
import CinematicStory from "./CinematicStory";
import RotatingTopics from "./RotatingTopics";
import treesPhoto from "@/assets/images/TreesNK_1.jpg";
import styles from "./portfolioHome.module.scss";

const ContactMeSection = dynamic(() => import("@/components/ContactMe/contactMeSection"));

type HomePageProps = {
  projects: ProjectInterface[];
  workexperience: WorkExperienceInterface[];
  onlineCourses: CourseInterface[];
  collegeCourses: CourseInterface[];
  membership: MembershipInterface[];
  skills: SkillsInterface[];
  profiles: ProfilesInterface[];
};

export default function HomePage({
  projects,
  workexperience,
  onlineCourses,
  collegeCourses,
  membership,
  skills,
  profiles,
}: HomePageProps) {
  const pageRef = useRef<HTMLElement>(null);
  useContentReveal(pageRef);
  useHashScroll(useRouter().asPath);
  const socialLinks = profiles.filter((profile) => ["LinkedIn", "GitHub"].includes(profile.name));
  return (
    <main className={styles.page} ref={pageRef}>
      <CinematicStory />

      <section className={styles.experience} id="workexperience" aria-labelledby="experience-heading">
        <div data-reveal className={styles.sectionHeading}>
          <h2 id="experience-heading">From development to deployment.</h2>
          <p>At Visa, my work covered service migrations, testing, infrastructure, and production releases. At ZOLL, I worked on dispatch scheduling and AI models.</p>
        </div>
        <div className={styles.experienceList}>
          {groupExperience(workexperience).map(({ company, roles }) => (
            <article data-reveal className={styles.experienceRow} key={company}>
              <h3>{company}</h3>
              <div className={styles.roleList}>
                {roles.map((role) => {
                  const descriptions = Array.isArray(role.description)
                    ? role.description
                    : [role.description];
                  const highlights = experienceHighlights(role.company, role.post, descriptions);
                  const remaining = descriptions.filter(description => !highlights.includes(description));
                  return (
                    <div className={styles.role} key={`${role.post}-${role.timeframe}`}>
                      <div className={styles.roleTitle}>
                        <h4>{role.post}</h4>
                        <p>{role.timeframe}</p>
                      </div>
                      <ul>
                        {highlights.map((description) => <li key={description}>{description}</li>)}
                      </ul>
                      {remaining.length > 0 && (
                        <details data-analytics-id={`role_${company.toLowerCase().replace(/[^a-z0-9]+/g,"_")}`} className={styles.disclosure}>
                          <summary>More from this role</summary>
                          <ul>{remaining.map((description) => <li key={description}>{description}</li>)}</ul>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.afterHours} aria-labelledby="perspective-heading">
        <div data-reveal className={styles.afterHoursCopy}>
          <h2 id="perspective-heading">The whole system matters.</h2>
          <p>I connect product thinking with hands-on engineering, from shaping an idea to building the systems behind it.</p>
          <p>I think about how it feels to use, how its parts fit together, and how it holds up over time. Clear experiences and reliable foundations guide the choices I make.</p>
          <div className={styles.articleLinks}>
            <Link data-analytics-skip-global="true" href="/projects" onClick={() => trackSelectContent("profile_cta", "Explore my projects")}>Explore my projects</Link>
          </div>
        </div>
        <div data-reveal className={styles.infrastructureImage}>
          <Image
            src={treesPhoto}
            alt="Nirmal outdoors beneath trees"
            fill
            sizes="(max-width: 767px) 100vw, 46vw"
            loading="lazy"
          />
          <span>Nirmal outdoors.</span>
        </div>
      </section>

      <section className={styles.projects} id="project" aria-labelledby="projects-heading">
        <div data-reveal className={styles.sectionHeading}>
          <h2 id="projects-heading">Selected projects.</h2>
          <p>From planning cluster capacity to building a research portal: tools and applications with specific problems to solve.</p>
        </div>
        <div className={styles.projectList}>
          {projects.map((project) => (
            <Link data-analytics-skip-global="true"
              data-analytics-exposure={project.slug}
              data-reveal
              className={styles.projectRow}
              href={`/projects?id=${encodeURIComponent(project.slug)}`}
              key={project.slug}
              onClick={() => {
                trackSelectContent("project", project.slug, { item_list_name: "home_featured_projects" });
              }}
            >
              <span className={styles.projectMain}>
                <span className={styles.projectTitle}>{project.slug === "atskit" ? "ATSKit" : project.frontmatter.title}</span>
                <span className={styles.projectSummary}>{project.frontmatter.summary || project.excerpt}</span>
              </span>
              <span className={styles.projectTags}>{project.frontmatter.tags?.join(" · ") || "Software"}</span>
              <span className={styles.projectArrow} aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <Link href="/projects" className={styles.allProjectsLink}>Explore all projects <span aria-hidden="true">↗</span></Link>
      </section>

      <section className={styles.about} id="about" aria-labelledby="about-heading">
        <div data-reveal className={styles.aboutCopy}>
          <h2 id="about-heading">Systems focus. Full-stack experience.</h2>
          <p>
            I completed my undergraduate studies at NITK Surathkal before earning a Master of Science in Computer Science at the University of Colorado Boulder. My experience connects backend and infrastructure work with hands-on frontend development, including the entire ScholarHub frontend.
          </p>
          <ul className={styles.socialLinks} aria-label="Professional profiles">
            {socialLinks.map((profile) => (
              <li key={profile.name}><a href={profile.url} target="_blank" rel="noopener noreferrer">{profile.name} <span aria-hidden="true">↗</span></a></li>
            ))}
          </ul>
        </div>
        <div data-reveal className={styles.aboutDetails}>
          <Disclosure title="Languages and tools">
            <ul className={styles.tagList}>{skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}</ul>
          </Disclosure>
          <Disclosure title="Courses and certificates">
            <ul>{[...onlineCourses, ...collegeCourses].map((course) => (
              <li key={`${course.name}-${course.provider ?? "university"}`}>
                {course.name}{course.provider ? ` · ${course.provider}` : ""}
                {course.link && <> · <a href={course.link} target="_blank" rel="noopener noreferrer">Certificate</a></>}
              </li>
            ))}</ul>
          </Disclosure>
          <Disclosure title="Community">
            <ul>{membership.map((item) => <li key={item.club}>{item.position} · <a href={item.clubwebsite} target="_blank" rel="noopener noreferrer">{item.club}</a></li>)}</ul>
          </Disclosure>
        </div>
      </section>

      <section data-reveal className={styles.writing} id="blog" aria-labelledby="writing-heading">
        <h2 id="writing-heading">How I approach <RotatingTopics /></h2>
        <Link href="/blog/homelab_gitops">Homelab configuration with GitOps <span aria-hidden="true">↗</span></Link>
        <Link href="/blog/homelab_architect">Homelab architecture and access control <span aria-hidden="true">↗</span></Link>
        <Link href="/blog" className={styles.allWritingLink}>Read all writing <span aria-hidden="true">↗</span></Link>
      </section>

      <ContactMeSection variant="portfolio" />
    </main>
  );
}

function groupExperience(experience: WorkExperienceInterface[]) {
  const groups = new Map<string, WorkExperienceInterface[]>();
  experience.forEach((role) => {
    const roles = groups.get(role.company) ?? [];
    roles.push(role);
    groups.set(role.company, roles);
  });
  return Array.from(groups, ([company, roles]) => ({ company, roles }));
}

function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details data-analytics-id={`profile_${title.toLowerCase().replace(/[^a-z0-9]+/g,"_")}`} className={styles.disclosure}>
      <summary>{title}</summary>
      {children}
    </details>
  );
}
