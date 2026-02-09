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

const pickupLineDisplay = document.getElementById('pickup-line');
const generateBtn = document.getElementById('generate-btn');
const backgroundContainer = document.getElementById('background-animation');
const heartEmojis = ['❤️', '💖', '💘', '💝', '💓', '💗', '💞', '✨', '💕'];
const roseEmojis = ['🌹', '🌺', '🌸', '🌼', '🌻'];
const confettiColors = ['#ff4d6d', '#ff8fa3', '#c9184a', '#ffc6d3', '#ffb3c6', '#ffdde1'];

let lastIndex = -1;
let isTyping = false;
let loveCount = 0;

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(updateCursor);
}
updateCursor();

// ============================================
// 3D CARD TILT EFFECT
// ============================================
const mainContainer = document.getElementById('main-container');
let tiltEnabled = true;

mainContainer.addEventListener('mousemove', (e) => {
    if (!tiltEnabled || window.innerWidth <= 768) return;

    const rect = mainContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    mainContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

mainContainer.addEventListener('mouseleave', () => {
    mainContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
});

// ============================================
// LOVE COUNTER
// ============================================
const counterValue = document.getElementById('counter-value');

function loadLoveCount() {
    const saved = localStorage.getItem('valentineLoveCount');
    if (saved) {
        loveCount = parseInt(saved, 10);
        counterValue.textContent = loveCount;
    }
}

function incrementLoveCount() {
    loveCount++;
    counterValue.textContent = loveCount;
    counterValue.classList.add('counter-increment');
    setTimeout(() => counterValue.classList.remove('counter-increment'), 500);
    localStorage.setItem('valentineLoveCount', loveCount);

    // Trigger confetti on milestones
    if (loveCount % 10 === 0) {
        createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    }
}

loadLoveCount();

// ============================================
// TYPING ANIMATION
// ============================================
async function typeText(text) {
    if (isTyping) return;
    isTyping = true;

    pickupLineDisplay.innerHTML = '';
    pickupLineDisplay.classList.add('show');

    const typingCursor = document.createElement('span');
    typingCursor.className = 'typing-cursor';

    for (let i = 0; i < text.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        pickupLineDisplay.textContent = text.substring(0, i + 1);
        if (i === text.length - 1) {
            pickupLineDisplay.appendChild(typingCursor);
            setTimeout(() => typingCursor.remove(), 500);
        }
    }

    isTyping = false;
}

function generateRandomPickupLine() {
    if (isTyping) return;

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * pickupLines.length);
    } while (randomIndex === lastIndex && pickupLines.length > 1);

    lastIndex = randomIndex;

    pickupLineDisplay.classList.remove('show');

    setTimeout(() => {
        typeText(pickupLines[randomIndex]);
    }, 300);

    createBurst(window.innerWidth / 2, window.innerHeight / 2);
    createSparkles(window.innerWidth / 2, window.innerHeight / 2);
    incrementLoveCount();
}

// ============================================
// FLOATING HEARTS
// ============================================
function createHeart(x, y, isBackground = false) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    const size = Math.random() * (isBackground ? 25 : 35) + 15;
    const duration = Math.random() * 3 + 4;
    const startX = x || Math.random() * window.innerWidth;

    heart.style.left = `${startX}px`;
    heart.style.top = `${y || window.innerHeight}px`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    backgroundContainer.appendChild(heart);

    setTimeout(() => heart.remove(), duration * 1000);
}

// ============================================
// ROSE PETALS
// ============================================
function createRosePetal() {
    const petal = document.createElement('div');
    petal.classList.add('rose-petal');
    petal.textContent = roseEmojis[Math.floor(Math.random() * roseEmojis.length)];

    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 4 + 6;
    const size = Math.random() * 15 + 20;

    petal.style.left = `${startX}px`;
    petal.style.top = '-50px';
    petal.style.fontSize = `${size}px`;
    petal.style.animationDuration = `${duration}s`;

    backgroundContainer.appendChild(petal);

    setTimeout(() => petal.remove(), duration * 1000);
}

// ============================================
// HEART BURST
// ============================================
function createBurst(x, y) {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeart(
                x + (Math.random() * 150 - 75),
                y + (Math.random() * 150 - 75)
            );
        }, i * 40);
    }
}

// ============================================
// SPARKLES
// ============================================
function createSparkles(x, y) {
    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        const angle = (Math.PI * 2 * i) / 12;
        const distance = 50 + Math.random() * 50;
        const sparkleX = x + Math.cos(angle) * distance;
        const sparkleY = y + Math.sin(angle) * distance;

        sparkle.style.left = sparkleX + 'px';
        sparkle.style.top = sparkleY + 'px';

        backgroundContainer.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1500);
    }
}

// ============================================
// CONFETTI
// ============================================
function createConfetti(x, y) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.backgroundColor = color;
    confetti.style.left = x + (Math.random() * 100 - 50) + 'px';
    confetti.style.top = y + 'px';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';

    backgroundContainer.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
}

function createConfettiBurst(x, y) {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createConfetti(x, y), i * 20);
    }
}

// ============================================
// MOUSE TRAIL
// ============================================
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 100) {
        lastTrailTime = now;

        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        const tx = (Math.random() - 0.5) * 50;
        const ty = (Math.random() - 0.5) * 50;

        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
});

// ============================================
// RIPPLE EFFECT
// ============================================
generateBtn.addEventListener('click', (e) => {
    const rect = generateBtn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    generateBtn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    generateRandomPickupLine();
    createBurst(e.clientX, e.clientY);
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
const helpBtn = document.getElementById('help-btn');
const keyboardHelp = document.getElementById('keyboard-help');
const closeHelp = document.getElementById('close-help');

helpBtn.addEventListener('click', () => {
    keyboardHelp.classList.add('show');
    keyboardHelp.setAttribute('aria-hidden', 'false');
});

closeHelp.addEventListener('click', () => {
    keyboardHelp.classList.remove('show');
    keyboardHelp.setAttribute('aria-hidden', 'true');
});

document.addEventListener('keydown', (e) => {
    // Close help dialog with Escape
    if (e.key === 'Escape' && keyboardHelp.classList.contains('show')) {
        keyboardHelp.classList.remove('show');
        keyboardHelp.setAttribute('aria-hidden', 'true');
        return;
    }

    // Don't trigger shortcuts when help is open
    if (keyboardHelp.classList.contains('show')) return;

    // Generate pickup line with Space or Enter
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        generateBtn.click();
    }

    // Confetti burst with 'C'
    if (e.key === 'c' || e.key === 'C') {
        createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    }
});

// ============================================
// BACKGROUND ANIMATION INTERVALS
// ============================================
setInterval(() => createHeart(null, null, true), 400);
setInterval(() => createRosePetal(), 800);

// ============================================
// INITIALIZE
// ============================================
pickupLineDisplay.innerHTML = '<span class="placeholder">Click the button for a surprise...</span>';
pickupLineDisplay.classList.add('show');
