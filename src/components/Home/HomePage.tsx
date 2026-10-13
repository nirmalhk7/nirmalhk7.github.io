import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { trackClick, trackSelectContent } from "@/util/analytics";
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
  const socialLinks = profiles.filter((profile) => ["LinkedIn", "GitHub"].includes(profile.name));
  return (
    <main className={styles.page}>
      <CinematicStory />

      <section className={styles.experience} id="workexperience" aria-labelledby="experience-heading">
        <div className={styles.sectionHeading}>
          <h2 id="experience-heading">Experience that runs in production.</h2>
          <p>Backend services, product systems, and the work that keeps them moving.</p>
        </div>
        <div className={styles.experienceList}>
          {groupExperience(workexperience).map(({ company, roles }) => (
            <article className={styles.experienceRow} key={company}>
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
                        <details className={styles.disclosure}>
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
        <div className={styles.afterHoursCopy}>
          <h2 id="perspective-heading">I see the whole system.</h2>
          <p>I care about how a product feels, how its services behave, and what keeps it dependable. I connect the details to the bigger picture.</p>
          <p>Product judgment. Systems thinking. The curiosity to keep building.</p>
          <div className={styles.articleLinks}>
            <Link href="/projects" onClick={() => trackSelectContent("profile_cta", "Explore my projects")}>Explore my projects</Link>
          </div>
        </div>
        <div className={styles.infrastructureImage}>
          <Image
            src={treesPhoto}
            alt="Nirmal outdoors beneath trees"
            fill
            sizes="(max-width: 767px) 100vw, 46vw"
            loading="lazy"
          />
          <span>Curiosity beyond the screen.</span>
        </div>
      </section>

      <section className={styles.projects} id="project" aria-labelledby="projects-heading">
        <div className={styles.sectionHeading}>
          <h2 id="projects-heading">Across the stack.</h2>
          <p>Selected work, from infrastructure tooling to browser based experiences.</p>
        </div>
        <div className={styles.projectList}>
          {projects.map((project, index) => (
            <Link
              className={styles.projectRow}
              href={`/projects?id=${encodeURIComponent(project.slug)}`}
              key={project.slug}
              onClick={() => {
                trackSelectContent("project", project.slug, { item_list_name: "home_featured_projects" });
                trackClick(project.slug, "project_card");
              }}
            >
              <span className={styles.projectIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
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
        <div className={styles.aboutCopy}>
          <h2 id="about-heading">A broad engineer with systems at the center.</h2>
          <p>
            I completed my undergraduate studies at NITK Surathkal before earning a Master of Science in Computer Science at the University of Colorado Boulder. My work spans backend services, production systems, web applications, and mobile development.
          </p>
          <ul className={styles.socialLinks} aria-label="Professional profiles">
            {socialLinks.map((profile) => (
              <li key={profile.name}><a href={profile.url} target="_blank" rel="noopener noreferrer">{profile.name} <span aria-hidden="true">↗</span></a></li>
            ))}
          </ul>
        </div>
        <div className={styles.aboutDetails}>
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

      <section className={styles.writing} id="blog" aria-labelledby="writing-heading">
        <h2 id="writing-heading">Notes from the work.</h2>
        <Link href="/blog/homelab_gitops">How GitOps brings order to chaos <span aria-hidden="true">↗</span></Link>
        <Link href="/blog/homelab_architect">Homelab architecture: planning your playground <span aria-hidden="true">↗</span></Link>
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
    <details className={styles.disclosure}>
      <summary>{title}</summary>
      {children}
    </details>
  );
}
