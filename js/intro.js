// ═══════════════════════════════════════════
//  Europa Historica — Intro / Info System
//  Auto-shows on first visit (after 2.5s delay)
//  Reopenable via (i) button
// ═══════════════════════════════════════════

const INTRO_KEY = 'eh_intro_seen';

function _introEl() { return document.getElementById('intro-overlay'); }

function showIntro() {
  const el = _introEl();
  if (!el) return;
  el.style.display = 'flex';
  // Force reflow so transition fires
  el.offsetHeight;
  el.classList.add('visible');
}

function hideIntro() {
  const el = _introEl();
  if (!el) return;
  el.classList.remove('visible');
  el.addEventListener('transitionend', () => { el.style.display = 'none'; }, { once: true });
  localStorage.setItem(INTRO_KEY, '1');
}

function hideIntroThenTrail() {
  hideIntro();
  setTimeout(openTrailMenu, 320);
}

// Opens without touching localStorage (reopen via (i) button)
function openIntro() {
  showIntro();
}

function toggleMoreAbout() {
  const content  = document.getElementById('intro-more-content');
  const toggle   = document.getElementById('intro-more-toggle');
  const otherC   = document.getElementById('intro-updates-content');
  const otherT   = document.getElementById('intro-updates-toggle');
  if (!content || !toggle) return;
  const open = content.classList.toggle('open');
  toggle.textContent = open ? 'About this project ↑' : 'About this project ↓';
  toggle.classList.toggle('open', open);
  if (open && otherC) {
    otherC.classList.remove('open');
    otherT.textContent = 'Updates ↓';
    otherT.classList.remove('open');
  }
}

function toggleUpdates() {
  const content  = document.getElementById('intro-updates-content');
  const toggle   = document.getElementById('intro-updates-toggle');
  const otherC   = document.getElementById('intro-more-content');
  const otherT   = document.getElementById('intro-more-toggle');
  if (!content || !toggle) return;
  const open = content.classList.toggle('open');
  toggle.textContent = open ? 'Updates ↑' : 'Updates ↓';
  toggle.classList.toggle('open', open);
  if (open && otherC) {
    otherC.classList.remove('open');
    otherT.textContent = 'About this project ↓';
    otherT.classList.remove('open');
  }
}

// ── Init ──────────────────────────────────
window.addEventListener('load', () => {
  if (!localStorage.getItem(INTRO_KEY)) {
    setTimeout(showIntro, 2500);
  }
});
