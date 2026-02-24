# 📋 Changelog

All notable changes to **PickMe** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

> Things that are coming but aren't done yet. Don't hold your breath — this is a solo project.

- Custom letter themes
- Email delivery option
- i18n support (love in every language)
- AI-assisted pickup line generation
- Push notifications ("someone liked your letter!")

---

## [1.3.0] — 2026-02-24

### Added
- Full GitHub documentation suite: README overhaul, CONTRIBUTING.md, CHANGELOG.md, SECURITY.md
- GitHub Wiki pages: Home, Architecture, Installation, Usage, Privacy, Troubleshooting, Roadmap
- SVG assets for documentation: banner, architecture diagram, data flow, capability matrix, stats panel
- `assets/` directory for documentation resources
- `wiki/` directory for wiki source files

### Changed
- README.md completely overhauled with SVG diagrams, structured sections, and a demo GIF placeholder
- LICENSE copyright year updated to 2024–2026

---

## [1.2.0] — 2026-01-15

### Added
- Public wall sorting options: Newest, Oldest, Most Liked, Sender A–Z, Recipient A–Z
- WhatsApp share button with pre-formatted message including secret code
- URL parameter support: `?code=ABCDE1` auto-opens the letter directly
- Session click counter for engagement tracking

### Changed
- Letter character limit increased from 500 to 1 000 characters
- Loading animation minimum display time increased to 800ms for smoother UX
- Code character set refined — removed 0, O, I, L to avoid visual confusion

### Fixed
- Dark mode flash on initial page load (now reads localStorage before paint)
- Like button double-firing on rapid clicks
- Mobile layout overflow on the letter form at 375px

---

## [1.1.0] — 2025-12-01

### Added
- PWA support: `sw.js` Service Worker with network-first / cache-first strategy
- `manifest.json` — app installable on home screen
- Password-protected admin panel (`godview.html`) for analytics
- Geolocation capture (IP via `ipapi.co`, GPS via browser API) stored per letter

### Changed
- Firestore security rules tightened — public wall reads are open, writes require letter data

### Fixed
- Firebase offline mode — letters now fail gracefully with a toast notification instead of a broken state

---

## [1.0.1] — 2025-10-20

### Fixed
- Typewriter effect not clearing between pickup lines on rapid key presses
- Valentine surprise page not loading letter content when accessed via URL parameter
- CSS animation jank on Safari (webkit prefixes added)

---

## [1.0.0] — 2025-09-14 🎉

> *The one where love went online.*

### Added
- Pickup line generator with 40+ lines and typewriter animation
- Love letter creator with sender/receiver names and character counter
- 6-character secret code generation (alphanumeric, ~2.1B combinations)
- Animated surprise page (`valentine.html`) with floating hearts, rose petals, typewriter reveal
- Firebase Firestore integration for cloud letter storage
- Like system with localStorage to prevent duplicate votes
- Dark/light theme toggle with localStorage persistence
- Parallax mouse-following background mesh animation
- Toast notification system
- Firebase Hosting deployment configuration

---

[Unreleased]: https://github.com/Kaelith69/pickme/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/Kaelith69/pickme/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Kaelith69/pickme/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Kaelith69/pickme/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/Kaelith69/pickme/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Kaelith69/pickme/releases/tag/v1.0.0
