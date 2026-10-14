import * as analytics from '@/util/analytics';

const api = analytics as typeof analytics & {
  sanitizeAnalyticsPayload: (value: Record<string, unknown>) => Record<string, unknown>;
  sanitizeAnalyticsUrl: (value: string) => string;
};

test('removes personal data, unsupported fields, and arbitrary URL query strings', () => {
  expect(api.sanitizeAnalyticsPayload({
    email: 'visitor@example.com', description: 'Failed for visitor@example.com',
    search_term: 'private search', page_location: 'https://nirmalhk7.com/projects?id=atskit&email=visitor@example.com#secret',
    page_path: '/projects?id=not-a-project&token=secret', link_url: 'mailto:visitor@example.com',
    content_id: 'atskit', query_length: 14, result_count: 0, error_category: 'runtime',
  })).toEqual({ page_location: 'https://nirmalhk7.com/projects?id=atskit', page_path: '/projects', content_id: 'atskit', query_length: 14, result_count: 0, error_category: 'runtime' });
});

test('keeps acquisition parameters and removes unsafe attribution and unknown landing paths', () => {
  expect(api.sanitizeAnalyticsUrl('https://nirmalhk7.com/blog/relaunch?utm_source=linkedin&utm_medium=social&gclid=abc123&password=bad#contact')).toBe('https://nirmalhk7.com/blog/relaunch?utm_source=linkedin&utm_medium=social&gclid=abc123');
  expect(api.sanitizeAnalyticsUrl('https://nirmalhk7.com/person/visitor@example.com?utm_campaign=visitor@example.com')).toBe('https://nirmalhk7.com/unknown');
});

test('enforces GA4 payload size, retaining required context before extras', () => {
  const payload = api.sanitizeAnalyticsPayload({ page_path: '/', page_location: 'https://nirmalhk7.com/', page_title: 'A'.repeat(400), ...Object.fromEntries(Array.from({length: 40}, (_, i) => [`unknown_${i}`, i])), content_id: 'x'.repeat(150), metric_value: Infinity });
  expect(payload.page_title).toHaveLength(300);
  expect(payload.content_id).toHaveLength(100);
  expect(payload).not.toHaveProperty('metric_value');
  expect(Object.keys(payload).length).toBeLessThanOrEqual(25);
});

test('search event records query length rather than text', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  analytics.trackSearch('visitor@example.com', { search_scope: 'projects', result_count: 0 });
  expect(spy).toHaveBeenCalledWith('[Analytics] site_search', expect.objectContaining({ query_length: 19, search_scope: 'projects', result_count: 0 }));
  expect(JSON.stringify(spy.mock.calls)).not.toContain('visitor@example.com');
  spy.mockRestore();
});

test('recognizes configured locale and strips credentials from external referrers',()=>{
  expect(api.sanitizeAnalyticsUrl('/en-US/blog/relaunch?utm_source=linkedin')).toBe('/en-US/blog/relaunch?utm_source=linkedin');
  expect(api.sanitizeAnalyticsUrl('https://visitor:password@example.org/path?q=email',true)).toBe('https://example.org/path');
});

test('retains SDK-generated Web Vital identifiers without allowing raw error descriptions',()=>{
  expect(api.sanitizeAnalyticsPayload({metric_id:'v3-1791907217738-12893',metric_name:'LCP',description:'visitor@example.com'})).toEqual({metric_id:'v3-1791907217738-12893',metric_name:'LCP'});
});

test('external referrer context preserves acquisition domain without private path text',()=>{
  expect(api.sanitizeAnalyticsPayload({page_referrer:'https://search.example/users/JaneDoe?token=secret'})).toEqual({page_referrer:'https://search.example/'});
});

test('internal UI actions use a custom event rather than claiming an enhanced outbound click',()=>{
  const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  analytics.trackClick('/projects','navbar_link');
  expect(spy).toHaveBeenCalledWith('[Analytics] ui_action',expect.objectContaining({event_category:'navbar_link',event_label:'/projects'}));
  spy.mockRestore();
});

test('preserves all five catalog matches even when the combined list exceeds GA4 string length',()=>{
  const spy=jest.spyOn(console,'log').mockImplementation(()=>{});
  analytics.trackSearch('systems',{search_scope:'projects',matched_ids:'Web-Complexity-Analysis,handwriting_recognizer,obscuring_blockchain,nirmalhk7.github.io,geth-testnet-box'});
  expect(spy).toHaveBeenCalledWith('[Analytics] site_search',expect.objectContaining({matched_id_1:'Web-Complexity-Analysis',matched_id_5:'geth-testnet-box'}));
  spy.mockRestore();
});

test('preserves opaque advertising IDs longer than custom parameter values in native landing URLs',()=>{
  const clickId='opaque-'+ 'x'.repeat(180);
  expect(api.sanitizeAnalyticsUrl(`/projects?gclid=${clickId}&utm_source=google&email=private@example.com`)).toBe(`/projects?gclid=${clickId}&utm_source=google`);
});
