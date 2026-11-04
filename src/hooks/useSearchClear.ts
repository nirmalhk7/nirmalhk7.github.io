import { useEffect, useRef } from 'react';
import { trackEvent } from '@/util/analytics';

/** Observe clearing via typing, native clear control or reset button; never retain query text. */
export function useSearchClear(query: string, scope: string) {
  const hadQuery=useRef(false);
  useEffect(() => {
    const hasQuery=Boolean(query.trim());
    if (hadQuery.current && !hasQuery) trackEvent('search_clear',{search_scope:scope});
    hadQuery.current=hasQuery;
  }, [query,scope]);
}
