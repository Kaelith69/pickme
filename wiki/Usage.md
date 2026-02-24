# 📖 Usage Guide

How to actually use PickMe — for senders, receivers, and the morbidly curious who just want to poke around.

---

## 🧭 App Pages at a Glance

| URL / File | What it is |
|------------|-----------|
| `index.html` | Main landing page — pickup lines, letter form, code reader |
| `valentine.html` | Animated surprise reveal page for the recipient |
| `public_letter.html` | Public wall — all shared public letters |
| `godview.html` | Admin dashboard (password-protected) |

---

## 💝 Sender Flow: Writing a Letter

### Step 1 — Open the App

Navigate to `index.html` (or the live URL). You'll see the main interface with:
- A pickup line displayed with typewriter animation
- Two main CTAs: **Write a Letter** and **Read a Letter**

### Step 2 — Generate Pickup Lines (Optional but Recommended)

Click the pickup line display or press **Space / Enter** to cycle through lines. There are 40+ of them. They get progressively nerdier. You're welcome.

### Step 3 — Write Your Letter

Click **Write a Letter**. A form appears:
- **Your name** — who's sending this masterpiece
- **Their name** — who's receiving it
- **Your message** — up to 1,000 characters. The counter updates live. Be poetic. Be honest. Be weird. Whatever works.
- **Visibility** — choose **Private** (requires code to view) or **Public** (appears on the public wall)

### Step 4 — Submit

Click **Send**. The app will:
1. Capture your IP location and optionally GPS (if you granted permission)
2. Save the letter to Firestore
3. Generate a unique 6-character code
4. Display the code prominently

**The code is your key.** Write it down, copy it, tattoo it — whatever you need to do.

### Step 5 — Share the Code

Options:
- **WhatsApp button** — generates a pre-formatted message like "Hey, I wrote you something: https://yourapp.com/?code=ABCDE1"
- **Copy manually** and send however you want

The recipient just needs the code (or the full URL).

---

## 💖 Receiver Flow: Reading a Letter

### Option A — Via Direct URL

If the sender shared a URL like `https://yourapp.com/?code=ABCDE1`, just open it. The app reads the `?code=` parameter and opens the letter automatically.

### Option B — Via Code Entry

1. Open the app at `index.html`
2. Click **Read a Letter**
3. Enter the 6-character code (case-insensitive)
4. Click **Open**

Either way, you'll be taken to `valentine.html`, which:
- Shows a full-screen animated reveal
- Displays sender name, recipient name, and the full message
- Has floating hearts, rose petals, and a typewriter effect
- Gives you a **heart** button to like the letter (if it's public)

---

## 🌍 Public Wall

Navigate to `public_letter.html` to browse all letters marked as public.

### Sorting Options

| Sort | What it does |
|------|-------------|
| Newest First | Most recently submitted at the top |
| Oldest First | Chronological order from the start |
| Most Liked | Sorted by ❤️ count, descending |
| Sender A–Z | Alphabetical by sender name |
| Recipient A–Z | Alphabetical by recipient name |

### Liking Letters

Click the ❤️ button on any letter. `localStorage` tracks your likes to prevent duplicate voting. The counter is stored in Firestore.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Generate a new pickup line |
| `Enter` | Generate a new pickup line |

---

## 🖱️ Easter Eggs

- **Parallax background** — the mesh gradient follows your mouse cursor
- **Loading minimum** — the heart loader shows for at least 800ms so it doesn't flash annoyingly
- **Offline mode** — if Firebase is down, you get a toast notification instead of a broken experience

---

## 🔒 Admin Panel (godview.html)

**For the developer / deployer only.**

The admin panel shows all letters with metadata including location data. Access requires a password entered on load.

⚠️ The password is stored in the frontend JS — this is not real authentication. It's a convenience, not a security gate. If you deploy your own instance, update or replace this with Firebase Authentication.

---

## 🔗 URL Parameter Reference

| Parameter | Example | Effect |
|-----------|---------|--------|
| `?code=ABCDE1` | `index.html?code=ABCDE1` | Auto-opens the letter with that code |

The app reads this on load and fires `fetchLetterByCode()` automatically if the parameter is present.

---

## 💡 Tips

- The code is **case-insensitive** — `abcde1` and `ABCDE1` will both work
- Letters are **permanent** — there's no delete (by design, for now)
- Public letters are visible to **everyone** — don't include sensitive personal information
- Private letters are only accessible via the secret code — but they're not encrypted at rest in Firestore
