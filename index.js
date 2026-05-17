// --- 1. DATA SETUP ---
// Generate your pool of 700 traders (1 to 700)
const totalTradersPool = [];
for (let i = 1; i <= 700; i++) {
    totalTradersPool.push(i.toString());
}

// Visual layout configurations (Fixed 12 premium slices for a clean look)
const visualSegments = ["✦", "✧", "✦", "✧", "✦", "✧", "✦", "✧", "✦", "✧", "✦", "✧"];
const numSegments = visualSegments.length;
const segmentAngle = (2 * Math.PI) / numSegments;

// --- 2. WHEEL SYSTEM VARIABLES ---
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const winnerDisplay = document.getElementById("winner-display");

let currentRotation = 0;
let isSpinning = false;

// Premium color palette
const goldGradStart = "#d4af37";
const goldGradEnd = "#aa771c";
const luxuryBlue = "#0a192f";
const innerBlueGlow = "#0e2445";

// --- 3. RENDERING ENGINE ---
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = canvas.width / 2;
    
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(currentRotation);

    for (let i = 0; i < numSegments; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, i * segmentAngle, (i + 1) * segmentAngle);
        
        // Render alternating background gradients
        if (i % 2 === 0) {
            let blueGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, radius);
            blueGrad.addColorStop(0, innerBlueGlow);
            blueGrad.addColorStop(1, luxuryBlue);
            ctx.fillStyle = blueGrad;
        } else {
            let goldGrad = ctx.createLinearGradient(0, 0, radius, 0);
            goldGrad.addColorStop(0, goldGradStart);
            goldGrad.addColorStop(1, goldGradEnd);
            ctx.fillStyle = goldGrad;
        }
        ctx.fill();

        // Subtle geometric separator lines
        ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Overlay clean luxury icons instead of crowded numbers
        ctx.save();
        ctx.rotate(i * segmentAngle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        
        if (i % 2 === 0) {
            ctx.fillStyle = "#e5c158"; 
        } else {
            ctx.fillStyle = "#0a192f"; 
        }
        
        ctx.font = "18px 'Montserrat', sans-serif";
        ctx.fillText(visualSegments[i], radius - 45, 0);
        ctx.restore();
    }
    
    // Deluxe inner metallic hub
    ctx.restore();
    ctx.beginPath();
    ctx.arc(radius, radius, 35, 0, 2 * Math.PI);
    let centerGrad = ctx.createLinearGradient(radius-35, radius-35, radius+35, radius+35);
    centerGrad.addColorStop(0, "#ffffff");
    centerGrad.addColorStop(0.5, "#d4af37");
    centerGrad.addColorStop(1, "#aa771c");
    ctx.fillStyle = centerGrad;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.fill();
    ctx.shadowBlur = 0; 
}

// --- 4. SPIN ANIMATION CORE ---
function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    winnerDisplay.style.opacity = 0;

    // 1. Pick a random visual segment (0 to 11) to stop on
    const targetVisualSegment = Math.floor(Math.random() * numSegments);
    
    // 2. Calculate the exact stopping angle to center that segment under the pointer
    // The pointer is at the top (-90 degrees, or 1.5 * Math.PI)
    const targetAngle = (1.5 * Math.PI) - (targetVisualSegment * segmentAngle + segmentAngle / 2);
    
    // 3. Normalize the angle to keep it positive, then add 8 full luxury rotations
    const normalizedTargetAngle = (targetAngle + 2 * Math.PI) % (2 * Math.PI);
    const totalSpin = (8 * 2 * Math.PI) + normalizedTargetAngle;
    
    const duration = 5000; // 5-second mechanical ease-out
    const startTimestamp = performance.now();

    function animate(now) {
        const elapsed = now - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        
        // Quintic deceleration curve for elite weight simulation
        const easeOut = 1 - Math.pow(1 - progress, 5);
        
        currentRotation = easeOut * totalSpin;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            displayWinner();
        }
    }
    requestAnimationFrame(animate);
}

/// --- 5. LOGIC ENGINE ---
function displayWinner() {
    // Select a random winner from the entire pool of 700 traders
    const randomIndex = Math.floor(Math.random() * totalTradersPool.length);
    const luckyTrader = totalTradersPool[randomIndex];

    // Push the results live to your luxury container layout
    winnerDisplay.innerHTML = `WINNER: <span style="color: #fcf6ba; font-weight: bold; text-shadow: 0 0 12px rgba(212,175,55,0.7)">TRADER #${luckyTrader}</span>`;
    winnerDisplay.style.opacity = 1;

    // --- NEW: LUXURY CELEBRATION SHOWER ---
    // This creates a premium burst of gold, dark blue, and white confetti
    const duration = 3 * 1000; // Celebrate for 3 seconds
    const end = Date.now() + duration;

    (function frame() {
        // Left side blast
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: ['#d4af37', '#ffffff', '#0a192f']
        });
        // Right side blast
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: ['#d4af37', '#ffffff', '#0a192f']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Initialize system layout
drawWheel();
spinBtn.addEventListener("click", spin);