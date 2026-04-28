// ═══════════════════════════════════════════
//  Trails — Guided narrative journeys
//  data/trails.json  ·  Button: #trails-btn
// ═══════════════════════════════════════════

let _trailsData   = null;
let _activeTrail  = null;
let _activeStepIdx = 0;
let _trailActivatedEvents = false;

// ── Load ──────────────────────────────────
async function loadTrailsData() {
  if (_trailsData) return _trailsData;
  const suffix = typeof getDataSuffix === 'function' ? getDataSuffix() : '';
  const r = await fetch(`data/trails${suffix}.json`);
  _trailsData = await r.json();
  return _trailsData;
}

window.addEventListener('langchange', () => {
  _trailsData = null;
  const menu = document.getElementById('trail-menu');
  if (menu && menu.classList.contains('open')) {
    menu.classList.remove('open');
  }
});

// ── Menu (fly-up from button) ─────────────
async function openTrailMenu() {
  const menu = document.getElementById('trail-menu');
  const btn  = document.getElementById('trails-btn');
  if (!menu || !btn) return;

  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
    return;
  }

  // Capture rect BEFORE async fetch — DOM may change during await
  const rect0 = btn.getBoundingClientRect();

  const trails = await loadTrailsData();

  menu.innerHTML =
    `<div id="trail-menu-hint">${t('trail_choose')}</div>` +
    trails.map(tr => `
    <div class="trail-menu-item" onclick="startTrail('${tr.id}')">
      <div class="trail-menu-title">${tr.title}</div>
      <div class="trail-menu-sub">${tr.subtitle || ''} &middot; ${tr.steps.length} ${t('trail_steps')}</div>
    </div>`).join('');

  // Re-measure after fetch; fall back to pre-fetch rect if button hidden (zero size)
  let rect = btn.getBoundingClientRect();
  if (rect.width === 0) rect = rect0;
  const mobile = typeof isMobile === 'function' && isMobile();
  const vh = (window.visualViewport ? window.visualViewport.height : window.innerHeight);
  const menuH = trails.length * 56 + 8; // approximate height
  const spaceAbove = rect.top;
  const spaceBelow = vh - rect.bottom;
  if (mobile || spaceAbove > spaceBelow) {
    menu.style.bottom = (vh - rect.top + 4) + 'px';
    menu.style.top    = '';
  } else {
    menu.style.top    = (rect.bottom + 4) + 'px';
    menu.style.bottom = '';
  }
  menu.style.left = Math.max(4, rect.left + rect.width / 2 - 110) + 'px';
  menu.classList.add('open');

  // Close on outside click
  setTimeout(() => {
    function _closeMenu(e) {
      if (!menu.contains(e.target) && e.target !== btn) {
        menu.classList.remove('open');
      }
      document.removeEventListener('click', _closeMenu);
    }
    document.addEventListener('click', _closeMenu);
  }, 0);
}

// ── Start ─────────────────────────────────
async function startTrail(id) {
  document.getElementById('trail-menu').classList.remove('open');
  const trails = await loadTrailsData();
  _activeTrail   = trails.find(tr => tr.id === id);
  if (!_activeTrail) return;
  _activeStepIdx = 0;
  document.getElementById('trails-btn').classList.add('on');
  // Activate events layer (windowed mode) so event markers appear alongside steps
  if (typeof eventsMode !== 'undefined' && eventsMode === 0 && typeof toggleEvents === 'function') {
    toggleEvents();
    _trailActivatedEvents = true;
  }
  goToTrailStep(0);
}

// ── End ───────────────────────────────────
function endTrail() {
  _activeTrail   = null;
  _activeStepIdx = 0;
  const panel = document.getElementById('trail-panel');
  if (panel) panel.style.display = 'none';
  const btn = document.getElementById('trails-btn');
  if (btn) { btn.classList.remove('on'); btn.blur(); }
  // Turn events off again if trail auto-activated them (direct sync reset avoids async race)
  if (_trailActivatedEvents) {
    _trailActivatedEvents = false;
    if (typeof eventsMode !== 'undefined') {
      eventsMode = 0;
      const evBtn = document.getElementById('events-btn');
      if (evBtn) { evBtn.classList.remove('on', 'on-all'); evBtn.title = 'Historical events — off'; }
      const legEntry = document.getElementById('leg-events');
      if (legEntry) legEntry.style.display = 'none';
      d3.select('#g-events').selectAll('*').remove();
    }
  }
}

// ── Navigation ────────────────────────────
function nextTrailStep() {
  if (!_activeTrail) return;
  if (_activeStepIdx < _activeTrail.steps.length - 1) {
    goToTrailStep(_activeStepIdx + 1);
  } else {
    endTrail();
  }
}

function prevTrailStep() {
  if (!_activeTrail || _activeStepIdx === 0) return;
  goToTrailStep(_activeStepIdx - 1);
}

// ── Main step logic ───────────────────────
function goToTrailStep(idx) {
  if (!_activeTrail) return;
  _activeStepIdx = idx;
  const step  = _activeTrail.steps[idx];
  const total = _activeTrail.steps.length;

  // Snap all open territory panels so they don't pile up
  document.querySelectorAll('.terr-panel').forEach(p => {
    if (!p.classList.contains('snapped')) snapPanel(p.id);
  });

  // Jump timeline
  if (step.year != null) {
    if (typeof currentRange !== 'undefined' && typeof TIME_RANGES !== 'undefined') {
      if (step.year < currentRange.from || step.year > currentRange.to) {
        currentRange = TIME_RANGES.all;
        document.querySelectorAll('.era-sel-btn').forEach(b => b.classList.remove('active'));
        if (typeof buildEpochMarkers === 'function') buildEpochMarkers();
      }
    }
    state.pct = yearToGlobalPct(step.year);
    updateUI(state.pct);
    const epochIdx = typeof getEpochIdxForPct === 'function' ? getEpochIdxForPct(state.pct) : null;
    if (epochIdx !== null && typeof renderEpoch === 'function') renderEpoch(epochIdx);
  }

  // Pan map to step location
  if (step.lon != null && step.lat != null) {
    _trailPanTo(step.lon, step.lat);
  }

  // Open territory/event panel — desktop only; mobile uses Related tap links
  if (!isMobile()) {
    if (step.subjecto) {
      setTimeout(() => _trailOpenTerritory(step), 80);
    } else if (step.wiki) {
      setTimeout(() => _trailOpenEvent(step), 80);
    }
  }

  // Render trail panel UI
  _renderTrailPanel(step, idx, total);
}

// ── Pan map to lon/lat ────────────────────
function _trailPanTo(lon, lat) {
  try {
    if (typeof proj !== 'function') return;
    const pt = proj([lon, lat]);
    if (!pt || isNaN(pt[0])) return;
    const svgEl = document.querySelector('#map-svg') || document.querySelector('svg');
    if (!svgEl || typeof zoom === 'undefined') return;
    const w = svgEl.clientWidth, h = svgEl.clientHeight;
    const k = typeof currentZoomK !== 'undefined' ? currentZoomK : 1;
    const mobile = typeof isMobile === 'function' && isMobile();
    const centerY = mobile ? h * 0.28 : h / 2;
    const t = d3.zoomIdentity.translate(w / 2 - pt[0] * k, centerY - pt[1] * k).scale(k);
    d3.select(svgEl).transition().duration(700).call(zoom.transform, t);
  } catch(e) {}
}

// ── Open territory panel for step ─────────
function _trailOpenTerritory(step) {
  // Prefer NAME match (avoids client-state polygons that share SUBJECTO but have a different NAME)
  let el = d3.select('#g-terr').selectAll('.territory').filter(function() {
    const d = d3.select(this).datum();
    return d && d.properties && d.properties.NAME === step.subjecto;
  }).node();
  // Fall back to SUBJECTO match
  if (!el) {
    el = d3.select('#g-terr').selectAll('.territory').filter(function() {
      const d = d3.select(this).datum();
      return d && d.properties && d.properties.SUBJECTO === step.subjecto;
    }).node();
  }

  if (!el) return;

  const props = d3.select(el).datum().properties;
  const color = el.getAttribute('fill') || '#c8b882';
  const fakeEv = {
    clientX: _safePanelX(Math.min(window.innerWidth * 0.72, window.innerWidth - 320)),
    clientY: 90
  };

  if (typeof isMobile === 'function' && isMobile()) {
    if (typeof _mSheetOpenTerritory === 'function') _mSheetOpenTerritory(fakeEv, props, color);
  } else {
    createTerritoryPanel(fakeEv, props, color);
  }
}

// ── Open event float panel for step ───────
function _trailOpenEvent(step) {
  if (typeof loadEventsData !== 'function') return;
  loadEventsData().then(evts => {
    if (!evts) return;
    const ev = evts.find(e => e.wiki === step.wiki || e.title === step.title);
    if (!ev) return;
    const fakeEv = {
      clientX: _safePanelX(Math.min(window.innerWidth * 0.72, window.innerWidth - 320)),
      clientY: 90
    };
    if (typeof createEventPanel === 'function') createEventPanel(fakeEv, ev);
  }).catch(() => {});
}

// ── Render trail panel ────────────────────
function _renderTrailPanel(step, idx, total) {
  const panel = document.getElementById('trail-panel');
  if (!panel) return;

  document.getElementById('trail-panel-name').textContent    = _activeTrail.title;
  document.getElementById('trail-panel-counter').textContent = (idx + 1) + ' / ' + total;
  document.getElementById('trail-step-title').textContent    = step.title;
  document.getElementById('trail-step-desc').textContent     = step.description || '';
  const bodyEl = document.getElementById('trail-panel-body');
  if (bodyEl) bodyEl.scrollTop = 0;

  // Prev button
  const prevBtn = document.getElementById('trail-btn-prev');
  prevBtn.disabled = (idx === 0);

  // Next button
  const nextBtn = document.getElementById('trail-btn-next');
  const isLast  = idx === total - 1;
  nextBtn.textContent = isLast ? t('trail_finish') : t('trail_next');
  nextBtn.classList.toggle('trail-btn-finish', isLast);

  // Wikipedia link(s)
  const wikiBtn = document.getElementById('trail-wiki-btn');
  if (step.wiki) {
    wikiBtn.style.display = 'flex';
    wikiBtn.querySelector('span').textContent = (step.wiki_label || 'Wikipedia') + ' →';
    wikiBtn.onclick = () => window.open('https://en.wikipedia.org/wiki/' + encodeURIComponent(step.wiki), '_blank');
  } else {
    wikiBtn.style.display = 'none';
  }
  const wiki2Btn = document.getElementById('trail-wiki2-btn');
  if (step.wiki2) {
    wiki2Btn.style.display = 'flex';
    wiki2Btn.querySelector('span').textContent = (step.wiki2_label || 'Wikipedia') + ' →';
    wiki2Btn.onclick = () => window.open('https://en.wikipedia.org/wiki/' + encodeURIComponent(step.wiki2), '_blank');
  } else {
    wiki2Btn.style.display = 'none';
  }
  // Note: trail step `wiki_label` is part of the localized trails JSON
  // (trails_de.json provides German labels). Default fallback "Wikipedia"
  // remains untranslated since it's the brand name.

  // Progress dots
  const dots = document.getElementById('trail-progress');
  if (dots) {
    dots.innerHTML = _activeTrail.steps.map((_, i) =>
      `<span class="trail-dot${i === idx ? ' active' : i < idx ? ' done' : ''}"></span>`
    ).join('');
  }

  // Related tap links (mobile only) — territory only; events shown as map markers
  const mobile  = typeof isMobile === 'function' && isMobile();
  const relDiv  = document.getElementById('trail-related');
  const relTerr = document.getElementById('trail-rel-terr');
  const relEv   = document.getElementById('trail-rel-ev');
  if (relDiv) {
    if (mobile) {
      const hasTerr = !!step.subjecto;
      relDiv.style.display = hasTerr ? '' : 'none';
      if (relTerr) {
        relTerr.style.display = hasTerr ? '' : 'none';
        if (hasTerr) { relTerr.textContent = '▣ ' + step.subjecto; relTerr.onclick = () => _trailOpenTerritory(step); }
      }
      if (relEv) relEv.style.display = 'none';
    } else {
      relDiv.style.display = 'none';
    }
  }

  // Local thumbnail image
  const img = document.getElementById('trail-panel-img');
  img.style.display = 'none'; img.src = '';

  panel.style.display = 'flex';

  if (step.image) {
    img.src = step.image;
    img.style.display = 'block';
  }
}
