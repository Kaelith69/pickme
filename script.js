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
// Limit total particles to prevent lag - lower on mobile
const MAX_PARTICLES = window.innerWidth < 768 ? 40 : 100;

// ============================================
// CUSTOM CURSOR & TILT OPTIMIZATION
// ============================================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let isCursorMoving = false;

// Track mouse position without triggering layout
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isCursorMoving = true;
}, { passive: true });

// Combined animation loop for cursor and tilt
function animateLoop() {
    if (isCursorMoving) {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        // Use transform instead of top/left for 60fps performance
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

        // 3D Tilt Effect - Only if enabled and visible
        if (window.innerWidth > 768) {
            updateTilt(cursorX, cursorY);
        }

        // Stop updating if mouse stops moving (optimization)
        if (Math.abs(mouseX - cursorX) < 0.1 && Math.abs(mouseY - cursorY) < 0.1) {
            isCursorMoving = false;
        }
    }

    requestAnimationFrame(animateLoop);
}

const mainContainer = document.getElementById('main-container');
const mainContainerRect = mainContainer.getBoundingClientRect();
const centerX = mainContainerRect.left + mainContainerRect.width / 2;
const centerY = mainContainerRect.top + mainContainerRect.height / 2;

function updateTilt(x, y) {
    // Calculate relative to center of screen for simplicity/performance
    // or relative to container center
    const rotateX = ((y - window.innerHeight / 2) / (window.innerHeight / 2)) * -5; // Reduced max tilt
    const rotateY = ((x - window.innerWidth / 2) / (window.innerWidth / 2)) * 5;

    mainContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

// Start the loop
animateLoop();

// Reset tilt on leave
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

    const fragment = document.createDocumentFragment();
    const textNode = document.createTextNode('');
    const typingCursor = document.createElement('span');
    typingCursor.className = 'typing-cursor';

    fragment.appendChild(textNode);
    fragment.appendChild(typingCursor);
    pickupLineDisplay.appendChild(fragment);

    // Faster typing speed standard
    const speed = 25;

    for (let i = 0; i < text.length; i++) {
        textNode.textContent = text.substring(0, i + 1);
        await new Promise(resolve => setTimeout(resolve, speed));
    }

    setTimeout(() => typingCursor.remove(), 500);
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
    }, 200);

    createBurst(window.innerWidth / 2, window.innerHeight / 2);
    createSparkles(window.innerWidth / 2, window.innerHeight / 2);
    incrementLoveCount();
}

// ============================================
// PARTICLE SYSTEM (Optimized)
// ============================================

// Helper to check particle count
function canAddParticle() {
    return backgroundContainer.childElementCount < MAX_PARTICLES;
}

function createHeart(x, y, isBackground = false) {
    if (!canAddParticle() && isBackground) return; // Skip background hearts if busy

    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    // Hardware accelerated properties set in CSS (will-change)

    const size = Math.random() * (isBackground ? 25 : 35) + 15;
    const duration = Math.random() * 3 + 4;
    const startX = x || Math.random() * window.innerWidth;

    // Use transform for positioning if possible, but left/top is okay for initial placement 
    // if movement is done via transform/animation
    heart.style.left = `${startX}px`;
    heart.style.top = `${y || window.innerHeight}px`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    backgroundContainer.appendChild(heart);

    // Guaranteed cleanup
    setTimeout(() => {
        if (heart.isConnected) heart.remove();
    }, duration * 1000);
}

function createRosePetal() {
    if (!canAddParticle()) return;

    const petal = document.createElement('div');
    petal.classList.add('rose-petal');
    petal.textContent = roseEmojis[Math.floor(Math.random() * roseEmojis.length)];

    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 4 + 6;
    const size = Math.random() * 15 + 20;

    petal.style.left = `${startX}px`;
    petal.style.top = '-50px'; // Start above screen
    petal.style.fontSize = `${size}px`;
    petal.style.animationDuration = `${duration}s`;

    backgroundContainer.appendChild(petal);

    setTimeout(() => {
        if (petal.isConnected) petal.remove();
    }, duration * 1000);
}

function createBurst(x, y) {
    // Reduce burst size if already many particles
    const count = canAddParticle() ? 15 : 5;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            if (canAddParticle()) {
                createHeart(
                    x + (Math.random() * 100 - 50),
                    y + (Math.random() * 100 - 50)
                );
            }
        }, i * 50);
    }
}

// ============================================
// SPARKLES
// ============================================
function createSparkles(x, y) {
    if (!canAddParticle()) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 8; i++) { // Reduced count from 12
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        const angle = (Math.PI * 2 * i) / 8;
        const distance = 40 + Math.random() * 40;
        const sparkleX = x + Math.cos(angle) * distance;
        const sparkleY = y + Math.sin(angle) * distance;

        sparkle.style.left = sparkleX + 'px';
        sparkle.style.top = sparkleY + 'px';

        fragment.appendChild(sparkle);

        // Self-cleanup closure
        setTimeout(() => {
            if (sparkle.isConnected) sparkle.remove();
        }, 1500);
    }
    backgroundContainer.appendChild(fragment);
}

// ============================================
// CONFETTI
// ============================================
function createConfetti(x, y) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.backgroundColor = color;
    // Random spread
    const spreadX = (Math.random() - 0.5) * 50;

    confetti.style.left = (x + spreadX) + 'px';
    confetti.style.top = y + 'px';
    confetti.style.width = Math.random() * 8 + 5 + 'px';
    confetti.style.height = Math.random() * 8 + 5 + 'px';

    backgroundContainer.appendChild(confetti);

    setTimeout(() => {
        if (confetti.isConnected) confetti.remove();
    }, 3000);
}

function createConfettiBurst(x, y) {
    let count = 0;
    const maxConfetti = 30; // Reduced from 50

    const interval = setInterval(() => {
        if (count >= maxConfetti || !canAddParticle()) {
            clearInterval(interval);
            return;
        }
        createConfetti(x, y);
        count++;
    }, 30);
}

// ============================================
// MOUSE TRAIL
// ============================================
let lastTrailTime = 0;
document.body.addEventListener('mousemove', (e) => {
    // Only trail if enabled and not too busy
    if (window.innerWidth <= 768) return;

    const now = Date.now();
    if (now - lastTrailTime > 150) { // Throttled more (100 -> 150)
        lastTrailTime = now;

        if (document.querySelectorAll('.trail-particle').length > 10) return; // Limit active trails

        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        // Random drift
        const tx = (Math.random() - 0.5) * 30;
        const ty = (Math.random() - 0.5) * 30;

        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}, { passive: true });

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
    // Burst effect handled in generate function
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
    if (e.key === 'Escape' && keyboardHelp.classList.contains('show')) {
        keyboardHelp.classList.remove('show');
        keyboardHelp.setAttribute('aria-hidden', 'true');
        return;
    }

    if (keyboardHelp.classList.contains('show')) return;

    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        generateBtn.click();
    }

    if (e.key === 'c' || e.key === 'C') {
        createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    }
});

// ============================================
// BACKGROUND ANIMATION INTERVALS
// ============================================
setInterval(() => createHeart(null, null, true), 800); // Slower interval (400 -> 800)
setInterval(() => createRosePetal(), 2000); // Slower interval (800 -> 2000)

// ============================================
// INITIALIZE
// ============================================
pickupLineDisplay.innerHTML = '<span class="placeholder">Click the button for a surprise...</span>';
pickupLineDisplay.classList.add('show');
