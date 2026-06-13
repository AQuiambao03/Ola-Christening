/* ============================================================
   Ola-scripts.js
   All interactive behaviour for Ola's Godparent Invitation
   ============================================================ */

const API_URL = CONFIG.API_URL;

/* ============== Loading screen ============== */
const loadingScreen = document.getElementById('loadingScreen');

const savedGodparentName = localStorage.getItem('godparentName');
const savedGodparentAccepted = localStorage.getItem('hasAcceptedInvite') === 'true';

if (savedGodparentAccepted && savedGodparentName) {
  document.getElementById('loadEyebrow').innerHTML =
    `Welcome back, Ninong / Ninang ${savedGodparentName} <i class="fa-solid fa-hand fa-rotate-by" style="--fa-rotate-angle: 45deg;"></i>`;
  document.getElementById('loadHeading').textContent =
    "Thank you for saying yes! We can't wait to celebrate with you.";
  document.getElementById('loadingCta').textContent = 'View Invitation';

  document.getElementById('heroEyebrow').innerHTML =
    `Welcome back, Ninong / Ninang ${savedGodparentName} <i class="fa-solid fa-hand fa-rotate-by" style="--fa-rotate-angle: 45deg;"></i>`;
  document.getElementById('heroHeading').textContent =
    "Thank you for being part of my special day.";
  document.getElementById('heroLead').textContent =
    "Scroll down to revisit the details, the countdown, and the blessing wall.";
}

function dismissLoader() {
  loadingScreen.classList.add('hide');
  document.body.style.overflow = '';
  document.getElementById('meet').scrollIntoView({ behavior: 'smooth' });
}

document.body.style.overflow = 'hidden';
document.getElementById('loadingCta').addEventListener('click', dismissLoader);

/* ============== Ambient background elements ============== */
(function () {
  const ambient = document.getElementById('ambient');

  // Clouds
  for (let i = 0; i < 4; i++) {
    const c = document.createElement('div');
    c.className = 'cloud float-slow';
    c.style.top              = (10 + i * 22) + '%';
    c.style.left             = (-10 + i * 5) + '%';
    c.style.animationDuration = (8 + i * 1.5) + 's';
    c.style.animationDelay   = (i * 1.2) + 's';
    ambient.appendChild(c);
  }

  // Stars
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('div');
    s.className   = 'ambient-star float-med';
    s.textContent = '🌸';
    s.style.top              = (Math.random() * 100) + '%';
    s.style.left             = (Math.random() * 100) + '%';
    s.style.animationDuration = (4 + Math.random() * 4) + 's';
    s.style.animationDelay   = (Math.random() * 3) + 's';
    s.style.fontSize         = (0.7 + Math.random()) + 'rem';
    ambient.appendChild(s);
  }
})();

/* ============== Scroll reveal ============== */
document.addEventListener("DOMContentLoaded", () => {

  const revealEls = document.querySelectorAll('.reveal, .reveal-zoom');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target); // optional: animate once only
      }
    });
  }, {
    threshold: 0.18
  });

  revealEls.forEach(el => revealObserver.observe(el));
});

/* Timeline progress line */
const timelineRow = document.getElementById('timeline');
const tlObserver  = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) timelineRow.style.setProperty('--line-progress', 1);
  });
}, { threshold: 0.3 });
tlObserver.observe(timelineRow);

/* ============== Nav dots ============== */
const sections = ['hero','meet','journey','gallery','letter','question','details','countdown','wall','final'];
const navDots   = document.querySelectorAll('#navDots button');

navDots.forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.target).scrollIntoView({ behavior: 'smooth' });
  });
});

document.getElementById('openInvite').addEventListener('click', () => {
  document.getElementById('meet').scrollIntoView({ behavior: 'smooth' });
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = sections.indexOf(entry.target.id);
      navDots.forEach(d => d.classList.remove('active'));
      if (navDots[idx]) navDots[idx].classList.add('active');
    }
  });
}, { threshold: 0.5 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) navObserver.observe(el);
});

const galleryItems = Array.from(document.querySelectorAll(".g-item"));
const lightbox = document.getElementById("lightbox");
const lightboxInner = document.getElementById("lightboxInner");

let currentIndex = 0;

/* ===== Get image safely ===== */
function getImage(item) {
  return item.dataset.img || item.querySelector("img")?.src;
}

/* ===== Render image ===== */
function render(index) {
  const item = galleryItems[index];
  const src = getImage(item);

  lightboxInner.innerHTML = `<img src="${src}" alt="Photo">`;
}

/* ===== Open ===== */
function openLightbox(index) {
  currentIndex = index;
  render(currentIndex);
  lightbox.classList.add("open");
}

/* ===== Close ===== */
function closeLightbox() {
  lightbox.classList.remove("open");
}

/* ===== Navigation ===== */
function next() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  render(currentIndex);
}

function prev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  render(currentIndex);
}

/* ===== Events ===== */
galleryItems.forEach((item, i) => {
  item.addEventListener("click", () => openLightbox(i));
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openLightbox(i);
  });
});

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbNext").addEventListener("click", (e) => {
  e.stopPropagation();
  next();
});

document.getElementById("lbPrev").addEventListener("click", (e) => {
  e.stopPropagation();
  prev();
});

/* click outside closes */
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* keyboard */
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});

/* swipe */
let startX = 0;

lightbox.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) {
    dx > 0 ? prev() : next();
  }
});

/* ============== Acceptance flow ============== */
const acceptOverlay = document.getElementById('acceptOverlay');
const acceptBtn     = document.getElementById('acceptBtn');
const finalCta      = document.getElementById('finalCta');
const laterBtn      = document.getElementById('laterBtn');
const acceptForm    = document.getElementById('acceptForm');
const acceptStep1   = document.getElementById('acceptStep1');
const successState  = document.getElementById('successState');
let hasAccepted     = savedGodparentAccepted;

function openAccept() {
  if (hasAccepted) {
    // Already accepted previously - show success state directly
    acceptStep1.style.display = 'none';
    successState.classList.add('show');
  } else {
    acceptStep1.style.display = '';
    successState.classList.remove('show');
  }
  acceptOverlay.classList.add('open');
  fireConfetti();
}
function closeAccept() { acceptOverlay.classList.remove('open'); }

acceptBtn.addEventListener('click', openAccept);

if (hasAccepted) {
  finalCta.textContent = 'Send My Blessings';
}


finalCta.addEventListener('click', () => {
  if (hasAccepted) {
    document.getElementById('wall').scrollIntoView({ behavior: 'smooth' });
  } else {
    document.getElementById('question').scrollIntoView({ behavior: 'smooth' });
  }
});

laterBtn.addEventListener('click', () => {
  laterBtn.textContent = 'Take your time, no rush';
  setTimeout(() => { laterBtn.textContent = 'I Need More Time'; }, 2600);
});

document.getElementById('closeOverlay').addEventListener('click', closeAccept);
acceptOverlay.addEventListener('click', (e) => { if (e.target === acceptOverlay) closeAccept(); });

acceptForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('msg').value.trim()
  };

  try {
    const response = await fetch(`${API_URL}/acceptances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit acceptance');
    }

    console.log('Acceptance saved:', result.data);

    localStorage.setItem(
      'godparentName',
      data.fullName
    );
    localStorage.setItem('hasAcceptedInvite', 'true');

    acceptStep1.style.display = 'none';
    successState.classList.add('show');

    hasAccepted = true;
    finalCta.textContent = 'Send My Blessings';

  } catch (err) {
    console.error(err);

    alert(
      'Unable to submit your acceptance. Please try again.'
    );
  }
});

document.getElementById('successClose').addEventListener('click', () => {
  closeAccept();
  document.getElementById('details').scrollIntoView({ behavior: 'smooth' });
});

/* ============== Confetti ============== */
const canvas = document.getElementById('confetti-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function fireConfetti() {
  const colors = ['#8FA888','#E8C9C2','#C9A45C','#FAF4EC','#6E8868'];
  const pieces = [];

  for (let i = 0; i < 140; i++) {
    pieces.push({
      x:     Math.random() * canvas.width,
      y:     -20 - Math.random() * canvas.height * 0.3,
      r:     4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx:    -1 + Math.random() * 2,
      vy:    2  + Math.random() * 3,
      rot:   Math.random() * 360,
      vrot:  -6 + Math.random() * 12,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    });
  }

  let frame = 0;
  function tick() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    if (frame < 150) { requestAnimationFrame(tick); }
    else             { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  tick();
}

/* ============== Add to Calendar ============== */
document.getElementById('calBtn').addEventListener('click', () => {
  const start    = '20260919T103000';
  const end      = '20260919T150000';
  const text     = encodeURIComponent("Ola's Christening");
  const details  = encodeURIComponent('Christening at Parroquia del Espiritu Santo - San Luis, Tarlac City, reception to follow at Balai Alfresco, Blk 4, Magsaysay Subdivision, San Vicente, Tarlac City.');
  const location = encodeURIComponent('Parroquia del Espiritu Santo - San Luis, Tarlac');
  window.open(
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`,
    '_blank'
  );
});

/* ============== Countdown ============== */
const targetDate = new Date('2026-09-19T10:30:00');

function updateCountdown() {
  let diff = targetDate - new Date();
  if (diff < 0) diff = 0;
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins  = Math.floor((diff / (1000 * 60)) % 60);
  const secs  = Math.floor((diff / 1000) % 60);
  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ============== Blessing Wall ============== */

const wallBoard = document.getElementById('wall-board');
const blessingForm = document.getElementById('blessingForm');

/* Create blessing card */
function addBlessing(blessing) {
  const card = document.createElement('div');

  card.className = 'polaroid';

  const rot = (Math.random() * 16 - 8).toFixed(1);

  card.style.setProperty('--rot', `${rot}deg`);

  card.innerHTML = `
    <div class="polaroid-pin"></div>
    <div class="polaroid-img">${blessing.icon || '🌿'}</div>
    <div class="polaroid-name">${blessing.name}</div>
    <div class="polaroid-msg">${blessing.message}</div>
  `;

  wallBoard.appendChild(card);
}

/* Load blessings from MongoDB */
async function loadBlessings() {
  try {
    const response = await fetch(`${API_URL}/blessings`);

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    wallBoard.innerHTML = '';

    result.data.forEach(addBlessing);

  } catch (err) {
    console.error('Failed to load blessings:', err);

    wallBoard.innerHTML = `
      <div class="text-center p-4">
        Unable to load blessings right now.
      </div>
    `;
  }
}

/* Submit blessing */
blessingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name =
    document.getElementById('blessName').value.trim() ||
    localStorage.getItem('godparentName');

  const message =
    document.getElementById('blessMsg').value.trim();

  if (!name || !message) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/blessings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        message
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to save blessing');
    }

    addBlessing(result.data);

    blessingForm.reset();

    wallBoard.lastElementChild.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

  } catch (err) {
    console.error(err);

    alert(
      'Unable to save your blessing. Please try again.'
    );
  }
});

/* Initial load */
document.addEventListener('DOMContentLoaded', () => {
  loadBlessings();
});