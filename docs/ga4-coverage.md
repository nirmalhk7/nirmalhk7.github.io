# GA4 coverage and setup

Repository scope: current portfolio, all seven articles, project catalog, native résumé PDF links, contact form, error pages, privacy controls, and rendered legacy controls. Tracking uses Advanced Consent Mode v2 with independent Analytics and Advertising choices. The property checklist below must be applied before deployment; repository tests do not configure the live property.

## Event contract

`src/util/analyticsEvents.ts` is the finite, typed event-name registry. `src/util/analyticsPrivacy.ts` owns accepted payload keys and limits. All events carry sanitized `page_location`, `page_path`, static `page_title`, viewport dimensions, and language where available. Route page views additionally carry `page_type`; external referrer context retains source origin only. Attribution parameters are preserved on sanitized landing URLs. Opaque ad-click IDs can exceed the custom-parameter 100-character limit; retain complete IDs within the native page-location URL budget, dropping overflow parameters rather than cutting an ID. Google owns source/medium attribution, first visits, sessions, native engagement, browser/OS/device, and approximate geography.

No custom visitor ID, occupation inference, fingerprinting, raw search text, form values, raw error messages, arbitrary URL query strings, or visitor-generated DOM text. Unknown site paths become `/unknown`. Project query IDs must exist in the public content catalog. Locale `/en-US` is supported. Public catalog IDs are maintained in `analyticsCatalog.ts`; add new content there when extending the site.

Custom names replace earlier ambiguous events: `trackClick` now emits `ui_action`, and `trackSearch` emits `site_search`. Google’s recommended `search` requires `search_term`; raw-text-free search therefore uses a custom event. Existing `select_content`, `share`, and `generate_lead` retain their names. Past data is not migrated. The résumé page lives at `/resume` (also available under `/en-US/resume`) and embeds the PDF immediately. Résumé links record `select_content` with `content_type: resume`; page navigation records the usual résumé page view. The PDF asset is used inside the viewer. Opening the page is not counted as a file download.

Events are emitted once per actual action, except the deliberate observation of multiple lifecycle phases: selection versus project expansion, submit click versus valid submission attempt, and success versus pending-duration outcome. Explicit owners suppress generic click listeners. A share composer opening is an intent, not proof of publication; filter `share_action` before interpreting share reports. A file download is initiation, not proof of completion. Exit events are best-effort browser delivery.

### Implemented and tested events

Test names below refer to files in `src/__tests__`; browser scenarios live in `scripts/verify-ga4.cjs`. The matrix status applies to repository instrumentation, not live GA4 reporting.

| Event / control coverage | Trigger and owner | Parameters beyond context | Deduplication | Verification |
| --- | --- | --- | --- | --- |
| `page_view`: `/`, `/projects`, `/blog`, every `/blog/<slug>`, `/privacy`, 404/500 | Router hook after hydration/page replacement; runtime on BFCache restoration | `page_type`, `view_type` | One per distinct page visit; no views for hash or shallow state changes | analyticsRouting, appHydration, browser routes |
| `page_navigation`: anchor and project-state URLs | Router hash/shallow completion | `interaction_type`, sanitized destination | One per completed state transition | analyticsRouting, browser projects |
| `ui_action`: navbar, résumé navigation, email/hiring links, 404 shortcuts, submit button | Existing authored handlers | `event_category`, authored `event_label` | Generic listener suppressed | analyticsPrivacy, navbar, contactForm, browser journeys |
| `link_click`: other internal/outbound links, contact fallback, RSS, project-detail links, article headings/TOC, privacy/provider links, footer brand | Runtime window click listener | `interaction_type`, sanitized `link_url`, `link_domain`, `outbound`, optional `link_id`, `placement`, `action_method` | Only controls without explicit owner | analyticsRuntime, browser privacy/contact/navigation |
| `button_click`: unowned buttons/role buttons, scroll-to-top, legacy timeline controls | Runtime window click listener | Authored `button_id`, `button_type`, `placement`, `action_method` | Explicit owners excluded; no button text copied | analyticsRuntime; authored static IDs |
| `disclosure_toggle`: technology filter disclosure and home role/profile details | Runtime native details toggle listener | Authored `button_id`, `action` | One per actual open/close state; no summary text copied | analyticsRuntime; browser project disclosure |
| `content_copy`, `print_intent` | Native copy/beforeprint listeners | Public content ID when available; action copy_requested/print_requested | One per observed request; no copied text, no completion claim | analyticsRuntime |
| `navigation_menu`: portfolio and legacy menus, button/Escape/selection closure | Navbar state transition | `action`, `placement` | One per state change, not initial closed render | navbar, mobile browser |
| `section_navigation`: legacy section navigator | Navigator handler | `section_id` | One per activation | analyticsExtras |
| `select_content`: CTAs, home project rows, project/article/social selections, 404 results, palette selection | Authored component handler | `content_type`, `content_id`, optional list/index/placement/method/interaction | Generic listener suppressed; removed duplicate legacy click emissions where same selection already owned | commandAnalytics, projectDiscovery, resumePage, existing component tests; browser palette/project/PDF |
| `section_view`: visible page sections | Runtime geometry sampling | `section_id` | 50% visible for one second; oversized sections measured relative to viewport; once per visit | analyticsRuntime |
| `content_view`: project cards/rows, article rows/body, experience articles | Runtime geometry sampling | Public `content_id` or static article index | Same exposure rule; once per content ID per visit | analyticsRuntime; browser verifies article body identity |
| `scroll_depth` | Runtime geometry sampling | `depth_percentage`: 25/50/75/90/100 | Each crossed milestone once per visit; reset on navigation/BFCache restore | analyticsRuntime |
| `engagement_milestone` | Runtime visible-time sampling | `milestone_seconds`: 10/30/60/120/300 | Once per milestone per visit; hidden time excluded | analyticsRuntime |
| `page_summary` | Navigation disposal/pagehide | `active_time_msec`, `max_scroll_percentage` | Once per lifecycle segment; restore starts new visit | analyticsRuntime, analyticsRouting |
| `visibility_change` | Document visibility listener | `visibility_state`, `active_time_msec` | One per actual browser visibility event | analyticsRuntime |
| `site_search`: projects, 404 search, command palette | Component 700 ms debounce | `search_scope`, `query_length`, `result_count`, up to five full catalog matches in `matched_id_1` through `matched_id_5`, plus truncated `matched_ids` summary, optional `active_filter` | Debounce; no raw query or per-keystroke events | analyticsPrivacy, projectDiscovery, commandAnalytics, browser searches |
| `project_filter`: category/technology/clear | Projects handlers | `action`, `category` or `active_filter` | One per filter activation | projectDiscovery, browser projects |
| `project_archive` | Projects archive toggle | `action`: show/hide | One per toggle | projectDiscovery, browser projects |
| `project_toggle` | Projects expand/collapse | `content_id`, `action` | One per toggle; shallow URL update does not add a view | projectDiscovery, browser projects |
| `project_drawer` | Legacy drawer catalog ID changes | `content_id`, `action`: open/close | Stable ID reference prevents effect replay duplication | analyticsExtras |
| `command_palette` | Open shortcut/control; close Escape/shortcut/backdrop/selection | `action`, `action_method`, `interaction_type` | One per requested open/close action | commandAnalytics, browser keyboard |
| `file_download` | Explicit résumé download or generic document/archive link | `file_name`, `file_extension`, sanitized `link_url`, `interaction_type` | Explicit résumé controls skip generic listener | resumePage, browser PDF |
| `share` | Composer opening or successful link copy | `method`, `content_type`, `item_id`, `share_action`, `share_placement`, `shared_at`, `shared_path`, campaign tags | One per successful operation; composer action is explicitly identified | blogShare, browser copy |
| `share_error` | Clipboard copy failure | Same sharing context, no error text | One per failed operation | blogShare |
| `form_start` | First focus/edit/submit interaction | `form_id`, `form_name` | Once per form visit | contactForm, browser form |
| `form_engagement` | Field focus or first edit | `action`, `field_id`, `form_id` | First edit once per field; repeated focus remains meaningful | contactForm |
| `form_submit` | Valid submit handler | `form_id`, `form_name`, `form_submit_text` | Ignore pending duplicate submission | contactForm, browser retry |
| `form_validation_error` | Native validation or server field validation | `field_id`, `form_id`, optional error count/server classification | One per observed invalid attempt/outcome; field IDs allowlisted | contactForm, browser server failure |
| `form_error` | Formspree form/field failure | `form_id`, `form_name`, `error_count` | Per response state; no server error messages | contactForm |
| `form_pending` | Submit resolves to failure/success | `form_id`, `interaction_type`, `duration_msec` | One per pending attempt | contactForm, browser failure/retry/success |
| `form_abandonment` | Interacted form leaves page/unmounts before success | `form_id`, `form_name` | Once until next attempt; never after success | contactForm positive/negative lifecycle guards |
| `generate_lead` | Formspree success | `lead_source`, `form_id`, `form_name` | Success reference prevents effect replay duplication | contactForm, browser success |
| `error_page` | 404/500 rendered | `error_category`: not_found/server | Once with page visit | analyticsRouting, browser error routes |
| `exception` | Runtime/resource errors, unhandled rejection, non-cancelled navigation failure | `error_category`, `fatal` | One per actual failure; no exception message or resource URL | analyticsRuntime runtime/resource/rejection tests, analyticsRouting failure |
| `web_vital` | Available Next.js Web Vitals/custom performance metrics | `metric_id`, `metric_name`, `metric_value`, optional label/rating/start/navigation type | SDK lifecycle owns measurement | analyticsPrivacy metric ID; production Google command verification |
| Consent controls and privacy link | Provider/UI; protocol `consent default/update`, not an Analytics event | Four Google consent states; local version/expiry only | Initialize once; restore before config; persist 180 days; immediate withdrawal/cross-tab updates | analyticsConsent, analyticsControls, browser consent combinations/storage failures |

`timing_complete`, `trackView`, and `trackError` are compatibility helpers with no additional current UI callers. They are not missing user journeys; runtime now owns active-time and categorized errors.

### Google-collected / property setup required

| Capability | Status | Reason / action |
| --- | --- | --- |
| `first_visit`, `session_start`, `user_engagement`; sessions and returning visits | Google-collected | Native tag/session lifecycle; identifiers depend on consent. Do not manufacture duplicate session events. |
| Source/medium/campaign, landing page, referral domain | Google-collected | Clean landing URLs retain supported UTM/ad-click fields; browser referrer may be unavailable. Attribution is Google's responsibility. |
| Device category, browser/OS, language, screen resolution, approximate geography | Google-collected | Native tag; do not add hardware fingerprint signals or claim exact geolocation. |
| Demographics/interests/Google Signals | Property setup required | Eligible aggregated users only; separate advertising consent plus Google eligibility/thresholds. |
| Custom reports, custom dimensions/metrics, key events, retention | Property setup required | Complete checklist below; event dispatch does not register report fields. |
| Search Console/Ads links | Property setup required | Link only existing accounts you control; no credentials or accounts created here. |
| BigQuery export | Property setup required | Optional raw event export; user chooses project/billing and storage/query budget. |

### Inapplicable or deliberately unavailable

| GA4 capability | Reason |
| --- | --- |
| Native/enhanced `click`, `scroll`, `view_search_results`, form and download auto-measurement | Replaced by explicit ownership; disable overlaps in stream configuration. |
| Recommended `search` with `search_term` | Raw visitor text excluded; custom `site_search` captures safe behavior. |
| Video/audio playback progress | No observable supported player in current site. PDF iframe is not video; browser PDF internals inaccessible. |
| Ecommerce/item-list shopping, cart, checkout, payment, shipping, purchases/refunds/promotions | Portfolio has no store or commerce journey; project listings are content, not purchasable items. |
| Login, account signup, memberships/groups, user ID, cross-device authenticated identity | No authentication/account system. No synthetic identities. |
| Game levels, virtual currency, tutorials/onboarding | No matching product features. |
| App/Firebase lifecycle, push messaging, in-app purchases, ad impressions/revenue | Website only; no app SDK or ad-serving feature. |
| Lead qualification/CRM pipeline events | No observable downstream CRM system. Only successful contact submissions generate leads. |
| Newsletter signup event | Existing API has no rendered subscriber UI; no invented signup journey. |
| Direct RSS/PDF/API consumption | No JavaScript collection in those responses. Measure website link activation; do not claim subscriptions, PDF completion, or server API identity. |
| `/design` as independent production experience | Production redirect leads to `/`; development logs only. Legacy components retain tracking for rendered legacy/error layouts. |
| Completed external sharing, actual file receipt, private iframe activity | Cross-origin/browser boundaries provide no reliable completion signal. |
| Raw form/search text, visitor names/emails, arbitrary URL queries, raw exceptions | Excluded by approved data policy and Google's PII requirements. |
| Hover streams, pointer coordinates, individual keystrokes, fingerprinting | Outside selected meaningful-action scope. |
| Measurement Protocol/server-side proxy | No supported server business event needing it; do not bypass browser consent or blockers. |

## GA4 property setup checklist

Apply in existing property before deploying this instrumentation. No property edits or deployment were performed by this task.

1. **Admin → Data collection and modification → Data streams → web stream.** Confirm measurement ID matches production `NEXT_PUBLIC_GOOGLETAG` (a `G-…` ID), correct website URL, and one Google tag. Remove any separate installation/GTM events that duplicate this site's explicit events.
2. **Enhanced measurement → gear.** Disable Scrolls, Outbound clicks, Site search, Form interactions, and File downloads. Under Page views → advanced settings, disable **Page changes based on browser history events**. Code sets `send_page_view:false` and owns initial/SPA/restored page views. Leave video measurement off while no supported player exists.
3. **Admin → Custom definitions → Create custom dimension.** Use **Event** scope for every parameter below; use parameter itself as display name. Existing equivalent definitions can be reused:

   `page_type`, `view_type`, `navigation_type`, `interaction_type`, `action`, `action_method`, `placement`, `source`, `section_id`, `content_id`, `content_type`, `item_id`, `item_list_name`, `event_category`, `event_label`, `button_id`, `form_id`, `field_id`, `lead_source`, `search_scope`, `active_filter`, `category`, `method`, `share_action`, `share_placement`, `error_category`, `visibility_state`, `metric_name`, `metric_rating`, `metric_label`.

   This is 30 event-scoped definitions. Do not register high-cardinality `metric_id`, `shared_at`, URLs, or concatenated match lists as custom dimensions. Native dimensions such as page location/title, language, source/medium, and device category need no duplicate custom definition. Do not create occupation or visitor-identity user properties.
4. **Custom definitions → Create custom metric.** Event scope; parameter/display name matching below. Unit: Standard for all values because durations are emitted in milliseconds; names retain units:

   `active_time_msec`, `duration_msec`, `max_scroll_percentage`, `depth_percentage`, `milestone_seconds`, `query_length`, `result_count`, `error_count`, `viewport_width`, `viewport_height`, `metric_value`.

   Filter `metric_value` by `metric_name` before comparing. CLS is multiplied by 1000; other values use Next's emitted metric units. Available metric names/ratings depend on SDK. Definitions affect reporting going forward, not historical retroactive reporting.
5. **Admin → Data display → Key events.** Create/mark `generate_lead`. Do not mark generic clicks, searches, preview openings, or share intents as completed conversions. No invented lead monetary value.
6. **Admin → Data collection → Google signals data collection.** Enable eligible demographics/interests collection if desired under separate Advertising consent. Review regional controls and current Google eligibility. Thresholds and incomplete coverage are expected, not missing code. Enable ad-personalization features only consistently with captured consent choices.
7. **Admin → Product links.** Link existing Search Console property to this web stream. Link existing Google Ads account only if one exists and you want campaign/conversion integration; review personalized-advertising setting against consent. No account required for site behavior tracking.
8. **Admin → Data retention.** Choose highest available suitable event/user retention (standard GA4 usually 14 months; larger properties/360 differ). For durable event-level history, optionally enable **Product links → BigQuery links** using your own project; daily export, all relevant events, chosen dataset region. Streaming export is optional and can incur additional cost. BigQuery storage/query/export costs and access policies are user decisions; not activated here.
9. **Data filters.** Define internal traffic only with actual known IP ranges; do not invent addresses. Put internal/developer traffic filters into Testing first; inspect matching data before making filters Active.
10. **Tag Assistant / DebugView.** Connect Tag Assistant to deployed site to enable debug collection. Verify denied defaults before config, restored/update/withdrawal choices, one page view per route, no extra page views on project shallow state/anchors, and exactly one `generate_lead` for a successful test submission. With denied consent, DebugView visibility can be limited; inspect Consent tab and network as well. Realtime and reports can lag; report presence is not proven by a successful HTTP collection response.

Suggested explorations: acquisition → landing page → content exposure/selection → résumé/contact intent → successful lead; project/filter/search discovery; article exposure → scroll/active time → share action; form start → validation → submit → failure/retry → success. Segment by page/content/placement and event action. Use built-in acquisition/device/geography reports for native fields.

## Verification and repeatability

Run Jest, lint, TypeScript, direct Next build, and existing performance budget check:

```sh
JEST_JUNIT_OUTPUT_DIR=/tmp/ga4-jest-reports npm test -- --runInBand --coverage=false
npm run lint
npx tsc --noEmit
NEXT_PUBLIC_GOOGLETAG=G-TEST123 npx next build
npm run check-performance
npx next start -H 127.0.0.1 -p 3100
```

The dummy ID build is for verification only. A production release must be rebuilt with its real measurement ID. Avoid `npm run build` during isolated verification: its wrapper synchronizes/generates tracked content.

`scripts/verify-ga4.cjs` requires Playwright and a local copy of Google's public tag script. It accepts only loopback site URLs, blocks all Google collection, uses `G-TEST123`, stubs Formspree and Vercel transport, and never submits a live contact message. Install/use an existing Playwright runtime outside the application; set `GA4_PLAYWRIGHT_MODULE` to its module path when not locally resolvable.

```sh
curl --fail 'https://www.googletagmanager.com/gtag/js?id=G-TEST123' -o /tmp/ga4-google-tag.js
GA4_GOOGLE_TAG_PATH=/tmp/ga4-google-tag.js node scripts/verify-ga4.cjs
```

Optional environment variables: `GA4_TEST_URL`, `GA4_PLAYWRIGHT_MODULE`, `GA4_REPORT_PATH`, `GA4_SCREENSHOT_PATH`. Default report `/tmp/ga4-browser-verification.json`; default mobile screenshot `/tmp/ga4-consent.png`. Browser scenarios cover consent combinations/reload/withdrawal/cross-tab/unavailable storage, initial and SPA/shallow views, project discovery, palette keyboard navigation, share copy, native PDF redirects/opening, stubbed form failure/retry/success, error routes, blocked tag, and prohibited-payload checks. Jest additionally covers visible-time milestones, exposure qualification, scroll resets, BFCache restoration, prerender exclusion, malformed/expired preferences, and listener cleanup.

Live GA4 property configuration, real attribution/demographic availability, report definitions, consent modeling eligibility, and live-property ingestion remain user verification tasks. Browser checks validate dispatch and intercepted native Google network requests, not acceptance into a live report.

### Official references

- [Recommended events and required parameters](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Consent Mode implementation and ordering](https://developers.google.com/tag-platform/security/guides/consent)
- [Enhanced measurement ownership](https://support.google.com/analytics/answer/9216061)
- [Collection limits](https://support.google.com/analytics/answer/9267744)
- [Avoid personally identifiable information](https://support.google.com/analytics/answer/6366371)
- [Custom dimensions and metrics](https://support.google.com/analytics/answer/14240153)
- [Demographic eligibility and thresholds](https://support.google.com/analytics/answer/12948931)
- [Data retention](https://support.google.com/analytics/answer/7667196)
- [BigQuery export](https://support.google.com/analytics/answer/9358801)
