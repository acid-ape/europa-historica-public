let currentZoomK = 1;

// Touch-movement guard: compare D3 zoomTransform before/after touch
// If the map moved (pan or pinch) the territory/marker click is suppressed
let _touchStartTransform = { x: 0, y: 0, k: 1 };

const zoom = d3.zoom()
  .scaleExtent([0.4,12])
  .touchable(true)
  .on('zoom', e => {
    currentZoomK = e.transform.k;
    ['#g-land','#g-rivers','#g-terr','#g-bord','#g-labels','#g-cities','#g-pleiades','#g-events'].forEach(id =>
      d3.select(id).attr('transform', e.transform));
    // Keep Pleiades crosses at constant pixel size
    d3.selectAll('.pleiades-dot').each(function() {
      const d = d3.select(this).datum();
      if (d) d3.select(this).attr('transform', `translate(${d.cx},${d.cy}) scale(${1/currentZoomK})`);
    });
    // Keep Event markers at constant pixel size
    if (typeof rescaleEventMarkers === 'function') rescaleEventMarkers();
    // Re-render Pleiades layer when zoom crosses a density tier boundary (auto mode only)
    if (typeof pleiadesMode !== 'undefined' && pleiadesMode === 1 &&
        typeof getZoomTier === 'function' && typeof _lastTier !== 'undefined') {
      const newTier = getZoomTier(currentZoomK);
      if (newTier !== _lastTier) {
          const year = (typeof state !== 'undefined' && typeof pctToYear === 'function')
          ? pctToYear(state.pct) : 0;
        renderPleiadesCities(year);
      }
    }
  });

d3.select('#map-container')
  .call(zoom)
  .on('mousedown.cur', function() { this.classList.add('dragging'); })
  .on('mouseup.cur',   function() { this.classList.remove('dragging'); })
  .on('touchstart.cur', function() { this.classList.add('dragging'); }, {passive:true})
  .on('touchend.cur',   function() { this.classList.remove('dragging'); });

// Capture phase fires before D3's touchstart (which calls stopImmediatePropagation)
document.addEventListener('touchstart', function() {
  const mc = document.getElementById('map-container');
  if (!mc) return;
  const t = d3.zoomTransform(mc);
  _touchStartTransform = { x: t.x, y: t.y, k: t.k };
}, { passive: true, capture: true });

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════
function setMsg(m) { document.getElementById('loading-msg').textContent = m; }

// ── Reichs-Tooltip draggable ──
(function() {
  const el = document.getElementById('tooltip');
  if (!el) return;
  let dragging = false, startX = 0, startY = 0;

  el.addEventListener('mousedown', e => {
    // Nur ziehen wenn gepinnt und nicht auf Button/Link geklickt
    if (!el.classList.contains('pinned')) return;
    if (['A','BUTTON','SPAN'].includes(e.target.tagName)) return;
    if (e.target.id === 'tt-close') return;
    dragging = true;
    // Tooltip auf absolute Position setzen wenn noch nicht
    if (!el.style.left) {
      const rect = el.getBoundingClientRect();
      el.style.left  = rect.left + 'px';
      el.style.top   = rect.top  + 'px';
      el.style.right = 'auto';
    }
    startX = e.clientX - el.offsetLeft;
    startY = e.clientY - el.offsetTop;
    el.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    el.style.left  = (e.clientX - startX) + 'px';
    el.style.top   = (e.clientY - startY) + 'px';
    el.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
    el.style.cursor = '';
  });
})();

// ── Legende auf Mobile standardmäßig eingeklappt ──
if (window.innerWidth <= 768) {
  const leg = document.getElementById('legend');
  const btn = document.getElementById('legend-toggle');
  if (leg && btn) {
    leg.classList.add('collapsed');
    btn.textContent = '+';
  }
}

// ── Legende verschiebbar ──
(function() {
  const el = document.getElementById('legend');
  if (!el) return;
  let dragging = false, startX = 0, startY = 0;
  const handle = document.getElementById('legend-toggle') || el;

  el.addEventListener('mousedown', e => {
    if (e.target.id === 'legend-resize') return;
    if (e.target.id === 'legend-toggle') return;
    // Convert to top/left positioning before first drag
    const rect = el.getBoundingClientRect();
    el.style.left   = rect.left + 'px';
    el.style.top    = rect.top  + 'px';
    el.style.bottom = 'auto';
    el.style.right  = 'auto';
    dragging = true;
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    el.style.left = Math.max(0, e.clientX - startX) + 'px';
    el.style.top  = Math.max(0, e.clientY - startY) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });
})();
function setLB(v)  { document.getElementById('lb').style.width = v+'%'; }


// ═══════════════════════════════════════════
//  LAND BASE LAYER
// ═══════════════════════════════════════════
let landData = null;

async function loadAndRenderLand() {
  try {
    setMsg('Loading coastline…');
    const r = await fetch('data/base/ne_50m_land.geojson');
    if (!r.ok) throw new Error();
    landData = await r.json();
    renderLand();
  } catch(e) {
    console.warn('Land layer not found, continuing without it');
  }
}

let riverData = null;

async function loadAndRenderRivers() {
  try {
    const r = await fetch('data/base/ne_50m_rivers_lake_centerlines.geojson');
    if (!r.ok) throw new Error('not found');
    riverData = await r.json();
    renderRiversLayer();
  } catch(e) {
    console.warn('River layer not found, continuing without it');
  }
}

function renderRiversLayer() {
  const gR = d3.select('#g-rivers');
  gR.selectAll('*').remove();
  if (!riverData) return;
  gR.append('path')
    .datum(riverData)
    .attr('d', pathGen)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(100,160,220,0.32)')
    .attr('stroke-width', 0.6)
    .attr('stroke-linecap', 'round');
}

function renderLand() {
  const gL = d3.select('#g-land');
  gL.selectAll('*').remove();
  if (!landData) return;
  gL.append('path')
    .datum(landData)
    .attr('d', pathGen)
    .attr('fill', '#1a2a1a')
    .attr('stroke', 'rgba(30,50,30,0.6)')
    .attr('stroke-width', 0.3);
}

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
async function init() {
  setLB(15); buildEpochMarkers();
  setLB(30); updateUI(0); setSpd(1);

  window.addEventListener('resize', () => {
    proj.translate([W()/2, H()/2]);
    renderLand();
    renderRiversLayer();
    if (state.currentEpochIdx !== null) renderEpoch(state.currentEpochIdx);
  });

  setLB(40);
  await loadAndRenderLand();
  setLB(50);
  await loadAndRenderRivers();
  setLB(60);
  await renderEpoch(0);
  setLB(100);

  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
  }, 250);
}

init().catch(err => {
  console.error('init() failed:', err);
  // Ensure loading screen is hidden even on error
  const l = document.getElementById('loading');
  if (l) l.style.display = 'none';
});
