# Blog sharing analytics

All article footers offer X, Facebook, LinkedIn, Bluesky, Instagram, email, and Copy link. Social composers receive the production article URL. Instagram copies its own tagged URL with instructions for a Story link sticker, bio, or message; there is no web article composer in this flow. Clipboard failures expose a selectable tagged URL rather than suggesting copying an untagged address-bar URL.

## Outgoing attribution

Every shared URL includes the five standard campaign tags, built afresh from the article slug:

| Parameter | Value |
| --- | --- |
| `utm_source` | `x`, `facebook`, `linkedin`, `bluesky`, `instagram`, `email`, or `copy` |
| `utm_medium` | `social`; `email` for email; `referral` for Copy link |
| `utm_campaign` | `blog_share` |
| `utm_content` | `article_footer` |
| `utm_term` | Article slug, such as `homelab_architect` |

Example:

```text
https://nirmalhk7.com/blog/homelab_architect?utm_source=instagram&utm_medium=social&utm_campaign=blog_share&utm_content=article_footer&utm_term=homelab_architect
```

Incoming tags, arbitrary query parameters, and fragments are not propagated. Slugs and composer parameters are URL-encoded. Campaign tags attribute subsequent visits to the shared platform/campaign, not to an individual sharer. Optional advertising parameters such as creative format and marketing tactic are omitted because this is an organic sharing flow.

## Events and identity

The existing analytics adapter sends GA4's recommended `share` event with `method`, `content_type=blog_post`, and `item_id` (article slug), plus:

- `share_action`: `composer_opened` for social/email link clicks, or `link_copied` after successful clipboard writes.
- `share_placement`: `article_footer`.
- `shared_at`: Browser UTC ISO timestamp. GA4 also records its own event timestamp.
- `shared_path`: Canonical article path.
- All five outgoing UTM values, as event parameters.
- Existing page location/path/title, viewport, device type, and language context.

`share_error` records failed clipboard writes with `share_action=copy_failed`; failed copies do not emit `share`. The share component skips global click instrumentation to avoid duplicate custom click events. Automatic GA4 outbound-click events, if enabled in the property, are separate events and should not be added to the share count.

Anonymous visitor/session identity comes from the existing Google tag, with no new identity cookies, social account collection, or identities embedded in share URLs. GA4's BigQuery export provides `user_pseudo_id`, `ga_session_id` in event parameters, and `event_timestamp` for per-visitor/session analysis. Visitor identity depends on analytics consent, cookies, browser settings, and blockers; it cannot reliably identify one person across devices.

`composer_opened` means the site requested a composer by link click. It does not prove that a popup opened or a post was published. `link_copied` proves only that clipboard writing succeeded. These events do not reveal social usernames, published post URLs, or the eventual recipient.

References: [GA4 share event](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#share), [BigQuery event schema](https://support.google.com/analytics/answer/7029846), [manual campaign tagging](https://support.google.com/analytics/answer/11242870), [Bluesky intent links](https://bsky.network/docs/intent-links/).

## GA4 property setup

The site already loads Google Analytics in production when `NEXT_PUBLIC_GOOGLETAG` contains the measurement ID. Development events go only to the console; they do not reach Google Analytics. Events fired before initialization now use Google's Arguments command format in `dataLayer`.

The code is instrumented. Live collection and reporting definitions still need verification in the GA4 property; no property settings were changed by this implementation.

1. Confirm production `NEXT_PUBLIC_GOOGLETAG` points to the intended GA4 web stream.
2. In GA4 Admin > Custom definitions, create event-scoped dimensions for `method`, `content_type`, `item_id`, `share_action`, and `share_placement` if not already present. Register outgoing UTM event parameters only if needed for share-event reports. These are distinct from GA4's built-in incoming traffic-source dimensions. Avoid registering `shared_at` as a custom dimension because each timestamp creates a different value. [Google's custom-dimension instructions](https://support.google.com/analytics/answer/14239696).
3. Build an Exploration filtered to Event name = `share`, with platform (`method`), article (`item_id`), and action as dimensions; compare event count and total users. Use GA4's geographic/device dimensions for coarse audience context.
4. Use Traffic acquisition filtered by campaign `blog_share` to measure incoming sessions. Manual ad content and manual term represent `utm_content` and `utm_term`.
5. For exact anonymous visitor/session/time analysis, enable the property's BigQuery export and inspect the fields listed above. No export was provisioned here.
6. Verify production share events in Realtime or DebugView with an analytics-enabled browser. Separately visit a tagged link and verify incoming campaign attribution. No real social post is needed for this check.

## Verification

Regression tests cover platform URLs and UTM replacement, share event context/time, successful Instagram copies, clipboard fallback without false success, and pre-initialization GA command format. Local browser checks confirmed desktop and 390px mobile article controls and successful Instagram copy feedback. Live GA4 ingestion and social posting were not tested.
