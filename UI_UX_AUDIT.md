# PickMe UI, UX and Frontend Deep Audit

Audit branch: `audit/ui-ux-deep-pass-2026`

## Scope and method

This pass reviewed the source for the homepage, letter creation and success states, private code reader, public wall, in app letter view, standalone public letter, animated Valentine surprise, God View admin, responsive styles, interaction code and service worker.

The review used three lenses:

1. Visual design and information hierarchy.
2. Responsive layout and interaction ergonomics across narrow phones, larger phones, tablets, desktop and short landscape windows.
3. Frontend semantics, state transitions, accessibility, failure feedback and cache correctness.

This was a source level audit. It did not include physical device or cross browser screenshot testing. Findings below distinguish directly observable code defects from risks that still require runtime confirmation.

## Findings and fixes applied

### 1. Homepage and main application

| Severity | Finding | Correction |
|---|---|---|
| High | Secondary screens shared explicit desktop grid rows with the page header. The letter view and forms could occupy the same grid row as the heading, creating overlap or compressed positioning at desktop widths. | Secondary states now collapse to a single column, hide the duplicate page header and give the active form or letter a dedicated grid row. |
| Medium | Fixed height and nested scrolling on the public wall could create a scroll area inside the page, especially on smaller touch screens. | Public list height is now viewport bounded on desktop and naturally expands on mobile. Scrollbar space is reserved where appropriate. |
| Medium | Light theme muted text and like controls used low contrast accent colours. | Darkened muted and coral text tokens. Measured contrast ratios: muted on canvas 4.66:1, coral ink on coral surface 5.12:1, violet on white 5.20:1. |
| Medium | Keyboard shortcut handling could trigger pickup line generation when focus was on a button or other interactive control. | Space and Enter shortcut now runs only when focus is on the document background, not on form or interactive controls. |
| Medium | Typewriter animation ignored reduced motion preferences. | Reduced motion and hidden document states now render the line immediately. |
| Medium | Clipboard rejection was unhandled, leaving users without feedback when copying failed. | Added rejection handling and an explicit manual copy fallback message. |
| Medium | Theme toggle did not expose its current state to assistive technology. | Added synchronized accessible label and `aria-pressed` state. |
| Medium | Success state retained the previous creation heading. | Success screen now updates its title and eyebrow to reflect that the letter is ready to share. |

### 2. Letter creation, private reading and success states

- Form and read tabs now expose radiogroup, tablist and tabpanel semantics.
- The selected tab updates `aria-selected` alongside its visual active state.
- The public wall loading region exposes busy and live status.
- Inputs use appropriate autocomplete hints, and the private code input requests one time code style entry and uppercase characters.
- Form screens use the form's own heading instead of duplicating the hidden page heading.
- The letter view uses a dedicated wide reading surface and no longer shares a desktop grid row with the page header.

### 3. Public wall

| Severity | Finding | Correction |
|---|---|---|
| High | An article had `role=button` while containing a nested like button. Nested interactive semantics are invalid and can behave inconsistently with screen readers and keyboard navigation. | Rebuilt each card as a semantic article with a dedicated read button and a separate like button. |
| High | Firebase errors were converted to an empty array, making a failed request look like an empty public wall. | Fetch failures are now distinct from a genuinely empty wall. |
| Medium | Rapid refreshes could allow an older request to overwrite a newer result. | Added request sequence protection and explicit loading state. |
| Medium | The list had no meaningful retry path after failure. | Added a retry action and distinct empty, loading and error states. |
| Medium | Like controls could be activated repeatedly while a request was pending. | Disabled during the request and retained the success and failure feedback. |

### 4. Standalone public letter

- Removed the accumulated intermediate redesign style blocks. The page now has one base style sheet and one final responsive layer.
- Removed the scale and rotate entrance treatment that could make the paper look enlarged on mobile.
- Letter paper width is bounded by the viewport, with dynamic viewport height, safe area padding and internal vertical scrolling.
- The page background is scrollable while the dialog is closed. The background is locked while the letter is open.
- The close action remains visible while reading.
- Envelope activation now supports keyboard interaction.
- The letter is announced as a modal dialog, supports Escape to close, traps keyboard focus, restores focus to the envelope and handles reduced motion without a long artificial delay.

### 5. Animated Valentine surprise

- Consolidated multiple overlapping style override blocks into one final responsive layer.
- Replaced scale based paper entrance with a small vertical transition.
- The letter modal now scrolls vertically rather than clipping long messages.
- Added dynamic viewport sizing, safe area spacing and a short landscape layout.
- Converted the close control into a real button.
- Added keyboard activation for the envelope, dialog semantics, Escape close, focus trapping and focus restoration.
- Reduced motion bypasses the staged opening delay and hides decorative particle effects.
- Closing an instant display restores the hidden envelope stage instead of returning focus to a hidden element.

### 6. God View admin

- Consolidated the admin redesign into one final override layer.
- Removed duplicated Google Fonts preconnect declarations.
- Added consistent Manrope and DM Serif typography.
- Reworked header wrapping, action button sizing, statistic cards, map dimensions, table rows, detail grids and search sizing for phone and tablet widths.
- Added dynamic viewport sizing and scroll handling to the login overlay so short screens and the on screen keyboard do not trap the login form outside the visible area.
- Improved focus indicators and login error announcement.

### 7. PWA and quality gates

- Bumped the service worker cache to `pickme-v6`.
- Bumped the stylesheet URL to `styles.css?v=6`.
- Kept the project relative Pages scope and the standalone reader and surprise pages in the precache.
- Added pull request validation to GitHub Actions. Pull requests run the build and source checks but do not deploy. Main branch pushes continue to deploy.
- CI now checks the external app script, service worker, inline scripts in all standalone pages, and CSS brace balance.

## Responsive review matrix

| Surface | Narrow phone 320 to 360 px | Phone 361 to 560 px | Tablet 561 to 899 px | Desktop 900 px and up | Short landscape |
|---|---|---|---|---|---|
| Homepage | Compact gutters, single column actions, wrapped text | Full width card, safe area padding | Centered single column composition | Two panel composition | Reduced header and quote height |
| Create and read forms | Single column and 16 px input text | Full width fields and tabs | Centered form surface | Dedicated one column form state | Document scrolling remains available |
| Public wall | Cards wrap names and messages | Natural page scrolling | Natural page scrolling | Bounded list with reserved scrollbar space | Page scroll remains available |
| In app letter | Paper width constrained to card | Readable paper padding | Centered reader | Wide bounded reading paper | Natural document scroll |
| Standalone letter | 12 px modal gutters and internal paper scroll | 480 px maximum paper width | 620 px maximum paper width | Centered dialog | Dialog aligns to top and scrolls |
| Surprise page | Safe area modal and no scale entrance | 480 px maximum paper width | Centered 620 px paper | Centered 620 px paper | Top aligned scrollable paper |
| God View | Two column stats, compact actions and rows | Two column stats and full width search | Two column stats and wrapped header | Three column stats and full table | Login overlay scrolls |

## Important security findings not changed in this UI pull request

The source still contains two backend security problems:

1. God View uses a password value directly in client side JavaScript. A client side password is visible to anyone who downloads the page source.
2. Firestore rules currently allow public reads and deletes on the letters collection. This exposes letter records and allows unauthenticated deletion.

These are not safe to fix with a visual only change. Proper remediation requires Firebase Authentication or a trusted server side authorization layer, then a coordinated rules and data access redesign. Tightening the rules without redesigning the anonymous letter code retrieval, public wall and admin flows would break current functionality. Treat this as a separate high priority security project.

## Verification boundary

Source level checks are included in GitHub Actions and will run on the pull request. Actual screenshots and interaction testing on physical Android and iOS devices, multiple desktop browsers, keyboard only navigation and real Firestore failure conditions remain required before claiming full visual or runtime sign off.
