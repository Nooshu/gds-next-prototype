# ADR-0001: React (Next.js SSR + PE) vs Server-rendered HTML (Express/Nunjucks)

## Context

This prototype demonstrates FaCT journeys using Next.js (SSR-first) with Progressive Enhancement (PE) and the GOV.UK Design System. See also: `docs/React non preferred framework motivations.md`.

## Decision

Proceed with React + Next.js (SSR + PE) for the prototype to prove feasibility. Document additional complexity introduced, and provide guidance on when a traditional server-rendered approach (Express/Nunjucks + GOV.UK Frontend) may be preferable.

## Forces / Trade-offs

### Accessibility and Progressive Enhancement

-   **React/Next.js**: Achievable but requires deliberate focus management and timing controls (e.g.,`useEffect` + deferred focus, skip-link interplay, ID wiring for`aria-describedby`, live-region updates).
-   **Server-rendered HTML**: Native page-load semantics make focus and skip-links deterministic with less code.

### Testability and Reliability

-   **React/Next.js**: Playwright stability needs timing allowances around hydration/focus. We implemented resilient assertions and small waits.
-   **Server-rendered**: Fewer timing issues; simpler tests.

### Performance and User Experience

-   **React/Next.js**: SSR reduces JS cost but still ships hydration code; careful client component boundaries needed.
-   **Server-rendered**: Smallest JS footprint by default; faster on low-spec/rural contexts.

### Developer Experience and Maintainability

-   **React/Next.js**: Component reuse, co-location, and ecosystem benefits. Complexity rises for strict GDS PE+a11y behaviours.
-   **Server-rendered**: Simpler baseline, fewer a11y/PE pitfalls; less client interactivity out of the box.

## Complexity Introduced (React Path) and Mitigations

### Focus Management Complexity

-   **Issue**: Skip links vs hydration timing; error summary programmatic focus; live-region announcements need keyed rerenders.
-   **Mitigation**: Added`FocusOnRender` with delayed focus and skip-link awareness. Error summary focus uses a ref to the actual`.govuk-error-summary` node, with tabindex injection.

### ID/ARIA Wiring Challenges

-   **Issue**: Framework-generated IDs complicate "stable ID" expectations, tests and screen-reader mapping.
-   **Mitigation**: Tests accept framework-generated IDs; stable`aria-describedby` across hint/error.

### Hydration and JS Cost

-   **Issue**: Even SSR-first, hydration adds overhead (performance and complexity).
-   **Mitigation**: Constrain client components; measure and budget JS execution time.

### GOV.UK Frontend JavaScript Dependency

-   **Issue**: React approach requires bundling GOV.UK Frontend's JavaScript (`public/govuk-frontend.js`) to enable component behaviours (skip links, error summaries, details polyfills, conditional reveals). This adds ~5KB of additional JS that wouldn't be needed in a server-rendered approach.
-   **Mitigation**: Copy GOV.UK Frontend JS to public directory and load via `<Script>` tag. This enables official GOV.UK behaviours but increases JS footprint and complexity.
-   **Impact**: Without this JS, Playwright tests fail completely (0/22 pass) and accessibility violations increase significantly. Server-rendered HTML would rely on native browser behaviours instead.

### Test Brittleness Risk

-   **Issue**: More routes/states = more timing edges (focus, live regions, transitions).
-   **Mitigation**: Playwright waits (`networkidle`, short timeouts), focus checks via activeElement evaluation.

### Cognitive Load

-   **Issue**: Developers must master both GOV.UK Frontend semantics and React/Next SSR/PE footguns.
-   **Mitigation**: Codify a11y primitives as internal library; template discipline (data-in, markup-out).

## When to Prefer Each Approach

### Prefer React/Next.js SSR + PE when:

-   You need a reusable component library and significant client-side interactivity.
-   Teams standardise on React, and you can invest in PE/a11y scaffolding and testing.
-   Rich user interactions (autocomplete, tabs, modals) are core to the service.

### Prefer Server-rendered HTML (Express/Nunjucks + GOV.UK Frontend) when:

-   Strict PE/a11y with minimal JS is paramount (low-spec/rural, assessor expectations).
-   Journeys are mostly read/submit without rich client interactions.
-   You want the simplest path to deterministic page semantics and tests.
-   Performance on low-bandwidth/rural connections is critical.

## Future Evolution Concerns

### If React Continues (Scaling Challenges)

-   **More interactions**: Autocomplete, tabs, modals multiply React a11y work. Each needs robust PE fallbacks and trapping/restore-focus logic.
-   **State management creep**: Avoid client-side state for things HTML does natively (forms, navigation, sorting). Keep logic on the server.
-   **Design system drift**: Wrappers can diverge from GOV.UK Frontend; set rules to mirror GOV.UK markup exactly, and test "HTML matches" per GOV.UK guidance.

### Alternative Architectures Better Aligned to Motivations

-   **Server-rendered HTML baseline (recommended)**: Express or Nest + Nunjucks + GOV.UK Frontend, conventional controllers/views/forms, progressive enhancement via tiny vanilla JS where truly needed.
-   **Hybrid/islands if richer interactivity is mandatory**: Keep pages server-rendered; mount small React islands for specific interactive widgets only (no app-wide hydration).

## Outcome in This Prototype

-   All Playwright suites pass (22/22).
-   axe-core: 0 violations (on key routes).
-   Lighthouse: Accessibility ≈96, Performance ≈80 (meets target).
-   Feasibility proven, with documented complexity overhead for React.

## References

-   TESTING_RESULTS.md
