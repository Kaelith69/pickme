# 💘 PickMe Wiki — Home

Welcome to the PickMe wiki. This is where we explain how everything works in considerably more detail than the README, but with the same energy as a developer explaining their side project at midnight after too much coffee.

---

## 🗺️ What's In This Wiki

| Page | What You'll Learn |
|------|------------------|
| [Architecture](Architecture.md) | How the pieces fit together — frontend, Firebase, PWA, external APIs |
| [Installation](Installation.md) | Every possible way to run this thing locally or in the cloud |
| [Usage](Usage.md) | How senders and receivers actually use the app |
| [Privacy](Privacy.md) | What data is collected, where it goes, and how to turn it off |
| [Troubleshooting](Troubleshooting.md) | Common problems and how to fix them |
| [Roadmap](Roadmap.md) | What's coming next (eventually, probably) |

---

## 🎯 Project in One Paragraph

PickMe is a **serverless, zero-dependency romantic web app** built with pure HTML5, Vanilla CSS, and Vanilla JavaScript, backed by Firebase Firestore. It lets you generate cheesy pickup lines, write personalized love letters, generate a 6-character secret code, and send a crush to a fully animated surprise page. It works as a PWA (installable, offline-capable) and has a public wall of shared love letters with sorting and likes.

The whole thing is one `public/` folder. No build step. No package manager. Just files.

---

## 🧱 Tech Stack Summary

| Technology | Role |
|------------|------|
| HTML5 | Page structure and semantics |
| Vanilla CSS | All styling — 1,000+ hand-crafted lines |
| Vanilla JavaScript (ES6+) | All logic — 1,092 lines |
| Firebase Firestore | Cloud database for letters |
| Firebase Hosting | Static file serving |
| Service Worker (`sw.js`) | Offline caching, PWA layer |
| `ipapi.co` API | IP-based geolocation |
| Browser Geolocation API | GPS coordinate capture |
| Google Fonts CDN | Typography (Playfair Display, Outfit, Dancing Script) |

**npm dependencies: 0.** This is the way.

---

## 🏠 Repository Layout

```
pickme/
├── public/           ← The entire app lives here
├── assets/           ← Documentation SVGs and demo GIF
├── wiki/             ← This wiki (source files)
├── firebase.json     ← Firebase Hosting config
├── firestore.rules   ← Database security rules
├── .firebaserc       ← Firebase project binding
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── SECURITY.md
```

---

## 🔗 Quick Links

- **Live App:** https://sayanth-t-m.github.io/pickme/
- **Issues:** https://github.com/Kaelith69/pickme/issues
- **Contributing:** [CONTRIBUTING.md](../CONTRIBUTING.md)
- **License:** MIT — [LICENSE](../LICENSE)
