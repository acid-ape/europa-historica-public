// ═══════════════════════════════════════════
//  Europa Historica — Guided Tour
// ═══════════════════════════════════════════

const _TOUR_STEPS = [
  {
    target: null,
    pos: 'center',
    title: 'Europa Historica',
    text: 'This interactive map shows how the world looked at different points in history — from 8000 BC to 2010 AD. Click any territory to explore its rulers and history.',
  },
  {
    target: '#tl-wrap',
    pos: 'above',
    title: 'The Timeline',
    text: 'Drag the slider or click anywhere on the track to travel through history. The year updates in real time as you move.',
  },
  {
    target: '#era-select-row',
    pos: 'above',
    title: 'Time Periods',
    text: 'Quickly jump to a specific era — Prehistory, Antiquity, Middle Ages, and more. Tap again to deselect and return to the full timeline.',
  },
  {
    target: '.btn-group-left',
    pos: 'above',
    title: 'Navigation Controls',
    text: 'Jump directly to any year using the input field, or step forward and backward through time with the ± buttons.',
  },
  {
    target: '.btn-group-center',
    pos: 'above',
    title: 'Info & Search',
    text: 'Here you can access the main tools:\n◉  starts this guided tour\n(i)  reopens the info panel\n☰  lists and browses all territories\n⌕  searches rulers, places, and events',
  },
  {
    target: '#play-btns',
    pos: 'above',
    title: 'Playback',
    text: 'Use ▶ to animate history forward, or ◀ and ◀◀ to travel backwards through time. Adjust the pace with the speed buttons — from ½× to 3×.',
  },
  {
    target: '#pleiades-btn',
    pos: 'above',
    title: 'Ancient Settlements',
    text: 'Click once to show ancient settlements near the current year. Click again to show all settlements up to this point in time.',
  },
  {
    target: '#events-btn',
    pos: 'above',
    title: 'Historical Events',
    text: 'Click once to show events in a 150-year window. Click again to show all events up to the current year. Click a ✦ marker on the map for details.',
  },
  {
    target: '#trails-btn',
    pos: 'above',
    title: 'Historical Trails',
    text: 'Follow the path of history with guided trails. Each trail takes you through key moments in chronological order — with context, images, and links that connect the dots between events.',
  },
  {
    target: '#legend',
    pos: 'right',
    title: 'Legend',
    text: 'Each territory is colored by its cultural group — Germanic, Roman, Ottoman, and more. Here you can see which groups are active in the current epoch and what the different border styles mean.',
  },
  {
    target: null,
    pos: 'center',
    title: "You're all set!",
    text: 'The map is yours to explore. Click any territory to discover its rulers and history.',
    finish: true,
  },
];

const _TT_W = 300;
const _PAD  = 10;
const _GAP  = 14;

let _tourIdx = 0;
let _tourHl  = null;
let _tourTt  = null;
let _tourAutoExpandedLegend = false;

// ── Public API ─────────────────────────────
function startTour() {
  hideIntro();
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
  const step   = _TOUR_STEPS[i];
  const isLast = !!step.finish;

  // On mobile: open drawer for steps that target the controls bar
  // #tl-wrap is visible in the collapsed strip — exclude from drawer-open
  let drawerJustOpened = false;
  if (typeof isMobile === 'function' && isMobile() && step.target &&
      step.target !== '#legend' && step.target !== '#tl-wrap') {
    const ctrl = document.getElementById('controls');
    if (ctrl && !ctrl.classList.contains('m-open')) {
      ctrl.classList.add('m-open');
      const btn = document.getElementById('m-more');
      if (btn) { btn.textContent = '▼'; btn.classList.add('open'); }
      drawerJustOpened = true;
    }
  }

  // Auto-expand legend for the legend step
  if (step.target === '#legend') {
    const leg = document.getElementById('legend');
    if (leg && leg.classList.contains('collapsed')) {
      _tourAutoExpandedLegend = true;
      toggleLegend();
    }
  }

  document.getElementById('tr-count').textContent = 'Step ' + (i + 1) + ' of ' + _TOUR_STEPS.length;
  document.getElementById('tr-title').textContent = step.title;
  document.getElementById('tr-body').textContent  = step.text;

  const skp = document.getElementById('tr-skip');
  if (isLast) {
    skp.textContent = '\u2190 Take a Trail';
    skp.onclick = () => {
      _tourSkip();
      if (typeof isMobile === 'function' && isMobile()) {
        const ctrl = document.getElementById('controls');
        if (ctrl) { ctrl.classList.add('m-open'); const mb = document.getElementById('m-more'); if (mb) mb.classList.add('open'); }
        setTimeout(openTrailMenu, 360);
      } else {
        openTrailMenu();
      }
    };
    skp.classList.add('tt-equal');
  } else {
    skp.textContent = 'End Tour';
    skp.onclick = _tourSkip;
    skp.classList.remove('tt-equal');
  }

  const nxt = document.getElementById('tr-next');
  nxt.textContent = isLast ? 'Explore the map \u2192' : 'Next \u2192';
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
  _tourTt.classList.remove('tr-on', 'tr-arr-down', 'tr-arr-left');

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
  _tourTt.classList.remove('tr-on');
  _tourHl.classList.remove('tr-on');
  _tourIdx++;
  if (_tourIdx >= _TOUR_STEPS.length) { _tourSkip(); return; }
  setTimeout(() => _tourShow(_tourIdx), 180);
}

function _tourSkip() {
  _tourDestroy();
}

function _tourDestroy() {
  if (_tourHl) { _tourHl.remove(); _tourHl = null; }
  if (_tourTt) { _tourTt.remove(); _tourTt = null; }
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
