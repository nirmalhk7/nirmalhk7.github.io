/** Names are a finite contract. Adding a feature requires a coverage-matrix entry. */
export const analyticsEvents = {
  page_view: 'page', page_navigation: 'navigation', error_page: 'technical',
  ui_action: 'control', disclosure_toggle: 'control', content_copy: 'content', print_intent: 'content', link_click: 'navigation', button_click: 'control',
  select_content: 'content', section_view: 'exposure', content_view: 'exposure',
  scroll_depth: 'engagement', engagement_milestone: 'engagement', page_summary: 'engagement', visibility_change: 'engagement',
  site_search: 'discovery', project_filter: 'discovery', project_toggle: 'discovery', project_archive: 'discovery', project_drawer: 'discovery',
  command_palette: 'discovery', navigation_menu: 'navigation', section_navigation: 'navigation',
  file_download: 'download',
  share: 'sharing', share_error: 'sharing',
  form_engagement: 'contact', form_start: 'contact', form_submit: 'contact', form_validation_error: 'contact',
  form_error: 'contact', form_pending: 'contact', form_abandonment: 'contact', generate_lead: 'contact',
  exception: 'technical', web_vital: 'technical', timing_complete: 'technical',
} as const;
export type AnalyticsEventName = keyof typeof analyticsEvents;
