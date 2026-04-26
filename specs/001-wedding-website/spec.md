# Feature Specification: Fabhia & Bruno Wedding Website

**Feature Branch**: `001-wedding-website`
**Created**: 2026-04-26
**Status**: Approved
**Input**: User description — premium single-page wedding website with six sections, RSVP, gift list, and admin view.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Guest Submits RSVP (Priority: P1)

A wedding guest visits the site, scrolls to the RSVP section, enters their name, selects whether they will attend, and submits the form. They receive immediate confirmation that their response was recorded.

**Why this priority**: RSVP is the only interactive feature that requires data persistence and directly affects the couple's planning. It MUST work flawlessly before the wedding.

**Independent Test**: Navigate to the RSVP section, complete the form with a name and attendance choice, submit, and verify a confirmation message appears. Query the database directly to confirm the response was stored.

**Acceptance Scenarios**:

1. **Given** a guest is on the RSVP section, **When** they enter their name and select "Yes, I'll be there" then submit, **Then** a confirmation message appears and the response is stored in the database with `attending: true`.
2. **Given** a guest selects "Regretfully, I cannot attend" and submits, **Then** confirmation appears and the response is stored with `attending: false`.
3. **Given** a guest submits without entering a name, **Then** form validation prevents submission and an inline error is shown.
4. **Given** the database is unavailable, **When** a guest submits, **Then** a user-friendly error message appears and no partial data is stored.

---

### User Story 2 — Guest Claims a Gift (Priority: P2)

A guest visits the Gift List section, browses the curated gifts with names, descriptions, and prices, and marks one gift as chosen. The gift is immediately removed from the available list for all other visitors.

**Why this priority**: Gift coordination prevents duplicate purchases. Optimistic UI ensures the interaction feels instant.

**Independent Test**: Load the gift list, identify an available gift, click "I'll give this", and verify the gift disappears from the available list immediately (optimistic) and is confirmed as taken in the database.

**Acceptance Scenarios**:

1. **Given** a gift is available, **When** a guest marks it as chosen, **Then** it is removed from the visible list immediately (optimistic update) and the change is persisted to the database.
2. **Given** two guests simultaneously try to claim the same gift, **Then** only one succeeds; the second receives a friendly message that the gift was already taken.
3. **Given** the gift links to an external store, **When** a guest clicks the gift name or link, **Then** the external store opens in a new tab.
4. **Given** all gifts are taken, **When** a guest visits the Gift List, **Then** a graceful empty state is shown.

---

### User Story 3 — Couple Reviews RSVP Responses (Priority: P3)

One of the couple visits `/admin`, enters the correct passphrase, and sees a clean table of all RSVP responses with guest names, attendance status, and submission timestamps.

**Why this priority**: The admin view is only for the couple; it does not affect guest experience. A simple, functional view is sufficient.

**Independent Test**: Navigate to `/admin`, enter the correct passphrase (from environment config), and verify a table appears listing all submitted RSVPs with name, attending status, and date.

**Acceptance Scenarios**:

1. **Given** the correct passphrase is entered, **When** the form is submitted, **Then** the full RSVP list is shown with name, attending (Yes/No), and submission date.
2. **Given** a wrong passphrase is entered, **Then** an error is shown and the RSVP list is not displayed.
3. **Given** no RSVPs have been submitted, **When** the admin views the list, **Then** an empty state is shown (not an error).

---

### User Story 4 — Guest Navigates and Experiences the Site (Priority: P4)

A guest arrives at the site and is greeted by a full-screen hero with the couple's names, wedding date, and a live countdown. They navigate through all six sections using the fixed top bar, which highlights the active section. All desktop animations feel cinematic and premium.

**Why this priority**: The full experience matters deeply, but it is built on top of the working interactive features above.

**Independent Test**: Load the site on desktop; verify the hero countdown updates in real time, the navigation bar shows the correct active section as the user scrolls, and all six sections are reachable and render correctly. Repeat at 375px viewport width.

**Acceptance Scenarios**:

1. **Given** the site is loaded on desktop, **When** the page finishes loading, **Then** the hero entrance animation plays, the countdown shows correct days/hours/minutes/seconds to August 22 2026 15:30, and the couple's names are prominently displayed.
2. **Given** the user scrolls down, **When** each section enters the viewport, **Then** a scroll-triggered reveal animation plays and the corresponding navigation item becomes highlighted.
3. **Given** the user clicks a navigation item, **Then** the page smooth-scrolls to the correct section.
4. **Given** the site is viewed on a 375px-wide mobile device, **Then** all sections are readable, interactive elements are touch-friendly, and no horizontal scrolling occurs.

---

### Edge Cases

- What happens when a guest submits the RSVP form multiple times with the same name? Each submission is stored separately (no deduplication required at launch).
- What happens when a guest has JavaScript disabled? Forms degrade gracefully; static content remains visible; animated elements display in their final state.
- What happens if the countdown reaches zero before the wedding? The timer shows all zeros rather than negative values.
- What happens if an external gift store link breaks? The site displays the gift information; the broken external link is the store's responsibility.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display a live countdown timer (days, hours, minutes, seconds) to August 22, 2026 at 15:30 Brasília time (BRT, UTC-3).
- **FR-002**: The navigation bar MUST be fixed at the top of the viewport and MUST highlight the section currently visible in the viewport.
- **FR-003**: Clicking a navigation item MUST smooth-scroll to the corresponding section.
- **FR-004**: The RSVP form MUST accept a guest name (required, non-empty) and an attendance choice (attending or not attending).
- **FR-005**: Submitted RSVP responses MUST be persisted to a database with the guest name, attending status, and submission timestamp.
- **FR-006**: The gift list MUST display each gift's name, description, price, and a link to an external store.
- **FR-007**: A guest MUST be able to mark a gift as chosen, which removes it from the available list for all subsequent visitors.
- **FR-008**: Gift claim state MUST be updated optimistically on the client (immediate UI update before server confirmation).
- **FR-009**: The admin view at `/admin` MUST require a passphrase before displaying RSVP responses.
- **FR-010**: The admin view MUST display all RSVP responses including guest name, attendance status, and submission timestamp.
- **FR-011**: The photo carousel in the Our Story section MUST display couple photos stored as static assets.
- **FR-012**: The Dress Code section MUST display a color palette and moodboard-style visual layout.
- **FR-013**: The site MUST function correctly at a minimum viewport width of 375px.
- **FR-014**: All images MUST be served with size optimization; unoptimized images are prohibited.

### Key Entities

- **RSVPResponse**: Represents a single guest's confirmation. Attributes: unique ID, guest name, attending (boolean), submission timestamp.
- **Gift**: Represents a gift option. Attributes: unique ID, display name, description, price, external store URL, taken status (boolean), taken timestamp (nullable).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The hero countdown displays the correct remaining time and updates every second without page reload.
- **SC-002**: An RSVP submission completes and shows confirmation within 3 seconds on a 4G connection.
- **SC-003**: A gift claim registers the optimistic UI update within 100ms of the user interaction and persists within 3 seconds.
- **SC-004**: All six sections are reachable via navigation on both desktop (≥ 1280px) and mobile (375px) without horizontal scrolling.
- **SC-005**: Lighthouse scores for the home page MUST be ≥ 90 for Performance, Accessibility, and Best Practices on desktop.
- **SC-006**: The admin view correctly displays all stored RSVP responses and rejects incorrect passphrases 100% of the time.
- **SC-007**: Core Web Vitals meet the thresholds defined in the constitution: LCP ≤ 2.5s, CLS < 0.1, INP ≤ 200ms.

## Assumptions

- The couple will populate the gift list with real gift data before the site goes live; the spec defines the data structure and display, not the specific gifts.
- Couple photos are provided as static files before development begins and stored in `public/photos/`.
- The wedding date and time (August 22, 2026 at 15:30 BRT) are fixed and will not change.
- The admin passphrase is managed via an environment variable; no UI exists to change it.
- No email notifications are sent on RSVP submission (the couple checks the admin view manually).
- No deduplication of RSVP submissions is required; duplicate names are stored separately.
- The venue's Google Maps embed URL is provided before development begins.
- The site is in Brazilian Portuguese; English is not required.
- The gift external store links are provided before the site is seeded with gift data.
