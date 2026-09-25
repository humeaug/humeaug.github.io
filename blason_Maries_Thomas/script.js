const themeButton = document.getElementById("themeButton");

const fireworksCanvas = document.createElement("canvas");
fireworksCanvas.id = "fireworksCanvas";
document.body.appendChild(fireworksCanvas);

const fireworksContext = fireworksCanvas.getContext("2d");
const particles = [];
const colors = ["#ff4d6d", "#ffd166", "#06d6a0", "#4cc9f0", "#f72585", "#ffffff"];
const pointerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const mottoes = [
    "Qui ose gagne",
    "L'union fait la force",
    "Le courage est la clé du succès",
    "Persévérance sans fin",
    "Le travail fait le talent",
    "Rêver, créer, réussir",
    "La discipline mène loin",
    "Toujours plus haut",
    "L'innovation inspire",
    "La confiance donne la force",
    "Rester humble, avancer fort",
    "Le futur se construit chaque jour",
    "Le changement commence ici",
    "Vaincre les limites",
    "Le savoir est un atout",
    "Ne pas abandonner",
    "Le meilleur est à venir",
    "Oser, apprendre, progresser",
    "Le défi devient opportunité",
    "L'ambition guide le chemin"
];
const mottoColors = [
    "red", "orange", "gold", "green", "teal", "cyan", "blue", "navy",
    "purple", "magenta", "pink", "brown", "crimson", "darkslategray",
    "darkgreen", "indigo", "darkorange", "tomato", "slateblue", "mediumvioletred"
];
let fireworksInterval = null;
let isAKeyPressed = false;

const randomMottoButton = document.getElementById("randomMottoButton");
const randomColorButton = document.getElementById("randomColorButton");
const mottoDisplay = document.getElementById("mottoDisplay");
const deviseCell = document.getElementById("about");

if (themeButton) {
    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeButton.textContent = "Mode clair";
        } else {
            themeButton.textContent = "Mode sombre";
        }
    });
}

function resizeFireworksCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    fireworksCanvas.width = window.innerWidth * pixelRatio;
    fireworksCanvas.height = window.innerHeight * pixelRatio;
    fireworksCanvas.style.width = `${window.innerWidth}px`;
    fireworksCanvas.style.height = `${window.innerHeight}px`;
    fireworksContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function startFireworksLoop() {
    if (fireworksInterval) {
        return;
    }

    fireworksInterval = setInterval(() => {
        createFirework(pointerPosition.x, pointerPosition.y);
    }, 80);
}

function stopFireworksLoop() {
    if (!fireworksInterval) {
        return;
    }

    clearInterval(fireworksInterval);
    fireworksInterval = null;
}

function createFirework(x, y) {
    const particleCount = 70;

    for (let index = 0; index < particleCount; index += 1) {
        const angle = (Math.PI * 2 * index) / particleCount + (Math.random() - 0.5) * 0.12;
        const speed = 2 + Math.random() * 4;

        particles.push({
            x,
            y,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
            life: 1,
            decay: 0.012 + Math.random() * 0.012,
            size: 1.5 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function animateFireworks() {
    fireworksContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityY += 0.06;
        particle.velocityX *= 0.99;
        particle.life -= particle.decay;

        if (particle.life <= 0) {
            particles.splice(index, 1);
            continue;
        }

        fireworksContext.globalAlpha = particle.life;
        fireworksContext.fillStyle = particle.color;
        fireworksContext.beginPath();
        fireworksContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        fireworksContext.fill();
    }

    fireworksContext.globalAlpha = 1;
    requestAnimationFrame(animateFireworks);
}

function pickRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function randomizeMotto() {
    const motto = pickRandomItem(mottoes);
    const color = pickRandomItem(mottoColors);
    mottoDisplay.textContent = `« ${motto} »`;
    mottoDisplay.style.color = color;
}

function isDarkTextPreferred(hexColor) {
    const cleanColor = hexColor.replace("#", "");
    const red = parseInt(cleanColor.slice(0, 2), 16);
    const green = parseInt(cleanColor.slice(2, 4), 16);
    const blue = parseInt(cleanColor.slice(4, 6), 16);
    const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);

    return luminance > 180;
}

function randomizeDeviseCellColor() {
    const palette = [
        "#ff6b6b", "#ffd166", "#90be6d", "#4cc9f0", "#f72585",
        "#bdb2ff", "#ff9f1c", "#70e000", "#00bbf9", "#ff5d8f",
        "#9b5de5", "#00f5d4", "#f15bb5", "#84dcc6", "#ff7b00",
        "#7bdff2", "#cdb4db", "#ffafcc", "#a3b18a", "#f4d35e"
    ];

    if (!deviseCell) {
        return;
    }

    const chosenColor = pickRandomItem(palette);
    const textColor = isDarkTextPreferred(chosenColor) ? "#1d3557" : "#ffffff";

    deviseCell.style.backgroundColor = chosenColor;
    deviseCell.style.color = textColor;
    deviseCell.style.borderColor = chosenColor;

    const title = deviseCell.querySelector("h2");
    const description = deviseCell.querySelector("p");

    if (title) {
        title.style.color = textColor;
    }

    if (description) {
        description.style.color = textColor;
    }
}

if (randomMottoButton) {
    randomMottoButton.addEventListener("click", randomizeMotto);
}

if (randomColorButton) {
    randomColorButton.addEventListener("click", randomizeDeviseCellColor);
}

window.addEventListener("resize", resizeFireworksCanvas);

document.addEventListener("pointermove", function (event) {
    pointerPosition.x = event.clientX;
    pointerPosition.y = event.clientY;
});

document.addEventListener("keydown", function (event) {
    if (event.key.toLowerCase() !== "a") {
        return;
    }

    if (isAKeyPressed) {
        return;
    }

    isAKeyPressed = true;
    createFirework(pointerPosition.x, pointerPosition.y);
    startFireworksLoop();
});

document.addEventListener("keyup", function (event) {
    if (event.key.toLowerCase() === "a") {
        isAKeyPressed = false;
        stopFireworksLoop();
    }
});

document.addEventListener("pointerup", stopFireworksLoop);
document.addEventListener("pointercancel", stopFireworksLoop);
window.addEventListener("blur", () => {
    isAKeyPressed = false;
    stopFireworksLoop();
});

resizeFireworksCanvas();
animateFireworks();