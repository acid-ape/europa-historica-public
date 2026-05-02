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
  const suffix = typeof getDataSuffix === 'function' ? getDataSuffix() : '';
  const url = suffix ? `data/events${suffix}.json` : 'data/events.json?v=2e';
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('events not found');
    eventsData = await r.json();
  } catch(e) {
    console.warn('Events data not loaded:', e);
    eventsData = [];
  }
}

window.addEventListener('langchange', async () => {
  eventsData = null;
  if (eventsMode > 0) {
    await loadEventsData();
    const year = typeof pctToYear === 'function' && typeof state !== 'undefined' ? pctToYear(state.pct) : 0;
    renderEvents(year);
  }
});

// ── Toggle ────────────────────────────────
// Cycles: 0 (off) → 1 (±150yr window) → 2 (all so far) → 0
async function toggleEvents() {
  eventsMode = (eventsMode + 1) % 3;
  const btn      = document.getElementById('events-btn');
  const legEntry = document.getElementById('leg-events');

  if (eventsMode === 0) {
    if (btn) { btn.classList.remove('on', 'on-all'); btn.title = 'Historical events — off'; btn.blur(); }
    _setBtnState(btn, 'state_off');
    if (legEntry) legEntry.style.display = 'none';
    d3.select('#g-events').selectAll('*').remove();
    return;
  }

  await loadEventsData();

  if (eventsMode === 1) {
    if (btn) { btn.classList.add('on'); btn.classList.remove('on-all'); btn.title = 'Historical events — recent window (click for all)'; }
    _setBtnState(btn, 'state_window');
  } else {
    if (btn) { btn.classList.add('on', 'on-all'); btn.title = 'Historical events — all shown (click to turn off)'; }
    _setBtnState(btn, 'state_all');
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

  // C4.3: Project all visible events first, then group near-coincident
  // ones into clusters (e.g. multiple events in Rome). Render a single
  // marker with a +N badge per cluster.
  const _clusterRadius = 14 / k;
  const _projected = visible.map(ev => {
    const pt = proj([ev.lon, ev.lat]);
    if (!pt || isNaN(pt[0]) || isNaN(pt[1])) return null;
    return { ev, x: pt[0], y: pt[1] };
  }).filter(p => p);

  const _clusters = [];
  _projected.forEach(p => {
    const c = _clusters.find(c => {
      const dx = c.x - p.x, dy = c.y - p.y;
      return dx*dx + dy*dy < _clusterRadius*_clusterRadius;
    });
    if (c) { c.events.push(p.ev); }
    else   { _clusters.push({ x: p.x, y: p.y, events: [p.ev] }); }
  });

  _clusters.forEach(cl => {
    let cx = cl.x, cy = cl.y;

    // Radial offset if overlapping an existing city/pleiades marker
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

    const isCluster = cl.events.length > 1;
    const ev0       = cl.events[0];
    const g = gE.append('g')
      .attr('class', isCluster ? 'event-marker event-cluster' : 'event-marker')
      .datum({ cx, cy })
      .attr('transform', `translate(${cx},${cy}) scale(${1/k})`)
      .style('cursor', 'pointer');

    if (isCluster) {
      g.on('mouseenter', e => { if (!tooltipPinned) showEventClusterTT(e, cl.events); })
       .on('mousemove',  e => { if (!tooltipPinned) moveTooltip(e); })
       .on('mouseleave', () => { if (!tooltipPinned) hideTooltip(); })
       .on('click',     e => { e.stopPropagation(); selectEventCluster(e, cl.events); });
    } else {
      g.on('mouseenter', e => { if (!tooltipPinned) showEventTT(e, ev0); })
       .on('mousemove',  e => { if (!tooltipPinned) moveTooltip(e); })
       .on('mouseleave', () => { if (!tooltipPinned) hideTooltip(); })
       .on('click',     e => { e.stopPropagation(); selectEvent(e, ev0); });
    }

    // Hit-area ring (transparent, large target)
    g.append('circle').attr('r', 12).attr('fill', 'transparent');

    // Outer halo (slightly larger for clusters)
    g.append('circle')
      .attr('r', isCluster ? 9 : 7.5)
      .attr('fill', 'rgba(220,88,40,0.1)')
      .attr('stroke', 'rgba(220,88,40,0.4)')
      .attr('stroke-width', isCluster ? 1.2 : 0.9);

    // Inner star
    g.append('path')
      .attr('d', _evStarPath(isCluster ? 5.6 : 4.8))
      .attr('fill', '#e05828')
      .attr('fill-opacity', 0.92)
      .attr('stroke', 'rgba(255,160,80,0.45)')
      .attr('stroke-width', 0.5)
      .style('filter', 'url(#city-glow)');

    // Cluster count badge
    if (isCluster) {
      g.append('text')
        .attr('x', 7).attr('y', -7)
        .attr('class', 'event-cluster-count')
        .text(cl.events.length);
    }
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
             + `${t('ev_closest_state')} (~${_fmtEvYear(epochYear)})</li>`;
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

  // Local description
  const descEl = descEl0;
  if (ev.description && descEl) {
    descEl.textContent = ev.description;
    descEl.style.display = 'block';
    if (ctxSection) ctxSection.style.display = '';
  }

  // Local thumbnail image
  if (ev.image && evImgEl) {
    evImgEl.src = ev.image;
    evImgEl.style.display = 'block';
  }

  document.getElementById('tt-wiki-txt').textContent = t('tt_wiki_arrow');
  document.getElementById('tt-wiki-wp').onclick = () =>
    window.open('https://en.wikipedia.org/wiki/' + encodeURIComponent(ev.wiki), '_blank');

  const wdEl = document.getElementById('tt-wiki-wd');
  if (wdEl) wdEl.style.display = 'none';

  const gotoBtn = document.getElementById('tt-goto-year');
  if (gotoBtn) {
    gotoBtn.textContent = t('ev_jump_year');
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
      <div class="tt-section-label">${t('tt_context')}</div>
      <img class="ep-thumb" style="display:none;width:calc(100% + 32px);margin:4px -16px 6px;height:200px;object-fit:contain;object-position:center;background:rgba(0,0,0,0.55);border-top:1px solid var(--border);border-bottom:1px solid var(--border);" alt="">
      <div class="tp-desc ep-desc" style="display:none"></div>
    </div>
    <div class="tt-div"></div>
    <div style="display:flex;flex-direction:column;gap:5px;">
      <div class="ms-goto-year btn" style="margin:0;width:100%;text-align:center;cursor:pointer;"></div>
      <div class="tt-wiki ep-wiki" style="cursor:pointer">
        <div class="wiki-i">W</div><span>${t('tt_wiki_arrow')}</span>
      </div>
    </div>`;

  panel.querySelector('h3').textContent = ev.title;
  panel.querySelector('.tt-sub').textContent = yr;
  panel.querySelector('.ms-goto-year').textContent = `${t('ev_jump_to')} ${yr}`;

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

  // Local description
  const ctx = panel.querySelector('.tt-float-ctx');
  if (ev.description) {
    const desc = panel.querySelector('.ep-desc');
    desc.textContent = ev.description;
    desc.style.display = 'block';
    if (ctx) ctx.style.display = '';
  }

  // Local thumbnail image
  if (ev.image) {
    const img = panel.querySelector('.ep-thumb');
    img.src = ev.image;
    img.style.display = 'block';
    if (ctx) ctx.style.display = '';
  }
}

function selectEvent(event, ev) {
  if (eventsMode === 0) toggleEvents();
  _currentEventYear = ev.year;
  createEventPanel(event, ev);
}

// C4.3: Hover tooltip for a cluster (multiple events at same spot).
// Shows the count + an inline list of titles.
function showEventClusterTT(event, evs) {
  const typeIconEl = document.getElementById('tt-type-icon');
  if (typeIconEl) typeIconEl.textContent = '✦';
  document.getElementById('tt-name').textContent =
    evs.length + ' ' + t('ev_cluster_label');
  document.getElementById('tt-sub').textContent = '';
  const flagEl = document.getElementById('tt-flag');
  if (flagEl) flagEl.style.display = 'none';
  const evImgEl = document.getElementById('tt-event-img');
  if (evImgEl) { evImgEl.style.display = 'none'; evImgEl.src = ''; }
  const capRow = document.getElementById('tt-capital-row');
  if (capRow) capRow.style.display = 'none';
  const aiNoteEl = document.getElementById('tt-ai-note');
  if (aiNoteEl) aiNoteEl.style.display = 'none';
  const descEl = document.getElementById('tt-desc');
  if (descEl) { descEl.style.display = 'none'; descEl.textContent = ''; }
  const precRow = document.getElementById('tt-prec-row');
  if (precRow) precRow.style.display = 'none';

  const ctxEl = document.getElementById('tt-context');
  // Up to 6 titles; +N if more
  const sorted = [...evs].sort((a, b) => a.year - b.year);
  const top = sorted.slice(0, 6);
  let html = top.map(e =>
    `<li style="padding-left:0">${_fmtEvYear(e.year)} · ${e.title}</li>`
  ).join('');
  if (sorted.length > 6) {
    html += `<li style="padding-left:0;color:#5a4a2a;font-style:italic">+${sorted.length - 6}…</li>`;
  }
  ctxEl.innerHTML = html;
  const ctxSection = document.getElementById('tt-context-section');
  if (ctxSection) ctxSection.style.display = 'block';

  const rulerSec = document.getElementById('tt-ruler-area');
  if (rulerSec) rulerSec.innerHTML = '';
  const rulerLab = document.getElementById('tt-ruler-label');
  if (rulerLab) rulerLab.style.display = 'none';
  const rulerDiv = document.getElementById('tt-ruler-div');
  if (rulerDiv) rulerDiv.style.display = 'none';

  // Hide wiki/links/goto in hover tooltip
  const links = document.getElementById('tt-links');
  if (links) links.style.display = 'none';

  moveTooltip(event);
  _showTooltipEl();
}

// C4.3: Click on a cluster opens a side-panel listing all its events;
// each list item is its own click-target opening the regular event panel.
function selectEventCluster(event, evs) {
  if (eventsMode === 0) toggleEvents();
  if (typeof isMobile === 'function' && isMobile() &&
      typeof _mSheetOpenEventCluster === 'function') {
    _mSheetOpenEventCluster(evs);
    return;
  }
  _createEventClusterPanel(event, evs);
}

function _createEventClusterPanel(triggerEvent, evs) {
  // Reuse the multi-panel pattern from territories.
  const id = 'evcl-' + Date.now();
  const panel = document.createElement('div');
  panel.className = 'terr-panel event-cluster-panel';
  panel.id = id;
  // Clamp position into viewport: prevent the panel from landing off-screen
  // when the cluster sits near the right or top edge.
  const baseX = (typeof _safePanelX === 'function')
    ? _safePanelX(triggerEvent.clientX + 20)
    : Math.min(triggerEvent.clientX + 20, window.innerWidth - 320);
  const baseY = Math.max(8,
    Math.min(triggerEvent.clientY - 20, window.innerHeight - 360));
  panel.style.left = baseX + 'px';
  panel.style.top  = baseY + 'px';
  if (typeof _tpZBase !== 'undefined') {
    panel.style.zIndex = String(++_tpZBase);
  }

  const sorted = [...evs].sort((a, b) => a.year - b.year);
  const items = sorted.map((ev, i) => `
    <li class="evcl-item" data-i="${i}">
      <span class="evcl-year">${_fmtEvYear(ev.year)}</span>
      <span class="evcl-title">${ev.title}</span>
    </li>`).join('');

  panel.innerHTML = `
    <div class="tp-handle">
      <span class="tp-title-group">
        <span class="tp-type-icon">✦</span>
        <span class="tp-name">${evs.length} ${t('ev_cluster_label')}</span>
      </span>
      <span class="tp-btn evcl-close" title="Close">✕</span>
    </div>
    <div class="evcl-body">
      <ul class="evcl-list">${items}</ul>
    </div>`;

  document.body.appendChild(panel);
  panel.classList.add('active-panel');

  // Close button — wired up via JS instead of inline onclick so it always
  // closes this specific panel.
  panel.querySelector('.evcl-close').addEventListener('click', e => {
    e.stopPropagation();
    panel.remove();
  });

  // Each list item closes the cluster list and opens the individual event
  // panel where the user clicked.
  panel.querySelectorAll('.evcl-item').forEach(li => {
    li.addEventListener('click', e => {
      e.stopPropagation();
      const i = +li.dataset.i;
      const ev = sorted[i];
      panel.remove();
      selectEvent(e, ev);
    });
  });

  if (typeof makeDraggable === 'function') {
    makeDraggable(panel, panel.querySelector('.tp-handle'));
  }
}
