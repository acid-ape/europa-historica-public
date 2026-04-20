// ═══════════════════════════════════════════
//  Historical Events Layer
//  Events accumulate as the timeline moves forward (year <= currentYear)
//  Toggle button: #events-btn
// ═══════════════════════════════════════════

let eventsData = null;   // null = not loaded
let eventsMode = 0;      // 0=off  1=window (±150yr)  2=all happened so far

// 4-point star path, r = outer radius
function _evStarPath(r) {
  const i = r * 0.38;
  return `M0,${-r} L${i*0.7},${-i*0.7} L${r},0 L${i*0.7},${i*0.7}`
       + ` L0,${r} L${-i*0.7},${i*0.7} L${-r},0 L${-i*0.7},${-i*0.7} Z`;
}

// ── Load ──────────────────────────────────
async function loadEventsData() {
  if (eventsData !== null) return;
  try {
    const r = await fetch('data/events.json?v=2d');
    if (!r.ok) throw new Error('events.json not found');
    eventsData = await r.json();
    console.log(`Events: ${eventsData.length} loaded`);
  } catch(e) {
    console.warn('Events data not loaded:', e);
    eventsData = [];
  }
}

// ── Toggle ────────────────────────────────
// Cycles: 0 (off) → 1 (±150yr window) → 2 (all so far) → 0
async function toggleEvents() {
  eventsMode = (eventsMode + 1) % 3;
  const btn      = document.getElementById('events-btn');
  const legEntry = document.getElementById('leg-events');

  if (eventsMode === 0) {
    if (btn) { btn.classList.remove('on', 'on-all'); btn.title = 'Historical events — off'; btn.blur(); }
    if (legEntry) legEntry.style.display = 'none';
    d3.select('#g-events').selectAll('*').remove();
    return;
  }

  await loadEventsData();

  if (eventsMode === 1) {
    if (btn) { btn.classList.add('on'); btn.classList.remove('on-all'); btn.title = 'Historical events — recent window (click for all)'; }
  } else {
    if (btn) { btn.classList.add('on', 'on-all'); btn.title = 'Historical events — all shown (click to turn off)'; }
  }
  if (legEntry) legEntry.style.display = 'flex';

  const year = (typeof state !== 'undefined' && typeof pctToYear === 'function')
    ? pctToYear(state.pct) : 0;
  const gE = d3.select('#g-events');
  gE.style('opacity', 0);
  renderEvents(year);
  requestAnimationFrame(() => gE.transition().duration(200).style('opacity', 1));
}

// ── Render ────────────────────────────────
// Called from updateUI (timeline.js) and zoom handler (app.js)
function renderEvents(year) {
  if (eventsMode === 0 || !eventsData) return;

  const k   = (typeof currentZoomK !== 'undefined') ? currentZoomK : 1;
  const gE  = d3.select('#g-events');
  gE.selectAll('*').remove();

  const visible = eventsMode === 2
    ? eventsData.filter(ev => ev.year <= year)
    : eventsData.filter(ev => ev.year <= year && year <= ev.year + 150);

  // Collect city + Pleiades positions for overlap avoidance (Cities > Pleiades > Events)
  const _oThresh = 18 / k, _oStep = 20 / k;
  const _occupied = [];
  d3.select('#g-cities').selectAll('g').each(function() {
    const d = d3.select(this).datum();
    if (d) _occupied.push({x: d.cx, y: d.cy});
  });
  d3.selectAll('.pleiades-dot').each(function() {
    const d = d3.select(this).datum();
    if (d) _occupied.push({x: d.cx, y: d.cy});
  });

  visible.forEach(ev => {
    const pt = proj([ev.lon, ev.lat]);
    if (!pt || isNaN(pt[0]) || isNaN(pt[1])) return;
    let [cx, cy] = pt;

    // Radial offset if overlapping an existing marker
    if (_occupied.some(m => { const dx=m.x-cx, dy=m.y-cy; return dx*dx+dy*dy < _oThresh*_oThresh; })) {
      const _angles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
      for (const a of _angles) {
        const nx = cx + Math.cos(a) * _oStep, ny = cy + Math.sin(a) * _oStep;
        if (!_occupied.some(m => { const dx=m.x-nx, dy=m.y-ny; return dx*dx+dy*dy < _oThresh*_oThresh; })) {
          cx = nx; cy = ny; break;
        }
      }
    }
    _occupied.push({x: cx, y: cy});

    const g = gE.append('g')
      .attr('class', 'event-marker')
      .datum({ cx, cy })
      .attr('transform', `translate(${cx},${cy}) scale(${1/k})`)
      .style('cursor', 'pointer')
      .on('mouseenter', e => { if (!tooltipPinned) showEventTT(e, ev); })
      .on('mousemove',  e => { if (!tooltipPinned) moveTooltip(e); })
      .on('mouseleave', () => { if (!tooltipPinned) hideTooltip(); })
      .on('click', e => {
        e.stopPropagation();
        selectEvent(e, ev);
      });

    // Hit-area ring (transparent, large target)
    g.append('circle').attr('r', 12).attr('fill', 'transparent');

    // Outer halo
    g.append('circle')
      .attr('r', 7.5)
      .attr('fill', 'rgba(220,88,40,0.1)')
      .attr('stroke', 'rgba(220,88,40,0.4)')
      .attr('stroke-width', 0.9);

    // Inner star
    g.append('path')
      .attr('d', _evStarPath(4.8))
      .attr('fill', '#e05828')
      .attr('fill-opacity', 0.92)
      .attr('stroke', 'rgba(255,160,80,0.45)')
      .attr('stroke-width', 0.5)
      .style('filter', 'url(#city-glow)');
  });
}

// ── Rescale on zoom (called from app.js zoom handler) ──
function rescaleEventMarkers() {
  if (eventsMode === 0) return;
  const k = (typeof currentZoomK !== 'undefined') ? currentZoomK : 1;
  d3.selectAll('.event-marker').each(function() {
    const d = d3.select(this).datum();
    if (d) d3.select(this).attr('transform', `translate(${d.cx},${d.cy}) scale(${1/k})`);
  });
}

// ── Format year ───────────────────────────
function _fmtEvYear(y) {
  return y < 0 ? Math.abs(y) + ' BC' : y + ' AD';
}

// ── Tooltip ───────────────────────────────
function showEventTT(event, ev) {
  if (typeof _tooltipSerial !== 'undefined') ++_tooltipSerial;
  const serial = (typeof _tooltipSerial !== 'undefined') ? _tooltipSerial : 0;

  const typeIconEl = document.getElementById('tt-type-icon');
  if (typeIconEl) typeIconEl.textContent = '✦';

  document.getElementById('tt-name').textContent = ev.title;

  const flagEl = document.getElementById('tt-flag');
  if (flagEl) flagEl.style.display = 'none';
  const evImgEl = document.getElementById('tt-event-img');
  if (evImgEl) { evImgEl.style.display = 'none'; evImgEl.src = ''; }
  const capRow = document.getElementById('tt-capital-row');
  if (capRow) capRow.style.display = 'none';
  const aiNoteEl = document.getElementById('tt-ai-note');
  if (aiNoteEl) aiNoteEl.style.display = 'none';
  const descEl0 = document.getElementById('tt-desc');
  if (descEl0) { descEl0.style.display = 'none'; descEl0.textContent = ''; }

  document.getElementById('tt-sub').textContent = _fmtEvYear(ev.year);

  // "Closest state" note if event year doesn't match current epoch
  const epochYear = (typeof state !== 'undefined' && state.currentEpochIdx != null)
    ? EPOCHS[state.currentEpochIdx].year : null;
  let noteHtml = '';
  if (epochYear !== null && epochYear !== ev.year) {
    noteHtml = `<li style="padding-left:0;color:#5a4a2a;font-style:italic">`
             + `Map shows closest available state (~${_fmtEvYear(epochYear)})</li>`;
  }
  const ctxEl = document.getElementById('tt-context');
  ctxEl.innerHTML = noteHtml;
  const ctxSection = document.getElementById('tt-context-section');
  if (ctxSection) ctxSection.style.display = noteHtml ? 'block' : 'none';

  document.getElementById('tt-ruler-div').style.display   = 'none';
  document.getElementById('tt-ruler-label').style.display = 'none';
  document.getElementById('tt-ruler-area').innerHTML      = '';
  const precRow = document.getElementById('tt-prec-row');
  if (precRow) precRow.style.display = 'none';

  // Wikipedia extract (async)
  const descEl = descEl0;

  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(ev.wiki)}`)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (typeof _tooltipSerial !== 'undefined' && _tooltipSerial !== serial) return;
      if (!data) return;
      // Wikipedia extract
      if (data.extract && descEl) {
        let txt = data.extract;
        if (txt.length > 240) txt = txt.substring(0, 238) + '…';
        descEl.textContent = txt;
        descEl.style.display = 'block';
        if (ctxSection) ctxSection.style.display = '';
      }
      // Wikipedia thumbnail image — shown full-width below header
      if (data.thumbnail && data.thumbnail.source && evImgEl) {
        evImgEl.src = data.thumbnail.source;
        evImgEl.style.display = 'block';
      }
    })
    .catch(() => {});

  document.getElementById('tt-wiki-txt').textContent = 'Wikipedia →';
  document.getElementById('tt-wiki-wp').onclick = () =>
    window.open('https://en.wikipedia.org/wiki/' + encodeURIComponent(ev.wiki), '_blank');

  const wdEl = document.getElementById('tt-wiki-wd');
  if (wdEl) wdEl.style.display = 'none';

  const gotoBtn = document.getElementById('tt-goto-year');
  if (gotoBtn) {
    gotoBtn.textContent = '⏱ Jump to this year';
    gotoBtn.style.display = 'block';
  }

  _showTooltipEl();
  moveTooltip(event);
}

let _currentEventYear = null;

function _jumpToEventYear() {
  if (_currentEventYear === null) return;
  const year = _currentEventYear;
  if (typeof currentRange !== 'undefined' && typeof TIME_RANGES !== 'undefined') {
    if (year < currentRange.from || year > currentRange.to) {
      currentRange = TIME_RANGES.all;
      document.querySelectorAll('.era-sel-btn').forEach(b => b.classList.remove('active'));
      if (typeof buildEpochMarkers === 'function') buildEpochMarkers();
    }
  }
  if (typeof yearToGlobalPct === 'function') {
    state.pct = yearToGlobalPct(year);
    if (typeof updateUI === 'function') updateUI(state.pct);
    const idx = (typeof getEpochIdxForPct === 'function') ? getEpochIdxForPct(state.pct) : null;
    if (idx !== null && typeof renderEpoch === 'function') renderEpoch(idx);
  }
}

let _epCount = 0;

function createEventPanel(mouseEvent, ev) {
  if (typeof isMobile === 'function' && isMobile()) {
    if (typeof _mSheetOpenEvent === 'function') _mSheetOpenEvent(ev);
    return;
  }

  // Dismiss hover tooltip so it doesn't overlap the new float panel
  if (typeof _hideTooltipEl === 'function') _hideTooltipEl();

  // Prevent duplicate
  const eid = 'ev-' + ev.year + '-' + (ev.wiki || ev.title).replace(/\W+/g, '_');
  const existing = document.querySelector(`.tt-float[data-eid="${CSS.escape(eid)}"]`);
  if (existing) {
    existing.style.zIndex = String(++_tpZBase);
    existing.style.outline = '1px solid var(--gold)';
    setTimeout(() => { existing.style.outline = ''; }, 400);
    return;
  }

  const id = 'evp-' + (++_epCount);
  const panel = document.createElement('div');
  panel.className = 'tt-float';
  panel.id = id;
  panel.dataset.eid = eid;
  panel.style.left = _safePanelX(mouseEvent.clientX + 20) + 'px';
  panel.style.top  = Math.min(mouseEvent.clientY - 20, window.innerHeight - 300) + 'px';
  panel.style.zIndex = String(++_tpZBase);

  const yr = _fmtEvYear(ev.year);

  panel.innerHTML = `
    <div class="tt-float-hdr">
      <span style="font-size:12px;color:#7a6a42;flex-shrink:0;line-height:1">✦</span>
      <h3></h3>
      <span class="tp-btn tp-snap" title="Snap to top">⊟</span>
      <span class="tp-btn tt-float-min" title="Minimize">−</span>
      <span class="tp-btn tp-close" title="Close">✕</span>
    </div>
    <div class="tt-sub"></div>
    <div class="tt-float-ctx" style="display:none">
      <div class="tt-section-label">Context</div>
      <img class="ep-thumb" style="display:none;width:calc(100% + 32px);margin:4px -16px 6px;height:130px;object-fit:cover;object-position:center top;border-top:1px solid var(--border);border-bottom:1px solid var(--border);" alt="">
      <div class="tp-desc ep-desc" style="display:none"></div>
    </div>
    <div class="tt-div"></div>
    <div style="display:flex;flex-direction:column;gap:5px;">
      <div class="ms-goto-year btn" style="margin:0;width:100%;text-align:center;cursor:pointer;"></div>
      <div class="tt-wiki ep-wiki" style="cursor:pointer">
        <div class="wiki-i">W</div><span>Wikipedia →</span>
      </div>
    </div>`;

  panel.querySelector('h3').textContent = ev.title;
  panel.querySelector('.tt-sub').textContent = yr;
  panel.querySelector('.ms-goto-year').textContent = '⏱ Jump to ' + yr;

  document.body.appendChild(panel);
  makeDraggable(panel, panel.querySelector('.tt-float-hdr'));

  panel.addEventListener('click', e => {
    const btn = e.target.closest('.tp-btn');
    if (!btn) return;
    e.stopPropagation();
    if (btn.classList.contains('tp-snap')) snapPanel(id);
    else if (btn.classList.contains('tt-float-min')) toggleTtFloat(id);
    else if (btn.classList.contains('tp-close')) panel.remove();
  }, true);

  panel.querySelector('.ms-goto-year').addEventListener('click', () => {
    _currentEventYear = ev.year;
    _jumpToEventYear();
  });
  panel.querySelector('.ep-wiki').addEventListener('click', () =>
    window.open('https://en.wikipedia.org/wiki/' + encodeURIComponent(ev.wiki), '_blank'));

  fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(ev.wiki))
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!panel.isConnected || !data) return;
      const ctx = panel.querySelector('.tt-float-ctx');
      if (data.extract) {
        const desc = panel.querySelector('.ep-desc');
        let txt = data.extract;
        if (txt.length > 300) txt = txt.substring(0, 298) + '…';
        desc.textContent = txt;
        desc.style.display = 'block';
        if (ctx) ctx.style.display = '';
      }
      if (data.thumbnail && data.thumbnail.source) {
        const img = panel.querySelector('.ep-thumb');
        img.src = data.thumbnail.source;
        img.style.display = 'block';
        if (ctx) ctx.style.display = '';
      }
    })
    .catch(() => {});
}

function selectEvent(event, ev) {
  if (eventsMode === 0) toggleEvents();
  _currentEventYear = ev.year;
  createEventPanel(event, ev);
}
