# 🗺️ Roadmap

Where PickMe is headed — eventually. Probably. At some point.

This is an honest backlog, not a marketing timeline. Things move when they move.

---

## ✅ Already Done (Current State)

- [x] Pickup line generator (40+ lines, typewriter animation)
- [x] Love letter form with character counter
- [x] 6-character secret code generation
- [x] Animated surprise page (hearts, petals, typewriter)
- [x] Firebase Firestore cloud storage
- [x] Public wall with sorting (newest, oldest, most liked, A–Z)
- [x] Like system with localStorage deduplication
- [x] WhatsApp share button
- [x] URL parameter code opening (`?code=XXXXXX`)
- [x] Dark / light mode with persistence
- [x] Parallax mouse-following background
- [x] PWA with Service Worker (offline caching)
- [x] Password-protected admin dashboard
- [x] IP and GPS location capture
- [x] Toast notification system
- [x] Loading animation with minimum display time
- [x] Full documentation suite (README, CONTRIBUTING, CHANGELOG, SECURITY, Wiki)

---

## 🔵 Planned — High Priority

### 🎨 Custom Letter Themes

Right now the surprise page has one look. The plan is to add selectable themes (e.g., cosmic, minimalist, retro, dark) that the sender picks when writing. Stored as a `theme` field on the Firestore document.

### 🔒 End-to-End Encrypted Letters

Currently, letter content is stored in plaintext in Firestore. A future version would let the sender optionally encrypt the message client-side (using the Web Crypto API) with the code as the key derivation input. This way Firestore stores ciphertext and even the admin can't read it without the code.

### 📧 Email Delivery Option

Instead of (or in addition to) the secret code, let the sender optionally enter a recipient email address. The app (via Firebase Functions or a simple email API) would deliver the surprise link directly.

---

## 🟡 Planned — Medium Priority

### 🌐 i18n / Translations

The app is currently English-only. Love is not. The plan is to extract all UI strings into a JSON locale file and add a language picker. Spanish, French, Portuguese, and Hindi are the first targets.

### 📱 Dedicated Mobile App

The PWA is already installable, but a proper Capacitor wrapper would allow distribution via app stores and push notifications.

### 🔔 Push Notifications

"Someone liked your letter!" via Web Push API. Requires a notification permission prompt on submission and storing a push subscription in Firestore.

### 🎵 Background Music

Optional ambient music on the surprise page. A subtle piano loop or ambient track. Muted by default, user-activated — because autoplaying audio is a crime against humanity.

---

## 🟢 Planned — Lower Priority / Ideas

### 🤖 AI-Generated Pickup Lines

Hook into an LLM API to generate dynamic, personalized pickup lines based on context (name, interests, etc.). The current 40 are handcrafted, which is charming — but an infinite generator would be wild.

### 📊 Public Analytics Page

A public stats page showing (anonymously): total letters sent, total likes, most active countries, etc. Fun data visualization without exposing any personal info.

### 🔁 Letter Reply System

Let the recipient write a reply letter that links back to the original. Creates a thread. Requires a `replyTo` reference field on the Firestore document.

### 🗑️ Letter Expiry / Self-Destruct

Optional TTL on letters — "this message will self-destruct in 24 hours." Requires either a Firestore TTL policy or a scheduled Firebase Function to clean up.

### 🎉 More Animated Themes for the Surprise Page

Currently one animation set. More variety:
- Starfield with shooting stars
- Cherry blossom petals
- Minimalist typographic reveal
- Retro terminal aesthetic

---

## ❌ Won't Do

These are explicitly out of scope for this project:

- **User accounts / authentication** — adds complexity and friction. The code system is the intentional auth mechanism.
- **React / Next.js rewrite** — the vanilla approach is a feature, not a limitation.
- **Paid features / monetization** — this is a free romantic side project.
- **Native mobile app** (React Native, Flutter) — the PWA is sufficient for the use case.

---

## 📬 Want to Contribute to the Roadmap?

Open a GitHub Issue with the `enhancement` label. Explain the use case, not just the feature. PRs for roadmap items are welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).

The best features come from people who actually use the app and notice what's missing. 💌
