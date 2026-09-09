# Project TODO

- [x] Establish dark-mode forensic dashboard layout and visual design system
- [x] Add authentication-aware judge demo entry point using existing Manus OAuth flow
- [x] Add safe pasted-email and .eml analysis flow with consent and privacy notices
- [x] Add deterministic header, URL, attachment-name, IP validation, and SHA-256 analysis
- [x] Add server-side schema-validated LLM summary and evidence explanation
- [x] Add protected scan metadata persistence with masked history and delete controls
- [x] Add resilient synthetic fallback states for analysis and geolocation failures
- [x] Add interactive dark-mode map for validated public IP-hop route context
- [x] Add high-contrast threat score badges, red-flag tags, and concise summaries
- [x] Add single-click forensic PDF/print export with headers, hops, evidence, actions, and limitations
- [x] Add plain-English historical scan search with transparent query interpretation
- [x] Add dashboard trends and historical threat summaries
- [x] Add unit tests for parsing, scoring, search interpretation, fallback behavior, and protected access
- [x] Verify responsive layouts, accessibility, loading states, empty states, and error states
- [x] Run typecheck, tests, and visual preview verification
- [x] Save final project checkpoint

## Change history

- Initial project scope recorded for MailSentinel dashboard implementation.
- User requirements: map-based IP-hop context, server-side LLM, PDF export, judge login, mock fallbacks, natural-language historical search, privacy-first handling.

## Safety constraints

- Never open extracted URLs or execute/render attachments.
- Geolocation is approximate routing/source-IP context, never sender attribution.
- Synthetic data must be visibly labeled.
- AI processing requires user consent and must use structured validated output.
- Do not retain unnecessary raw email content.
- Reserved/documentation IP ranges are retained as observed non-geolocatable context, while only validated public IPs use live geolocation with timeout-bounded synthetic fallback.
- Added safe .eml file picker and server-side file metadata validation, real downloadable jsPDF export, protected trend summaries, and expanded tests.
- Verified desktop and mobile previews; typecheck and 7 tests pass.
- [x] Fix Google Maps script-load error on the dashboard and ensure graceful route-map fallback without console errors
- [x] Add regression coverage for map loading failure/fallback state
- [x] Force a post-fix Google Maps script failure and confirm the fallback remains visible with no new Maps error log
- [x] Ensure the MapView regression test is discovered by Vitest and confirm it passes
- [x] Review and implement all changes described in the newly attached change request
- [x] Make forensic parsing and findings visibly data-derived from the supplied email
- [x] Add SPF/DKIM/DMARC status parsing with unavailable states and explanations
- [x] Add URL, sender/domain, display-name, Reply-To, Return-Path, and impersonation evidence
- [x] Add evidence-weighted auditable risk scoring with separate Analysis Confidence and Inconclusive classification
- [x] Add attachment metadata/magic-byte/hash analysis without execution
- [x] Add expandable evidence explanations, indicators, attack reconstruction, and MITRE mappings
- [x] Separate core forensic analysis, optional external enrichment, and labeled demo sample data
- [x] Add role-specific recommended actions and architecture visibility
- [x] Expand forensic PDF contents and add evaluation-pending state
- [x] Add automated coverage for malformed email, auth parsing, URL/attachment analysis, scoring, classification, and ambiguous cases
- [x] Replace the evidence ledger Accordion with a runtime-safe expandable implementation and verify no fresh browser error
- [x] Emit explicit evidence items for Return-Path mismatch and display-name impersonation
- [x] Add safe attachment signature detection and SHA-256 computation when attachment bytes are available
- [x] Add malformed .eml and broader classification regression tests
- [x] Replace the current route visualization with an interactive Leaflet.js world map
- [x] Draw a red route line through validated observed public-IP coordinates after analysis
- [x] Preserve context-not-attribution labels and fallback behavior for unavailable coordinates
- [x] Add Leaflet map regression coverage and verify responsive rendering
- [ ] Read and implement all requirements in the newly attached change request
