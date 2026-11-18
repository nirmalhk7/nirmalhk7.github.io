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
import { BlogInterface } from "@/interfaces/blog";
import { experienceHighlights } from "@/util/experienceHighlights";
import CinematicStory from "./CinematicStory";
import WhirlwindWorkflow from "./WhirlwindWorkflow";
import ArrowIcon from "./ArrowIcon";
import treesPhoto from "@/assets/images/TreesNK_1.jpg";
import styles from "./portfolioHome.module.scss";

const ContactMeSection = dynamic(() => import("@/components/ContactMe/contactMeSection"));

type HomePageProps = {
  projects: ProjectInterface[];
  latestBlogs: BlogInterface[];
  workexperience: WorkExperienceInterface[];
  onlineCourses: CourseInterface[];
  collegeCourses: CourseInterface[];
  membership: MembershipInterface[];
  skills: SkillsInterface[];
  profiles: ProfilesInterface[];
};

export default function HomePage({
  projects,
  latestBlogs,
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
  const featuredProject = projects.find((project) => project.slug === "whirlwind");
  const socialLinks = profiles.filter((profile) => ["LinkedIn", "GitHub"].includes(profile.name));
  return (
    <main className={styles.page} ref={pageRef}>
      <CinematicStory />

      <section className={styles.experience} id="workexperience" aria-labelledby="experience-heading">
        <div data-reveal className={styles.sectionHeading}>
          <h2 id="experience-heading">From development<br />to deployment.</h2>
          <p>At Visa, my work covered service migrations, testing, infrastructure, and production releases. At ZOLL, I worked on dispatch scheduling and AI models.</p>
        </div>
        <div className={styles.experienceList}>
          {groupExperience(workexperience).map(({ company, roles }) => (
            <article data-reveal data-analytics-exposure={`experience_${company.toLowerCase().replace(/[^a-z0-9]+/g,"_")}`} className={styles.experienceRow} key={company}>
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

      <section className={styles.projects} id="project" aria-labelledby="projects-heading">
        <div data-reveal className={styles.sectionHeading}>
          <h2 id="projects-heading">Selected projects.</h2>
          <p>Engineering tools and applications, from agent orchestration to cluster capacity.</p>
        </div>
        {featuredProject && (
          <article className={styles.featuredProject} aria-labelledby="whirlwind-heading" data-analytics-exposure="whirlwind">
            <div className={styles.featuredCopy}>
              <h3 id="whirlwind-heading">{featuredProject.frontmatter.title}</h3>
              <p>{featuredProject.frontmatter.summary}</p>
              <ul className={styles.featuredDetails}>
                <li><strong>Durable execution.</strong> SQLite-backed progress survives interruptions.</li>
                <li><strong>Explicit control.</strong> Human approvals stay part of the workflow.</li>
              </ul>
              <p className={styles.projectTags}>{featuredProject.frontmatter.tags?.join(" · ")}</p>
            </div>
            <WhirlwindWorkflow />
            <div className={styles.featuredLinks}>
              <Link href="/projects?id=whirlwind" data-analytics-skip-global="true"
                onClick={() => trackSelectContent("project", "whirlwind", { item_list_name: "home_featured_projects" })}>
                Explore project <ArrowIcon />
              </Link>
              <a href={featuredProject.frontmatter.url} target="_blank" rel="noopener noreferrer">GitHub <ArrowIcon /></a>
            </div>
          </article>
        )}
        <div className={styles.projectList}>
          {projects.filter((project) => project.slug !== "whirlwind").map((project) => (
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
              <span className={styles.projectArrow}><ArrowIcon /></span>
            </Link>
          ))}
        </div>
        <Link href="/projects" className={styles.allProjectsLink}>Explore all projects <ArrowIcon /></Link>
      </section>

      <section className={styles.writing} id="blog" aria-labelledby="writing-heading">
        <div className={styles.writingHeading}>
          <h2 id="writing-heading">Latest writing</h2>
          <Link href="/blog" className={styles.allWritingLink}>Read all writing <ArrowIcon /></Link>
        </div>
        <div className={styles.writingGrid}>
          {latestBlogs.map((blog) => (
            <article className={styles.writingArticle} key={blog.slug}>
              {blog.frontmatter?.date && (
                <time dateTime={blog.frontmatter.date}>
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(blog.frontmatter.date))}
                </time>
              )}
              <h3><Link href={`/blog/${blog.slug}`}>{blog.frontmatter?.title}</Link></h3>
              {(blog.frontmatter?.description || blog.excerpt) && <p>{blog.frontmatter?.description || blog.excerpt}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.about} id="about" aria-labelledby="about-heading">
        <div className={styles.aboutLayout}>
          <div className={styles.aboutCopy}>
            <h2 id="about-heading">Systems focus.<br /><span className={styles.unbroken}>Full-stack</span> experience.</h2>
            <p>
              I completed my undergraduate studies at NITK Surathkal before earning a Master of Science in Computer Science at the University of Colorado Boulder. My experience connects backend and infrastructure work with hands-on frontend development, including the entire ScholarHub frontend.
            </p>
            <ul className={styles.socialLinks} aria-label="Professional profiles">
              {socialLinks.map((profile) => (
                <li key={profile.name}><a href={profile.url} target="_blank" rel="noopener noreferrer">{profile.name} <ArrowIcon /></a></li>
              ))}
            </ul>
          </div>
          <figure className={styles.aboutPhoto}>
            <Image src={treesPhoto} alt="Nirmal outdoors beneath trees" fill sizes="(max-width: 767px) 100vw, 42vw" loading="lazy" />
            <figcaption>Nirmal outdoors.</figcaption>
          </figure>
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
        </div>
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
