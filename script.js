// ===== KIRJOITUSEFEKTI =====
const phrases = [
  "// Tämä sivu on hyvin perus.",
  "// Tai onko se?",
  "// Tervetuloa internettiin.",
  "// SYSTEM ONLINE. READY.",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById("typewriter");

function type() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typeEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(type, isDeleting ? 40 : 70);
}

type();

// ===== KLIKKAUSLASKURI =====
let count = 0;
const counterValue = document.getElementById("counterValue");
const statusText = document.getElementById("statusText");
const clickBtn = document.getElementById("clickBtn");

const statusMessages = [
  "// KLIKKAUS REKISTERÖITY",
  "// HYVÄ SUORITUS",
  "// JATKA SAMAAN MALLIIN",
  "// OLET MESTARI",
  "// ONKO SINULLA MUUTAKIN TEKEMISTÄ?",
  "// VAKAVA KLIKKAUSONGELMA HAVAITTU",
  "// KUTSUTAAN APUA...",
  "// APUA EI OLE TULOSSA",
];

clickBtn.addEventListener("click", () => {
  count++;
  counterValue.textContent = count;

  // Bump-animaatio
  counterValue.classList.remove("bump");
  void counterValue.offsetWidth; // reflow
  counterValue.classList.add("bump");
  setTimeout(() => counterValue.classList.remove("bump"), 150);

  // Statusviesti
  const msg = statusMessages[Math.min(Math.floor(count / 3), statusMessages.length - 1)];
  statusText.textContent = msg;

  // Shake koko sivulle kun count on iso
  if (count > 20 && count % 10 === 0) {
    document.querySelector(".container").classList.add("shake");
    setTimeout(() => document.querySelector(".container").classList.remove("shake"), 400);
  }
});

// ===== VÄRINVAIHTO =====
const colorBtn = document.getElementById("colorBtn");
const themes = ["", "theme-2", "theme-3"];
let themeIndex = 0;

colorBtn.addEventListener("click", () => {
  document.body.classList.remove(...themes);
  themeIndex = (themeIndex + 1) % themes.length;
  if (themes[themeIndex]) {
    document.body.classList.add(themes[themeIndex]);
  }
  statusText.textContent = "// VÄRIPROFIILI VAIHDETTU";
});

// ===== PARTIKKELIT =====
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
const PARTICLE_COUNT = 80;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.5 + 0.1,
  });
}

function getPrimaryColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--primary").trim() || "#00ff41";
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const color = getPrimaryColor();

  particles.forEach((p, i) => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // Piirrä viivoja lähellä olevien partikkelien välille
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[j].x - p.x;
      const dy = particles[j].y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = (1 - dist / 100) * 0.15;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    // Piirrä piste
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}

drawParticles();