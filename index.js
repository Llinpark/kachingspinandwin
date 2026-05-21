// --- 1. DATA SETUP ---
// Your explicit pool of premium trader numbers
const totalTradersPool = [
    "521007968", "521006352", "731001023", "521002108", "731001023", "521002108", "521004465", "521004486", 
    "521004500", "521006225", "521006352", "521007128", "521007256", "521007505", "521007968", "521008047", 
    "521009132", "501017223", "501018310", "501018346", "501018478", "501018514", "501030961", "501031601", 
    "501044664", "501052401", "501056106", "451000020", "581007251", "111083265", "111094148", "561006057", 
    "501052401", "111083265", "501018478", "501018514", "501022111", "501026656", "501030961", "501043953", 
    "501049484", "501052401", "501054858", "501056106", "501061388", "501064392", "501070428", "451000572", 
    "581007251", "111083261", "111102265", "501018478", "501018493", "501018514", "501020775", "501022111", 
    "501026515", "501030961", "501035155", "501038201", "501039004", "501042284", "501043953", "501045964", 
    "501054552", "501056106", "501061388", "501070428", "501072394", "451000572", "581004475", "581005163", 
    "581006430", "581007251", "581010563", "111083261", "111102265", "501018514", "501039004", "501046960", 
    "501056106", "501017210", "501017223", "501017286", "501017487", "501018199", "501018310", "501018346", 
    "501018478", "501018493", "501018514", "501020708", "501020775", "501020779", "501021459", "501021478", 
    "501021674", "501026277", "501026474", "501026515", "501026656", "501026814", "501027426", "501028506", 
    "501030961", "501031601", "501035155", "501038201", "501039004", "501042284", "501043953", "501044664", 
    "501046960", "501047064", "501047463", "501049484", "501050712", "501050885", "501051386", "501052289", 
    "501052401", "501052416", "501052985", "501054552", "501054858", "501056106", "501061388", "501064392", 
    "501064815", "501067026", "451000020", "501070428", "501072394", "501072871", "501072941", "541002074", 
    "581004615", "581004727", "581005163", "581006430", "581007251", "581010563", "111083265", "111094148", 
    "111102265", "111109856", "111110083", "111110782"
];

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

// --- 5. LOGIC ENGINE ---
function displayWinner() {
    // Select a random winner from the entire pool of unique traders
    const randomIndex = Math.floor(Math.random() * totalTradersPool.length);
    const luckyTrader = totalTradersPool[randomIndex];

    // PRIVACY MASKING LOGIC: Expose the first 3 digits and last 3 digits, mask the middle.
    let maskedTrader;
    if (luckyTrader.length >= 6) {
        const firstThree = luckyTrader.substring(0, 3);
        const lastThree = luckyTrader.substring(luckyTrader.length - 3);
        const middleMask = "*".repeat(luckyTrader.length - 6);
        maskedTrader = `${firstThree}${middleMask}${lastThree}`;
    } else {
        // Fallback safety formatting for unexpected shorter lengths
        maskedTrader = "****" + luckyTrader.slice(-4);
    }

    // Push the masked results live to your luxury container layout
    winnerDisplay.innerHTML = `WINNER: <span style="color: #fcf6ba; font-weight: bold; text-shadow: 0 0 12px rgba(212,175,55,0.7)">TRADER #${maskedTrader}</span>`;
    winnerDisplay.style.opacity = 1;

    // --- LUXURY CELEBRATION SHOWER ---
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