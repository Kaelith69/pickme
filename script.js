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

// ==========================================
// TOAST NOTIFICATION (replaces alert)
// ==========================================
let toastTimer = null;

function showToast(message, duration = 3000) {
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
    await sleep(300);

    pickupLineDisplay.innerHTML = '';
    pickupLineDisplay.style.opacity = '1';

    const textNode = document.createTextNode('');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    pickupLineDisplay.appendChild(textNode);
    pickupLineDisplay.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
        textNode.textContent = text.substring(0, i + 1);
        await sleep(20 + Math.random() * 35);
    }

    // Keep cursor blinking then fade it out
    await sleep(1500);
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
// RIPPLE EFFECT (no transforms — purely width/height based)
// ==========================================
function createRipple(event) {
    const button = event.currentTarget;

    // Remove any existing ripple
    const oldRipple = button.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();

    const circle = document.createElement('span');
    circle.classList.add('ripple');

    const rect = button.getBoundingClientRect();

    // Position the ripple at click point (or center for keyboard)
    if (event.clientX === 0 && event.clientY === 0) {
        circle.style.left = `${rect.width / 2}px`;
        circle.style.top = `${rect.height / 2}px`;
    } else {
        circle.style.left = `${event.clientX - rect.left}px`;
        circle.style.top = `${event.clientY - rect.top}px`;
    }

    button.appendChild(circle);

    // Clean up after animation finishes
    circle.addEventListener('animationend', () => circle.remove());
}

// ==========================================
// PARALLAX BACKGROUND
// ==========================================
const mesh = $('.background-mesh');
let rafId = null;

document.addEventListener('mousemove', (e) => {
    if (rafId) return; // Throttle with rAF

    rafId = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        mesh.style.transform = `translate(${-(x * 15)}px, ${-(y * 15)}px)`;
        rafId = null;
    });
}, { passive: true });

// ==========================================
// EVENT LISTENERS
// ==========================================
generateBtn.addEventListener('click', (e) => {
    if (isTyping) return; // Don't ripple or act if still typing
    createRipple(e);
    generateRandomPickupLine();
});

// Keyboard shortcuts (only when not in form)
document.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in a form field
    const activeTag = document.activeElement.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    const formIsHidden = letterForm.classList.contains('hidden');
    if ((e.code === 'Space' || e.code === 'Enter') && !isTyping && formIsHidden) {
        e.preventDefault();
        generateBtn.click();
    }
});

// Character counter for textarea
if (messageInput) {
    messageInput.addEventListener('input', () => {
        charCount.textContent = messageInput.value.length;
    });
}

// ==========================================
// VIEW SWITCHING
// ==========================================
function showLetterMode(to, from, msg) {
    actionArea.classList.add('hidden');
    contentArea.classList.add('hidden');
    letterForm.classList.add('hidden');

    subtitleEl.textContent = `A Letter For You`;
    titleEl.textContent = "Happy Valentine's";

    $('#letter-to').textContent = to;
    $('#letter-from').textContent = from;
    $('#letter-body').textContent = msg;

    letterView.classList.remove('hidden');
}

function showCreateMode() {
    actionArea.classList.add('hidden');
    contentArea.classList.add('hidden');
    letterView.classList.add('hidden');

    subtitleEl.textContent = "Create Your Own";
    titleEl.textContent = "Write a Letter";

    letterForm.classList.remove('hidden');

    // Focus on first input for UX
    setTimeout(() => senderInput.focus(), 300);
}

function resetToDefault() {
    window.history.pushState({}, document.title, window.location.pathname);

    letterForm.classList.add('hidden');
    letterView.classList.add('hidden');
    actionArea.classList.remove('hidden');
    contentArea.classList.remove('hidden');

    subtitleEl.textContent = "For You";
    titleEl.textContent = "Hey Darling";

    // Reset form fields
    senderInput.value = '';
    receiverInput.value = '';
    messageInput.value = '';
    charCount.textContent = '0';
}

// ==========================================
// LETTER CREATION & SHARING
// ==========================================
createLetterBtn.addEventListener('click', showCreateMode);
cancelFormBtn.addEventListener('click', resetToDefault);
createOwnBtn.addEventListener('click', () => {
    resetToDefault();
    showCreateMode();
});

generateLinkBtn.addEventListener('click', async (e) => {
    createRipple(e);

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

    // Save to localStorage (with IP tracking)
    await saveLetter(sender, receiver, message);

    // Generate shareable link
    const params = new URLSearchParams({
        to: receiver,
        from: sender,
        msg: message
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    // Copy to clipboard with toast feedback
    navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("Link copied! Send it to your Valentine 💕");
    }).catch(() => {
        // Fallback for non-HTTPS / older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        showToast("Link copied! Send it to your Valentine 💕");
    });

    // Show preview of the letter
    showLetterMode(receiver, sender, message);
});

// ==========================================
// LETTER STORAGE (localStorage + CSV)
// ==========================================
async function getIPAndLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            ip: data.ip || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || '',
            country: data.country_name || 'Unknown',
            location: `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`,
            latitude: data.latitude || null,
            longitude: data.longitude || null
        };
    } catch (error) {
        console.error('Failed to fetch IP/location:', error);
        return {
            ip: 'Unknown',
            city: 'Unknown',
            region: '',
            country: 'Unknown',
            location: 'Unknown',
            latitude: null,
            longitude: null
        };
    }
}

async function saveLetter(from, to, message) {
    const letters = getLetters();
    const ipData = await getIPAndLocation();

    const letter = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        from: from,
        to: to,
        message: message,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        ip: ipData.ip,
        location: ipData.location,
        city: ipData.city,
        country: ipData.country,
        latitude: ipData.latitude,
        longitude: ipData.longitude
    };
    letters.push(letter);
    localStorage.setItem('valentine_letters', JSON.stringify(letters));
    return letter;
}

function getLetters() {
    try {
        return JSON.parse(localStorage.getItem('valentine_letters') || '[]');
    } catch {
        return [];
    }
}

function generateCSV() {
    const letters = getLetters();
    if (letters.length === 0) return null;

    // CSV header
    const header = 'ID,From,To,Message,IP,Location,Date,Timestamp';

    // Escape CSV fields properly
    const escapeCSV = (str) => {
        if (str == null) return '';
        const s = String(str);
        if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    };

    const rows = letters.map(l =>
        [l.id, l.from, l.to, l.message, l.ip || 'N/A', l.location || 'N/A', l.date || '', l.timestamp]
            .map(escapeCSV)
            .join(',')
    );

    return header + '\n' + rows.join('\n');
}

function downloadCSV() {
    const csv = generateCSV();
    if (!csv) {
        showToast("No letters saved yet!");
        return;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valentine_letters_${new Date().toISOString().split('T')[0]}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("CSV downloaded! 📄");
}

// Make functions available globally for godview.html
window.getLetters = getLetters;
window.generateCSV = generateCSV;
window.downloadCSV = downloadCSV;

// ==========================================
// INIT: Check URL for letter params
// ==========================================
(function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to');
    const from = urlParams.get('from');
    const msg = urlParams.get('msg');

    if (to && from && msg) {
        const decodedTo = decodeURIComponent(to);
        const decodedFrom = decodeURIComponent(from);
        const decodedMsg = decodeURIComponent(msg);

        showLetterMode(decodedTo, decodedFrom, decodedMsg);
    }
})();

