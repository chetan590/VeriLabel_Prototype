# Architecture

## 1. Scope and operating model

VeriLabel is a single-page React 19 application built with Vite, TypeScript, Tailwind CSS, and a small amount of global CSS. It is intentionally frontend-only. The browser owns route resolution, theme and language state, demo-session state, sample selection, simulated processing, result rendering, and PDF generation.

There is currently no application server, database, live OCR endpoint, rule engine service, secure identity provider, or persistent inspection store. The application should therefore be read as a demonstrator of an inspection experience and data model rather than as an operational enforcement platform.

## 2. Runtime topology

```text
src/main.tsx
  └─ App
     ├─ ThemeProvider
     │  └─ I18nProvider
     │     ├─ public role selection (/)
     │     ├─ officer auth (/officer or protected officer route)
     │     ├─ officer dashboard (/officer/dashboard)
     │     └─ CustomerShell
     │        ├─ Header + GlobalControls
     │        ├─ OverviewTab
     │        ├─ ScannerTab
     │        │  ├─ PhotosGrid
     │        │  ├─ simulated PipelineStepper
     │        │  ├─ BoundingBoxOverlay
     │        │  └─ ResultsPanel
     │        ├─ TeamTab
     │        └─ ChatbotFab
     └─ client-side PDF service
```

`App.tsx` is the lightweight route resolver. It uses `history.pushState`, `history.replaceState`, and the `popstate` event rather than a router package. The same `CustomerShell` and shared scanner/team components are used for customer and officer-facing scan/team views; `officerMode` changes navigation targets and labels, not the core scan or team implementation.

## 3. Route map and access rules

| Path | Rendered surface | Access rule |
| --- | --- | --- |
| `/` | `RoleSelectionPage` | Public |
| `/officer` | `OfficerAuthPage` | Public |
| `/officer/dashboard` | `OfficerDashboardPage` | Requires `sessionStorage['verilabel:officer'] === 'true'` |
| `/officer/scan` | `CustomerShell` with `ScannerTab` | Requires demo session |
| `/officer/team` | `CustomerShell` with `TeamTab` | Requires demo session |
| `/customer` | `CustomerShell` with `OverviewTab` | Public |
| `/customer#scanner` | `CustomerShell` with `ScannerTab` | Public |
| `/customer#team` | `CustomerShell` with `TeamTab` | Public |

An unauthenticated protected officer path is rendered as the officer login page. The officer logout action removes the demo session and navigates to `/`, which is the public landing/role-selection page.

## 4. Provider and persistence model

### Theme

`ThemeProvider` reads and writes `localStorage['verilabel:theme']` with the values `light` and `dark`. An effect applies `data-theme` and `color-scheme` to `document.documentElement`. `src/index.css` defines independent light and dark semantic variables and targeted mappings for legacy utility classes.

### Language

`I18nProvider` reads and writes `localStorage['verilabel:language']` with `en`, `hi`, or `mr`, and keeps the root `lang` attribute synchronized. Translation keys are defined in `src/i18n/index.tsx`; all three locales should receive a value when a key is added. The brand name `VeriLabel` remains unchanged across locales.

### Officer session

The officer login is deliberately demo-only. A successful form submission stores `verilabel:officer` in `sessionStorage`. No password is sent to a server, hashed, or verified by an identity service. This must not be presented as production authentication.

## 5. Customer and officer composition

`OverviewTab` is the common home surface. It includes the hero copy, shared dashboard actions, homepage video, four-step explanation, and prototype footer. `DashboardActions` is the singular source for the `Scan the Product` and `Meet the Team` actions, so customer and officer entry points stay aligned.

`CustomerShell` owns the active tab and maps it to either a customer hash route or an officer path. There is no bottom navigation bar in the shared shell. The header and dashboard actions provide the navigation entry points.

`TeamTab` renders the six members from `TEAM_MEMBERS` in `src/data/presets.ts`, with local portrait paths and per-member GitHub/LinkedIn values. Officer mode reaches this same team surface at `/officer/team`; it does not maintain a second officer-specific team list.

`ChatbotFab` is a local FAQ assistant. It normalizes the submitted question, scores keyword matches from `assistantFaqs`, and renders the best match with a source name and URL. A no-match state is rendered when no FAQ keyword is found. There is no network request, streaming response, or unhandled promise in this flow.

## 6. Scan and report data flow

```text
src/data/samples/*.json
  → src/data/presets.ts / SAMPLE_DATASETS
  → PhotosGrid selection
  → ScannerTab activeSample
  → timed simulated pipeline
  → BoundingBoxOverlay + ResultsPanel
  → pdfService.generateInspectionPdf(activeSample, { language })
  → browser download: VeriLabel_Inspection_<case>.pdf
```

The scan pipeline uses state and timeouts to show four stages: preprocessing, OCR-style extraction, rule validation, and verdict finalization. It does not derive a result from pixels. After completion, the selected fixture supplies all visible findings and overlay data.

Each `SampleDataset` contains:

- identity and case reference;
- product name, category, quantity, MRP, and date text;
- primary and thumbnail image paths;
- summary, badge, and default result status;
- `boundingBoxes` for optical-region visualisation;
- `violations` with severity and rule text;
- `compliant` elements with displayed values; and
- `changeLog` corrective actions and statutory references.

`pdfService.ts` produces a client-side PDF containing a report header, product summary, verdict, violations, compliant elements, corrective action plan, and optical-region analysis. It uses the selected fixture’s case reference when available and localises report labels for the selected language.

## 7. Officer prototype data

`src/data/officerPrototypeData.ts` contains static summary counts, recent inspections, violation records, penalty examples, repeated-offender examples, and evidence references. These records are deliberately labelled as prototype/Mumbai sample data in the UI and documentation. Amounts, hashes, timestamps, and totals are not authoritative records.

## 8. Assets and dependencies

- Product labels: `public/assets/labels/product-1.jpeg` through `product-6.jpeg`.
- Team portraits: `public/assets/team/`.
- Logo: `public/assets/verilabel-logo.PNG`.
- Homepage video: `public/assets/Video_VeriLabel.mp4`.
- Devanagari font asset: `public/fonts/NotoSansDevanagari-Regular.ttf`.
- PDF: `jspdf`.
- UI icons: `lucide-react`.
- Confetti success cue: `canvas-confetti`.

## 9. Extension points

To evolve the prototype safely:

1. Replace the demo session with a server-backed identity flow before using real officer data.
2. Introduce a service boundary for image upload, OCR, rule evaluation, and report persistence.
3. Keep fixture-backed UI states available as deterministic test data.
4. Preserve `SampleDataset` as the UI contract or add an explicit API adapter rather than spreading response-shape assumptions through components.
5. Move legal references and rule interpretation into a reviewed source registry with version/date metadata.
6. Add automated route, theme, accessibility, PDF text, and visual regression tests before treating the workflow as production-ready.
