# 🔏 Privacy

PickMe collects some data when you submit a letter. This page explains exactly what, why, where it goes, and how to opt out (or remove it entirely from your own instance).

---

## 📋 What Is Collected

When a user submits a love letter, the following data is captured and stored in Firebase Firestore:

| Data | Source | Always Collected? |
|------|--------|------------------|
| IP address | `ipapi.co` API | Yes (unless removed) |
| City | `ipapi.co` inferred from IP | Yes (unless removed) |
| Country | `ipapi.co` inferred from IP | Yes (unless removed) |
| Timezone | `ipapi.co` inferred from IP | Yes (unless removed) |
| GPS latitude | Browser Geolocation API | Only if permission granted |
| GPS longitude | Browser Geolocation API | Only if permission granted |

Plus the letter content itself:
- Sender name
- Recipient name
- Message body
- Visibility setting (public/private)
- Submission timestamp

---

## 🗃️ Where Does It Go

Everything goes into **Firebase Firestore** under the `letters` collection. Each letter is a single document.

The **admin panel** (`godview.html`) can read all letters including location data. Regular users **cannot** see location data — it is not rendered on the public wall or on the surprise page. They see only: sender name, recipient name, message, and like count.

---

## 🌐 Third-Party Services

### ipapi.co

When a letter is submitted, PickMe makes a client-side request to `https://ipapi.co/json/`. This request reveals your IP address to `ipapi.co` (a third-party service). Their privacy policy applies.

The response (city, country, timezone) is then stored in Firestore alongside your letter.

### Google Fonts CDN

Fonts are loaded from `fonts.googleapis.com`. This is a standard web practice and means Google sees the request from your browser. No letter content is sent to Google.

### Firebase (Google)

Firebase Firestore is a Google product. All letter data — including location metadata — is stored on Google's infrastructure. Google's Firebase Terms of Service and Privacy Policy apply.

---

## 🛑 What Is NOT Collected

- Email addresses
- Phone numbers
- Account information (there are no accounts)
- Browser fingerprints beyond what the IP provides
- Cookies (none are set by PickMe)

---

## ⚙️ How to Disable Location Tracking

If you're running your own instance and want to remove location collection:

### Remove IP Geolocation

In `public/script.js`, find and remove or comment out the call to `getIPAndLocation()` inside `saveLetter()`. The letter submission will still work — it just won't capture any location data.

### Remove GPS

The browser Geolocation API prompt will not appear if `navigator.geolocation.getCurrentPosition()` is not called. Removing the `getIPAndLocation()` function call removes both IP and GPS collection simultaneously.

---

## 🔐 Data Retention

There is no automated data deletion. Letters persist in Firestore indefinitely until manually deleted by someone with Firebase console access.

If you submitted a letter and want it removed, contact the repository maintainer.

---

## 🚀 For Self-Hosted Instances

If you fork and deploy PickMe yourself:

- You become the data controller for any letters submitted to your instance
- You're responsible for your own privacy policy and compliance with applicable laws (GDPR, CCPA, etc.)
- Review `firestore.rules` to ensure data access matches your intent
- Consider disabling location collection if you don't need it

---

## ⚠️ Summary

PickMe is a small personal project, not a data broker. Location data exists for analytics/curiosity purposes and is only visible to the admin. If you're concerned about it, either don't submit real personal information or run your own instance with location collection disabled.

Love letters shouldn't come with surveillance. We try to keep it minimal. 💌
