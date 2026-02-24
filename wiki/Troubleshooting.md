# 🔧 Troubleshooting

Something broke? Before you file an issue, check here. There's a good chance your problem is on this list.

---

## 🚫 Letters Won't Save / Firebase Errors

**Symptom:** Clicking "Send" does nothing, or you get an error toast.

**Most likely causes:**

1. **Firebase is not configured** — the default `current-config.txt` is a reference file, not the actual config. You need to paste your Firebase project config into `public/script.js`.

2. **Firestore is in production mode with restrictive rules** — if you set up Firestore in "production mode" instead of "test mode", writes are blocked by default. Check your Firestore security rules in the Firebase console and make sure writes are allowed.

3. **Firebase project doesn't exist** — double-check that the `projectId` in your config matches an actual Firebase project.

4. **CORS / network issue** — if you're running locally via `file://` rather than a local server, some browsers block outgoing fetch requests. Use `python -m http.server` or `npx serve public` instead.

---

## 🔑 "Invalid Code" When Entering a Code

**Symptom:** You enter a valid-looking code and get "letter not found."

**Causes:**
1. The code is wrong — double-check (no spaces, case-insensitive, 6 characters)
2. The letter was saved to a different Firebase project than the one you're querying
3. Firebase is offline or unreachable — check browser console for network errors
4. The letter was submitted to a different instance of the app entirely

---

## 🌙 Dark Mode Not Persisting

**Symptom:** You switch to dark mode, reload, and it's back to light.

**Fix:** Make sure `localStorage` isn't blocked in your browser. In Chrome: Settings → Privacy → Site settings → check that storage isn't blocked for the origin. In incognito mode, `localStorage` may behave differently.

---

## 📦 Service Worker Not Registering

**Symptom:** The PWA install prompt never appears; offline mode doesn't work.

**Causes:**
1. You're opening the file via `file://` — Service Workers require `http://` or `https://`. Use a local server.
2. You're on HTTP (not HTTPS) on a non-localhost domain — Service Workers require a secure context.
3. Your browser doesn't support Service Workers (very old browser — update it).

---

## 📍 No Geolocation Prompt

**Symptom:** The browser never asks for location permission.

**Causes:**
1. Your browser has previously blocked geolocation for this site — check the browser address bar for the blocked permission icon.
2. You're on HTTP — geolocation requires a secure context on most modern browsers.
3. The geolocation call is gracefully failing silently — this is by design. The letter still saves, just without GPS coordinates.

---

## 🖥️ App Looks Broken / CSS Not Loading

**Symptom:** The page loads but looks unstyled or weird.

**Fix:**
1. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) — clears the Service Worker cache
2. If the Service Worker cached a stale version: open DevTools → Application → Service Workers → click "Unregister" → reload
3. Check the browser console for 404 errors on `styles.css`

---

## 💔 WhatsApp Share Button Opens Wrong URL

**Symptom:** The WhatsApp message has a broken or wrong link.

This can happen if the app doesn't know its own origin (e.g., running on localhost with no port). The share URL is constructed from `window.location.origin` + `?code=...`. On a properly hosted instance this works correctly.

---

## 🐛 Valentine Page Shows Nothing

**Symptom:** `valentine.html` loads but the letter content is blank or it says "letter not found."

**Causes:**
1. No `?code=` parameter in the URL — the page needs a code to know which letter to show
2. The code in the URL has a typo
3. Firebase returned an error (check browser console)

---

## 🔒 Admin Panel Locked / Forgot Password

The admin password is in `public/godview.html` in the frontend JavaScript. Open the file and search for the password string. If you don't have access to the source, you can't recover it without Firebase console access.

---

## 🌐 CORS Errors in Console

**Symptom:** Console shows `Access-Control-Allow-Origin` errors.

**Cause:** You're running via `file://`. Solution: use a local server (`python -m http.server`).

Firebase SDK requests themselves don't typically produce CORS errors — this is almost always the `ipapi.co` call failing in a restricted environment.

---

## ❓ Something Else

1. Open browser DevTools (F12) and check the **Console** and **Network** tabs
2. Look for red errors — they usually tell you exactly what's wrong
3. Check [GitHub Issues](https://github.com/Kaelith69/pickme/issues) to see if someone else reported it
4. If it's a new bug, open an issue with:
   - What you did
   - What happened
   - Browser + OS
   - Console errors (screenshot or paste)
