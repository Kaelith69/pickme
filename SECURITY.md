# 🔒 Security Policy

## Supported Versions

PickMe is a solo-dev project without formal versioning SLAs, but here's the honest state:

| Version | Supported |
|---------|-----------|
| Latest (`main`) | ✅ Yes |
| Older branches | ❌ No — update to main |

If you find a vulnerability in an older version, it probably also exists in main. Report it for the current codebase.

---

## 🚨 Reporting a Vulnerability

**Please do not open a public GitHub Issue for security vulnerabilities.**

Opening a public issue tells every attacker exactly what to exploit before a fix is deployed. That's not great.

Instead:

**Email:** Open a [GitHub Security Advisory](https://github.com/Kaelith69/pickme/security/advisories/new) via the "Security" tab on the repo, or email the maintainer directly (check the GitHub profile for contact info).

Include:
- A clear description of the vulnerability
- Steps to reproduce (as minimal as possible)
- Potential impact (what could an attacker do?)
- Your suggested fix, if you have one

You'll get an acknowledgment within **72 hours** (probably faster — this is a small repo, not a corporation).

---

## 🤝 Responsible Disclosure

If you report a valid security issue:

- You'll be credited in the fix commit / CHANGELOG unless you prefer to stay anonymous
- We'll work with you on a timeline before disclosing publicly
- We aim to patch critical issues within 7 days

We follow a **90-day public disclosure policy** — if a fix isn't shipped within 90 days, you're free to publish. We'll try not to let it come to that.

---

## 🔍 Known Security Considerations

These are not vulnerabilities in the traditional sense, but things you should be aware of when running your own instance:

### Location Data Collection
The app calls `ipapi.co` and the browser Geolocation API when a letter is submitted. This stores IP address, city, country, timezone, and optionally GPS coordinates in Firestore alongside each letter.

**If you run your own instance and don't want this:** remove the `getIPAndLocation()` call from `public/script.js`. The letter submission still works without it.

### Admin Panel Password
`godview.html` has a hardcoded admin password in the frontend JavaScript. **This is security through obscurity, not real authentication.** The admin panel exists for development/analytics purposes. Do not store sensitive data assuming the admin panel protects it.

If you deploy your own instance, change this password or replace it with proper Firebase Authentication.

### Firebase Security Rules
The `firestore.rules` file controls what clients can read/write. Review these before deploying to production — the default config in the repository may allow broader access than you want for a public-facing instance.

### API Keys in Frontend
The Firebase configuration (API keys, project ID, etc.) is present in `public/script.js` as required by Firebase's client-side SDK. Firebase API keys are not secret by design — access is controlled by Firestore security rules. However, do not commit real Firebase config to public repos without locking down your rules.

---

## 🙏 Thanks

Security is everyone's responsibility. If you took the time to read this file and report an issue properly — thank you. You're doing the internet a favour.

*"The road to a secure app is paved with people who bother to file proper bug reports."* 🔐
