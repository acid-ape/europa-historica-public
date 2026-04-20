function updateLegend(geo) {
  const seen = new Set();
  geo.features.forEach(f => {
    const g = getCulture(f.properties);
    seen.add(g);
  });
  const container = document.getElementById('leg-items');
  container.innerHTML = '<h4 style="margin:0 0 0.4em;">Cultures</h4>';
  // Show in defined order
  for (const [key, group] of Object.entries(CULTURE_GROUPS)) {
    if (!seen.has(key)) continue;
    const div = document.createElement('div');
    div.className = 'leg-item';
    div.innerHTML = `<div class="leg-sw" style="background:${group.color}"></div>${group.label}`;
    container.appendChild(div);
  }
}

// ═══════════════════════════════════════════
//  TIMELINE & PLAYBACK
// ═══════════════════════════════════════════
function pctToYear(pct) {
  // Interpolate directly from EPOCHS array — single source of truth
  if (pct <= EPOCHS[0].pct) return EPOCHS[0].year;
  if (pct >= EPOCHS[EPOCHS.length-1].pct) return EPOCHS[EPOCHS.length-1].year;
  for (let i = 0; i < EPOCHS.length - 1; i++) {
    const a = EPOCHS[i], b = EPOCHS[i+1];
    if (pct >= a.pct && pct <= b.pct) {
      const t = (pct - a.pct) / (b.pct - a.pct);
      return Math.round(a.year + t * (b.year - a.year));
    }
  }
  return EPOCHS[EPOCHS.length-1].year;
}
function yearLabel(y) {
  const abs = Math.abs(y);
  const formatted = abs >= 1000
    ? Math.floor(abs/1000) + ',' + String(abs % 1000).padStart(3,'0')
    : String(abs);
  if (y < 0) return formatted + ' BC';
  if (y === 0) return '0';
  return formatted + ' AD';
}
function getEpochForPct(pct) {
  let e = EPOCHS[0];
  for (const ep of EPOCHS) { if (pct >= ep.pct) e = ep; }
  return e;
}
function getEpochIdxForPct(pct) {
  let idx = 0;
  for (let i=0;i<EPOCHS.length;i++) { if (pct >= EPOCHS[i].pct) idx = i; }
  return idx;
}

function updateUI(pct) {
  const y = pctToYear(pct);
  const yd = document.getElementById('year-display'); if (yd) yd.textContent = yearLabel(y);
  const ed = document.getElementById('era-display');  if (ed) ed.textContent = getEpochForPct(pct).era;
  // Slider und Thumb in Range-relativer Position anzeigen
  const displayPct = globalToRangePct(pct);
  document.getElementById('tl-input').value = displayPct;
  document.getElementById('tl-fill').style.width  = displayPct + '%';
  document.getElementById('tl-thumb').style.left  = displayPct + '%';
  const minY = document.getElementById('min-year');
  if (minY) minY.textContent = yearLabel(y);
  const mY = document.getElementById('m-year');
  if (mY) mY.textContent = yearLabel(y);
  const thumbYearEl = document.getElementById('thumb-year');
  if (thumbYearEl) {
    thumbYearEl.textContent = yearLabel(y);
    const wrap  = document.getElementById('tl-wrap');
    const wrapW = wrap ? wrap.offsetWidth : 0;
    const labelW = thumbYearEl.offsetWidth;
    const rawPx  = (displayPct / 100) * wrapW;
    const px = Math.max(labelW / 2, Math.min(wrapW - labelW / 2, rawPx));
    thumbYearEl.style.left = px + 'px';
  }

  // Epoch markers — null-check weil buildEpochMarkers() nur Marker innerhalb der Range anlegt
  EPOCHS.forEach((_,i) => {
    const el = document.getElementById('ep-'+i);
    if (!el) return;
    const next = EPOCHS[i+1];
    el.classList.toggle('active', pct >= EPOCHS[i].pct && (!next || pct < next.pct));
  });

  // Keep Pleiades layer in sync with exact timeline year (not just epoch snapshots)
  if (typeof renderPleiadesCities === 'function' && typeof pleiadesMode !== 'undefined' && pleiadesMode > 0) {
    renderPleiadesCities(y);
  }
  // Keep Events layer in sync
  if (typeof renderEvents === 'function' && typeof eventsMode !== 'undefined' && eventsMode > 0) {
    renderEvents(y);
  }
}

document.getElementById('tl-input').addEventListener('input', function() {
  // Slider liefert Range-relatives pct (0–100 innerhalb currentRange) → in globales pct umrechnen
  state.pct = rangeToGlobalPct(parseFloat(this.value));
  updateUI(state.pct);
  const idx = getEpochIdxForPct(state.pct);
  if (idx !== state.currentEpochIdx) renderEpoch(idx);
});

function togglePlay() {
  state.playing = !state.playing;
  const btn = document.getElementById('play-btn');
  if (state.playing) {
    btn.textContent = '⏸'; btn.classList.add('on');
    state.lastT = null;
    state.raf = requestAnimationFrame(tick);
  } else {
    btn.textContent = '▶'; btn.classList.remove('on');
    if (state.raf) cancelAnimationFrame(state.raf);
  }
}

function tick(ts) {
  if (!state.lastT) state.lastT = ts;
  const dt = ts - state.lastT; state.lastT = ts;
  state.pct = state.pct + dt/1000 * state.speed * 0.5;
  const rangeEnd   = yearToGlobalPct(currentRange.to);
  const rangeStart = yearToGlobalPct(currentRange.from);
  const atLimit = (state.speed >= 0 && state.pct >= rangeEnd)
               || (state.speed < 0  && state.pct <= rangeStart);
  if (atLimit) {
    state.pct = state.speed >= 0 ? rangeEnd : rangeStart;
    state.playing = false;
    document.getElementById('play-btn').textContent = '▶';
    document.getElementById('play-btn').classList.remove('on');
    if (state.raf) cancelAnimationFrame(state.raf);
    updateUI(state.pct);
    renderEpoch(getEpochIdxForPct(state.pct));
    return;
  }
  updateUI(state.pct);
  const idx = getEpochIdxForPct(state.pct);
  if (idx !== state.currentEpochIdx) renderEpoch(idx);
  state.raf = requestAnimationFrame(tick);
}

function jumpIdx(i) {
  state.pct = EPOCHS[i].pct;
  updateUI(state.pct);
  renderEpoch(i);
}

// ── Jump to epoch + programmatically open territory panel ──
async function jumpAndOpenTerritory(epochIdx, subjecto, year) {
  if (!subjecto) return false;
  if (year != null) {
    // If target year is outside the current time range, reset to "all"
    if (year < currentRange.from || year > currentRange.to) {
      currentRange = TIME_RANGES.all;
      document.querySelectorAll('.era-sel-btn').forEach(b => b.classList.remove('active'));
      buildEpochMarkers();
    }
    state.pct = yearToGlobalPct(year);
  } else {
    state.pct = EPOCHS[epochIdx].pct;
  }
  updateUI(state.pct);
  await renderEpoch(epochIdx);
  let found = false;
  d3.select('#g-terr').selectAll('.territory').each(function(d) {
    if (found) return;
    const p = d.properties;
    if ((p.SUBJECTO || '').toLowerCase() === subjecto.toLowerCase() ||
        (p.NAME     || '').toLowerCase() === subjecto.toLowerCase()) {
      found = true;
      const bbox = this.getBoundingClientRect();
      const cx   = bbox.left + bbox.width  / 2;
      const cy   = Math.max(80, Math.min(bbox.top + bbox.height / 2, window.innerHeight - 350));
      const culture = getCulture(p);
      const color   = (CULTURE_GROUPS[culture] || CULTURE_GROUPS.other).color;
      selectTerritory(this, { clientX: cx, clientY: cy }, p, color);
    }
  });
  return found;
}

function setSpd(s) {
  state.speed = s;
  ['s-2h','s-1h','sh','s1','s2','s3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('on');
  });
  // Map speed to button id
  const idMap = {'-2':'s-2h', '-1':'s-1h', '0.5':'sh', '1':'s1', '2':'s2', '3':'s3'};
  const activeEl = document.getElementById(idMap[String(s)]);
  if (activeEl) activeEl.classList.add('on');
}

// ── Steuerung einklappen ──
function toggleControls() {
  const ctrl = document.getElementById('controls');
  const btn  = document.getElementById('ctrl-toggle');
  ctrl.classList.toggle('collapsed');
  btn.textContent = ctrl.classList.contains('collapsed') ? '▲' : '▼';
}

// ── Zeitstrahl-Bereich ──
const TIME_RANGES = {
  all:          { label: "All",          from: -8000, to: 2010  },
  prehistoric:  { label: "Prehistory",   from: -8000, to: -3000 },
  bronze_age:   { label: "Bronze Age",   from: -3000, to: -800  },
  antiquity:    { label: "Antiquity",    from:  -800, to:  500  },
  medieval:     { label: "Middle Ages",  from:   500, to: 1500  },
  early_modern: { label: "Early Modern", from:  1500, to: 1800  },
  modern:       { label: "Modern",       from:  1800, to: 2010  },
};
let currentRange = TIME_RANGES.all;

// Konvertiert globales pct (0–100 über alle Zeit) → Range-relatives pct (0–100 innerhalb currentRange)
function globalToRangePct(globalPct) {
  const fromPct = yearToGlobalPct(currentRange.from);
  const toPct   = yearToGlobalPct(currentRange.to);
  if (fromPct >= toPct) return 0;
  return Math.max(0, Math.min(100, (globalPct - fromPct) / (toPct - fromPct) * 100));
}

// Konvertiert Range-relatives pct (0–100 innerhalb currentRange) → globales pct (0–100 über alle Zeit)
function rangeToGlobalPct(rangePct) {
  const fromPct = yearToGlobalPct(currentRange.from);
  const toPct   = yearToGlobalPct(currentRange.to);
  return fromPct + (rangePct / 100) * (toPct - fromPct);
}

function setTimeRange(key, btn) {
  currentRange = TIME_RANGES[key] || TIME_RANGES.all;
  // Update active button
  document.querySelectorAll('.era-sel-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // Clamp current year to new range
  const y = pctToYear(state.pct);
  const clamped = Math.max(currentRange.from, Math.min(currentRange.to, y));
  jumpToYear(clamped);
  // Marker neu aufbauen — danach updateUI nochmal damit active-State auf neuen Markern sitzt
  buildEpochMarkers();
  updateUI(state.pct);
  _updateRangeLabels();
}

function _updateRangeLabels() {
  const s = document.getElementById('tl-start-lbl');
  const e = document.getElementById('tl-end-lbl');
  if (!s || !e) return;
  s.textContent = yearLabel(currentRange.from);
  e.textContent = yearLabel(currentRange.to);
}

function yearToPct(year) {
  // Convert year to pct within current range
  const { from, to } = currentRange;
  for (let i = 0; i < EPOCHS.length - 1; i++) {
    const a = EPOCHS[i], b = EPOCHS[i+1];
    if (year >= a.year && year <= b.year) {
      const t = (year - a.year) / (b.year - a.year);
      const globalPct = a.pct + t * (b.pct - a.pct);
      // Map global pct to range pct
      const fromPct = yearToGlobalPct(from);
      const toPct   = yearToGlobalPct(to);
      return (globalPct - fromPct) / (toPct - fromPct) * 100;
    }
  }
  return 0;
}

function yearToGlobalPct(year) {
  if (year <= EPOCHS[0].year) return EPOCHS[0].pct;
  if (year >= EPOCHS[EPOCHS.length-1].year) return EPOCHS[EPOCHS.length-1].pct;
  for (let i = 0; i < EPOCHS.length - 1; i++) {
    const a = EPOCHS[i], b = EPOCHS[i+1];
    if (year >= a.year && year <= b.year) {
      const t = (year - a.year) / (b.year - a.year);
      return a.pct + t * (b.pct - a.pct);
    }
  }
  return 0;
}

// ── Pfeiltasten-Navigation ──
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight') stepYear(e.shiftKey ? 100 : e.altKey ? 10 : 1);
  if (e.key === 'ArrowLeft')  stepYear(e.shiftKey ? -100 : e.altKey ? -10 : -1);
  if (e.key === ' ') { e.preventDefault(); togglePlay(); }
});

function stepYear(delta) {
  // C4: enable transition only for discrete steps, not slider drag
  const wrap = document.getElementById('tl-wrap');
  if (wrap) { wrap.classList.add('tl-stepping'); setTimeout(() => wrap.classList.remove('tl-stepping'), 180); }
  const currentYear = pctToYear(state.pct);
  // Ziel auf Range-Grenzen clampen
  const targetYear = Math.max(currentRange.from, Math.min(currentRange.to, currentYear + delta));
  jumpToYear(targetYear);
}

function jumpToYear(yearInput) {
  const year = parseInt(yearInput);
  if (isNaN(year)) return;
  // Find pct for this year by reverse-interpolating EPOCHS
  const clamped = Math.max(EPOCHS[0].year, Math.min(EPOCHS[EPOCHS.length-1].year, year));
  for (let i = 0; i < EPOCHS.length - 1; i++) {
    const a = EPOCHS[i], b = EPOCHS[i+1];
    if (clamped >= a.year && clamped <= b.year) {
      const t = (clamped - a.year) / (b.year - a.year);
      state.pct = a.pct + t * (b.pct - a.pct);
      updateUI(state.pct);
      const idx = getEpochIdxForPct(state.pct);
      if (idx !== state.currentEpochIdx) renderEpoch(idx);
      return;
    }
  }
}

// ═══════════════════════════════════════════
//  EPOCH MARKERS
// ═══════════════════════════════════════════
function buildEpochMarkers() {
  const row = document.getElementById('epoch-row');
  row.innerHTML = '';  // Bei Range-Wechsel neu aufbauen

  const fromPct = yearToGlobalPct(currentRange.from);
  const toPct   = yearToGlobalPct(currentRange.to);

  EPOCHS.forEach((ep, i) => {
    // Nur Marker innerhalb der aktiven Range anlegen
    if (ep.year < currentRange.from || ep.year > currentRange.to) return;

    // Position relativ zur Range berechnen (0–100% innerhalb des sichtbaren Bereichs)
    const displayPct = (ep.pct - fromPct) / (toPct - fromPct) * 100;

    const div = document.createElement('div');
    div.className = 'epoch-mk';
    div.id = 'ep-' + i;
    div.style.left   = displayPct + '%';
    div.style.bottom = '0';
    // Clamp label at edges so it doesn't get clipped
    if (displayPct < 4)   div.style.transform = 'translateX(0)';
    else if (displayPct > 96) div.style.transform = 'translateX(-100%)';
    div.innerHTML = `<span class="epoch-lbl">${ep.label}</span><div class="epoch-dot"></div>`;
    div.onclick = () => jumpIdx(i);
    row.appendChild(div);
  });
}

// ═══════════════════════════════════════════
//  LEGEND RESIZE (drag bottom-right handle)
// ═══════════════════════════════════════════
(function() {
  const leg = document.getElementById('legend');
  const handle = document.getElementById('legend-resize');
  let dragging = false, startX, startY, startW, startH;

  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startW = leg.offsetWidth;
    startH = leg.offsetHeight;
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dw = e.clientX - startX;
    const dh = e.clientY - startY; // dragging down = bigger height
    const newW = Math.max(150, Math.min(500, startW + dw));
    const newH = Math.max(80, Math.min(window.innerHeight - 80, startH + dh));
    leg.style.width = newW + 'px';
    leg.style.height = newH + 'px';
    // Scale font proportionally
    const scale = newW / 200;
    leg.style.fontSize = Math.max(10, Math.min(20, Math.round(13 * scale))) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });
})();

// ═══════════════════════════════════════════
//  PAN & ZOOM

// ── Mobile Drawer ──
function toggleMobileDrawer() {
  if (window.innerWidth > 768) return;
  const ctrl = document.getElementById('controls');
  const btn  = document.getElementById('m-more');
  const isOpen = ctrl.classList.toggle('m-open');
  if (btn) { btn.textContent = isOpen ? '▼' : '▲'; btn.classList.toggle('open', isOpen); }
}

// ── Era button toggle (tap again to deselect → reset to all) ──
function toggleTimeRange(key, btn) {
  if (currentRange === TIME_RANGES[key]) {
    setTimeRange('all', null);
    if (btn) btn.blur();
  } else {
    setTimeRange(key, btn);
  }
}

// ── Legende ein/ausklappen ──
function toggleLegend() {
  const leg = document.getElementById('legend');
  const btn = document.getElementById('legend-toggle');
  leg.classList.toggle('collapsed');
  btn.textContent = leg.classList.contains('collapsed') ? '+' : '−';
}

// Init range labels once DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _updateRangeLabels);
} else {
  _updateRangeLabels();
}
