// ═══════════════════════════════════════════
//  Europa Historica — Territories Overview Panel
//  Public simplified view: name, type, ruler count, Wikipedia/Wikidata links
// ═══════════════════════════════════════════

let _terrData    = null;   // territories.json
let _rulerData   = null;   // rulers.json
let _terrLoaded  = false;

// ── Open / Close ──────────────────────────
function openTerrOverview() {
  const el = document.getElementById('terr-overlay');
  if (!el) return;
  el.style.display = 'flex';
  el.offsetHeight; // reflow
  el.classList.add('visible');
  // Render once data is ready (lazy load)
  _loadTerrData().then(() => _renderTable(''));
  // Focus search
  setTimeout(() => {
    const s = document.getElementById('terr-search');
    if (s) s.focus();
  }, 280);
}

function closeTerrOverview() {
  const el = document.getElementById('terr-overlay');
  if (!el) return;
  el.classList.remove('visible');
  el.addEventListener('transitionend', () => { el.style.display = 'none'; }, { once: true });
}

// ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const el = document.getElementById('terr-overlay');
    if (el && el.classList.contains('visible')) closeTerrOverview();
  }
});

// ── Data Loading ──────────────────────────
async function _loadTerrData() {
  if (_terrLoaded) return;
  const [terrRes, rulerRes] = await Promise.all([
    fetch('data/knowledge/territories.json'),
    fetch('data/knowledge/rulers.json'),
  ]);
  _terrData  = await terrRes.json();
  _rulerData = await rulerRes.json();
  _terrLoaded = true;
}

// ── Ruler Count ───────────────────────────
function _rulerCount(territory) {
  const type = territory.territory_type;
  if (type === 'context_only') return null;
  if (type === 'multi_context') {
    let total = 0;
    for (const ctx of (territory.contexts || [])) {
      const qid = ctx.wikidataId || ctx.id;
      if (qid && _rulerData[qid]) total += (_rulerData[qid].rulers || []).length;
    }
    return total || null;
  }
  // ruler_based
  const qid = territory.wikidataId || territory.id;
  if (qid && _rulerData[qid]) return (_rulerData[qid].rulers || []).length || null;
  return null;
}

// ── Epoch Range ───────────────────────────
function _epochKeyToYear(key) {
  if (!key) return null;
  let m = key.match(/world_bc(\d+)/);
  if (m) return -parseInt(m[1]);
  m = key.match(/world_(\d+)/);
  if (m) return parseInt(m[1]);
  return null;
}

function _yearLabel(y) {
  if (y === null) return null;
  return y <= 0 ? `${Math.abs(y)} BC` : `${y}`;
}

function _epochRange(territory) {
  const geo = territory.geodata;
  if (!geo) return null;
  const epochs = geo.epochs || [];
  const first = geo.firstEpoch || epochs[0];
  const last  = epochs[epochs.length - 1] || first;
  const y1 = _epochKeyToYear(first);
  const y2 = _epochKeyToYear(last);
  if (y1 === null) return null;
  const l1 = _yearLabel(y1);
  const l2 = _yearLabel(y2);
  return (l1 === l2 || !l2) ? l1 : `${l1} – ${l2}`;
}

// ── Type Label ────────────────────────────
function _typeLabel(t) {
  if (t === 'multi_context') return 'multi';
  if (t === 'context_only')  return 'ctx';
  if (t === 'ruler_based')   return 'rulers';
  return t || '—';
}

// ── Build Rows ────────────────────────────
function _buildRows(filter) {
  if (!_terrData) return [];

  // Collect context child QIDs to exclude (nested sub-contexts)
  const ctxChildQids = new Set();
  for (const v of Object.values(_terrData)) {
    for (const ctx of (v.contexts || [])) {
      const qid = ctx.wikidataId || ctx.id;
      if (qid) ctxChildQids.add(qid);
    }
  }

  const q = filter.toLowerCase().trim();
  return Object.values(_terrData)
    .filter(terr => !ctxChildQids.has(terr.id) || terr.territory_type === 'multi_context')
    .filter(terr => !q || (terr.label || '').toLowerCase().includes(q))
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
}

// ── Render Table ─────────────────────────
function _renderTable(filter) {
  const tbody = document.getElementById('terr-tbody');
  if (!tbody) return;

  if (!_terrLoaded) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#5a4a2a;padding:20px">${t('terr_loading')}</td></tr>`;
    return;
  }

  const rows = _buildRows(filter);

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#5a4a2a;padding:20px">${t('terr_none')}</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(terr => {
    const qid     = terr.wikidataId || terr.id || '';
    const label   = terr.label || qid;
    const wikiUrl = terr.wikipedia || '';
    const wdUrl   = qid ? `https://www.wikidata.org/wiki/${qid}` : '';
    const count    = _rulerCount(terr);
    const typeStr  = _typeLabel(terr.territory_type);
    const period   = _epochRange(terr);

    const wikiLink = wikiUrl
      ? `<a href="${wikiUrl}" target="_blank" class="to-link" title="Wikipedia">↗</a>`
      : '';
    const qidCell   = qid ? `<a href="${wdUrl}" target="_blank" class="to-qid">${qid}</a>` : '—';
    const countCell = count !== null ? count : '—';
    const periodCell = period || '—';

    return `<tr>
      <td class="to-name">${label}${wikiLink}</td>
      <td class="to-cell">${qidCell}</td>
      <td class="to-cell"><span class="to-type to-type-${terr.territory_type}">${typeStr}</span></td>
      <td class="to-cell to-num">${countCell}</td>
      <td class="to-cell to-num to-period">${periodCell}</td>
    </tr>`;
  }).join('');

  // Update count label
  const lbl = document.getElementById('terr-count-lbl');
  if (lbl) lbl.textContent = `${rows.length} territories`;
}

// ── Search handler ────────────────────────
function _terrSearch(val) {
  _renderTable(val);
}
