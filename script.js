// --- DOM Elements & State ---
const screens = document.querySelectorAll('.screen');
const fxCanvas = document.getElementById('fx-canvas');
const ctx = fxCanvas.getContext('2d');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let currentScreen = 1;
let isMusicPlaying = false;

// Resize canvases
function resizeCanvas() {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
    const uniCanvas = document.getElementById('universe-canvas');
    if(uniCanvas) {
        uniCanvas.width = window.innerWidth;
        uniCanvas.height = window.innerHeight;
    }
    const heartCanvas = document.getElementById('heart-canvas');
    if(heartCanvas) {
        heartCanvas.width = window.innerWidth;
        heartCanvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Audio setup
musicToggle.addEventListener('click', () => {
    if (bgMusic.src && bgMusic.src !== window.location.href) {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.style.opacity = '0.5';
        } else {
            bgMusic.play().catch(e => console.log("Audio play prevented:", e));
            musicToggle.style.opacity = '1';
        }
        isMusicPlaying = !isMusicPlaying;
    } else {
        // Fallback visual toggle if no audio src is provided
        isMusicPlaying = !isMusicPlaying;
        musicToggle.style.opacity = isMusicPlaying ? '1' : '0.5';
    }
});
musicToggle.style.opacity = '0.5'; // Default state

// Navigation Core
function nextScreen(targetIndex) {
    document.getElementById(`screen-${currentScreen}`).classList.remove('active');
    
    // Handle special string targets for ending screens
    if(typeof targetIndex === 'string') {
        document.getElementById(targetIndex).classList.add('active');
        currentScreen = targetIndex;
    } else {
        document.getElementById(`screen-${targetIndex}`).classList.add('active');
        currentScreen = targetIndex;
    }
    initScreenLogic(currentScreen);
}

// --- Screen Specific Logic Init ---
function initScreenLogic(screenId) {
    switch(screenId) {
        case 2: initLockScreen(); break;
        case 3: initStoryScreen(); break;
        case 4: initUniverseScreen(); break;
        case 5: initDatingApp(); break;
        case 6: initChat(); break;
        case 7: initTimeline(); break;
        case 9: initPolaroids(); break;
        case 11: initProposal(); break;
        case 'screen-12-yes': triggerFireworks(); break;
    }
}

// --- Screen 1: Auto advance ---
setTimeout(() => { nextScreen(2); }, 3000);

// --- Screen 2: Lock Screen ---
function initLockScreen() {
    // Live Time
    const timeEl = document.querySelector('.time-text');
    setInterval(() => {
        const now = new Date();
        timeEl.innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }, 1000);

    // Swipe logic
    let startY = 0;
    const swipeArea = document.getElementById('swipe-area');
    
    swipeArea.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
    swipeArea.addEventListener('touchend', e => {
        let endY = e.changedTouches[0].clientY;
        if(startY - endY > 50) nextScreen(3); // Swiped up
    });
    // Click fallback for desktop testing
    swipeArea.addEventListener('click', () => nextScreen(3));
}

// --- Screen 3: Story ---
function initStoryScreen() {
    const lines = document.querySelectorAll('.story-line');
    lines.forEach((line, i) => {
        setTimeout(() => { line.classList.add('show'); }, 1000 + (i * 2000));
    });
    setTimeout(() => { nextScreen(4); }, 2000 + (lines.length * 2000));
}

// --- Screen 4: Universe ---
function initUniverseScreen() {
    const canvas = document.getElementById('universe-canvas');
    const uCtx = canvas.getContext('2d');
    let stars = [];
    for(let i=0; i<100; i++) {
        stars.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            r: Math.random() * 2, speed: Math.random() * 0.5
        });
    }

    let progress = 0;
    function drawUni() {
        if(currentScreen !== 4) return;
        uCtx.clearRect(0,0, canvas.width, canvas.height);
        
        // Stars
        uCtx.fillStyle = 'white';
        stars.forEach(s => {
            uCtx.beginPath();
            uCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            uCtx.fill();
            s.y += s.speed;
            if(s.y > canvas.height) s.y = 0;
        });

        // Connection line
        if(progress < 1) progress += 0.005;
        const p1 = {x: canvas.width*0.2, y: canvas.height*0.2};
        const p2 = {x: canvas.width*0.8, y: canvas.height*0.8};
        
        uCtx.beginPath();
        uCtx.arc(p1.x, p1.y, 5, 0, Math.PI*2);
        uCtx.fillStyle = '#FF4D8D'; uCtx.fill();
        
        uCtx.beginPath();
        uCtx.arc(p2.x, p2.y, 5, 0, Math.PI*2);
        uCtx.fill();

        uCtx.beginPath();
        uCtx.moveTo(p1.x, p1.y);
        uCtx.lineTo(p1.x + (p2.x - p1.x)*progress, p1.y + (p2.y - p1.y)*progress);
        uCtx.strokeStyle = 'rgba(255, 77, 141, 0.5)';
        uCtx.lineWidth = 2; uCtx.stroke();

        requestAnimationFrame(drawUni);
    }
    drawUni();

    const lines = document.querySelectorAll('.uni-line');
    lines.forEach((line, i) => {
        setTimeout(() => { line.classList.add('show'); }, 1500 + (i * 1500));
    });
    setTimeout(() => { document.querySelector('#screen-4 .continue-btn').classList.add('show'); }, 6000);
}

// --- Screen 5: Dating App ---
function initDatingApp() {
    const stack = document.getElementById('card-stack');
    const mockProfiles = ['Sarah, 22', 'Priya, 21', 'Riya, 23'];
    
    // Create random cards
    mockProfiles.forEach((name, i) => {
        let card = document.createElement('div');
        card.className = 'swipe-card';
        card.style.zIndex = 3 - i;
        card.style.backgroundColor = `hsl(${Math.random()*360}, 50%, 30%)`; // Placeholder colored cards
        card.innerHTML = `<span class="card-name">${name}</span>`;
        stack.appendChild(card);
    });

    // Final Card
    let finalCard = document.createElement('div');
    finalCard.className = 'swipe-card final-card';
    finalCard.style.zIndex = 0;
    finalCard.innerHTML = `<span class="card-name">You ❤️</span>`;
    stack.appendChild(finalCard);

    // Auto Swipe Animation
    const cards = document.querySelectorAll('.swipe-card:not(.final-card)');
    cards.forEach((card, i) => {
        setTimeout(() => {
            card.classList.add('swipe-left');
        }, 1000 + (i * 800));
    });

    // Final effect
    setTimeout(() => {
        document.querySelector('.app-mockup').classList.add('blur-bg');
        setTimeout(() => nextScreen(6), 1500);
    }, 1000 + (cards.length * 800) + 1000);
}

// --- Screen 6: Chat ---
function initChat() {
    const chatBody = document.getElementById('chat-body');
    const indicator = document.getElementById('typing-indicator');
    const msgs = [
        { text: "Hi 😊", sender: 'tx', delay: 1000 },
        { text: "Hey!", sender: 'rx', delay: 2500 },
        { text: "Didn't expect we'd vibe this quickly 😂", sender: 'tx', delay: 4500 },
        { text: "Same here haha", sender: 'rx', delay: 7000 },
        { text: "Instagram? ❤️", sender: 'tx', delay: 9000 }
    ];

    msgs.forEach(m => {
        setTimeout(() => {
            if(m.sender === 'rx') {
                indicator.style.display = 'flex';
                chatBody.appendChild(indicator);
                chatBody.scrollTop = chatBody.scrollHeight;
                setTimeout(() => {
                    indicator.style.display = 'none';
                    appendBubble(m.text, m.sender);
                }, 1200); // Simulate typing duration
            } else {
                appendBubble(m.text, m.sender);
            }
        }, m.delay);
    });

    function appendBubble(text, type) {
        let b = document.createElement('div');
        b.className = `chat-bubble bubble-${type}`;
        b.innerText = text;
        chatBody.appendChild(b);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    setTimeout(() => nextScreen(7), msgs[msgs.length-1].delay + 3000);
}

// --- Screen 7: Timeline ---
function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
        setTimeout(() => { item.classList.add('show'); }, 800 + (i * 800));
    });
    setTimeout(() => {
        document.querySelector('.timeline-btn').style.display = 'block';
        document.querySelector('.timeline-btn').classList.add('show');
    }, 1000 + (items.length * 800));
}

// --- Screen 9: Polaroids ---
function initPolaroids() {
    const p1 = document.querySelector('.p1');
    const p2 = document.querySelector('.p2');
    const p3 = document.querySelector('.p3');
    const cap = document.querySelector('.memory-caption');
    const btn = document.querySelector('#screen-9 .continue-btn');

    setTimeout(() => p1.classList.add('show'), 500);
    setTimeout(() => p2.classList.add('show'), 1000);
    setTimeout(() => p3.classList.add('show'), 1500);
    setTimeout(() => cap.classList.add('show'), 2000);
    setTimeout(() => btn.classList.add('show'), 3500);
}

// --- Screen 10: Heart Particle Canvas ---
let hAnimReq;
function startHeartCanvas() {
    nextScreen(10);
    const canvas = document.getElementById('heart-canvas');
    const hCtx = canvas.getContext('2d');
    let particles = [];
    
    // Generate heart path points
    for(let i=0; i<Math.PI*2; i+=0.05) {
        // Parametric heart formula
        let x = 16 * Math.pow(Math.sin(i), 3);
        let y = 13 * Math.cos(i) - 5 * Math.cos(2*i) - 2 * Math.cos(3*i) - Math.cos(4*i);
        // Scale and invert Y
        particles.push({
            tx: canvas.width/2 + x * 10,
            ty: canvas.height/2 - y * 10 - 20,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.02 + Math.random() * 0.03
        });
    }

    function draw() {
        if(currentScreen !== 10) return cancelAnimationFrame(hAnimReq);
        hCtx.fillStyle = 'rgba(8, 17, 31, 0.2)';
        hCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        hCtx.fillStyle = '#FF4D8D';
        hCtx.shadowBlur = 10;
        hCtx.shadowColor = '#FF4D8D';
        
        let allArrived = true;
        particles.forEach(p => {
            p.x += (p.tx - p.x) * p.speed;
            p.y += (p.ty - p.y) * p.speed;
            if(Math.abs(p.tx - p.x) > 1 || Math.abs(p.ty - p.y) > 1) allArrived = false;
            
            hCtx.beginPath();
            hCtx.arc(p.x, p.y, 2, 0, Math.PI*2);
            hCtx.fill();
        });

        if(allArrived) {
            document.querySelector('#screen-10 .continue-btn').classList.add('show');
        }
        hAnimReq = requestAnimationFrame(draw);
    }
    draw();
}

// --- Screen 11: Proposal Logic ---
function initProposal() {
    const delays = document.querySelectorAll('.proposal-container [class*="delay-"]');
    delays.forEach((el, i) => {
        el.style.animationDelay = `${(i+1)*1.2}s`;
        el.classList.add('delay-show');
    });

    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    let noClickCount = 0;
    const noTexts = [
        "Let's get to know each other first 🌸",
        "Are you sure? 🥺",
        "Think again? ❤️",
        "Pretty please? 🥹",
        "Okay okay... one last chance 🤭"
    ];

    btnNo.onclick = (e) => {
        noClickCount++;
        if(noClickCount < 5) {
            // Update text
            btnNo.innerText = noTexts[noClickCount];
            // Grow Yes, Shrink No
            btnYes.style.transform = `scale(${1 + (noClickCount * 0.15)})`;
            btnNo.style.transform = `scale(${1 - (noClickCount * 0.05)})`;
            // Move No button randomly
            let maxMove = 80 + (noClickCount * 20);
            let moveX = (Math.random() - 0.5) * maxMove;
            let moveY = (Math.random() - 0.5) * maxMove;
            
            // Constrain inside bounds
            btnNo.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        } else {
            nextScreen('screen-12-no');
        }
    };

    btnYes.onclick = () => {
        nextScreen('screen-12-yes');
    };
}

// --- Effects: Confetti & Fireworks ---
function triggerFireworks() {
    const colors = ['#FF4D8D', '#FF73A7', '#8B5CF6', '#FFFFFF'];
    let particles = [];
    
    for(let i=0; i<150; i++) {
        particles.push({
            x: fxCanvas.width / 2,
            y: fxCanvas.height,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 1) * 20 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: 0.01 + Math.random() * 0.02,
            size: Math.random() * 4 + 2
        });
    }

    function animateFx() {
        ctx.clearRect(0,0, fxCanvas.width, fxCanvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // gravity
            p.life -= p.decay;

            if(p.life > 0) {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1;
        if(particles.some(p => p.life > 0)) {
            requestAnimationFrame(animateFx);
        } else {
            // Re-trigger every few seconds for celebration
            if(currentScreen === 'screen-12-yes') {
                setTimeout(triggerFireworks, 1000);
            }
        }
    }
    animateFx();
}