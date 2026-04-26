<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0
Bump rationale: MINOR — initial ratification; four principles and two sections added from blank template.

Modified principles:
  (none — first population from template)

Added sections:
  - I. Code Quality
  - II. Testing Standards
  - III. User Experience Consistency
  - IV. Performance Requirements
  - Quality Gates
  - Development Workflow
  - Governance

Removed sections:
  (none)

Template sync status:
  ✅ .specify/templates/plan-template.md
      Constitution Check gate section present and aligns with principles.
  ✅ .specify/templates/spec-template.md
      Functional requirements, success criteria, and acceptance scenarios align
      with Code Quality and UX Consistency principles.
  ✅ .specify/templates/tasks-template.md
      Test-optional approach and TDD ordering (tests FAIL before implementation)
      aligns with Testing Standards principle.
  ⚠  .specify/templates/commands/ — directory not found; no command files to update.

Deferred items:
  (none — all placeholders resolved)
-->

# Wedding Website Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code MUST pass TypeScript strict mode with zero type errors before merge.
ESLint rules MUST be satisfied; no suppression comments are permitted without an
inline justification referencing a specific, documented constraint.

- Functions MUST be pure where possible; side effects MUST be isolated and explicit.
- Components MUST be single-responsibility and self-contained.
- Dead code MUST be removed; commented-out code is PROHIBITED in committed files.
- Magic values (colors, numbers, strings) are PROHIBITED; all constants MUST be
  named and colocated with their usage or in a shared token file.

**Rationale**: Type safety and linting are the lowest-cost bug-prevention layer
available. Enforcing them unconditionally keeps the codebase navigable as the
wedding feature set grows under time pressure.

### II. Testing Standards

New features MUST have acceptance tests covering the primary happy path and at
least one failure/edge-case path before the feature is considered complete.

- Tests MUST be written before implementation for any non-trivial logic (TDD).
  The Red → Green → Refactor cycle is the required sequence.
- End-to-end tests MUST cover all critical user journeys: RSVP submission,
  navigation between pages, and guest information access.
- No test may be committed in a permanently skipped (`skip`, `xtest`, `.skip`)
  state without a comment that includes a linked issue or TODO with owner.
- Contract tests MUST be written whenever a shared schema or API boundary changes.

**Rationale**: The site has a hard deadline (the wedding date). Tests catch
regressions that would otherwise surface in front of guests with no recovery path.

### III. User Experience Consistency

The UI MUST derive all visual values from a single shared design token system
(colors, typography, spacing). Inline or hardcoded style values are PROHIBITED.

- All interactive elements MUST be keyboard-accessible and MUST meet WCAG 2.1 AA
  minimum contrast ratios (4.5:1 for text, 3:1 for large text and UI components).
- Page transitions and animations MUST use a consistent duration (≤ 300ms) and
  easing curve drawn from the shared token system.
- Every user-facing feature MUST have designed and implemented states for: error,
  loading, and empty — these states are not optional.
- Mobile-first responsive design is MANDATORY. All layouts MUST be verified at a
  minimum viewport width of 375px before merge.

**Rationale**: Wedding guests span a wide age range and device diversity. An
inconsistent or inaccessible UI damages the experience of a day that cannot be
repeated.

### IV. Performance Requirements

Core Web Vitals MUST meet the following thresholds, measured on a simulated 4G
connection, before any feature ships to production:

| Metric | Threshold |
|---|---|
| Largest Contentful Paint (LCP) | ≤ 2.5 s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Interaction to Next Paint (INP) | ≤ 200 ms |

- All images MUST use `next/image` with explicit `width`, `height`, or `fill` and
  a correct `sizes` attribute. Unoptimized images are PROHIBITED.
- Any pull request that increases the client JavaScript bundle by more than 10 KB
  (gzipped) MUST include a written justification in the PR description.
- Server-side rendering or static generation MUST be preferred over client-side
  data fetching for all content that does not require real-time updates.

**Rationale**: Guests will access the site on the day itself, often on cellular
connections. Slow or layout-shifting pages create friction at the worst possible
moment.

## Quality Gates

Every pull request MUST satisfy all of the following before merging:

- `tsc --noEmit` exits with zero errors.
- ESLint exits with zero warnings or errors (no `--max-warnings` bypass).
- All tests pass (`pnpm test` or equivalent) with no skipped tests lacking justification.
- Lighthouse CI scores MUST be ≥ 90 for Performance, Accessibility, and Best Practices
  on the affected pages (measured against the production build).
- A brief constitution compliance note is included in the PR description confirming
  no principle is violated or documenting any approved exception.

If any gate fails, the PR MUST NOT be merged until the failure is resolved or an
explicit exception is approved and documented by the author.

## Development Workflow

- All work MUST be done on feature branches. Direct commits to `main` are PROHIBITED.
- A feature specification (`spec.md`) MUST exist and be approved before implementation begins.
- Each feature branch MUST correspond to a single spec; batch branches that span
  multiple unrelated features are PROHIBITED.
- Pull requests require at least one review approval before merging.
- Commits MUST be atomic: one logical change per commit with a descriptive message.
  Merge commits from `main` into feature branches are preferred over rebasing
  published branches to avoid rewriting shared history.

## Governance

This constitution supersedes all other development practices, informal conventions,
and ad hoc decisions made in this project. When a conflict exists between any other
document and this constitution, this constitution takes precedence.

**Amendment procedure**:
1. Propose the change with a written rationale (PR description or documented discussion).
2. Obtain at least one approval from a project contributor.
3. Update this file, increment the version according to the versioning policy below,
   and update `LAST_AMENDED_DATE`.
4. Propagate any changes to affected templates per the consistency checklist in the
   Sync Impact Report header of this file.

**Versioning policy**:
- MAJOR: Backward-incompatible removal or redefinition of an existing principle.
- MINOR: New principle or section added, or materially expanded guidance.
- PATCH: Clarifications, wording improvements, or non-semantic refinements.

**Compliance review**: Constitution compliance MUST be verified at every pull request
via the Quality Gates section above. No exception may be granted silently; all
exceptions MUST be documented in the PR where they occur.

**Version**: 1.0.0 | **Ratified**: 2026-04-26 | **Last Amended**: 2026-04-26
