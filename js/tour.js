// ═══════════════════════════════════════════
//  Europa Historica — Guided Tour
// ═══════════════════════════════════════════

let _tourSteps = [];

async function _loadTourSteps() {
  const suffix = typeof getDataSuffix === 'function' ? getDataSuffix() : '';
  const url = suffix ? `data/tour${suffix}.json` : 'data/tour.json';
  try {
    const r = await fetch(url);
    _tourSteps = await r.json();
  } catch(e) {
    console.warn('tour.json not loaded, using empty steps:', e);
    _tourSteps = [];
  }
}

window.addEventListener('langchange', () => { _tourSteps = []; });

const _TT_W = 300;
const _PAD  = 10;
const _GAP  = 14;

let _tourIdx = 0;
let _tourHl  = null;
let _tourTt  = null;
let _tourAutoExpandedLegend = false;

// ── Public API ─────────────────────────────
async function startTour() {
  hideIntro();
  if (!_tourSteps.length) await _loadTourSteps();
  _tourIdx = 0;
  _tourBuild();
  setTimeout(() => _tourShow(_tourIdx), 300);
}

// ── DOM construction ───────────────────────
function _tourBuild() {
  _tourDestroy();

  _tourHl = document.createElement('div');
  _tourHl.id = 'tour-hl';
  document.body.appendChild(_tourHl);

  _tourTt = document.createElement('div');
  _tourTt.id = 'tour-tt';
  _tourTt.innerHTML =
    '<div class="tt-count" id="tr-count"></div>' +
    '<div class="tt-title" id="tr-title"></div>' +
    '<div class="tt-body"  id="tr-body"></div>'  +
    '<div class="tt-foot">'                       +
      '<button class="tt-skip" id="tr-skip" onclick="_tourSkip()">End Tour</button>' +
      '<button class="tt-next" id="tr-next">Next \u2192</button>' +
    '</div>';
  document.body.appendChild(_tourTt);
}

// ── Show step ──────────────────────────────
function _tourShow(i) {
  const step   = _tourSteps[i];
  if (!step) return;
  const isLast = !!step.finish;

  // Mobile-specific overrides — a step can declare alternative target,
  // position, and text for phones (e.g. legend points at #legend-btn
  // instead of the desktop-only floating #legend element; the steps for
  // navigation controls and tools differ entirely between layouts).
  const onMobile = typeof isMobile === 'function' && isMobile();
  if (onMobile) {
    if (step.target_mobile) step.target = step.target_mobile;
    if (step.pos_mobile)    step.pos    = step.pos_mobile;
    if (step.text_mobile)   step.text   = step.text_mobile;
    if (step.title_mobile)  step.title  = step.title_mobile;
  }

  // On mobile: open drawer for steps that target the controls bar.
  // #tl-wrap, #m-year (in the strip), #top-right-bar and #logo-menu-btn
  // are all reachable without expanding the drawer — exclude them.
  const STRIP_VISIBLE_TARGETS = new Set([
    '#legend', '#legend-btn', '#tl-wrap', '#top-right-bar',
    '#logo-menu-btn', '#logo-menu', '#m-year', '#year-input'
  ]);
  let drawerJustOpened = false;
  if (onMobile && step.target && !STRIP_VISIBLE_TARGETS.has(step.target)) {
    const ctrl = document.getElementById('controls');
    if (ctrl && !ctrl.classList.contains('m-open')) {
      ctrl.classList.add('m-open');
      const btn = document.getElementById('m-more');
      if (btn) { btn.textContent = '▼'; btn.classList.add('open'); }
      drawerJustOpened = true;
    }
  }
  // Auto-open burger menu when the tour points at it
  if (onMobile && (step.target === '#logo-menu-btn' || step.target === '#logo-menu')) {
    if (!document.body.classList.contains('logo-menu-open')) {
      document.body.classList.add('logo-menu-open');
    }
  }

  // Auto-expand desktop legend for the legend step
  if (step.target === '#legend') {
    const leg = document.getElementById('legend');
    if (leg && leg.classList.contains('collapsed')) {
      _tourAutoExpandedLegend = true;
      toggleLegend();
    }
  }
  // Auto-open mobile legend modal for the legend step
  if (step.target === '#legend-btn' && onMobile) {
    if (!document.body.classList.contains('legend-modal-open')) {
      document.body.classList.add('legend-modal-open');
    }
  }

  document.getElementById('tr-count').textContent =
    t('tour_step_of').replace('{n}', i + 1).replace('{total}', _tourSteps.length);
  document.getElementById('tr-title').textContent = step.title;

  // Final step with action-cards: render text + clickable cards.
  // Each card runs a named handler from _TOUR_ACTIONS, then ends the tour.
  const body = document.getElementById('tr-body');
  body.textContent = step.text;
  if (isLast && Array.isArray(step.actions) && step.actions.length) {
    const cards = document.createElement('div');
    cards.className = 'tt-cards';
    step.actions.forEach(a => {
      const card = document.createElement('button');
      card.className = 'tt-card';
      card.textContent = a.label;
      card.onclick = () => {
        _tourSkip();
        const fn = _TOUR_ACTIONS[a.action];
        if (typeof fn === 'function') {
          // Mobile: collapse drawer first, then run after small delay
          if (typeof isMobile === 'function' && isMobile()) {
            const ctrl = document.getElementById('controls');
            if (ctrl && ctrl.classList.contains('m-open')) {
              ctrl.classList.remove('m-open');
              const mb = document.getElementById('m-more'); if (mb) mb.classList.remove('open');
            }
            setTimeout(() => fn(...(a.args || [])), 320);
          } else {
            fn(...(a.args || []));
          }
        }
      };
      cards.appendChild(card);
    });
    body.appendChild(cards);
  }

  const skp = document.getElementById('tr-skip');
  if (isLast) {
    skp.style.display = 'none';   // last step uses cards instead
  } else {
    skp.style.display = '';
    skp.textContent = t('tour_end');
    skp.onclick = _tourSkip;
    skp.classList.remove('tt-equal');
  }

  const nxt = document.getElementById('tr-next');
  nxt.textContent = isLast ? t('tour_finish_explore') : t('tour_next');
  nxt.onclick     = isLast ? _tourSkip : _tourNext;

  const place = () => {
    _tourPlace(step);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      _tourHl.classList.add('tr-on');
      _tourTt.classList.add('tr-on');
    }));
  };

  // Wait for drawer animation (max-height transition: 300ms) before measuring rects
  if (drawerJustOpened) {
    setTimeout(place, 350);
  } else {
    place();
  }
}

// ── Positioning ────────────────────────────
function _tourPlace(step) {
  _tourTt.classList.remove('tr-on', 'tr-arr-down', 'tr-arr-left', 'tr-arr-up');

  if (!step.target) {
    _tourHl.style.boxShadow = 'none';
    _tourHl.style.width     = '0';
    _tourHl.style.height    = '0';
    _tourHl.style.left      = '0';
    _tourHl.style.top       = '0';

    _tourTt.style.left      = '50%';
    _tourTt.style.top       = '50%';
    _tourTt.style.transform = 'translate(-50%,-50%)';
    return;
  }

  const el = document.querySelector(step.target);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const vw   = window.innerWidth;

  const hlL = rect.left   - _PAD;
  const hlT = rect.top    - _PAD;
  const hlW = rect.width  + _PAD * 2;
  const hlH = rect.height + _PAD * 2;

  _tourHl.style.left      = hlL + 'px';
  _tourHl.style.top       = hlT + 'px';
  _tourHl.style.width     = hlW + 'px';
  _tourHl.style.height    = hlH + 'px';
  _tourHl.style.boxShadow = '0 0 0 9999px rgba(0,0,0,0.58)';

  if (step.pos === 'above') {
    let tx = hlL + hlW / 2 - _TT_W / 2;
    tx = Math.max(8, Math.min(vw - _TT_W - 8, tx));

    const arrowX = Math.max(16, Math.min(_TT_W - 24, (hlL + hlW / 2) - tx));
    _tourTt.style.setProperty('--arrow-x', arrowX + 'px');
    _tourTt.classList.add('tr-arr-down');
    _tourTt.style.left      = tx + 'px';
    _tourTt.style.top       = (hlT - _GAP) + 'px';
    _tourTt.style.transform = 'translateY(-100%)';

  } else if (step.pos === 'right') {
    let tx = hlL + hlW + _GAP;
    tx = Math.max(8, Math.min(vw - _TT_W - 8, tx));
    _tourTt.classList.add('tr-arr-left');
    _tourTt.style.left      = tx + 'px';
    _tourTt.style.top       = (hlT + hlH / 2) + 'px';
    _tourTt.style.transform = 'translateY(-50%)';
    // Clamp after transform renders so tooltip doesn't slip above viewport
    requestAnimationFrame(() => {
      if (!_tourTt) return;
      const ttRect = _tourTt.getBoundingClientRect();
      if (ttRect.top < 8) {
        _tourTt.style.top = (hlT + hlH / 2 + (8 - ttRect.top)) + 'px';
      }
    });

  } else if (step.pos === 'below') {
    let tx = hlL + hlW / 2 - _TT_W / 2;
    tx = Math.max(8, Math.min(vw - _TT_W - 8, tx));
    const arrowX = Math.max(16, Math.min(_TT_W - 24, (hlL + hlW / 2) - tx));
    _tourTt.style.setProperty('--arrow-x', arrowX + 'px');
    _tourTt.classList.add('tr-arr-up');
    _tourTt.style.left      = tx + 'px';
    _tourTt.style.top       = (hlT + hlH + _GAP) + 'px';
    _tourTt.style.transform = '';
  }
}

// ── Navigation ─────────────────────────────
function _tourNext() {
  // Collapse legend if the tour auto-expanded it for the legend step
  if (_tourAutoExpandedLegend) {
    _tourAutoExpandedLegend = false;
    const leg = document.getElementById('legend');
    if (leg && !leg.classList.contains('collapsed')) toggleLegend();
  }
  // Close mobile legend modal + logo-burger if the tour opened them
  document.body.classList.remove('legend-modal-open');
  document.body.classList.remove('logo-menu-open');
  _tourTt.classList.remove('tr-on');
  _tourHl.classList.remove('tr-on');
  _tourIdx++;
  if (_tourIdx >= _tourSteps.length) { _tourSkip(); return; }
  setTimeout(() => _tourShow(_tourIdx), 180);
}

function _tourSkip() {
  _tourDestroy();
}

function _tourDestroy() {
  if (_tourHl) { _tourHl.remove(); _tourHl = null; }
  if (_tourTt) { _tourTt.remove(); _tourTt = null; }
  // Close mobile legend modal + logo-burger if opened by the tour
  document.body.classList.remove('legend-modal-open');
  document.body.classList.remove('logo-menu-open');
  // Collapse legend if tour auto-expanded it
  if (_tourAutoExpandedLegend) {
    _tourAutoExpandedLegend = false;
    const leg = document.getElementById('legend');
    if (leg && !leg.classList.contains('collapsed')) toggleLegend();
  }
  // Close mobile drawer if it was opened by the tour
  if (typeof isMobile === 'function' && isMobile()) {
    const ctrl = document.getElementById('controls');
    if (ctrl) ctrl.classList.remove('m-open');
    const btn = document.getElementById('m-more');
    if (btn) { btn.textContent = '▲'; btn.classList.remove('open'); }
  }
}

// ── Final-step action cards ─────────────────
// Whitelist of allowed actions referenced from tour.json by name. Keeps
// the JSON declarative — no eval, no random globals.
const _TOUR_ACTIONS = {
  jumpToYear:    (y) => { if (typeof jumpToYear === 'function')    jumpToYear(y); },
  openTrailMenu: ()  => { if (typeof openTrailMenu === 'function') openTrailMenu(); },
  togglePleiades:()  => { if (typeof togglePleiades === 'function') togglePleiades(); },
  toggleEvents:  ()  => { if (typeof toggleEvents === 'function')   toggleEvents(); },
  // Composite: jump to a year where Pleiades data actually exists, then
  // turn the layer on. Most Pleiades settlements live -700 to ~640 AD.
  showAncientSettlements: () => {
    if (typeof jumpToYear === 'function') jumpToYear(100);
    if (typeof pleiadesMode !== 'undefined' && pleiadesMode === 0 &&
        typeof togglePleiades === 'function') {
      togglePleiades();
    }
  },
  // Composite: jump + show events at a known dense moment.
  showEventsAtJesusEra: () => {
    if (typeof jumpToYear === 'function') jumpToYear(33);
    if (typeof eventsMode !== 'undefined' && eventsMode === 0 &&
        typeof toggleEvents === 'function') {
      toggleEvents();
    }
  },
  noop: () => {},
};
