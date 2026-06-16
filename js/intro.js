// ═══════════════════════════════════════════
//  Europa Historica — Intro / Info System
//  Auto-shows on first visit (after 2.5s delay)
//  Reopenable via (i) button
// ═══════════════════════════════════════════

const INTRO_KEY = 'eh_intro_seen';

// ── Intro content (loaded from intro.json) ──
let _introDataCache = {};

async function _loadIntroData() {
  const lang = typeof getLang === 'function' ? getLang() : 'en';
  if (_introDataCache[lang]) return _introDataCache[lang];
  const suffix = typeof getDataSuffix === 'function' ? getDataSuffix() : '';
  const url = suffix ? `data/intro${suffix}.json` : 'data/intro.json';
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    _introDataCache[lang] = await r.json();
  } catch(e) {
    // Fallback to EN
    if (lang !== 'en' && _introDataCache['en']) {
      _introDataCache[lang] = _introDataCache['en'];
    } else {
      _introDataCache[lang] = null;
    }
  }
  return _introDataCache[lang];
}

async function renderIntroBody() {
  const data = await _loadIntroData();
  if (!data) return;

  const bodyEl = document.getElementById('intro-body');
  if (bodyEl) {
    const creditsHtml = data.credits.map(c =>
      `<li><a href="${c.url}" target="_blank">${c.text}</a></li>`
    ).join('');
    bodyEl.innerHTML =
      data.body.map(p => `<p>${p}</p>`).join('') +
      `<ul>${creditsHtml}</ul>` +
      data.body2.map(p => `<p>${p}</p>`).join('');
  }

  const moreInner = document.getElementById('intro-more-inner');
  if (moreInner && data.about) {
    const a = data.about;
    moreInner.innerHTML =
      `<h2>${a.title}</h2>` +
      a.paragraphs.map(p => `<p>${p}</p>`).join('') +
      `<ul>${a.list.map(li => `<li>${li}</li>`).join('')}</ul>` +
      a.paragraphs2.map(p => `<p>${p}</p>`).join('');
  }

  const updInner = document.getElementById('intro-updates-inner');
  if (updInner && data.updates) {
    const u = data.updates;
    updInner.innerHTML =
      `<h2>${u.title}</h2>` +
      `<p><strong>${u.date}</strong></p>` +
      `<p>${u.intro}</p>` +
      `<p>${u.recently_label}</p>` +
      `<ul>${u.recently.map(li => `<li>${li}</li>`).join('')}</ul>` +
      `<p>${u.coming_label}</p>` +
      `<ul>${u.coming.map(li => `<li>${li}</li>`).join('')}</ul>` +
      `<p>${u.feedback}</p>`;
  }
}

function _introEl() { return document.getElementById('intro-overlay'); }

function showIntro() {
  const el = _introEl();
  if (!el) return;
  el.style.display = 'flex';
  el.offsetHeight;
  el.classList.add('visible');
  renderIntroBody();
}

function hideIntro() {
  const el = _introEl();
  if (!el) return;
  el.classList.remove('visible');
  el.addEventListener('transitionend', () => { el.style.display = 'none'; }, { once: true });
  localStorage.setItem(INTRO_KEY, '1');
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
  toggle.textContent = open ? t('intro_more') + ' ↑' : t('intro_more') + ' ↓';
  toggle.classList.toggle('open', open);
  if (open && otherC) {
    otherC.classList.remove('open');
    otherT.textContent = t('intro_updates') + ' ↓';
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
  toggle.textContent = open ? t('intro_updates') + ' ↑' : t('intro_updates') + ' ↓';
  toggle.classList.toggle('open', open);
  if (open && otherC) {
    otherC.classList.remove('open');
    otherT.textContent = t('intro_more') + ' ↓';
    otherT.classList.remove('open');
  }
}

// ── Init ──────────────────────────────────
window.addEventListener('load', () => {
  if (!localStorage.getItem(INTRO_KEY)) {
    setTimeout(showIntro, 2500);
  }
});
