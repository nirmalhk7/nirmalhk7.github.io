import React from "react";
import { editorialStyles as styles } from "@/components/Site/Editorial";
import { allTechnologies, projectAreas, type useProjectFilters } from "./useProjectFilters";

type FilterProps = Pick<ReturnType<typeof useProjectFilters>, "filter" | "searchQuery" | "category" | "browsingAll" | "hasFilters" | "clearFilters" | "changeSearch" | "changeArea" | "changeTechnology">;

export function ProjectFilters({ allTags, total, filter, searchQuery, category, browsingAll, hasFilters, clearFilters, changeSearch, changeArea, changeTechnology }: FilterProps & { allTags: string[]; total: number }) {
  const filterOptions = [
    { tag: allTechnologies, label: "All" },
    ...allTags.slice().sort().map(tag => ({ tag, label: tag })),
  ];
  return <>
      <div role="search" aria-label="Search projects">
        <label htmlFor="project-search" className="sr-only">Search projects and technologies</label>
        <input
          id="project-search"
          type="search"
          placeholder="Search projects and technologies"
          value={searchQuery}
          onChange={(event) => changeSearch(event.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.searchStatus}>
        <p role="status">{total} {total === 1 ? 'project' : 'projects'} · {browsingAll ? 'Full archive' : 'Selected work'}</p>
        {hasFilters && <button data-analytics-id="projects_control_1" data-analytics-skip-global="true" type="button" className={styles.filterButton} onClick={clearFilters}>Clear search and filters</button>}
      </div>
      {total === 0 && <p className={styles.emptyState}>No matching projects. Try another term or clear the filters above.</p>}
      <div className={styles.filterBar} aria-label="Filter projects by area">
        {projectAreas.map(area => <button data-analytics-id="projects_control_2" data-analytics-skip-global="true" key={area} type="button" aria-pressed={area === category} className={`${styles.filterButton} ${area === category ? styles.filterButtonActive : ''}`} onClick={() => changeArea(area)}>{area}</button>)}
      </div>
      <details data-analytics-id="project_technology_filters" className={styles.technologyFilters}>
        <summary>Filter by technology{filter !== allTechnologies ? ` · ${filter}` : ''}</summary>
        <div className={styles.filterBar} aria-label="Filter projects by technology">
        {filterOptions.map(({ tag, label }) => (
          <button data-analytics-id="projects_control_3"
            key={tag}
            type="button"
            aria-pressed={tag === filter}
            data-analytics-skip-global="true"
            onClick={() => changeTechnology(tag)}
            className={`${styles.filterButton} ${tag === filter ? styles.filterButtonActive : ""}`}
          >
            {label}
          </button>
        ))}
        </div>
      </details>
  </>;
}
