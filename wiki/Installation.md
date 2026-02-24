# 🚀 Installation

Every possible way to get PickMe running. Pick the one that matches your energy level.

---

## Option A: Just Open the File (Easiest)

```bash
git clone https://github.com/Kaelith69/pickme.git
cd pickme
open public/index.html   # macOS
# or
xdg-open public/index.html   # Linux
# or just drag it into your browser
```

**Caveats:** Some browser security policies block Service Worker registration and certain fetch calls when loading from `file://`. Firebase will still work; the PWA features may not register properly.

This is fine for quick exploration. Not ideal for testing all features.

---

## Option B: Local Server (Recommended for Development)

### Python (built-in, no install needed)

```bash
git clone https://github.com/Kaelith69/pickme.git
cd pickme
python -m http.server 8000 --directory public
```

Open `http://localhost:8000`.

### Node.js (`npx serve`)

```bash
git clone https://github.com/Kaelith69/pickme.git
cd pickme
npx serve public
```

`npx serve` is temporary — it won't install anything permanently.

### VS Code Live Server Extension

If you have the Live Server extension:
1. Open the `pickme` folder in VS Code
2. Right-click `public/index.html`
3. Click "Open with Live Server"

Done.

---

## Option C: Firebase Hosting (Full Production Setup)

This is how the official deployment works.

### Prerequisites
- Node.js installed
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase account (free tier is fine)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Kaelith69/pickme.git
cd pickme

# 2. Log in to Firebase
firebase login

# 3. Create a new Firebase project at https://console.firebase.google.com
#    Then link it:
firebase use --add
# Select your project when prompted

# 4. Enable Firestore in the Firebase Console
#    → Cloud Firestore → Create database → Start in test mode

# 5. Update the Firebase config in public/script.js
#    Replace the firebaseConfig object with your project's config
#    (found in Firebase Console → Project Settings → Your apps)

# 6. Deploy
firebase deploy
```

Your app will be live at `https://<your-project-id>.web.app`.

---

## Option D: GitHub Pages (No Firebase)

If you just want the frontend without cloud features (letters won't persist):

1. Fork the repository
2. Go to your fork's Settings → Pages
3. Set source to the `main` branch, `/public` folder (or `/root` if you restructure)
4. GitHub Pages will serve your site

Note: Without Firebase config, letters won't save to the cloud. The app will fail gracefully with a toast notification.

---

## Firebase Config Setup

The Firebase config lives at the top of `public/script.js`. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Get your config from:
**Firebase Console → Project Settings → General → Your apps → SDK setup and configuration → Config**

⚠️ **Do not commit real API keys to public repositories without setting up proper Firestore security rules.** The keys themselves aren't secret (Firebase is designed this way), but open rules mean anyone can write to your database.

---

## Firestore Security Rules

The `firestore.rules` file defines who can read and write to your database. Review and tighten before going production. The default rules in this repository are intentionally permissive for demonstration purposes.

---

## Environment Notes

| Feature | Works with `file://`? | Works with localhost? | Works with hosted? |
|---------|----------------------|----------------------|-------------------|
| Pickup line generator | ✅ | ✅ | ✅ |
| Letter creation | ⚠️ (no cloud save) | ✅ | ✅ |
| Secret code retrieval | ⚠️ (no cloud) | ✅ | ✅ |
| Service Worker / PWA | ❌ | ✅ | ✅ |
| Dark mode toggle | ✅ | ✅ | ✅ |
| IP geolocation | ⚠️ (may be blocked) | ✅ | ✅ |
| GPS capture | ✅ (browser perm required) | ✅ | ✅ |

---

## Troubleshooting Installation

See the [Troubleshooting](Troubleshooting.md) wiki page for common issues.
