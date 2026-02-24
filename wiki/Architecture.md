# 🏗️ Architecture

PickMe is deliberately simple. No microservices. No orchestration layers. No Kubernetes. It's a static web app with a cloud database bolted on the back.

Here's what that actually means.

---

## 🗂️ High-Level Structure

```
Browser
  └── Loads public/index.html
        ├── Registers sw.js (Service Worker)
        ├── Loads styles.css
        └── Loads script.js
              ├── Initialises Firebase SDK (CDN)
              ├── Reads/writes to Firestore
              ├── Calls ipapi.co for IP geolocation
              └── Uses browser Geolocation API
```

That's the whole thing. No server-side rendering. No API layer you maintain. Firebase is the API.

---

## 🎨 Frontend Layer

### Files

| File | Purpose |
|------|---------|
| `index.html` | Main app: pickup line generator, letter form, code reader |
| `valentine.html` | Animated surprise page shown to the letter recipient |
| `public_letter.html` | Public wall — displays all public letters |
| `godview.html` | Admin dashboard (password-protected) |
| `styles.css` | Complete design system: layout, animations, themes (1,000+ lines) |
| `script.js` | All application logic (1,092 lines) |

### Design System (styles.css)

The CSS is structured with custom properties at the top for colors, typography, and spacing. The sheet handles:

- **Light / dark mode** — class-toggled on `<body>`, persisted in `localStorage`
- **Responsive layout** — mobile-first, tested at 375px and above
- **Animations** — floating hearts, rose petals, typewriter cursor, loading spinner, parallax mesh
- **Component styles** — cards, modals, buttons, forms, toast notifications

### Application Logic (script.js)

Key functions:

```javascript
saveLetter()           // Validates form, calls getIPAndLocation(), writes to Firestore
fetchLetterByCode()    // Reads letter by 6-char code from Firestore
fetchPublicLetters()   // Reads all public letters with sort options
openSurprisePage()     // Redirects to valentine.html with code in URL params
typeText()             // Typewriter animation for pickup lines
getIPAndLocation()     // Calls ipapi.co + browser GPS API
likeLetter()           // Increments like counter in Firestore, tracks in localStorage
initTheme()            // Reads localStorage, applies dark/light mode on load
```

No external JS libraries are used in the main app. The Firebase SDK is loaded from Google's CDN as an ES module.

---

## 📦 PWA Layer

### Service Worker (sw.js)

The Service Worker implements a two-tier caching strategy:

- **Network-first for dynamic/API content** — tries the network, falls back to cache if offline
- **Cache-first for static assets** — CSS, JS, fonts served from cache immediately

On install, the SW pre-caches core static files. On activate, it cleans up old cache versions.

### manifest.json

Minimal PWA manifest:
- App name, short name, icons
- `display: standalone` — looks like a native app when installed
- Theme color and background color matching the app's design

---

## 🔥 Firebase Layer

### Firestore Collections

```
letters/
  └── {documentId}
        ├── senderName: string
        ├── recipientName: string
        ├── message: string
        ├── code: string (6-char unique)
        ├── visibility: "public" | "private"
        ├── likes: number
        ├── timestamp: Firestore Timestamp
        ├── ip: string
        ├── city: string
        ├── country: string
        ├── timezone: string
        └── gps: { lat: number, lng: number } | null
```

There's one collection: `letters`. Public vs. private is a visibility flag on each document, not a separate collection.

### Security Rules (firestore.rules)

- **Read:** anyone can read public letters; private letters can be read by code lookup (no auth required)
- **Write:** anyone can create a letter; likes can be incremented; no deletes from the client

Review `firestore.rules` before deploying — these rules are intentionally permissive for a demo project.

### Firebase Hosting (firebase.json)

Static file serving with:
- All routes pointing to `public/` directory
- Cache headers for static assets
- No rewrites needed (everything is flat HTML)

---

## 🌐 External Services

| Service | Purpose | When Called |
|---------|---------|------------|
| `ipapi.co` | IP → city, country, timezone | On letter submission |
| Browser Geolocation API | GPS lat/lng | On letter submission (requires user permission) |
| Google Fonts CDN | Playfair Display, Outfit, Dancing Script | On page load |
| Firebase JS SDK CDN | Firestore client | On page load |

All external calls are made from the client. There is no proxy server.

---

## 🔐 Admin Panel (godview.html)

A password-protected page that shows all letters with their metadata (including location data). Authentication is a hardcoded password check in frontend JavaScript — this is **not real security**. It's a developer tool, not a user-facing feature.

---

## 🧵 Data Flow Summary

1. User fills in the letter form → `saveLetter()` fires
2. `getIPAndLocation()` fetches IP metadata from `ipapi.co` (and optionally GPS from the browser)
3. Letter data + location metadata written to `letters/` collection in Firestore
4. Firestore returns the document ID; a 6-char code is generated and associated
5. The code is displayed to the sender
6. Sender shares the code
7. Receiver enters code → `fetchLetterByCode()` reads from Firestore
8. `openSurprisePage()` navigates to `valentine.html?code=XXXXXX`
9. `valentine.html` reads the code from URL params, fetches letter, renders the animated reveal

For the full visual diagram, see the [README](../README.md#-data-flow).
