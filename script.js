// ==========================================
// FIREBASE CONFIG & INIT
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBEIiqPpy2JU2oqds9BS3yAJnAnxK4rJ58",
    authDomain: "projet-estore.firebaseapp.com",
    projectId: "projet-estore",
    storageBucket: "projet-estore.firebasestorage.app",
    messagingSenderId: "204606590244",
    appId: "1:204606590244:web:79c270a5085d2d8a7b77b1"
};

let app, db;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) {
    console.error("Firebase initialization failed:", e);
}

// ==========================================
// FIREBASE HELPERS
// ==========================================
async function fetchGlobalLetters() {
    if (!db) {
        console.warn("Firebase not available");
        return [];
    }
    try {
        const q = query(collection(db, "letters"), orderBy("timestamp", "desc"), limit(100));
        const querySnapshot = await getDocs(q);
        const globalLetters = [];
        querySnapshot.forEach((docSnap) => {
            globalLetters.push(docSnap.data());
        });
        return globalLetters;
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
}

async function deleteGlobalLetter(id) {
    if (!db) {
        console.warn("Firebase not available, cannot delete from cloud");
        return false;
    }
    try {
        const q = query(collection(db, "letters"), where("id", "==", id));
        const querySnapshot = await getDocs(q);

        const deletePromises = [];
        querySnapshot.forEach((document) => {
            deletePromises.push(deleteDoc(document.ref));
        });

        await Promise.all(deletePromises);
        console.log(`Deleted global letter with ID: ${id}`);
        return true;
    } catch (e) {
        console.error("Error deleting document: ", e);
        return false;
    }
}

// ==========================================
// PICKUP LINES DATA
// ==========================================
const pickupLines = [
    "Are you made of copper and tellurium? Because you're Cu-Te.",
    "Are you a carbon sample? Because I want to date you.",
    "Are you made of helium? Because you make me feel like I'm floating.",
    "Are you a star? Because you're illuminating.",
    "Is your name Saturn? Because I feel a great attraction to you.",
    "Are you a black hole? Because I can't escape your pull.",
    "Are you a shooting star? Because you just caught my eye.",
    "Are you a moon? Because I find you mesmerizing.",
    "Are you a comet? Because you're out of this world.",
    "Are you made of dark matter? Because I can't see you, but I know you're there.",
    "Are you an astronaut? Because you've got the right stuff.",
    "Are you the Sun? Because everything revolves around you.",
    "Are you a supernova? Because you're exploding with beauty.",
    "Are you a nebula? Because you're breathtaking.",
    "Are you a rocket? Because you send me to new heights.",
    "Are you a meteorite? Because you've left a big impression on me.",
    "Are you a constellation? Because you light up my life.",
    "Are you a telescope? Because I can't stop looking at you.",
    "Are you a Wi-Fi signal? Because I'm really feeling a connection.",
    "Are you a magician? Because whenever I look at you, everyone else disappears.",
    "Are you a parking ticket? Because you've got 'FINE' written all over you.",
    "Are you a dictionary? Because you're adding meaning to my life.",
    "Are you a keyboard? Because you're just my type.",
    "Are you a camera? Because every time I look at you, I smile.",
    "Are you a bank loan? Because you have my interest.",
    "Are you a firework? Because you light up my world.",
    "Are you a diamond? Because you're priceless.",
    "Are you a museum? Because you truly are a work of art.",
    "Are you a rainbow? Because you add color to my life.",
    "Are you a sunrise? Because you bring light to my darkest days.",
    "Are you a sunset? Because you make every evening beautiful.",
    "Are you a snowflake? Because you're one of a kind.",
    "Are you a dream? Because you're too good to be true.",
    "Are you a compass? Because you always point me in the right direction.",
    "Are you a watch? Because every second with you is precious.",
    "Are you a book? Because I can't put you down.",
    "Are you a treasure map? Because I'm getting lost in your eyes.",
    "Are you a melody? Because you're always stuck in my head.",
    "Are you a cookie? Because you're irresistibly sweet."
];

// ==========================================
// DOM REFERENCES (cached once)
// ==========================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const pickupLineDisplay = $('#pickup-line');
const generateBtn = $('#generate-btn');
const actionArea = $('#action-area');
const contentArea = $('#content-area');
const letterForm = $('#letter-form');
const letterView = $('#letter-view');
const subtitleEl = $('#subtitle-text');
const titleEl = $('#title-text');
const toast = $('#toast');
const toastMessage = $('#toast-message');

const createLetterBtn = $('#create-letter-btn');
const generateLinkBtn = $('#generate-link-btn');
const cancelFormBtn = $('#cancel-form-btn');
const createOwnBtn = $('#create-own-btn');

const senderInput = $('#sender-name');
const receiverInput = $('#receiver-name');
const messageInput = $('#letter-message');
const charCount = $('#char-count');

let lastIndex = -1;
let isTyping = false;
let sessionClickCount = 0;

// ==========================================
// TOAST NOTIFICATION (replaces alert)
// ==========================================
let toastTimer = null;

function showToast(message, duration = 3000) {
    if (!toastMessage || !toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================
async function typeText(text) {
    if (isTyping) return;
    isTyping = true;

    // Fade out
    pickupLineDisplay.style.opacity = '0';
    await sleep(150);

    pickupLineDisplay.innerHTML = '';
    pickupLineDisplay.style.opacity = '1';

    const textNode = document.createTextNode('');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    pickupLineDisplay.appendChild(textNode);
    pickupLineDisplay.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
        textNode.textContent = text.substring(0, i + 1);
        await sleep(10 + Math.random() * 17);
    }

    // Keep cursor blinking then fade it out
    await sleep(750);
    if (cursor.parentNode) cursor.remove();
    isTyping = false;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function generateRandomPickupLine() {
    if (isTyping) return;

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * pickupLines.length);
    } while (randomIndex === lastIndex && pickupLines.length > 1);

    lastIndex = randomIndex;
    typeText(pickupLines[randomIndex]);
}

// ==========================================
// PARALLAX BACKGROUND
// ==========================================
const mesh = $('.background-mesh');
let rafId = null;

if (mesh) {
    document.addEventListener('mousemove', (e) => {
        if (rafId) return; // Throttle with rAF

        rafId = requestAnimationFrame(() => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            mesh.style.transform = `translate(${-(x * 15)}px, ${-(y * 15)}px)`;
            rafId = null;
        });
    }, { passive: true });
}

// ==========================================
// EVENT LISTENERS
// ==========================================
if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
        if (isTyping) return;
        sessionClickCount++;
        generateRandomPickupLine();
    });
}

// Keyboard shortcuts (only when not in form)
document.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    if (letterForm && generateBtn) {
        const formIsHidden = letterForm.classList.contains('hidden');
        if ((e.code === 'Space' || e.code === 'Enter') && !isTyping && formIsHidden) {
            e.preventDefault();
            generateBtn.click();
        }
    }
});

// Character counter for textarea
if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
        charCount.textContent = messageInput.value.length;
    });
}

// ==========================================
// VIEW SWITCHING
// ==========================================
function showLetterMode(to, from, msg) {
    if (actionArea) actionArea.classList.add('hidden');
    if (contentArea) contentArea.classList.add('hidden');
    if (letterForm) letterForm.classList.add('hidden');

    if (subtitleEl) subtitleEl.textContent = `A Letter For You`;
    if (titleEl) titleEl.textContent = "Happy Valentine's";

    const letterTo = $('#letter-to');
    const letterFrom = $('#letter-from');
    const letterBody = $('#letter-body');
    if (letterTo) letterTo.textContent = to;
    if (letterFrom) letterFrom.textContent = from;
    if (letterBody) letterBody.textContent = msg;

    if (letterView) letterView.classList.remove('hidden');
}

function showCreateMode() {
    if (actionArea) actionArea.classList.add('hidden');
    if (contentArea) contentArea.classList.add('hidden');
    if (letterView) letterView.classList.add('hidden');

    if (subtitleEl) subtitleEl.textContent = "Create Your Own";
    if (titleEl) titleEl.textContent = "Write a Letter";

    if (letterForm) letterForm.classList.remove('hidden');

    // Focus on first input for UX
    if (senderInput) setTimeout(() => senderInput.focus(), 300);
}

function resetToDefault() {
    window.history.pushState({}, document.title, window.location.pathname);

    if (letterForm) letterForm.classList.add('hidden');
    if (letterView) letterView.classList.add('hidden');
    if (actionArea) actionArea.classList.remove('hidden');
    if (contentArea) contentArea.classList.remove('hidden');

    if (subtitleEl) subtitleEl.textContent = "For You";
    if (titleEl) titleEl.textContent = "Hey Darling";

    // Reset form fields
    if (senderInput) senderInput.value = '';
    if (receiverInput) receiverInput.value = '';
    if (messageInput) messageInput.value = '';
    if (charCount) charCount.textContent = '0';
}

// ==========================================
// LETTER CREATION & SHARING
// ==========================================
if (createLetterBtn) createLetterBtn.addEventListener('click', showCreateMode);
if (cancelFormBtn) cancelFormBtn.addEventListener('click', resetToDefault);
if (createOwnBtn) {
    createOwnBtn.addEventListener('click', () => {
        resetToDefault();
        showCreateMode();
    });
}

if (generateLinkBtn) {
    generateLinkBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const sender = senderInput.value.trim();
        const receiver = receiverInput.value.trim();
        const message = messageInput.value.trim();

        // Validation
        if (!sender) {
            senderInput.focus();
            showToast("Please enter your name 💕");
            return;
        }
        if (!receiver) {
            receiverInput.focus();
            showToast("Who is this for? 💌");
            return;
        }
        if (!message) {
            messageInput.focus();
            showToast("Write something from the heart ❤️");
            return;
        }

        // === LOADING STATE ===
        const loader = document.getElementById('loader');
        const originalBtnHTML = generateLinkBtn.innerHTML;
        generateLinkBtn.disabled = true;
        generateLinkBtn.innerHTML = '<span class="btn-spinner"></span> Saving...';
        if (loader) loader.classList.add('show');

        // Track when loader started so we can enforce a minimum display time
        const loaderStartTime = Date.now();

        try {
            const result = await saveLetter(sender, receiver, message);

            // Enforce minimum 800ms loader display for smooth UX
            const elapsed = Date.now() - loaderStartTime;
            const remaining = Math.max(0, 800 - elapsed);
            await sleep(remaining);

            // === HIDE LOADER ===
            if (loader) loader.classList.remove('show');

            // Brief pause before transitioning to letter view
            await sleep(300);

            if (result.offline) {
                showToast("Saved locally (offline mode) 📂");
            } else {
                showToast("Valentine saved to cloud! ☁️✨");
            }

            // Generate shareable link (obfuscated)
            const data = { t: receiver, f: sender, m: message };
            const encodedData = btoa(encodeURIComponent(JSON.stringify(data)));
            const params = new URLSearchParams({ d: encodedData });
            const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

            // Copy to clipboard with toast feedback
            try {
                await navigator.clipboard.writeText(shareUrl);
                showToast("Link copied! Send it to your Valentine 💕", 4000);
            } catch (clipboardError) {
                // Fallback for non-HTTPS / older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
                showToast("Link copied! Send it to your Valentine 💕", 4000);
            }

            // Show preview of the letter
            showLetterMode(receiver, sender, message);

        } catch (err) {
            console.error("Error in link generation flow:", err);
            if (loader) loader.classList.remove('show');
            showToast("Something went wrong. Please try again ❌");
        } finally {
            // Always restore button state
            generateLinkBtn.disabled = false;
            generateLinkBtn.innerHTML = originalBtnHTML;
        }
    });
}

// ==========================================
// LETTER STORAGE (localStorage + CSV)
// ==========================================
async function getIPAndLocation() {
    // 1. Try High Accuracy Geolocation first
    const getGeo = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation not supported');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: 'gps'
                    });
                },
                (err) => {
                    reject(err);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    };

    let geoData = null;
    try {
        geoData = await getGeo();
    } catch (e) {
        console.log('Geolocation failed or denied, falling back to IP');
    }

    // 2. Fetch IP Data
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const locationParts = [];
        if (data.city) locationParts.push(data.city);
        if (data.region) locationParts.push(data.region);
        if (data.country_name) locationParts.push(data.country_name);

        return {
            ip: data.ip || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            countryCode: data.country_code || '',
            postal: data.postal || '',
            timezone: data.timezone || '',
            location: locationParts.join(', ') || 'Unknown',
            latitude: geoData ? geoData.latitude : (data.latitude || null),
            longitude: geoData ? geoData.longitude : (data.longitude || null),
            accuracy: geoData ? 'gps' : (data.latitude && data.longitude ? 'city' : 'unknown')
        };
    } catch (error) {
        console.error('Failed to fetch IP/location:', error);
        if (geoData) {
            return {
                ip: 'Unknown', city: 'Unknown', region: 'Unknown', country: 'Unknown',
                countryCode: '', postal: '', timezone: '',
                location: `${geoData.latitude.toFixed(4)}, ${geoData.longitude.toFixed(4)}`,
                latitude: geoData.latitude, longitude: geoData.longitude, accuracy: 'gps'
            };
        }

        return {
            ip: 'Unknown', city: 'Unknown', region: 'Unknown', country: 'Unknown',
            countryCode: '', postal: '', timezone: '', location: 'Unknown',
            latitude: null, longitude: null, accuracy: 'unknown'
        };
    }
}

async function saveLetter(from, to, message) {
    // Loader is managed by the caller (generateLinkBtn handler)
    const ipData = await getIPAndLocation();

    const letter = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        from: from,
        to: to,
        message: message,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }),
        ip: ipData.ip,
        location: ipData.location,
        city: ipData.city,
        region: ipData.region,
        country: ipData.country,
        countryCode: ipData.countryCode,
        postal: ipData.postal,
        timezone: ipData.timezone,
        latitude: ipData.latitude,
        longitude: ipData.longitude,
        accuracy: ipData.accuracy,
        clicks: sessionClickCount
    };

    // Save to Firebase only
    let offline = false;
    if (db) {
        try {
            const docRef = await addDoc(collection(db, "letters"), letter);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document to Firebase: ", e);
            offline = true;
        }
    } else {
        console.warn("Firebase not available — letter not saved");
        offline = true;
    }

    return { letter, success: true, offline };
}

function checkAuth() {
    // Use '1' to match godview.html's inline auth system
    if (sessionStorage.getItem('godview_authenticated') === '1') {
        return true;
    }
    // Only prompt if on godview page
    if (window.location.pathname.includes('godview.html')) {
        const password = prompt("Enter Admin Password:");
        if (password === "valentines2024") {
            sessionStorage.setItem('godview_authenticated', '1');
            return true;
        } else {
            alert("Incorrect password!");
            window.location.href = "index.html";
            return false;
        }
    }
    return true;
}

// Make functions available globally for godview.html
window.saveLetter = saveLetter;
window.fetchGlobalLetters = fetchGlobalLetters;
window.deleteGlobalLetter = deleteGlobalLetter;
window.checkAuth = checkAuth;

// ==========================================
// INIT: Check URL for letter params
// ==========================================
(function init() {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for obfuscated data first
    const d = urlParams.get('d');

    let to, from, msg;

    if (d) {
        try {
            const decoded = JSON.parse(decodeURIComponent(atob(d)));
            to = decoded.t;
            from = decoded.f;
            msg = decoded.m;
        } catch (e) {
            console.error('Failed to decode letter data', e);
        }
    } else {
        // Backward compatibility
        to = urlParams.get('to');
        from = urlParams.get('from');
        msg = urlParams.get('msg');
    }

    if (to && from && msg) {
        const finalTo = d ? to : decodeURIComponent(to);
        const finalFrom = d ? from : decodeURIComponent(from);
        const finalMsg = d ? msg : decodeURIComponent(msg);

        showLetterMode(finalTo, finalFrom, finalMsg);
    }
})();
