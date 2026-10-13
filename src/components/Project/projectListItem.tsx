import React from "react";
import { ProjectInterface } from "@/interfaces/projects";
import { EditorialRow, editorialStyles as styles } from "@/components/Site/Editorial";

type ProjectListItemProject = Omit<ProjectInterface, "content"> & { contentHtml: string };

interface ProjectListItemProps {
  project: ProjectListItemProject;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export const ProjectListItem = React.forwardRef<HTMLDivElement, ProjectListItemProps>(({
  project, isExpanded, onToggle, index,
}, ref) => (
  <div ref={ref}>
    <EditorialRow
      index={index}
      eyebrow={project.frontmatter.tags?.slice(0, 3).join(" / ")}
      title={project.frontmatter.title}
      description={project.frontmatter.summary || project.excerpt || ""}
      expanded={isExpanded}
      controlLabel={`${isExpanded ? 'Collapse' : 'Expand'} ${project.frontmatter.title} details`}
      onClick={onToggle}
    >
      {isExpanded && (
        <div className={styles.rowDetail} dangerouslySetInnerHTML={{ __html: project.contentHtml }} />
      )}
    </EditorialRow>
  </div>
));

ProjectListItem.displayName = "ProjectListItem";
