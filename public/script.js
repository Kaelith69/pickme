// ==========================================
// FIREBASE CONFIG & INIT
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDocsFromServer, query, orderBy, limit, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAlLL2fcqWXASQ8kYcMHURlHG-haf3vl4s",
    authDomain: "pickme-love-2026.firebaseapp.com",
    projectId: "pickme-love-2026",
    storageBucket: "pickme-love-2026.firebasestorage.app",
    messagingSenderId: "1024313568025",
    appId: "1:1024313568025:web:b36d90f9b46d681e96b388"
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
        throw new Error("Firebase is not initialized. Check the Firebase configuration and network connection.");
    }
    try {
        // Fetch the collection without orderBy so older records without a timestamp
        // are not silently excluded and no composite index is required.
        const querySnapshot = await getDocs(collection(db, "letters"));
        return querySnapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            firestoreId: docSnap.id
        })).sort((a, b) => {
            const aTime = Date.parse(a.timestamp || "") || 0;
            const bTime = Date.parse(b.timestamp || "") || 0;
            return bTime - aTime;
        });
    } catch (e) {
        console.error("Error getting letters from Firestore:", e);
        throw e;
    }
}

async function deleteGlobalLetter(firestoreId) {
    if (!db) {
        console.warn("Firebase is not initialized; cannot delete the letter.");
        return false;
    }
    if (!firestoreId || typeof firestoreId !== "string") return false;
    try {
        await deleteDoc(doc(db, "letters", firestoreId));
        console.log(`Deleted Firestore document: ${firestoreId}`);
        return true;
    } catch (e) {
        console.error("Error deleting Firestore document:", e);
        return false;
    }
}

// ==========================================
// PICKUP LINES DATA
// ==========================================
// Original PickMe collection plus the 93-entry curated archive.
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
    "Are you a cookie? Because you're irresistibly sweet.",
    "Do you have a pencil? Because I want to erase your past and write our future. Also, it gives me a point.",
    "Are you a loan from a bank? Because you have my interest!",
    "You look like the kind of trouble I'd choose twice.",
    "Is it just me, or did it get hotter when you walked in? Because something's definitely rising.",
    "I'm not a photographer, but I can picture me and you together.",
    "Do you have a name, or can I call you mine?",
    "If I were a cat, I'd spend all 9 lives with you.",
    "Take away gravity, I'd still fall for you.",
    "Do you have a map? I just got lost in your eyes.",
    "Is your name Google? Because you have everything I've been searching for.",
    "Are you a parking ticket? Because you've got 'fine' written all over you.",
    "Is your name Wi-Fi? Because I'm feeling a connection.",
    "Do you believe in love at first sight, or should I walk by again?",
    "Do you like raisins? How do you feel about a date?",
    "Do you have a Band-Aid? Because I just scraped my knee falling for you.",
    "Are you an elevator? Because you're giving me a lift.",
    "Are you a magician? Because whenever I look at you, everyone else disappears.",
    "If you were a vegetable, you'd be a cute-cumber.",
    "If you were a fruit, you'd be a fine-apple.",
    "Are you French? Because Eiffel for you.",
    "Giiirl, are you from Tennessee?! Cause, you are the only 10 I see!",
    "Even if the floor is Lava, I'd still fall for you.",
    "Excuse me miss did you just fall out of a salt shaker?",
    "Do you have a mirror in your pocket? Because I can see myself in your pants.",
    "I like your shirt but it would look better on my bedroom floor.",
    "Are you RCB, cuz I'd like to screw you over and over again!",
    "Are you an organ trafficker?",
    "can i cartoon sound your huminah humimahs 😅",
    "Your breasts remind me of Mount Rushmore - my face should be among them.",
    "You're a fire hazard. 'Cause sweetheart, you are SMOKING hot.",
    "Are you a toaster because a bath with you would take me to heaven.",
    "Hey girl are you from Mississippi? Because you're the only miss who's piss I want to sippi.",
    "Dang girl, I wish I was a derivative...so I could lie tangent to your curves.",
    "Hey girl, are you f(x)=x-1? Because you're not defined with a zero.",
    "Are you f(x)=x-1? because I don't understand you but with time and dedication I will.",
    "Are you the square root of two? Girl I feel irrational around you.",
    "Your p-value must be below 0.05 because I fail to reject you 😉",
    "Damn girl, do you like maths? Because I wanna add you to my life, subtract your clothes, divide you legs and multiply ourselves!",
    "Are you good at math? I need help replacing my x without asking y.",
    "Can you help me with this math problem 'X+U=25'. So X must be 15 cause U are definetely a 10.",
    "math? why is it always x and y, why cant it be u and i",
    "You have all the right angles but if you were with me we'd make acute couple ☺ ",
    "That dress would look even better accelarating at 9.81m/s^2 on the floor of a OYO Room.",
    "Wanna use my Excel to spreadsheets?",
    "They must have made you in C, because you have a pointer to my heart.",
    "\"Nee Curry Powder aano? nee nalla rassama :)\" (Are you curry powder? You are very 'rasam')",
    "\"Are you my അച്ചാർ കുപ്പി?? coz I wanna spoon you 😉\" (Are you my Achar Kuppi/pickle jar?)",
    "\"Are you yogurt cause I wanna kadayal venna out of u.\" (I want to churn butter out of you)",
    "\"are u between pathanamthitta and Trivandrum? cause nee kollam.\" (Cause you are Kollam / You are good)",
    "\"wanna have kappalandi from Kollam beach sometime?\" (Want peanuts at Kollam beach?)",
    "Girl are u from kannur? Cz u da bomb!",
    "Girl are you Kochi cuz i can smell you from thrissur.",
    "\"Uyaram koodum thorum Chayakku ruchiyum koodum, Varunno ente koode Munnar kku...\" (As height increases, tea taste increases, coming to Munnar?)",
    "Damn girl you from palakkad? Cuz youre making me hot and thirsty.",
    "\"Ente kayyil undu jetti, Ente pattiyude peru betty, Will you be my kutti\" (I have a panty, my dog's name is Betty, will you be my girl)",
    "Palada Undaakaan Venam Panjasaara, Prathaman undaakan venam sharkara, Ninne kandappol ente hridayam paranju, Arey bhai lagti hain tu bahut pyaara",
    "\"ravile kudikkan kaapi Nee undenkil njan happyii\" (Morning drink is coffee, if you are there I am happy)",
    "\"puffs il und egg. Neeyanente drugg.\" (In a puff there is an egg. You are my drug)",
    "Ninte mizhi muna kondente nenjil oru balle balle, Ente praanasakhi, kurachu sneham tharumo ninte kayyaale",
    "\"Cricket kalikkan venam ball, nee oru yes mooliyal nee ente aal\" (To play cricket you need a ball, if you hum a 'yes', you are my girl)",
    "\"girl are u from a lake? Coz nee oru mothala\" (Cause you are a crocodile/wealt hy beauty)",
    "\"Ninte kayyil oru vespa tharatte njan oru pushpa\" (In your hand is a Vespa, shall I give a Pushpa/flower)",
    "Kuttide achan MVD il aano ??? Cause you've got 'FINE' written all over you....",
    "Lockdown time. Are you a steel pathram? because I wanna bang you on the terrace.",
    "Damn girl are you a communist hater? Cuz I wanna kodikuthal in you.",
    "Girl are u bourgeois cuz I wanna kodikuthal in you",
    "Ente doctor paranju njan oru iratta chankan aanennu, chilappol nee ente chankil ullathu kondaano ??",
    "Tu apne birthday par enjoy isliye nahi krega kyunki tu C hai.",
    "\"Iss gaon ki anpadh mitti, padh nahin skta Teri chitthi?\" (This village's illiterate soil, cannot read your letter?)",
    "\"Gawaron se dosti Ghatak hai. Kripiya aapke samman ka dhyan karre.\" (Friendship with the uncouth is lethal. Please take care of your respect)",
    "Namukku graamangalil chennu raappaarkkaam , athikaalathu ezhunettu munthirithottan galil poyi...",
    "\"Girl are you Mohanlal? Cause you are A10.\" (A10 sounds like Ettan)",
    "ninte maarile maaya chandana pott enikh alle",
    "\"Aaah Appu Harbhajan Singh ine polle undalo\" (Ah Appu, you look like Harbhajan Singh)",
    "Savitri... 'Say we three'. You, me and our kid. 😌",
    "Hey girl do you like Harry Potter? Because I want to wingardium leviosa up that skirt, alohamora those legs open and aqua erupto inside of your leaky cauldron.",
    "Do you like Harry Potter? Because I want to put my basilisk into your chamber of secrets.",
    "I wanna Slytherin to your Chamber of Secrets.",
    "Is this the Hogwarts Express? Because it feels like we're headed somewhere magical!",
    "My nickname is the Hogwarts Express. Why? Because to ride me, you gotta take 9 and three quarters.",
    "Charizards are red, Squirtle are blue, if you were a Pokemon, I'd choose you!",
    "Do you like Star Wars? Because Yoda only one for me!",
    "Your beauty makes the brightest stars seem dull by comparison.",
    "\"Ennodu para, I love yoooouu'nnu.\" (Tell me, 'I love you')",
    "You know who's my favorite creator? Your Mom/Dad/Parents. 😏",
    "Did you ever hear the tragedy of Darth Plagueis the Wise?",
    "Are you a 90 degree angle?",
    "Are you 1917 Russia because you bring an uprising in my lower class.",
    "\"Nee illaatha jeevitham enikku uppilaatha kanji poleyaa.\" (Life without you is like kanji without salt)",
    "\"Pennu kittathath kond parents parayunnu ente king size bed change cheyth single cot aakkaan. Bed king size aayitt nilanirthaan help cheyyaamo.\" (Since I can't find a girl, parents are telling me to change my king size bed to a single cot. Can you help me keep the bed king size?)",
    "\"Ente amma parayarund : Enne Kettunna aaal kure kashta pedum enn. Porunno Kashta pedaaan\" (My mother says whoever marries me will suffer a lot. Are you coming to suffer?)",
    "\"Patti korachal bark kannadachal dark. Nee an ente spark.\" (If a dog barks it's a bark, if you close your eyes it's dark. You are my spark.)",
    "Are you Delhi's AQI? Because you're taking my breath away."
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

// New UI Elements
const readLetterBtn = $('#read-letter-btn');
const readLetterForm = $('#read-letter-form');
const letterCodeInput = $('#letter-code');
const openLetterBtn = $('#open-letter-btn');
const cancelReadBtn = $('#cancel-read-btn');

const successView = $('#success-view');
const generatedCodeEl = $('#generated-code');
const copyCodeBtn = $('#copy-code-btn');
const viewMyLetterBtn = $('#view-my-letter-btn');
const viewSurpriseBtn = $('#view-surprise-btn');
const viewSurpriseReaderBtn = $('#view-surprise-reader-btn');
const createAnotherBtn = $('#create-another-btn');

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

// Wrap UI state changes in the browser's native View Transition API when available.
function runSharedTransition(update) {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduceMotion) {
        update();
        return;
    }
    try { document.startViewTransition({ update }); }
    catch (error) { update(); }
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================
async function typeText(text) {
    if (isTyping) return;
    isTyping = true;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || document.hidden) {
        pickupLineDisplay.textContent = text;
        isTyping = false;
        return;
    }

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
    document.addEventListener('pointermove', (e) => {
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
    const activeElement = document.activeElement;
    const isTypingTarget = activeElement && (activeElement.matches('input, textarea, select, [contenteditable="true"]') || activeElement.closest('[contenteditable="true"]'));
    const isInteractiveTarget = activeElement && activeElement !== document.body && activeElement !== document.documentElement;
    if (isTypingTarget || isInteractiveTarget) return;

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
function showLetterMode(to, from, msg, isPublic = false) {
    runSharedTransition(() => {
        if (actionArea) actionArea.classList.add('hidden');
        if (contentArea) contentArea.classList.add('hidden');
        if (letterForm) letterForm.classList.add('hidden');
        if (readLetterForm) readLetterForm.classList.add('hidden');
        if (successView) successView.classList.add('hidden');
        if (subtitleEl) subtitleEl.textContent = 'A Letter For You';
        if (titleEl) titleEl.textContent = "Happy Valentine's";
        const letterTo = $('#letter-to');
        const letterFrom = $('#letter-from');
        const letterBody = $('#letter-body');
        if (letterTo) letterTo.textContent = to;
        if (letterFrom) letterFrom.textContent = from;
        if (letterBody) letterBody.textContent = msg;
        if (viewSurpriseReaderBtn) viewSurpriseReaderBtn.classList.toggle('hidden', isPublic);
        if (letterView) letterView.classList.remove('hidden');
    });
}

function showCreateMode() {
    runSharedTransition(() => {
        if (actionArea) actionArea.classList.add('hidden');
        if (contentArea) contentArea.classList.add('hidden');
        if (letterView) letterView.classList.add('hidden');
        if (readLetterForm) readLetterForm.classList.add('hidden');
        if (successView) successView.classList.add('hidden');
        if (subtitleEl) subtitleEl.textContent = 'Create Your Own';
        if (titleEl) titleEl.textContent = 'Write a Letter';
        if (letterForm) letterForm.classList.remove('hidden');
    });
    if (senderInput) setTimeout(() => senderInput.focus(), 300);
}

function resetToDefault() {
    runSharedTransition(() => {
        window.history.pushState({}, document.title, window.location.pathname);
        if (letterForm) letterForm.classList.add('hidden');
        if (readLetterForm) readLetterForm.classList.add('hidden');
        if (successView) successView.classList.add('hidden');
        if (letterView) letterView.classList.add('hidden');
        if (actionArea) actionArea.classList.remove('hidden');
        if (contentArea) contentArea.classList.remove('hidden');
        if (subtitleEl) subtitleEl.textContent = 'For You';
        if (titleEl) titleEl.textContent = 'Hey Darling';
        if (senderInput) senderInput.value = '';
        if (receiverInput) receiverInput.value = '';
        if (messageInput) messageInput.value = '';
        if (charCount) charCount.textContent = '0';
    });
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
        generateLinkBtn.innerHTML = '<span class="btn-spinner"></span> Creating...';
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

            if (result.success) {
                // Show Success View with Code
                showSuccessView(result.letter);
                showToast("Valentine saved! ☁️✨");
            } else {
                showToast("Saved locally (offline mode) 📂");
            }

        } catch (err) {
            console.error("Error in letter creation flow:", err);
            if (loader) loader.classList.remove('show');
            showToast("Something went wrong. Please try again ❌");
        } finally {
            // Always restore button state
            generateLinkBtn.disabled = false;
            generateLinkBtn.innerHTML = originalBtnHTML;
        }
    });
}

function showSuccessView(letter) {
    runSharedTransition(() => {
        if (letterForm) letterForm.classList.add('hidden');
        if (successView) successView.classList.remove('hidden');
        if (subtitleEl) subtitleEl.textContent = 'Ready To Share';
        if (titleEl) titleEl.textContent = 'Your Letter Is Ready';
        if (generatedCodeEl) generatedCodeEl.textContent = letter.code;
        window.currentLetter = letter;
    });
}

// ==========================================
// UNIQUE CODE HANDLERS
// ==========================================
function showReadMode() {
    runSharedTransition(() => {
        if (actionArea) actionArea.classList.add('hidden');
        if (contentArea) contentArea.classList.add('hidden');
        if (readLetterForm) readLetterForm.classList.remove('hidden');
    });
    if (letterCodeInput) {
        letterCodeInput.value = '';
        setTimeout(() => letterCodeInput.focus(), 300);
    }
}

const LETTER_LOOKUP_TIMEOUT_MS = 12000;

async function fetchLetterByCode(code) {
    if (!db) {
        throw new Error("Firebase is not initialized. Check your connection and try again.");
    }

    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!normalizedCode) return null;

    const q = query(
        collection(db, "letters"),
        where("code", "==", normalizedCode),
        limit(1)
    );

    let timeoutId;
    try {
        // Read from the server so an offline or stale local cache cannot masquerade
        // as a successful private-code lookup. Always bound the wait time.
        const querySnapshot = await Promise.race([
            getDocsFromServer(q),
            new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error("Letter lookup timed out after 12 seconds."));
                }, LETTER_LOOKUP_TIMEOUT_MS);
            })
        ]);

        return querySnapshot.empty ? null : querySnapshot.docs[0].data();
    } catch (error) {
        console.error("Error fetching letter by code:", error);
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

if (readLetterBtn) readLetterBtn.addEventListener('click', showReadMode);
if (cancelReadBtn) cancelReadBtn.addEventListener('click', resetToDefault);

if (openLetterBtn) {
    openLetterBtn.addEventListener('click', async () => {
        const code = letterCodeInput.value.trim().toUpperCase();
        if (!code) {
            showToast("Please enter the code 🔑");
            letterCodeInput.focus();
            return;
        }

        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('show');

        const originalBtnHTML = openLetterBtn.innerHTML;
        openLetterBtn.disabled = true;
        openLetterBtn.innerHTML = '<span class="btn-spinner"></span> Checking...';

        try {
            const letter = await fetchLetterByCode(code);
            await sleep(600); // Fake delay for UX

            if (letter) {
                window.currentReadLetter = letter; // Store for surprise view
                // DIRECT REDIRECT: Bypass the text view and go straight to the surprise
                openSurprisePage(letter);
            } else {
                showToast("Letter not found 💔 Maybe write one?");
                // Optional: Shake animation or visual feedback
            }
        } catch (e) {
            console.error("Private letter lookup failed:", e);
            if (e?.message?.includes("timed out")) {
                showToast("The server is taking too long. Check your connection and try again.");
            } else {
                showToast("Couldn't retrieve the letter. Check your connection and try again.");
            }
        } finally {
            // Always release the full-screen loader, including on Firebase errors/timeouts.
            if (loader) loader.classList.remove('show');
            openLetterBtn.disabled = false;
            openLetterBtn.innerHTML = originalBtnHTML;
        }
    });
}

if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', async () => {
        const code = generatedCodeEl?.textContent?.trim();
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            showToast("Code copied! Share it 💕");
        } catch (error) {
            console.error('Clipboard copy failed:', error);
            showToast('Copy is unavailable. Please select the code manually.');
        }
    });
}

if (viewMyLetterBtn) {
    viewMyLetterBtn.addEventListener('click', () => {
        if (window.currentLetter) {
            const { to, from, message } = window.currentLetter;
            showLetterMode(to, from, message);
        }
    });
}

if (createAnotherBtn) createAnotherBtn.addEventListener('click', () => {
    resetToDefault();
    showCreateMode();
});

// WhatsApp Share Button
const shareWhatsAppBtn = $('#share-whatsapp-btn');
if (shareWhatsAppBtn) {
    shareWhatsAppBtn.addEventListener('click', () => {
        if (window.currentLetter && window.currentLetter.code) {
            shareViaWhatsApp(window.currentLetter.code);
        }
    });
}

// ==========================================
// SURPRISE PAGE HANDLERS
// ==========================================
function openSurprisePage(letter, skipAnimation = false) {
    if (!letter) return;

    // Encode data to be URL safe
    const data = {
        t: letter.to,
        f: letter.from,
        m: letter.message,
        s: skipAnimation ? 1 : 0 // s = skip parameter
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    // Open in same tab for seamless experience
    window.location.href = `valentine.html?d=${encoded}`;
}

function openPublicLetter(letter) {
    if (!letter) return;

    // Encode data to be URL safe
    const data = {
        t: letter.to,
        f: letter.from,
        m: letter.message
    };

    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    // Open in new public_letter.html template
    window.location.href = `public_letter.html?d=${encoded}`;
}

if (viewSurpriseBtn) {
    viewSurpriseBtn.addEventListener('click', () => {
        if (window.currentLetter) {
            openSurprisePage(window.currentLetter);
        }
    });
}

if (viewSurpriseReaderBtn) {
    viewSurpriseReaderBtn.addEventListener('click', () => {
        // Use read letter (reader mode) or created letter (creator mode)
        const letterToUse = window.currentReadLetter || window.currentLetter;
        if (letterToUse) {
            openSurprisePage(letterToUse);
        }
    });
}

// ==========================================
// LETTER STORAGE (localStorage + CSV)
// ==========================================
async function getIPAndLocation() {
    // 1. Try High Accuracy Geolocation first
    const getGeo = () => {
        return new Promise(async (resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation not supported');
                return;
            }

            // Check if permission is already granted
            if (navigator.permissions && navigator.permissions.query) {
                try {
                    const permission = await navigator.permissions.query({ name: 'geolocation' });
                    if (permission.state !== 'granted') {
                        reject('Permission not granted - skipping explicit prompt');
                        return;
                    }
                } catch (e) {
                    // Fallback if permissions API fails
                    console.log('Permissions API check failed', e);
                }
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

// [Old saveLetter removed to avoid duplication]

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

// ==========================================
// PUBLIC / PRIVATE LOGIC
// ==========================================

// 1. Updated Save Function including Visibility
async function saveLetter(from, to, message) {
    // Loader is managed by the caller
    const ipData = await getIPAndLocation();

    // Get visibility from DOM
    const visibilityEl = document.querySelector('input[name="visibility"]:checked');
    const visibility = visibilityEl ? visibilityEl.value : 'private';

    const generateUniqueCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const uniqueCode = generateUniqueCode();

    const letter = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        code: uniqueCode,
        from: from,
        to: to,
        message: message,
        visibility: visibility, // NEW FIELD
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }),
        ip: ipData.ip,
        city: ipData.city,
        region: ipData.region,
        country: ipData.country,
        countryCode: ipData.countryCode,
        postal: ipData.postal,
        timezone: ipData.timezone,
        location: ipData.location,
        latitude: ipData.latitude,
        longitude: ipData.longitude,
        accuracy: ipData.accuracy,
        clicks: sessionClickCount
    };

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

// 2. Fetch Public Letters
async function fetchPublicLetters() {
    if (!db) return null;
    try {
        const q = query(
            collection(db, "letters"),
            where("visibility", "==", "public"),
            orderBy("timestamp", "desc"),
            limit(50)
        );
        const querySnapshot = await getDocs(q);
        const publicLetters = [];
        querySnapshot.forEach((docSnap) => {
            publicLetters.push(docSnap.data());
        });
        return publicLetters;
    } catch (e) {
        console.error("Error fetching public letters: ", e);
        return null;
    }
}

// 3. Tab Logic
const tabPrivate = $('#tab-private');
const tabPublic = $('#tab-public');
const sectionPrivate = $('#private-section');
const sectionPublic = $('#public-section');
const publicListEl = $('#public-letters-list');
const refreshPublicBtn = $('#refresh-public-btn');
const sortSelect = $('#sort-select');

let cachedPublicLetters = [];

if (tabPrivate && tabPublic) {
    tabPrivate.addEventListener('click', () => {
        tabPrivate.classList.add('active');
        tabPrivate.setAttribute('aria-selected', 'true');
        tabPublic.setAttribute('aria-selected', 'false');
        tabPublic.classList.remove('active');
        sectionPrivate.classList.remove('hidden');
        sectionPublic.classList.add('hidden');
    });

    tabPublic.addEventListener('click', () => {
        tabPublic.classList.add('active');
        tabPublic.setAttribute('aria-selected', 'true');
        tabPrivate.setAttribute('aria-selected', 'false');
        tabPrivate.classList.remove('active');
        sectionPublic.classList.remove('hidden');
        sectionPrivate.classList.add('hidden');

        // Load data if empty or first click
        if (publicListEl.innerHTML.includes('Loading') || publicListEl.children.length === 0) {
            loadPublicLetters();
        }
    });

    // Fallback for :has() support on older mobile browsers
    const visibilityRadios = document.querySelectorAll('input[name="visibility"]');

    function updateRadioClasses() {
        visibilityRadios.forEach(radio => {
            const label = radio.closest('.radio-label');
            if (label) {
                if (radio.checked) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        });
    }

    visibilityRadios.forEach(radio => {
        radio.addEventListener('change', updateRadioClasses);
    });

    // Initial call
    updateRadioClasses();
}

if (refreshPublicBtn) {
    refreshPublicBtn.addEventListener('click', () => {
        loadPublicLetters();
    });
}

// Sort dropdown handler
if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        if (cachedPublicLetters.length > 0) {
            const sorted = sortLetters(cachedPublicLetters, sortSelect.value);
            renderPublicCards(sorted);
        }
    });
}

function sortLetters(letters, sortBy) {
    const sorted = [...letters];
    switch (sortBy) {
        case 'newest':
            sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            break;
        case 'oldest':
            sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            break;
        case 'most-liked':
            sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
        case 'sender-az':
            sorted.sort((a, b) => (a.from || '').localeCompare(b.from || ''));
            break;
        case 'recipient-az':
            sorted.sort((a, b) => (a.to || '').localeCompare(b.to || ''));
            break;
    }
    return sorted;
}

let publicLoadSequence = 0;

async function loadPublicLetters() {
    if (!publicListEl) return;
    const requestId = ++publicLoadSequence;
    publicListEl.setAttribute('aria-busy', 'true');
    publicListEl.replaceChildren();
    const loading = document.createElement('div');
    loading.className = 'loading-spinner';
    loading.setAttribute('role', 'status');
    loading.textContent = 'Gathering the love notes…';
    publicListEl.appendChild(loading);
    if (refreshPublicBtn) refreshPublicBtn.disabled = true;

    try {
        const letters = await fetchPublicLetters();
        if (requestId !== publicLoadSequence) return;
        if (!letters) {
            publicListEl.replaceChildren();
            const state = document.createElement('div');
            state.className = 'public-state';
            const title = document.createElement('strong');
            title.textContent = 'Could not load the public wall';
            const detail = document.createElement('span');
            detail.textContent = 'Check your connection and try again.';
            const retry = document.createElement('button');
            retry.type = 'button';
            retry.className = 'secondary-btn small';
            retry.textContent = 'Try again';
            retry.addEventListener('click', loadPublicLetters);
            state.append(title, detail, retry);
            publicListEl.appendChild(state);
            return;
        }

        cachedPublicLetters = letters;
        if (letters.length === 0) {
            publicListEl.replaceChildren();
            const empty = document.createElement('div');
            empty.className = 'public-state';
            const title = document.createElement('strong');
            title.textContent = 'The wall is waiting';
            const detail = document.createElement('span');
            detail.textContent = 'No public letters yet. Be the first to leave a little love.';
            empty.append(title, detail);
            publicListEl.appendChild(empty);
            return;
        }

        const currentSort = sortSelect ? sortSelect.value : 'newest';
        renderPublicCards(sortLetters(letters, currentSort));
    } catch (error) {
        console.error('Could not render public letters:', error);
        if (requestId === publicLoadSequence) {
            publicListEl.replaceChildren();
            const state = document.createElement('div');
            state.className = 'public-state';
            state.textContent = 'Something went wrong while loading the wall. Please try again.';
            publicListEl.appendChild(state);
        }
    } finally {
        if (requestId === publicLoadSequence) {
            publicListEl.setAttribute('aria-busy', 'false');
            if (refreshPublicBtn) refreshPublicBtn.disabled = false;
        }
    }
}

function renderPublicCards(letters) {
    const liked = getLikedLetters();
    publicListEl.replaceChildren();
    letters.forEach(letter => {
        const isLiked = liked.includes(letter.id);
        const card = document.createElement('article');
        card.className = 'public-card';

        const openButton = document.createElement('button');
        openButton.type = 'button';
        openButton.className = 'public-card-open';
        openButton.setAttribute('aria-label', `Read letter to ${letter.to || 'someone'}`);

        const header = document.createElement('span');
        header.className = 'public-card-header';
        const recipient = document.createElement('span');
        recipient.className = 'card-to';
        recipient.textContent = `To: ${letter.to || 'Someone'}`;
        const date = document.createElement('span');
        const parsedDate = new Date(letter.timestamp);
        date.textContent = Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        header.append(recipient, date);

        const message = document.createElement('span');
        message.className = 'card-msg';
        message.textContent = `“${letter.message || ''}”`;
        message.setAttribute('aria-label', (letter.message || 'Open this letter').trim());
        openButton.append(header, message);
        openButton.addEventListener('click', () => openPublicLetter(letter));

        const footer = document.createElement('div');
        footer.className = 'card-footer';
        const likeBtn = document.createElement('button');
        likeBtn.className = `like-btn ${isLiked ? 'liked' : ''}`;
        likeBtn.type = 'button';
        likeBtn.setAttribute('aria-label', isLiked ? 'Already liked' : 'Like this letter');
        likeBtn.setAttribute('aria-pressed', String(isLiked));
        likeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
        likeBtn.querySelector('svg').setAttribute('fill', isLiked ? 'currentColor' : 'none');
        const count = document.createElement('span');
        count.className = 'like-count';
        count.textContent = String(Number(letter.likes) || 0);
        likeBtn.append(count);

        const sender = document.createElement('span');
        sender.className = 'card-from';
        sender.textContent = `— ${letter.from || 'Anonymous'}`;
        footer.append(likeBtn, sender);
        card.append(openButton, footer);

        likeBtn.addEventListener('click', async () => {
            if (likeBtn.classList.contains('liked') || likeBtn.disabled) return;
            likeBtn.disabled = true;
            const success = await likeLetter(letter.id);
            likeBtn.disabled = false;
            if (success) {
                likeBtn.classList.add('liked');
                likeBtn.setAttribute('aria-pressed', 'true');
                likeBtn.setAttribute('aria-label', 'Already liked');
                likeBtn.querySelector('svg').setAttribute('fill', 'currentColor');
                count.textContent = String((Number(count.textContent) || 0) + 1);
                showToast('Liked! 💗');
            } else {
                showToast('Could not save your like. Please try again.');
            }
        });
        publicListEl.appendChild(card);
    });
}
// ==========================================
// THEME TOGGLE
// ==========================================
(function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('pickme-theme');

    // Apply saved theme or detect system preference
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        const syncThemeControl = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        };
        syncThemeControl();
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';

            if (next === 'light') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }

            localStorage.setItem('pickme-theme', next);
            syncThemeControl();
        });
    }
})();

// ==========================================
// LIKE BUTTON ON PUBLIC LETTERS
// ==========================================
function getLikedLetters() {
    try {
        return JSON.parse(localStorage.getItem('pickme-liked') || '[]');
    } catch { return []; }
}

function setLikedLetters(arr) {
    localStorage.setItem('pickme-liked', JSON.stringify(arr));
}

async function likeLetter(letterId) {
    if (!db) return false;

    const liked = getLikedLetters();
    if (liked.includes(letterId)) return false; // Already liked

    try {
        const { updateDoc, increment } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const q = query(collection(db, "letters"), where("id", "==", letterId), limit(1));
        const snap = await getDocs(q);

        if (!snap.empty) {
            await updateDoc(snap.docs[0].ref, { likes: increment(1) });
            liked.push(letterId);
            setLikedLetters(liked);
            return true;
        }
    } catch (e) {
        console.error("Error liking letter:", e);
    }
    return false;
}

// ==========================================
// WHATSAPP SHARE
// ==========================================
function shareViaWhatsApp(code) {
    const url = `${window.location.origin}${window.location.pathname}?code=${code}`;
    const text = `💌 Someone sent you a Valentine! Open it here:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ==========================================
// ?code= URL PARAMETER AUTO-OPEN
// ==========================================
(function handleCodeParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && code.trim()) {
        // Auto-open the letter
        (async () => {
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('show');

            try {
                const letter = await fetchLetterByCode(code.trim().toUpperCase());
                await sleep(500);

                if (letter) {
                    window.currentReadLetter = letter;
                    openSurprisePage(letter);
                } else {
                    if (loader) loader.classList.remove('show');
                    showToast("Letter not found 💔");
                }
            } catch (e) {
                if (loader) loader.classList.remove('show');
                showToast("Error loading letter ❌");
            }
        })();
    }
})();
