// ═══════════════════════════════════════════
//  Pleiades Ancient Cities Layer
//  Toggle: "Pleiades" button cycles OFF → NORMAL → ALL → OFF
//  NORMAL: geographically distributed pool, max 1000, zoom-tiered
//  ALL:    full 2528 cities, no limit
// ═══════════════════════════════════════════

let pleiadesData   = null;   // null = not loaded yet
let pleiadesSorted = [];     // all cities sorted by span desc (importance proxy)
let pleiadesNormal = [];     // geographically distributed pool, max 1000
let pleiadesMode   = 0;      // 0=off  1=normal (distributed)  2=all
let _lastTier      = -1;     // last rendered zoom tier (skip redundant re-renders)
let _lastYear      = null;   // last rendered year (skip if year + tier unchanged)

// Zoom tier thresholds (d3-zoom k value; extent 0.4–12)
function getZoomTier(k) {
  if (k < 2.5) return 0;   // top  80 — continental overview
  if (k < 5.0) return 1;   // top 250 — regional
  if (k < 8.0) return 2;   // top 600 — sub-regional
  return 3;                  // top 1000 — country-level detail
}
const TIER_LIMITS_NORMAL = [80, 250, 600, 1000];

// ── Geographic distribution ───────────────
// Divides map into cellDeg×cellDeg cells; takes top maxPerCell cities per cell
// (sorted by importance first) → prevents clustering in Greece/Italy
function buildNormalPool(cities, maxCount=1000, cellDeg=3.5, maxPerCell=6) {
  const grid = {};
  const pool = [];
  for (const city of cities) {                      // already sorted by importance
    if (pool.length >= maxCount) break;
    const ck = `${Math.floor(city.lon / cellDeg)},${Math.floor(city.lat / cellDeg)}`;
    if ((grid[ck] || 0) < maxPerCell) {
      grid[ck] = (grid[ck] || 0) + 1;
      pool.push(city);
    }
  }
  return pool;
}

// ── Load ──────────────────────────────────
async function loadPleiadesData() {
  if (pleiadesData !== null) return;
  try {
    const r = await fetch('data/knowledge/cities.json');
    if (!r.ok) throw new Error('cities.json not found');
    pleiadesData = await r.json();
    pleiadesSorted = Object.values(pleiadesData)
      .sort((a, b) => (b.end - b.start) - (a.end - a.start));
    pleiadesNormal = buildNormalPool(pleiadesSorted);
    console.log(`Pleiades: ${pleiadesSorted.length} total, ${pleiadesNormal.length} in normal pool`);
  } catch(e) {
    console.warn('Pleiades cities not loaded:', e);
    pleiadesData = {};
    pleiadesSorted = [];
    pleiadesNormal = [];
  }
}

// ── Toggle ────────────────────────────────
// Cycles: 0 (off) → 1 (normal) → 2 (all) → 0
async function togglePleiades() {
  pleiadesMode = (pleiadesMode + 1) % 3;

  const btn      = document.getElementById('pleiades-btn');
  const legEntry = document.getElementById('leg-pleiades');

  if (pleiadesMode === 0) {
    if (btn) { btn.classList.remove('on', 'on-all'); btn.title = 'Ancient settlements — off'; btn.blur(); }
    if (legEntry) legEntry.style.display = 'none';
    d3.select('#g-pleiades').selectAll('*').remove();
    _lastTier = -1;
    _lastYear = null;
    return;
  }

  await loadPleiadesData();

  if (pleiadesMode === 1) {
    if (btn) { btn.classList.add('on'); btn.classList.remove('on-all'); btn.title = 'Ancient settlements — curated (click for all)'; }
  } else {
    if (btn) { btn.classList.add('on', 'on-all'); btn.title = 'Ancient settlements — all shown (click to turn off)'; }
  }
  if (legEntry) legEntry.style.display = 'flex';

  const year = (typeof state !== 'undefined' && typeof pctToYear === 'function')
    ? pctToYear(state.pct) : 0;
  // C9: fade in the layer
  const gP = d3.select('#g-pleiades');
  gP.style('opacity', 0);
  renderPleiadesCities(year);
  requestAnimationFrame(() => gP.transition().duration(200).style('opacity', 1));
}

// Upward triangle — standard archaeological/ancient-site symbol
// r = outer radius (tip to base), centered at origin
const SETTLE_TRIANGLE = (r) =>
  `M0,${-r} L${r * 0.87},${r * 0.5} L${-r * 0.87},${r * 0.5} Z`;

const CROSS_PATH = SETTLE_TRIANGLE(5.5);

// ── Render ────────────────────────────────
function renderPleiadesCities(year) {
  if (pleiadesMode === 0) return;

  const k = (typeof currentZoomK !== 'undefined') ? currentZoomK : 1;

  let pool, limit, tier;
  if (pleiadesMode === 2) {
    // ALL — no geographic cap, no zoom tier limit
    pool  = pleiadesSorted;
    limit = Infinity;
    tier  = -1;
  } else {
    // NORMAL — distributed pool, zoom-tiered
    tier  = getZoomTier(k);
    pool  = pleiadesNormal;
    limit = TIER_LIMITS_NORMAL[tier];
  }

  // Skip re-render if year and zoom tier haven't changed
  if (year === _lastYear && tier === _lastTier) return;
  _lastYear = year;
  _lastTier = tier;

  const gP = d3.select('#g-pleiades');
  gP.selectAll('*').remove();

  const byTime = pool.filter(c => c.start <= year && c.end >= year);
  const cities = limit === Infinity ? byTime : byTime.slice(0, limit);

  // Collect named-city positions for overlap avoidance (Cities > Pleiades priority)
  const _oThresh = 18 / k, _oStep = 20 / k;
  const _occupied = [];
  d3.select('#g-cities').selectAll('g').each(function() {
    const d = d3.select(this).datum();
    if (d) _occupied.push({x: d.cx, y: d.cy});
  });

  cities.forEach(city => {
    const pt = proj([city.lon, city.lat]);
    if (!pt || isNaN(pt[0]) || isNaN(pt[1])) return;
    let [cx, cy] = pt;

    // Offset if overlapping a named city
    if (_occupied.some(m => { const dx=m.x-cx, dy=m.y-cy; return dx*dx+dy*dy < _oThresh*_oThresh; }))
      cx += _oStep;
    _occupied.push({x: cx, y: cy});

    const g = gP.append('g')
      .datum({cx, cy})
      .attr('class', 'pleiades-dot')
      .attr('transform', `translate(${cx},${cy}) scale(${1/k})`)
      .style('cursor', 'pointer')
      .on('mouseenter', e => { if (!tooltipPinned) showPleiadesTT(e, city); })
      .on('mousemove',  e => { if (!tooltipPinned) moveTooltip(e); })
      .on('mouseleave', () => { if (!tooltipPinned) hideTooltip(); })
      .on('click', e => {
        e.stopPropagation();
        selectPleiadesCity(e, city);
      });

    g.append('circle').attr('r', 9).attr('fill', 'transparent');
    g.append('path')
      .attr('d', CROSS_PATH)
      .attr('fill', '#d4a855')
      .attr('fill-opacity', 0.85)
      .attr('stroke', 'rgba(212,168,85,0.3)')
      .attr('stroke-width', 0.5);
  });
}

// ── Tooltip ───────────────────────────────
function showPleiadesTT(event, city) {
  if (typeof _tooltipSerial !== 'undefined') ++_tooltipSerial;
  const typeIconEl3 = document.getElementById('tt-type-icon');
  if (typeIconEl3) typeIconEl3.textContent = '△';
  document.getElementById('tt-name').textContent = city.name;
  const flagEl = document.getElementById('tt-flag');
  if (flagEl) flagEl.style.display = 'none';
  const capRow = document.getElementById('tt-capital-row');
  if (capRow) capRow.style.display = 'none';
  function fmtYear(y) { return y < 0 ? Math.abs(y) + ' BC' : y + ' AD'; }
  const yearStr = fmtYear(city.start) + ' – ' + fmtYear(city.end);
  document.getElementById('tt-sub').textContent = 'Ancient ' + city.type + ' · ' + yearStr;
  const descHtml = city.desc
    ? `<li style="padding-left:0;color:#b0a070">${city.desc}</li>` : '';
  document.getElementById('tt-context').innerHTML = descHtml;
  document.getElementById('tt-ruler-div').style.display = 'none';
  document.getElementById('tt-ruler-label').style.display = 'none';
  document.getElementById('tt-ruler-area').innerHTML = '';
  const precRow = document.getElementById('tt-prec-row');
  if (precRow) precRow.style.display = 'none';
  const descEl = document.getElementById('tt-desc');
  if (descEl) { descEl.style.display = 'none'; descEl.textContent = ''; }
  const ctxSection = document.getElementById('tt-context-section');
  if (ctxSection) ctxSection.style.display = descHtml ? 'block' : 'none';

  const wikiName = encodeURIComponent(city.name.replace(/ /g, '_'));
  document.getElementById('tt-wiki-txt').textContent = 'Wikipedia →';
  document.getElementById('tt-wiki-wp').onclick = () =>
    window.open('https://en.wikipedia.org/wiki/' + wikiName, '_blank');

  const wdEl = document.getElementById('tt-wiki-wd');
  if (city.wikidataId) {
    wdEl.style.display = 'flex';
    document.getElementById('tt-wd-txt').textContent = 'Wikidata ' + city.wikidataId + ' →';
    wdEl.onclick = () =>
      window.open('https://www.wikidata.org/wiki/' + city.wikidataId, '_blank');
  } else {
    wdEl.style.display = 'none';
  }

  _showTooltipEl();
  moveTooltip(event);
}

function selectPleiadesCity(event, city) {
  if (typeof isMobile === 'function' && isMobile()) {
    if (typeof _mSheetOpenPleiades === 'function') _mSheetOpenPleiades(city);
    return;
  }
  tooltipPinned = true;
  showPleiadesTT(event, city);
  document.getElementById('tooltip').classList.add('pinned');
}
