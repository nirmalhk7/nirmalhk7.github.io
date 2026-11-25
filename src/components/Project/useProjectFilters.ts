import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectListEntry } from '@/interfaces/projects';
import { useProjectListMotion } from '@/hooks/useProjectListMotion';
import { useSearchClear } from '@/hooks/useSearchClear';
import { trackEvent, trackSearch } from '@/util/analytics';
import { projectCategory, selectedProjects } from '@/util/projectCuration';

export const allTechnologies = 'X';
export const projectAreas = ['All work', 'Systems', 'Product', 'Research'];
const allAreas = projectAreas[0];

function matchesSearch(project: ProjectListEntry, query: string) {
  if (query === '') return true;
  const { title, tags, summary } = project.frontmatter;
  const searchable = `${title} ${tags?.join(' ')} ${summary || ''} ${project.excerpt || ''} ${project.contentHtml}`;
  return searchable.toLowerCase().includes(query.toLowerCase());
}

function filterProjects(projects: ProjectListEntry[], browsingAll: boolean, area: string, technology: string, query: string) {
  return projects.filter(project => {
    const matchesScope = browsingAll || Boolean(selectedProjects[project.slug]);
    const matchesCategory = area === allAreas || projectCategory(project) === area;
    const matchesTechnology = technology === allTechnologies || project.frontmatter.tags?.includes(technology);
    return matchesScope && matchesCategory && matchesTechnology && matchesSearch(project, query);
  });
}

function useReportProjectSearch(query: string, filtered: ProjectListEntry[], filter: string) {
  useEffect(() => {
    const searchTerm = query.trim();
    if (!searchTerm) return;
    const timer = window.setTimeout(() => trackSearch(searchTerm, {
      search_scope: 'projects', result_count: filtered.length, active_filter: filter,
      matched_ids: filtered.slice(0, 5).map(project => project.slug).join(','),
    }), 700);
    return () => window.clearTimeout(timer);
  }, [query, filtered, filter]);
}

export function useProjectFilters(projects: ProjectListEntry[]) {
  const [filter, setFilter] = useState(allTechnologies);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [category, setCategory] = useState(allAreas);
  const listRef = useRef<HTMLDivElement>(null);
  const prepareListMotion = useProjectListMotion(listRef);
  useSearchClear(searchQuery, 'projects');
  const filtersSelected = filter !== allTechnologies || category !== allAreas;
  const hasFilters = Boolean(searchQuery) || filtersSelected;
  const browsingAll = showArchive || Boolean(searchQuery.trim()) || filtersSelected;
  const filteredProjects = useMemo(() => filterProjects(projects, browsingAll, category, filter, searchQuery),
    [projects, browsingAll, category, filter, searchQuery]);
  useReportProjectSearch(searchQuery, filteredProjects, filter);

  const resetFilters = useCallback(() => {
    setCategory(allAreas);
    setFilter(allTechnologies);
    setSearchQuery('');
  }, []);
  const clearFilters = () => {
    prepareListMotion();
    trackEvent('project_filter', { action: 'clear' });
    resetFilters();
  };
  const changeSearch = (value: string) => { prepareListMotion(); setSearchQuery(value); };
  const changeArea = (area: string) => {
    prepareListMotion();
    setCategory(area);
    trackEvent('project_filter', { category: area, action: 'category' });
  };
  const changeTechnology = (tag: string) => {
    prepareListMotion();
    setFilter(tag);
    trackEvent('project_filter', { active_filter: tag === allTechnologies ? 'all' : tag, action: 'technology' });
  };
  const toggleArchive = () => {
    prepareListMotion();
    trackEvent('project_archive', { action: showArchive ? 'hide' : 'show' });
    setShowArchive(current => !current);
  };
  return {
    filter, searchQuery, showArchive, setShowArchive, category, listRef, browsingAll, filteredProjects, hasFilters,
    resetFilters, clearFilters, changeSearch, changeArea, changeTechnology, toggleArchive,
  };
}
