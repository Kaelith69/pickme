# 🤝 Contributing to PickMe

First off — **thank you for even reading this**. Most people don't. You're already better than average.

PickMe is a solo-dev passion project, so every contribution — even fixing a typo — genuinely makes a difference. Let's make this the most romantically engineered web app on the internet.

---

## 🧠 Before You Do Anything

1. **Read the README** — make sure you understand what the project does (and doesn't do).
2. **Check existing Issues** — your brilliant idea might already be tracked.
3. **Open an Issue first** for significant changes — no one likes a 1 200-line PR that surprises everyone.

---

## 🌿 Branching Model

We keep it simple. This is not a Fortune 500 company.

```
main          ← stable, deployed to Firebase Hosting
  └── feature/<short-description>    ← new features
  └── fix/<short-description>        ← bug fixes
  └── docs/<short-description>       ← documentation only
  └── chore/<short-description>      ← config, deps, tooling
```

**Examples:**
```bash
git checkout -b feature/add-more-pickup-lines
git checkout -b fix/dark-mode-flicker
git checkout -b docs/update-privacy-section
```

No `develop` branch. No `release/` branches. We're not Netflix.

---

## 🔧 Local Setup

```bash
git clone https://github.com/Kaelith69/pickme.git
cd pickme

# Serve locally — pick your weapon
python -m http.server 8000 --directory public
# or
npx serve public

# Open http://localhost:8000
```

Zero build step. Zero package manager drama. You're welcome.

---

## ✏️ Commit Style

We follow **Conventional Commits** (loosely). Be human about it.

```
<type>: <short description>

feat: add sparkle animation to surprise page
fix: prevent double-like on public wall
docs: explain secret code entropy in README
chore: update Firebase config reference
style: fix mobile layout on letter form
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `style` — CSS/layout tweaks (not logic)
- `chore` — everything else that isn't user-facing

Keep messages under 72 chars in the subject line. Future you will thank present you.

---

## 🧀 Adding Pickup Lines

This is the most popular contribution type. Here's the protocol:

1. Open `public/script.js`
2. Find the `pickupLines` array near the top
3. Add your line as a string
4. Make sure it's either:
   - Genuinely funny
   - Nerdy (science/programming/math references encouraged)
   - Self-aware (the line knows it's cheesy)
5. If it makes you cringe AND smile, it's in. If it just makes you cringe, it's out.

---

## 📋 What Makes a Good PR

✅ Solves a real problem or adds genuine value  
✅ Doesn't break existing functionality  
✅ Follows the project's vanilla JS / no-dependency philosophy  
✅ Has a clear description of what and why  
✅ Tested in at least Chrome (mobile + desktop if relevant)

❌ Adds npm dependencies without a very good reason  
❌ Rewrites everything in React (please, no)  
❌ Changes the Firebase config to a real key (we will be sad)  
❌ Submits 47 files for "fixing one typo"

---

## 🐛 Reporting Bugs

Use GitHub Issues. Include:
- What you expected to happen
- What actually happened
- Browser + OS
- Steps to reproduce (as minimal as possible)

We don't have a Jira. We barely have a backlog. GitHub Issues is the whole system.

---

## 💡 Suggesting Features

Open a GitHub Issue with the label `enhancement`. Explain:
- The problem it solves
- How it fits the project's vibe (romantic, fun, privacy-ish)
- Any rough implementation idea if you have one

---

## 🎨 Design Contributions

The design system lives in `public/styles.css`. Key things to know:
- CSS custom properties at the top define colors and typography
- Mobile-first — check both 375px and 1280px viewports
- Animations should feel smooth and purposeful, not distracting
- The app has both a light mode and a dark mode — any visual change needs to work in both

---

## 📜 Code Style

No linter (yet). But follow what's already there:

- 2-space indentation
- `const` and `let`, never `var`
- Descriptive function names (`getIPAndLocation`, not `getInfo`)
- Comments for anything non-obvious
- Keep functions focused — if it's doing three things, split it

---

## 🌍 Translations / i18n

Not implemented yet but it's on the roadmap. If you want to pioneer this, open an Issue and let's design it together before you write 400 lines.

---

## 🏁 PR Checklist

Before you open a PR, make sure:

- [ ] Branch name follows the convention
- [ ] Commit messages are clean and meaningful
- [ ] Tested locally in Chrome (at minimum)
- [ ] No real Firebase credentials committed
- [ ] Description explains what and why
- [ ] Links related Issue if applicable

---

## 💖 Code of Conduct

Be kind. Be helpful. Assume good faith. Don't be the reason someone stops contributing to open source.

This is a project about love letters. Act accordingly. 🌹

---

*Thanks for contributing. You're the reason open source doesn't collapse into entropy. 💝*
