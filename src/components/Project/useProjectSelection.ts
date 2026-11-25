import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { trackEvent, trackSelectContent } from '@/util/analytics';
import { selectedProjects } from '@/util/projectCuration';

function scrollToProject(element: HTMLElement | null) {
  if (!element) return;
  const bodyTop = document.body.getBoundingClientRect().top;
  const projectTop = element.getBoundingClientRect().top;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: projectTop - bodyTop - 100, behavior: reducedMotion ? 'auto' : 'smooth' });
}

export function useProjectSelection(showArchive: (visible: boolean) => void, resetFilters: () => void) {
  const router = useRouter();
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const localToggle = useRef<string | null | undefined>(undefined);
  const projectRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const projectId = router.query.id;
  useEffect(() => {
    const id = typeof projectId === 'string' ? projectId : null;
    setExpandedSlug(id);
    if (localToggle.current === id) {
      localToggle.current = undefined;
      return;
    }
    if (!id) return;
    if (!selectedProjects[id]) showArchive(true);
    resetFilters();
    const timer = setTimeout(() => scrollToProject(projectRefs.current[id]), 100);
    return () => clearTimeout(timer);
  }, [projectId, resetFilters, showArchive]);

  const handleToggle = (slug: string) => {
    const collapsing = expandedSlug === slug;
    const next = collapsing ? null : slug;
    localToggle.current = next;
    trackEvent('project_toggle', { content_id: slug, action: collapsing ? 'collapse' : 'expand' });
    setExpandedSlug(next);
    if (!collapsing) trackSelectContent('project', slug, { interaction_type: 'expand' });
    void router.push(collapsing ? '/projects' : `/projects?id=${encodeURIComponent(slug)}`, undefined, { shallow: true, scroll: false });
  };
  return { expandedSlug, projectRefs, handleToggle };
}
