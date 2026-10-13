# Recruiter review — October 4, 2026

Branch: `codex/cinematic-portfolio`. No merge or deploy. This report supersedes the earlier conversion verification where behavior changed.

## Judgment

The portfolio now makes a credible backend/infrastructure first impression while retaining broader product, security, and AI range. The portrait, immediate employer proof, and hiring links give it a personal identity. Remaining obstacles concern technical evidence and factual consistency more than visual styling. No actual recruiter study or conversion lift was measured.

Two independent assessments: design/usability review A and deterministic/content evidence review B. A completed its initial assessment before B's results were shared. A independently reassessed the edited source; current score is **25/32**. That reassessment was source-only; the primary agent separately confirmed live desktop/mobile behavior. A corrected its initial arithmetic: the initial individual scores sum to 22/32, not the earlier reported 25/32.

| Nielsen heuristic | Score | Evidence |
| --- | --- | --- |
| System status | 3 | Sending/success feedback; optional PDF loading state |
| Real-world match | 3 | Employer, role, education and engineering language |
| User control | 3 | Direct links, native disclosures, archive filters, Escape |
| Consistency | 4 | Shared hiring links and shell across page types |
| Error prevention | 3 | Required email/message, disabled duplicate submission |
| Recognition | 3 | Selected work before the full archive |
| Flexibility/efficiency | n/a | Not a recurring operational workflow |
| Minimalist presentation | 3 | Strong editorial hierarchy; secondary heroes are large |
| Error recovery | 3 | Constructive error pages; form retry/direct-email fallback |
| Help/documentation | n/a | Portfolio, not a tool requiring operational help |

## Priority findings

1. **P1 — Technical credibility and consistency.** The website and PDF disagree on Twzzr/Twizzr title and end date, Ansible implementation status, and Visa internship implementation details. These might describe different scopes or dates, but currently leave readers to reconcile them. GitOps claims an 80% reduction without a measurement baseline; architecture and hypervisor articles make broad security and Kubernetes/VM claims. The hardware article says an Optiplex 7040 uses DDR5; Dell specifies DDR4. Confirm current personal facts, then narrow claims and attach context. Suggested Impeccable command: clarify. Impact: hiring managers may discount otherwise strong evidence.
2. **P2 — Project ownership and tradeoffs.** Autoscaler now explains Kubernetes APIs, Prometheus, InfluxDB, horizontal/vertical scaling and Helm packaging, using existing PDF evidence. Individual ownership, design choices and evaluation limits still need author detail. MedicalVR remains especially brief. Suggested command: clarify. Impact: a reader can identify technologies but cannot fully assess engineering judgment.
3. **P2 — Secondary-page pacing.** Large article/project heroes keep the cinematic identity but postpone the technical proof. Existing user-approved hero/navigation behavior was preserved. Shorter secondary heroes could make evidence faster to scan without changing the homepage signature. Suggested command: distill. Impact: short recruiter visits spend more time on atmosphere.

## Implemented fixes

- Repaired Conclave's invalid image path, legacy ScholarHub link, unsupported iframe markup and ambiguous placement description using the article's own text.
- Repaired One Small Step's raw HTML media markup, now a direct photograph link; unsupported strikethrough became emphasis. No historical claims changed.
- Fixed direct-anchor hydration: server and browser now use the same portfolio transition wrapper. Hash changes do not change its route key or remount the page. Added SSR-structure regression coverage.
- Repaired résumé PDF text extraction. Eleven empty `/ActualText` overrides suppressed experience/project bullets. Removed only empty overrides and compressed streams. Both rendered pages are pixel-identical to the originals at 1200px; all visible bullet text now extracts. Actual ATS software was not tested. PDF size: 108,723 → 114,304 bytes.
- Added NITK BTech Information Technology and dates, CU Boulder MS dates, and clearly separated homelab tools on the HTML résumé, sourced from the existing PDF and repository.
- Made Visa migration, release/deployment responsibility and Jenkins/test practices visible together using shared source-backed selection.
- Led homepage projects with the Kubernetes autoscaler; normalized selected titles/tags from shared curation. Broader work remains accessible.
- Added reusable email, LinkedIn and résumé hiring links to shared contact bands and homepage contact. Added a recruiter-specific invitation and Send message label.
- Added sending/disabled feedback, name/email autocomplete and an accessible general submission failure with retry/direct-email fallback. Formspree ID, field names, success copy and analytics names remain intact. No external form submitted.
- Search now correctly says View résumé, stays in the same tab, and describes verified Visa Java/Reactor work instead of an unsupported Go performance claim.
- 404 suggestions load all local projects, independent of the GitHub sync manifest, and include résumé access.

## Persona walkthrough

- **Recruiter scanning quickly:** face, name, backend/infrastructure specialty and Visa/ZOLL proof are immediate. Education and contact are easier to find. Large secondary heroes still defer details.
- **Engineering manager:** Visa release/Jenkins evidence and autoscaler implementation are stronger. Remaining claim inconsistencies and absent tradeoffs could undermine confidence.
- **Keyboard/mobile visitor:** mobile menu focus enters correctly, Escape closes and restores the trigger. Inputs have accessible names, but visual placeholder labels disappear while typing. Direct email bypasses the form.

## Minor observations and cognitive load

Selected archive presents eight projects rather than 32 at once, with four area options and technology filters behind a disclosure. Desktop navigation has seven destinations/actions; familiar labels mitigate but do not eliminate scan cost. Homepage and blog duplicate the featured GitOps link. ScholarHub's Rails label alone understates frontend work, although the contribution sentence is explicit. The historical Moon article includes dated predictions that should not serve as current technical proof. External project/media links were not exhaustively checked for availability.

## Coverage and verification

Reviewed sources for home, projects/all 32 project records, blog/all seven articles, résumé/PDF, design utility, 404 and 500. Live review covered all seven articles, homepage, archive and project deep link, résumé, and shared hiring navigation. Error/design pages had independent pre-fix desktop inspection. Confirmation focused on 390px contact/résumé and 1440px project/anchor views. Earlier 768px and short-laptop captures remain available; no fresh full matrix or exhaustive keyboard audit is claimed.

- Lint, TypeScript, direct Next build, Jest (15 suites/39 tests), project Markdown check (32 projects), and whitespace check passed.
- Production direct `/#contact` loads without the observed hydration error; cross-page Contact reaches the same section. Exactly one homepage form. Mobile menu Escape restores focus.
- Detector returned zero findings. No new suppressions. Browser overlays unavailable; live screenshots, DOM/source and tests supplied evidence.
- No new libraries, fonts or hero assets. Route JS/CSS gzip: shared app 173.6/175 KiB, home 187.3/200, projects 187.7/200, blog 185.2/195, article 241.9/245. Baseline was 173.2, 186.9, 186.9, 184.5, 241.3 respectively. Runtime LCP/CLS not measured in this review.
- Slow network, JavaScript-disabled, 200% zoom and browser-level reduced-motion emulation unavailable through this browser backend. Existing static/reduced-motion tests pass. No real Formspree transmission or live ATS processing performed.
- Review servers stopped; temporary browser viewport reset and review tab closed. Unrelated staged JUnit report and untracked Renovate configuration preserved.

Screenshots: [desktop project](screenshots/recruiter-projects-desktop.png), [mobile contact](screenshots/recruiter-contact-mobile.png), [mobile résumé](screenshots/recruiter-resume-mobile.png).

## Evidence requiring author confirmation

Which personal record is current: website/YAML or PDF? Confirm Twzzr role/end date, Ansible status, internship scope, and the impact metrics before promoting them. Impeccable's refinement instruction says: “Ask before replacing factual copy or adding claims.” Existing conflicting claims were retained pending confirmation.

Official references: [Dell Optiplex 7040 specifications](https://www.dell.com/support/manuals/en-us/optiplex-7040-desktop/opti7040mt_om/specifications?guid=guid-f058d593-d332-479e-9d55-6c6031fa6cba&lang=en-us), [Kubernetes multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/).

Would you prefer website/YAML facts, PDF facts, or a supplied reconciled version? For autoscaler proof, can you provide a design decision, an evaluation result with context, or a repository link?
