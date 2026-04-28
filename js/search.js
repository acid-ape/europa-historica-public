// ═══════════════════════════════════════════
//  Europa Historica — Global Search (B1)
//  Searches territory names + ruler names
//  On select: jumps to matching epoch + opens territory panel
// ═══════════════════════════════════════════

let _srData   = null;   // flat search index
let _srLoaded = false;

// ── Open / Close ──────────────────────────
function openSearch() {
  const el = document.getElementById('search-overlay');
  if (!el) return;
  el.style.display = 'flex';
  el.offsetHeight;
  el.classList.add('visible');
  _srSelected = -1;
  // Preload data in background
  _loadSrData();
  setTimeout(() => {
    const inp = document.getElementById('search-input');
    if (inp) { inp.focus(); inp.select(); }
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-meta').textContent = '';
  }, 60);
}

function closeSearch() {
  const el = document.getElementById('search-overlay');
  if (!el) return;
  el.classList.remove('visible');
  el.addEventListener('transitionend', () => {
    if (!el.classList.contains('visible')) el.style.display = 'none';
  }, { once: true });
}

// ── ESC key ───────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const el = document.getElementById('search-overlay');
    if (el && el.classList.contains('visible')) { closeSearch(); return; }
  }
  // Ctrl/Cmd+K → open search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const el = document.getElementById('search-overlay');
    if (el && el.classList.contains('visible')) closeSearch();
    else openSearch();
    return;
  }
  // Arrow nav inside open search
  const overlay = document.getElementById('search-overlay');
  if (!overlay || !overlay.classList.contains('visible')) return;
  const rows = document.querySelectorAll('.sr-row');
  if (!rows.length) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _srSelected = Math.min(_srSelected + 1, rows.length - 1);
    _highlightSrRow(rows);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _srSelected = Math.max(_srSelected - 1, 0);
    _highlightSrRow(rows);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (_srSelected >= 0 && rows[_srSelected]) {
      rows[_srSelected].click();
    } else {
      // Enter with no selection → pick first result
      if (rows[0]) rows[0].click();
    }
  }
});

let _srSelected = -1;
function _highlightSrRow(rows) {
  rows.forEach((r, i) => r.classList.toggle('sr-active', i === _srSelected));
  if (rows[_srSelected]) rows[_srSelected].scrollIntoView({ block: 'nearest' });
}

// Fetch a localized JSON with EN fallback when the *_de variant is missing.
async function _fetchLocalized(basePath) {
  const suffix = typeof getDataSuffix === 'function' ? getDataSuffix() : '';
  if (suffix) {
    // basePath like 'data/events.json' or 'data/knowledge/territories.json'
    const localized = basePath.replace(/\.json$/, suffix + '.json');
    try {
      const r = await fetch(localized);
      if (r.ok) return r.json();
    } catch (_) { /* fall through to EN */ }
  }
  const r = await fetch(basePath);
  if (!r.ok) throw new Error('not found: ' + basePath);
  return r.json();
}

// ── Data Loading & Index Building ─────────
async function _loadSrData() {
  if (_srLoaded) return;
  // territories + events have DE variants; rulers + cities are language-neutral
  // (proper names of historical persons / cities).
  const [terrData, rulerData, citiesData, eventsRaw] = await Promise.all([
    _fetchLocalized('data/knowledge/territories.json'),
    fetch('data/knowledge/rulers.json').then(r => r.json()),
    fetch('data/knowledge/cities.json').then(r => r.ok ? r.json() : null).catch(() => null),
    _fetchLocalized('data/events.json').catch(() => null),
  ]);

  // Reverse map: subContextQid → parent territory entry
  const subCtxParent = {};
  for (const [, terr] of Object.entries(terrData)) {
    if (terr.territory_type === 'multi_context') {
      for (const ctx of (terr.contexts || [])) {
        const cqid = ctx.wikidataId || ctx.id;
        if (cqid) subCtxParent[cqid] = terr;
      }
    }
  }

  const index = [];

  // ── Territory entries ──
  for (const [qid, terr] of Object.entries(terrData)) {
    if (!terr.label) continue;
    const subjecto  = terr.subjecto || '';

    // 1) Try firstEpoch from geodata
    let epochIdx = null;
    const firstFile = terr.geodata?.firstEpoch;
    if (firstFile) {
      const idx = EPOCHS.findIndex(e => e.file === firstFile + '.geojson');
      if (idx >= 0) epochIdx = idx;
    }

    // 2) Fallback: derive from earliest ruler start year
    if (epochIdx === null) {
      const rulerQids = terr.territory_type === 'multi_context'
        ? (terr.contexts || []).map(c => c.wikidataId || c.id).filter(Boolean)
        : [qid];
      let minStart = null;
      for (const rqid of rulerQids) {
        for (const r of (rulerData[rqid]?.rulers || [])) {
          if (r.start != null && (minStart === null || r.start < minStart)) minStart = r.start;
        }
      }
      if (minStart !== null) epochIdx = _epochForYear(minStart, []);
    }

    index.push({
      type:     'territory',
      label:    terr.label,
      sub:      '',
      subjecto,
      epochIdx,
      qid,
    });
  }

  // ── Ruler entries ──
  for (const [qid, data] of Object.entries(rulerData)) {
    const terr = terrData[qid] || subCtxParent[qid];
    if (!terr) continue;
    const subjecto  = terr.subjecto || '';
    const terrLabel = terr.label    || '';
    const terrEpochs = (terr.geodata?.epochs || []).map(f => f);

    for (const ruler of (data.rulers || [])) {
      if (!ruler.name) continue;
      const epochIdx = _epochForYear(ruler.start, terrEpochs);
      index.push({
        type:     'ruler',
        label:    ruler.name,
        sub:      terrLabel,
        subjecto,
        epochIdx,
        qid,
        rulerStart: ruler.start,
      });
    }
  }

  // ── Settlement entries (Pleiades) ──
  if (citiesData) {
    for (const city of Object.values(citiesData)) {
      if (!city.name) continue;
      index.push({
        type:     'settlement',
        label:    city.name,
        sub:      city.type || 'settlement',
        epochIdx: null,
        cityData: city,
      });
    }
  }

  // ── Historical Event entries ──
  if (eventsRaw) {
    for (const ev of eventsRaw) {
      if (!ev.title) continue;
      index.push({
        type:      'event',
        label:     ev.title,
        sub:       '',
        epochIdx:  null,
        year:      ev.year,
        eventData: ev,
      });
    }
  }

  _srData   = index;
  _srLoaded = true;
}

// Find best epoch index for a given year, constrained to available territory epochs
function _epochForYear(year, terrEpochs) {
  if (year == null) return null;
  if (terrEpochs.length) {
    // Find the latest territory epoch whose year ≤ ruler start
    let best = null;
    for (const fileKey of terrEpochs) {
      const idx = EPOCHS.findIndex(e => e.file === fileKey + '.geojson');
      if (idx < 0) continue;
      if (EPOCHS[idx].year <= year) best = idx;
    }
    if (best !== null) return best;
    // Ruler predates territory on map — use first available territory epoch
    const first = EPOCHS.findIndex(e => e.file === terrEpochs[0] + '.geojson');
    return first >= 0 ? first : null;
  }
  // No epoch list — find closest EPOCHS entry whose year ≤ rulerStart
  let best = 0;
  for (let i = 0; i < EPOCHS.length; i++) {
    if (EPOCHS[i].year <= year) best = i;
    else break;
  }
  return best;
}

// ── Search ────────────────────────────────
function _doSearch(q) {
  _srSelected = -1;
  const results = document.getElementById('search-results');
  const meta    = document.getElementById('search-meta');
  if (!results) return;

  if (!q.trim()) {
    results.innerHTML = '';
    if (meta) meta.textContent = '';
    return;
  }

  if (!_srLoaded) {
    results.innerHTML = `<div class="sr-empty">${t('search_loading')}</div>`;
    return;
  }

  const term = q.toLowerCase().trim();
  const typeOrder = { territory: 0, ruler: 1, event: 2, settlement: 3 };
  const hits = _srData
    .filter(e => e.label.toLowerCase().includes(term))
    .sort((a, b) => {
      const aExact = a.label.toLowerCase() === term;
      const bExact = b.label.toLowerCase() === term;
      if (aExact !== bExact) return aExact ? -1 : 1;
      const ao = typeOrder[a.type] ?? 4;
      const bo = typeOrder[b.type] ?? 4;
      if (ao !== bo) return ao - bo;
      return a.label.localeCompare(b.label);
    })
    .slice(0, 50);

  if (meta) meta.textContent = hits.length
    ? `${hits.length} ${hits.length === 1 ? t('search_results_one') : t('search_results_n')}`
    : '';

  if (!hits.length) {
    results.innerHTML = `<div class="sr-empty">${t('search_no_results')}</div>`;
    return;
  }

  const _srFmtYear = y => y < 0 ? Math.abs(y) + ' BC' : y + ' AD';

  results.innerHTML = hits.map((h, i) => {
    const icon = h.type === 'territory' ? '▣' : h.type === 'ruler' ? '♛' : h.type === 'event' ? '✦' : '△';
    const subHtml = h.sub ? `<span class="sr-sub">${_escHtml(h.sub)}</span>` : '';
    let yearStr = '';
    if (h.type === 'settlement' && h.cityData) {
      yearStr = _srFmtYear(h.cityData.start);
    } else if (h.type === 'event' && h.year != null) {
      yearStr = _srFmtYear(h.year);
    } else if (h.epochIdx != null && EPOCHS[h.epochIdx]) {
      yearStr = EPOCHS[h.epochIdx].label;
    }
    return `<div class="sr-row" data-idx="${i}" onclick="_selectSrResult(${i})">
      <span class="sr-icon sr-icon-${h.type}">${icon}</span>
      <span class="sr-label">${_escHtml(h.label)}</span>
      ${subHtml}
      <span class="sr-year">${yearStr}</span>
    </div>`;
  }).join('');

  // Store hits reference on DOM node
  results._hits = hits;
}

function _escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Select Result ─────────────────────────
async function _selectSrResult(i) {
  const results = document.getElementById('search-results');
  if (!results || !results._hits) return;
  const hit = results._hits[i];
  if (!hit) return;

  closeSearch();

  // ── Event: enable Events layer, jump to year, pan, pin tooltip ──
  if (hit.type === 'event' && hit.eventData) {
    const ev = hit.eventData;
    if (typeof eventsMode !== 'undefined' && eventsMode === 0) {
      await toggleEvents();
    } else {
      await loadEventsData();
    }
    _srPanToLonLat(ev.lon, ev.lat);
    setTimeout(() => {
      const container = document.getElementById('map-container');
      const cx = container ? container.offsetWidth  / 2 : window.innerWidth  / 2;
      const cy = container ? container.offsetHeight * 0.4 : window.innerHeight * 0.4;
      if (typeof selectEvent === 'function') selectEvent({ clientX: cx, clientY: cy }, ev);
    }, 650);
    return;
  }

  // ── Settlement: enable Pleiades, jump to year, pan, pin tooltip ──
  if (hit.type === 'settlement' && hit.cityData) {
    const city = hit.cityData;
    if (typeof pleiadesMode !== 'undefined' && pleiadesMode === 0) {
      await togglePleiades();  // activates mode 1 and loads data
    } else {
      await loadPleiadesData();
    }
    // Ensure time range includes settlement's active period
    const y = city.start;
    if (typeof currentRange !== 'undefined' && (y < currentRange.from || y > currentRange.to)) {
      currentRange = TIME_RANGES.all;
      document.querySelectorAll('.era-sel-btn').forEach(b => b.classList.remove('active'));
      if (typeof buildEpochMarkers === 'function') buildEpochMarkers();
    }
    if (typeof jumpToYear === 'function') jumpToYear(y);
    // Pan map to settlement
    _srPanToLonLat(city.lon, city.lat);
    // Pin tooltip after pan animation completes
    setTimeout(() => {
      const container = document.getElementById('map-container');
      const cx = container ? container.offsetWidth  / 2 : window.innerWidth  / 2;
      const cy = container ? container.offsetHeight * 0.4 : window.innerHeight * 0.4;
      if (typeof selectPleiadesCity === 'function') selectPleiadesCity({ clientX: cx, clientY: cy }, city);
    }, 650);
    return;
  }

  // ── Territory / Ruler ──
  const epochIdx = hit.epochIdx != null ? hit.epochIdx : (state.currentEpochIdx || 0);
  if (typeof jumpAndOpenTerritory === 'function' && hit.subjecto) {
    const targetYear = (hit.type === 'ruler' && hit.rulerStart != null) ? hit.rulerStart : null;
    jumpAndOpenTerritory(epochIdx, hit.subjecto, targetYear);
  }
}

function _srPanToLonLat(lon, lat) {
  if (typeof proj === 'undefined' || typeof zoom === 'undefined') return;
  const pt = proj([lon, lat]);
  if (!pt || isNaN(pt[0]) || isNaN(pt[1])) return;
  const container = document.getElementById('map-container');
  const W = container ? container.offsetWidth  : window.innerWidth;
  const H = container ? container.offsetHeight : window.innerHeight;
  const k = Math.max(currentZoomK, 4);
  const tx = W / 2 - pt[0] * k;
  const ty = H / 2 - pt[1] * k;
  d3.select('#map-container')
    .transition().duration(600)
    .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
}

// ── Lang change ───────────────────────────
// Invalidate the search index so the next openSearch() reloads
// localized territories + events JSON.
window.addEventListener('langchange', () => {
  _srData   = null;
  _srLoaded = false;
});
