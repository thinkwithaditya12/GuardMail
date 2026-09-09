# GuardMail master implementation update

Applied to the existing futuristic GuardMail + Aceternity Text Flipping Board project.

## Implemented
- Removed the production-path dependence on the old static 86% demo result.
- `scans.analyze` is now callable without login so the live evidence engine can analyze judge/demo emails before authentication.
- Risk scoring now combines observed risk signals with positive safety evidence; missing SPF/DKIM/DMARC is not treated as failure.
- Credential/payment detection is contextual rather than triggered by isolated words such as `account`, `click`, or `security`.
- Risk and confidence remain separate values.
- Previous analysis is cleared when a new email/sample is loaded or analysis starts.
- Request IDs prevent an older asynchronous result from overwriting a newer analysis.
- Added an offline evidence-based fallback scorer for API failures/timeouts.
- Added a `ThreatExplainerCard` driven by actual returned findings.
- Added a presentation `JudgePitchControls` preset loader. Presets load synchronously and still require the normal Analyze action, so they do not bypass the real analysis engine.
- Analysis overlay remains deterministic at 4.5 seconds.
- Leaflet lifecycle was hardened: callback refs avoid unnecessary reinitialization, cleanup is explicit, height is 320px, and no geographic map is rendered when there are no validated public coordinates.
- Synthetic geolocation coordinates were removed; unavailable geolocation is represented as unavailable rather than fabricated.
- Added regression tests for safe-vs-suspicious scoring and missing authentication handling.
- Preserved the existing forensic PDF export and existing routes.
- Preserved the Aceternity-style Text Flipping Board homepage.

## Important limitation
The full `pnpm check` / `pnpm test` / production build could not be executed in this environment because the project dependencies are not installed and registry access is unavailable. Modified TypeScript/TSX files were syntax-transpiled successfully with TypeScript.

## Expected judge flow
1. Open `/`.
2. Open Analyzer.
3. Choose a preset or paste/drop an `.eml`.
4. Click Analyze.
5. The same evidence-based pipeline runs for samples and real emails.
6. API failure falls back to local evidence analysis instead of displaying the previous case.
