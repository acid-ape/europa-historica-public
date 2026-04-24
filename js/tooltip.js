// Returns an X coordinate guaranteed to be right of the legend strip.
// Applies at panel spawn time so panels never overlap the legend.
function _safePanelX(x) {
  const leg = document.getElementById('legend');
  const reserve = leg ? leg.getBoundingClientRect().right + 10 : 230;
  return Math.max(reserve, x);
}

// Serial token — incremented on every new tooltip open.
// Async callbacks compare against the captured serial to avoid
// overwriting a tooltip that has already changed to a different subject.
let _tooltipSerial = 0;

// ── C1: Tooltip fade helpers ──
// _showToken: cancel token for the pending double-rAF in _showTooltipEl.
// Incremented by _hideTooltipEl so a fast mouseleave doesn't let a
// scheduled rAF re-add tt-visible after the tooltip was already hidden.
let _showToken = 0;

function _showTooltipEl() {
  const el = document.getElementById('tooltip');
  const token = ++_showToken;
  if (el.style.display !== 'block') el.style.display = 'block';
  // Two rAFs: first lets display:block render, second triggers transition.
  // Guard with token so a hide() that fires between here and the rAF wins.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (_showToken === token) el.classList.add('tt-visible');
  }));
}
function _hideTooltipEl() {
  ++_showToken;  // cancel any pending show rAF
  const el = document.getElementById('tooltip');
  el.classList.remove('tt-visible');
  setTimeout(() => { if (!el.classList.contains('tt-visible')) el.style.display = 'none'; }, 115);
}

function selectTerritory(el, event, props, color) {
  // Highlight selected (keep previous highlights — multi-select)
  d3.select(el).classed('selected', true)
    .attr('stroke', d3.color(color).brighter(1.5))
    .attr('stroke-width', 1.5);
  _hideTooltipEl();  // dismiss any lingering hover tooltip so name doesn't appear twice
  createTerritoryPanel(event, props, color);
}

let _cpCount = 0;

function createCityPanel(mouseEvent, city) {
  if (isMobile()) { _mSheetOpenCity(city); return; }

  const cid = 'city-' + (city.name || '').replace(/\W+/g, '_');
  const existing = document.querySelector(`.tt-float[data-cid="${CSS.escape(cid)}"]`);
  if (existing) {
    existing.style.zIndex = String(++_tpZBase);
    existing.style.outline = '1px solid var(--gold)';
    setTimeout(() => { existing.style.outline = ''; }, 400);
    return;
  }

  const id = 'cp-' + (++_cpCount);
  const panel = document.createElement('div');
  panel.className = 'tt-float';
  panel.id = id;
  panel.dataset.cid = cid;
  panel.style.left = _safePanelX(mouseEvent.clientX + 20) + 'px';
  panel.style.top  = Math.min(mouseEvent.clientY - 20, window.innerHeight - 250) + 'px';
  panel.style.zIndex = String(++_tpZBase);

  const icon   = city.capital ? '◎' : '⊙';
  const subLbl = city.capital ? 'Capital city' : 'Notable city';

  panel.innerHTML = `
    <div class="tt-float-hdr">
      <span style="font-size:12px;color:#7a6a42;flex-shrink:0;line-height:1">${icon}</span>
      <h3></h3>
      <span class="tp-btn tp-snap" title="Snap to top" onclick="snapPanel('${id}')">⊟</span>
      <span class="tp-btn tt-float-min" title="Minimize" onclick="toggleTtFloat('${id}')">−</span>
      <span class="tp-btn" title="Close" onclick="document.getElementById('${id}').remove()">✕</span>
    </div>
    <div class="tt-sub"></div>
    <div class="tt-float-ctx" style="display:none">
      <div class="tt-section-label">Context</div>
      <div class="tp-desc cp-desc" style="display:none"></div>
    </div>
    <div class="tt-div"></div>
    <div class="tt-float-links" style="display:flex;flex-direction:column;gap:3px;">
      <div class="tt-wiki cp-wiki" style="cursor:pointer">
        <div class="wiki-i">W</div><span>Wikipedia →</span>
      </div>
      <div class="tt-wiki cp-wikidata" style="display:none;cursor:pointer">
        <div class="wiki-i" style="background:#1a2a4a;color:#8ab0da">Q</div><span></span>
      </div>
    </div>`;

  panel.querySelector('h3').textContent = city.name;
  panel.querySelector('.tt-sub').textContent = subLbl;
  if (city.desc) {
    const sub2 = document.createElement('div');
    sub2.className = 'tt-sub';
    sub2.style.color = '#b0a070';
    sub2.textContent = city.desc;
    panel.querySelector('.tt-float-ctx').before(sub2);
  }
  const wikiSlug = encodeURIComponent(city.name.replace(/ /g, '_'));
  panel.querySelector('.cp-wiki').addEventListener('click', () =>
    window.open('https://en.wikipedia.org/wiki/' + wikiSlug, '_blank'));
  if (city.wikidata) {
    const wdEl = panel.querySelector('.cp-wikidata');
    wdEl.style.display = 'flex';
    wdEl.querySelector('span').textContent = 'Wikidata ' + city.wikidata + ' →';
    wdEl.addEventListener('click', () =>
      window.open('https://www.wikidata.org/wiki/' + city.wikidata, '_blank'));
  }

  document.body.appendChild(panel);
  makeDraggable(panel, panel.querySelector('.tt-float-hdr'));

  fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + wikiSlug)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!panel.isConnected || !data || !data.extract) return;
      const desc = panel.querySelector('.cp-desc');
      let txt = data.extract;
      if (txt.length > 300) txt = txt.substring(0, 298) + '…';
      desc.textContent = txt;
      desc.style.display = 'block';
      panel.querySelector('.tt-float-ctx').style.display = '';
    })
    .catch(() => {});
}

function selectCity(event, city) {
  createCityPanel(event, city);
}

function unpinTooltip() {
  tooltipPinned = false;
  const el = document.getElementById('tooltip');
  if (el.classList.contains('snapped')) {
    el.classList.remove('snapped');
    _reflowSnapped();
    const snapBtn = el.querySelector('.tp-snap');
    if (snapBtn) { snapBtn.title = 'Snap to top'; snapBtn.textContent = '⊟'; snapBtn.onclick = () => snapPanel('tooltip'); }
  }
  _hideTooltipEl();
  el.classList.remove('pinned', 'tt-visible', 'minimized');
  const minBtn = document.getElementById('tt-minimize');
  if (minBtn) minBtn.textContent = '−';
  d3.select('#g-terr').selectAll('.territory').classed('selected', false)
    .attr('stroke','none').attr('stroke-width',0);
  state.selectedTerritory = null;
}

// ── Snap panel to top edge ──
function _reflowSnapped() {
  const snapped = [...document.querySelectorAll('.terr-panel.snapped, .ruler-panel-float.snapped, #tooltip.snapped, .tt-float.snapped')];
  const GAP = 6, MARGIN = 6;
  const startX = typeof _safePanelX === 'function' ? _safePanelX(MARGIN) : MARGIN;
  const maxX = window.innerWidth - MARGIN;
  let x = startX, y = MARGIN, rowH = 0;
  snapped.forEach(p => {
    const w = p.offsetWidth  || 280;
    const h = p.offsetHeight || 36;
    if (x + w > maxX && x > startX) {
      y += rowH + GAP;
      x = startX;
      rowH = 0;
    }
    p.style.left   = x + 'px';
    p.style.top    = y + 'px';
    p.style.zIndex = String(Math.max(561, parseInt(p.style.zIndex) || 561));
    x += w + GAP;
    rowH = Math.max(rowH, h);
  });
}

function snapPanel(id) {
  const panel = document.getElementById(id);
  if (!panel || panel.classList.contains('snapped')) return;
  panel._preSnapLeft = panel.style.left;
  panel._preSnapTop  = panel.style.top;
  panel.classList.add('snapped');
  _reflowSnapped();
  const btn = panel.querySelector('.tp-snap, .rp-snap');
  if (btn) { btn.title = 'Unsnap'; btn.textContent = '⊞'; btn.onclick = () => unSnapPanel(id); }
}

function unSnapPanel(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.remove('snapped');
  panel.style.left = panel._preSnapLeft || '100px';
  panel.style.top  = panel._preSnapTop  || '80px';
  _reflowSnapped();
  const btn = panel.querySelector('.tp-snap, .rp-snap');
  if (btn) { btn.title = 'Snap to top'; btn.textContent = '⊟'; btn.onclick = () => snapPanel(id); }
}

// ── Territory Panel (multi-open) ──
let _tpCount = 0;
let _tpZBase = 560;
function createTerritoryPanel(event, props, color) {
  if (isMobile()) {
    _mSheetOpenTerritory(event, props, color);
    return;
  }
  const name    = (props.NAME || '').trim() || props.SUBJECTO || 'Unknown';
  const subj    = props.SUBJECTO || (props.NAME || '').trim() || '';

  // Bring existing panel to front instead of opening a duplicate
  const existing = document.querySelector(`.terr-panel[data-subjecto="${CSS.escape(subj)}"]`);
  if (existing) {
    existing.style.zIndex = String(++_tpZBase);
    existing.style.outline = '1px solid var(--gold)';
    setTimeout(() => { existing.style.outline = ''; }, 400);
    return;
  }

  const prec    = props.BORDERPRECISION || 1;
  const culture = getCulture(props);
  const cultureLabel = (CULTURE_GROUPS[culture]||CULTURE_GROUPS.other).label;
  const currentYear  = pctToYear(state.pct);
  const precLabels   = {1:'Approximate',2:'Moderate',3:'Confirmed'};
  const precClass    = {1:'p1',2:'p2',3:'p3'};

  const id  = 'tp-' + (++_tpCount);
  const off = 80 + ((_tpCount - 1) % 6) * 24;
  const panel = document.createElement('div');
  panel.className = 'terr-panel';
  panel.id = id;
  panel.dataset.subjecto = subj;
  panel.style.left = _safePanelX(event.clientX + 20) + 'px';
  panel.style.top  = Math.min(event.clientY - 20, window.innerHeight - 400) + 'px';

  // Context bullets
  const ctx = buildContext(props, currentYear);
  const ctxLines = [
    ctx.macht       ? `<li><span class="ctx-label">Power</span> ${ctx.macht}</li>` : '',
    ctx.phase       ? `<li><span class="ctx-label">Period</span> ${ctx.phase}</li>` : '',
    ctx.besonderheit? `<li><span class="ctx-label">Notable</span> ${ctx.besonderheit}</li>` : '',
    ctx.grenze      ? `<li><span class="ctx-label">Borders</span> ${ctx.grenze}</li>` : '',
  ].filter(Boolean);
  const ctxHtml = ctxLines.length ? ctxLines.join('') : '';

  let mapping = getMappingForSubjecto(subj);
  if (!mapping) { const m2 = getMappingForSubjecto(name); if (m2) mapping = m2; }
  const wikiName = encodeURIComponent((props.NAME || subj || name).replace(/ /g,'_'));
  const wdHtml = mapping ? `<div class="tt-wiki tp-wiki-wd">
    <div class="wiki-i" style="background:#1a2a4a;color:#8ab0da">Q</div>
    <span class="tp-wd-txt">Wikidata ${mapping.wikidataId} →</span></div>` : '';

  panel.innerHTML = `
    <div class="tp-handle">
      <img class="tp-flag" alt="">
      <span class="tp-title-group"><span class="tp-type-icon">▣</span><span class="tp-name">${name}</span></span>
      <span class="tp-btn tp-snap" title="Snap to top" onclick="snapPanel('${id}')">⊟</span>
      <span class="tp-btn tp-min-btn" title="Minimize" onclick="toggleTpBody('${id}')">−</span>
      <span class="tp-btn" title="Close" onclick="closeTerritoryPanel('${id}')">✕</span>
    </div>
    <div class="tp-body">
      <div class="tp-sub">${cultureLabel}</div>
      <div class="tp-ctx-section"${ctxHtml ? '' : ' style="display:none"'}>
        <div class="tt-section-label">Context</div>
        <div class="tp-desc" style="display:none"></div>
        <ul class="tt-context-list tp-ctx">${ctxHtml}</ul>
        ${ctxHtml ? '<div class="tp-ai-note">This context is simplified · full Wikipedia context coming soon</div>' : ''}
      </div>
      <div class="tt-div tp-ruler-div"></div>
      <div class="tt-section-label tp-ruler-label">Rulers</div>
      <div class="tp-ruler-area">${mapping
        ? '<div class="tt-loading">Loading rulers…</div>'
        : `<div class="tt-loading" style="color:#7a6a4a;font-style:italic">No precise ruler data available, for more info follow the <a href="https://en.wikipedia.org/wiki/${wikiName}" target="_blank" class="rp-link">wiki link →</a></div>`
      }</div>
      <div class="tt-div"></div>
      <div class="tt-row tp-capital-row" style="display:none">
        <span>Capital</span><span class="tp-capital"></span>
      </div>
      <div class="tt-row">
        <span>Border precision</span>
        <span><span class="prec-b ${precClass[prec]}">${precLabels[prec]}</span></span>
      </div>
      <div class="tt-links">
        <div class="tt-wiki tp-wiki-wp">
          <div class="wiki-i">W</div>
          <span class="tp-wiki-txt">Wikipedia →</span>
        </div>
        ${wdHtml}
      </div>
    </div>
    <div class="tp-resize" title="Resize">⤢</div>`;

  // Wire up Wikipedia links
  panel.querySelector('.tp-wiki-wp').onclick = () =>
    window.open('https://en.wikipedia.org/wiki/' + wikiName, '_blank');
  if (mapping) {
    panel.querySelector('.tp-wiki-wd').onclick = () =>
      window.open('https://www.wikidata.org/wiki/' + mapping.wikidataId, '_blank');
  }

  document.body.appendChild(panel);
  // C7: active panel tracking
  panel.addEventListener('mousedown', () => {
    document.querySelectorAll('.terr-panel,.ruler-panel-float').forEach(p => p.classList.remove('active-panel'));
    panel.classList.add('active-panel');
  });
  panel.classList.add('active-panel');
  document.querySelectorAll('.terr-panel,.ruler-panel-float').forEach(p => { if (p !== panel) p.classList.remove('active-panel'); });
  makeDraggable(panel, panel.querySelector('.tp-handle'));
  makePanelResizable(panel, panel.querySelector('.tp-resize'));

  // Async: rulers + context label + description + flag
  if (mapping) {
    loadWikidataKnowledge(mapping, currentYear).then(knowledge => {
      if (!panel.isConnected) return;
      if (knowledge.contextLabel) panel.querySelector('.tp-name').textContent = knowledge.contextLabel;
      panel._territoryLabel = knowledge.contextLabel || name;
      renderRulersInPanel(knowledge, currentYear, panel);
    });
    loadTerritoriesData().then(territories => {
      if (!panel.isConnected) return;
      const territory = territories[mapping.wikidataId];
      if (!territory) return;

      const isValidatedP = territory.status === 'validated';
      const isDataDrivenP = territory.territory_type === 'multi_context' ||
                            territory.territory_type === 'context_only';
      let activeDesc = territory.description || '';
      let activeFlag = territory.flag || null;
      let activeCoat = territory.coatOfArms || null;
      if (territory.territory_type === 'multi_context' && territory.contexts) {
        const activeCtx = territory.contexts.find(c => currentYear >= c.start && currentYear <= c.end);
        if (activeCtx) {
          if (activeCtx.description) activeDesc = activeCtx.description;
          if (activeCtx.flag) activeFlag = activeCtx.flag;
          if (activeCtx.coatOfArms) activeCoat = activeCtx.coatOfArms;
        }
      }

      if (isDataDrivenP || (isValidatedP && activeDesc.trim())) {
        const ctxUl = panel.querySelector('.tp-ctx');
        if (ctxUl) ctxUl.style.display = 'none';
        const aiNote = panel.querySelector('.tp-ai-note');
        if (aiNote) aiNote.style.display = 'none';
      }
      if ((isValidatedP || isDataDrivenP) && activeDesc.trim()) {
        const descEl = panel.querySelector('.tp-desc');
        descEl.textContent = activeDesc;
        descEl.style.display = 'block';
        panel.querySelector('.tp-ctx-section').style.display = '';
      }

      const capital = getCapitalForYear(territory.capitals, currentYear);
      if (capital) {
        const wikiUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(capital.replace(/ /g,'_'));
        panel.querySelector('.tp-capital').innerHTML = `<a href="${wikiUrl}" target="_blank" class="tt-capital-link">${capital}</a>`;
        panel.querySelector('.tp-capital-row').style.display = 'flex';
      }

      const flagEl = panel.querySelector('.tp-flag');
      const flagSrc = activeFlag || activeCoat;
      if (flagSrc) { flagEl.src = flagSrc; flagEl.style.display = 'block'; }
    });
  }
}

function closeTerritoryPanel(id) {
  const panel = document.getElementById(id);
  if (panel) panel.remove();
  // Clear territory highlight if no more panels open for this territory
  if (!document.querySelector('.terr-panel')) {
    d3.select('#g-terr').selectAll('.territory').classed('selected', false)
      .attr('stroke','none').attr('stroke-width',0);
  }
}

function toggleTpBody(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  const body = panel.querySelector('.tp-body');
  const btn  = panel.querySelector('.tp-min-btn');
  if (!body) return;
  const minimized = body.style.display === 'none';
  body.style.display = minimized ? '' : 'none';
  if (!minimized) panel.style.height = ''; // clear resize height so panel collapses cleanly
  if (btn) btn.textContent = minimized ? '−' : '+';
}

function toggleTtFloat(id) {
  const el  = document.getElementById(id);
  const btn = el?.querySelector('.tt-float-min');
  if (!el || !btn) return;
  el.classList.toggle('minimized');
  btn.textContent = el.classList.contains('minimized') ? '+' : '−';
}

function renderRulersInPanel(knowledge, currentYear, panel) {
  const rulerArea = panel.querySelector('.tp-ruler-area');
  if (!rulerArea) return;

  if (knowledge.error) {
    rulerArea.innerHTML = `<div class="tt-loading" style="color:#5a3a2a">${knowledge.error}</div>`;
    return;
  }
  if (!knowledge.rulers || knowledge.rulers.length === 0) {
    let msg;
    if (knowledge.note) {
      const noteUrl  = knowledge.note.match(/https?:\/\/\S+/)?.[0];
      const noteText = knowledge.note.replace(/https?:\/\/\S+/, '').trim();
      msg = `<div class="tt-loading" style="color:#9a8a62">${noteText}${noteUrl ? ` <a href="${noteUrl}" target="_blank" class="rp-link">→ more</a>` : ''}</div>`;
    } else if (knowledge.hasRulers) {
      const linkUrl  = knowledge.rulersUrl || knowledge.wikipedia;
      const linkText = knowledge.rulersUrl ? '→ Ruler list' : '→ Wikipedia';
      msg = `<div class="tt-loading" style="color:#7a6a4a">No ruler for this period. <a href="${linkUrl}" target="_blank" class="rp-link">${linkText}</a></div>`;
    } else if (knowledge.rulerDataQuality === 'imprecise') {
      const wikiUrl = knowledge.wikipedia;
      const linkHtml = wikiUrl ? ` <a href="${wikiUrl}" target="_blank" class="rp-link rp-link-uncertain">→ Uncertain records (Wikipedia)</a>` : '';
      msg = `<div class="tt-loading" style="color:#9a8a62">Imprecise historical records.${linkHtml}</div>`;
    } else {
      const _wikiHref2 = knowledge.wikipedia || null;
      const _link2 = _wikiHref2 ? ` <a href="${_wikiHref2}" target="_blank" class="rp-link">wiki link →</a>` : '';
      msg = `<div class="tt-loading" style="color:#7a6a4a;font-style:italic">No precise ruler data available, for more info follow the${_link2}</div>`;
    }
    rulerArea.innerHTML = msg;
    return;
  }

  const fmt = y => y < 0 ? Math.abs(y)+' BC' : y+' AD';
  panel._rulers = knowledge.rulers;
  const pid = panel.id;
  rulerArea.innerHTML = knowledge.rulers.map((r, i) => {
    const s = r.start ? fmt(r.start) : '?';
    const e = r.end   ? (r._endInferred ? 'c. '+fmt(r.end) : fmt(r.end)) : '–';
    return `<div class="tt-ruler tt-ruler-link" onclick="openRulerDetail(document.getElementById('${pid}')._rulers[${i}], document.getElementById('${pid}'))">${r.name}<span class="tt-ruler-years">(${s}–${e})</span></div>`;
  }).join('');
}

function makePanelResizable(panel, handle) {
  if (!handle) return;
  let startX, startY, startW, startH;
  handle.addEventListener('mousedown', e => {
    e.preventDefault(); e.stopPropagation();
    startX = e.clientX; startY = e.clientY;
    startW = panel.offsetWidth; startH = panel.offsetHeight;
    function onMove(e) {
      panel.style.width  = Math.max(200, startW + e.clientX - startX) + 'px';
      panel.style.height = Math.max(80,  startH + e.clientY - startY) + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  });
}

function showTooltip(event, props, color) {
  const serial = ++_tooltipSerial;
  const name    = (props.NAME || '').trim() || props.SUBJECTO || 'Unknown';
  const subj    = props.SUBJECTO || (props.NAME || '').trim() || '';
  const prec    = props.BORDERPRECISION || 1;
  const culture = getCulture(props);
  const cultureLabel = (CULTURE_GROUPS[culture]||CULTURE_GROUPS.other).label;
  const currentYear = pctToYear(state.pct);
  const precLabels = {1:'Approximate',2:'Moderate',3:'Confirmed'};
  const precClass  = {1:'p1',2:'p2',3:'p3'};

  // ── Mobile: in Tooltip-Bar anzeigen ──
  if (isMobile()) {
    const ctx = buildContext(props, currentYear);
    let mapping = getMappingForSubjecto(subj);
    if (!mapping) { const m2 = getMappingForSubjecto(name); if (m2) mapping = m2; }
    const wikiName = encodeURIComponent((props.NAME || subj || name).replace(/ /g,'_'));
    const wikiBtn = `<a href="https://en.wikipedia.org/wiki/${wikiName}" target="_blank" style="font-size:10px;color:#5a8aaa;display:block;margin-top:4px">Wikipedia →</a>`;

    // Standard: Kontext kurz
    let ctxHtml = '';
    if (ctx.macht) ctxHtml += `<div><span style="color:#7a6a4a;font-size:9px;text-transform:uppercase">Power</span> ${ctx.macht}</div>`;
    if (ctx.phase) ctxHtml += `<div><span style="color:#7a6a4a;font-size:9px;text-transform:uppercase">Period</span> ${ctx.phase}</div>`;

    // Full: alles
    let fullHtml = ctxHtml;
    if (ctx.besonderheit) fullHtml += `<div><span style="color:#7a6a4a;font-size:9px;text-transform:uppercase">Notable</span> ${ctx.besonderheit}</div>`;
    if (ctx.grenze) fullHtml += `<div><span style="color:#7a6a4a;font-size:9px;text-transform:uppercase">Borders</span> ${ctx.grenze}</div>`;
    fullHtml += `<div style="margin-top:4px;color:#9a8a62;font-size:9px">Border precision: ${precLabels[prec]||'?'}</div>`;
    if (mapping) fullHtml += `<a href="https://www.wikidata.org/wiki/${mapping.wikidataId}" target="_blank" style="font-size:10px;color:#5a8aaa;display:block">Wikidata ${mapping.wikidataId} →</a>`;

    const mobilePanel = showMobileTooltip(name, cultureLabel, ctxHtml, fullHtml, wikiBtn);

    // Async: rulers + context label
    if (mapping && mobilePanel) {
      loadWikidataKnowledge(mapping, currentYear).then(knowledge => {
        if (!mobilePanel.isConnected) return;
        // Update panel title to active context label (e.g. "Kingdom of France")
        if (knowledge.contextLabel) {
          const titleEl = mobilePanel.querySelector('.tb-title');
          if (titleEl) titleEl.textContent = knowledge.contextLabel;
        }
        window._currentTerritoryLabel = knowledge.contextLabel || name;
        if (!knowledge.rulers || !knowledge.rulers.length) return;
        const fmt = y => y < 0 ? Math.abs(y)+' BC' : y+' AD';
        window._currentRulers = knowledge.rulers;
        const rulerHtml = '<div style="margin-top:4px;border-top:1px solid #1e1608;padding-top:4px">' +
          knowledge.rulers.map((r, i) =>
            `<div style="color:#d4a843;font-size:13px;cursor:pointer" onclick="openRulerDetail(window._currentRulers[${i}])">${r.name} <span style="color:#9a8a62;font-size:11px">(${fmt(r.start)}–${r.end ? (r._endInferred ? 'c. '+fmt(r.end) : fmt(r.end)) : '–'})</span></div>`
          ).join('') + '</div>';
        const stdBody  = mobilePanel.querySelector('.tb-body-std');
        const fullBody = mobilePanel.querySelector('.tb-body-full');
        if (stdBody)  stdBody.insertAdjacentHTML('beforeend', rulerHtml);
        if (fullBody) fullBody.insertAdjacentHTML('beforeend', rulerHtml);
      });

      // Async: description from territories.json
      loadTerritoriesData().then(territories => {
        if (!mobilePanel.isConnected) return;
        const territory = territories[mapping.wikidataId];
        if (!territory) return;
        let activeDesc = getTerrDesc(territory);
        if (territory.territory_type === 'multi_context' && territory.contexts) {
          const ctx = territory.contexts.find(c => currentYear >= c.start && currentYear <= c.end);
          if (ctx) { const d = getCtxDesc(ctx, territory); if (d) activeDesc = d; }
        }
        if (!activeDesc.trim()) return;
        const descHtml = `<div style="font-style:italic;color:#9a8a62;font-size:11px;margin-top:4px;padding-top:4px;border-top:1px solid #1e1608">${activeDesc}</div>`;
        mobilePanel.querySelector('.tb-body-std')?.insertAdjacentHTML('beforeend', descHtml);
        mobilePanel.querySelector('.tb-body-full')?.insertAdjacentHTML('beforeend', descHtml);
      });
    }
    return;
  }
  const descEl = document.getElementById('tt-desc');
  if (descEl) { descEl.style.display = 'none'; descEl.textContent = ''; }
  const flagEl = document.getElementById('tt-flag');
  if (flagEl) { flagEl.style.display = 'none'; flagEl.src = ''; }
  const evImgEl2 = document.getElementById('tt-event-img');
  if (evImgEl2) { evImgEl2.style.display = 'none'; evImgEl2.src = ''; }
  const capRow = document.getElementById('tt-capital-row');
  if (capRow) capRow.style.display = 'none';
  const gotoBtn2 = document.getElementById('tt-goto-year');
  if (gotoBtn2) gotoBtn2.style.display = 'none';
  const aiNoteEl = document.getElementById('tt-ai-note');
  if (aiNoteEl) aiNoteEl.style.display = 'none';
  const ctxSection = document.getElementById('tt-context-section');
  if (ctxSection) ctxSection.style.display = 'none';
  const ctxUlReset = document.getElementById('tt-context');
  if (ctxUlReset) ctxUlReset.style.display = '';

  // ── Sofort verfügbare Daten ──
  const typeIconEl = document.getElementById('tt-type-icon');
  if (typeIconEl) typeIconEl.textContent = '▣';
  document.getElementById('tt-name').textContent = name;
  document.getElementById('tt-sub').textContent  = cultureLabel ? 'Territory · ' + cultureLabel : 'Territory';
  const precRow = document.getElementById('tt-prec-row');
  if (precRow) precRow.style.display = '';
  document.getElementById('tt-prec').innerHTML   =
    `<span class="prec-b ${precClass[prec]}">${precLabels[prec]}</span>`;

  // Kontext-System (synchron, lokal) — nur anzeigen wenn mapping kein validiertes Territorium ist
  const ctx = buildContext(props, currentYear);
  const ctxList = document.getElementById('tt-context');
  const ctxLines = [
    ctx.macht       ? `<li><span class="ctx-label">Power</span> ${ctx.macht}</li>` : '',
    ctx.phase       ? `<li><span class="ctx-label">Period</span> ${ctx.phase}</li>` : '',
    ctx.besonderheit? `<li><span class="ctx-label">Notable</span> ${ctx.besonderheit}</li>` : '',
    ctx.grenze      ? `<li><span class="ctx-label">Borders</span> ${ctx.grenze}</li>` : '',
  ].filter(Boolean);
  if (ctxLines.length) {
    ctxList.innerHTML = ctxLines.join('');
    ctxSection.style.display = '';
    if (aiNoteEl) aiNoteEl.style.display = '';
  } else {
    ctxList.innerHTML = '';
  }

  // Herrscher-Bereich: erstmal Ladeindikator
  let mapping = getMappingForSubjecto(subj);
  if (!mapping) { const m2 = getMappingForSubjecto(name); if (m2) mapping = m2; }
  const rulerDiv   = document.getElementById('tt-ruler-div');
  const rulerLabel = document.getElementById('tt-ruler-label');
  const rulerArea  = document.getElementById('tt-ruler-area');

  rulerDiv.style.display   = 'block';
  rulerLabel.style.display = 'block';
  if (mapping) {
    rulerArea.innerHTML = `<div class="tt-loading">${t('tt_loading')}</div>`;
  } else {
    const _wikiName2 = encodeURIComponent((props.NAME || subj || name).replace(/ /g,'_'));
    rulerArea.innerHTML = `<div class="tt-loading" style="color:#7a6a4a;font-style:italic">${t('tt_no_precise')} <a href="https://en.wikipedia.org/wiki/${_wikiName2}" target="_blank" class="rp-link">${t('tt_wiki_link')}</a></div>`;
  }

  // Wikipedia-Link
  const wikiName = encodeURIComponent((props.NAME || subj || name).replace(/ /g,'_'));
  const wpEl = document.getElementById('tt-wiki-wp');
  document.getElementById('tt-wiki-txt').textContent = 'Wikipedia →';
  wpEl.onclick = () => window.open(`https://en.wikipedia.org/wiki/${wikiName}`, '_blank');

  // Wikidata-Link
  const wdEl = document.getElementById('tt-wiki-wd');
  if (mapping) {
    wdEl.style.display = 'flex';
    document.getElementById('tt-wd-txt').textContent = `Wikidata ${mapping.wikidataId} →`;
    wdEl.onclick = () => window.open(`https://www.wikidata.org/wiki/${mapping.wikidataId}`, '_blank');
  } else {
    wdEl.style.display = 'none';
  }

  const el = document.getElementById('tooltip');
  _showTooltipEl();
  moveTooltip(event);

  // ── Async: Rulers + Territory laden ──
  if (mapping) {
    loadWikidataKnowledge(mapping, currentYear).then(knowledge => {
      if (_tooltipSerial !== serial) return;
      // Multi-context: Tooltip-Name auf aktiven Kontext-Label aktualisieren
      if (knowledge.contextLabel) {
        document.getElementById('tt-name').textContent = knowledge.contextLabel;
      }
      renderRulers(knowledge, currentYear);
    });

    loadTerritoriesData().then(territories => {
      if (_tooltipSerial !== serial) return;
      const territory = territories[mapping.wikidataId];
      if (!territory) return;

      // Beschreibung aus territories.json — ersetzt Kontext-Stichpunkte
      const isValidated = territory.status === 'validated';
      const isDataDriven = territory.territory_type === 'multi_context' ||
                           territory.territory_type === 'context_only';

      // Multi-context: aktiven Kontext-Block für Jahr suchen
      let activeDesc = getTerrDesc(territory);
      let activeFlag = territory.flag || null;
      let activeCoat = territory.coatOfArms || null;
      if (territory.territory_type === 'multi_context' && territory.contexts) {
        const activeCtx = territory.contexts.find(
          ctx => currentYear >= ctx.start && currentYear <= ctx.end
        );
        if (activeCtx) {
          const ctxDesc = getCtxDesc(activeCtx, territory);
          if (ctxDesc) activeDesc = ctxDesc;
          if (activeCtx.flag) activeFlag = activeCtx.flag;
          if (activeCtx.coatOfArms) activeCoat = activeCtx.coatOfArms;
        }
      }

      const hasDesc = activeDesc.trim().length > 0;
      if (isDataDriven || (isValidated && hasDesc)) {
        const ctxUl = document.getElementById('tt-context');
        if (ctxUl) ctxUl.style.display = 'none';
        const aiNote2 = document.getElementById('tt-ai-note');
        if (aiNote2) aiNote2.style.display = 'none';
      }
      if ((isValidated || isDataDriven) && hasDesc) {
        const descEl2 = document.getElementById('tt-desc');
        if (descEl2) { descEl2.textContent = activeDesc; descEl2.style.display = 'block'; }
        const ctxSec2 = document.getElementById('tt-context-section');
        if (ctxSec2) ctxSec2.style.display = '';
      }

      // Aktuelle Hauptstadt
      const capital = getCapitalForYear(territory.capitals, currentYear);
      const capEl = document.getElementById('tt-capital');
      const capRow = document.getElementById('tt-capital-row');
      if (capEl && capRow) {
        if (capital) {
          const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(capital.replace(/ /g,'_'))}`;
          capEl.innerHTML = `<a href="${wikiUrl}" target="_blank" class="tt-capital-link">${capital}</a>`;
          capRow.style.display = 'flex';
        } else {
          capRow.style.display = 'none';
        }
      }

      // Flagge im Header (kontextabhängig für multi_context)
      const flagEl = document.getElementById('tt-flag');
      if (flagEl) {
        if (activeFlag) {
          flagEl.src   = activeFlag;
          flagEl.style.display = 'block';
        } else if (activeCoat) {
          flagEl.src   = activeCoat;
          flagEl.style.display = 'block';
        } else {
          flagEl.style.display = 'none';
        }
      }
    });
  }
}

function renderRulers(knowledge, currentYear) {
  const rulerArea = document.getElementById('tt-ruler-area');
  if (!rulerArea) return;

  if (knowledge.error) {
    rulerArea.innerHTML = `<div class="tt-loading" style="color:#5a3a2a">${knowledge.error}</div>`;
    return;
  }

  if (!knowledge.rulers || knowledge.rulers.length === 0) {
    let msg;
    if (knowledge.note) {
      // context_only: individueller Hinweis (z.B. Konsuln-Liste)
      const noteUrl  = knowledge.note.match(/https?:\/\/\S+/)?.[0];
      const noteText = knowledge.note.replace(/https?:\/\/\S+/, '').trim();
      msg = `<div class="tt-loading" style="color:#9a8a62">${noteText}${noteUrl ? ` <a href="${noteUrl}" target="_blank" class="rp-link">→ more</a>` : ''}</div>`;
    } else if (knowledge.hasRulers) {
      const linkUrl  = knowledge.rulersUrl || knowledge.wikipedia;
      const linkText = knowledge.rulersUrl ? t('tt_ruler_list') : '→ Wikipedia';
      msg = `<div class="tt-loading" style="color:#7a6a4a">${t('tt_no_ruler_period')} <a href="${linkUrl}" target="_blank" class="rp-link">${linkText}</a></div>`;
    } else if (knowledge.rulerDataQuality === 'imprecise') {
      const wikiUrl = knowledge.wikipedia;
      const linkHtml = wikiUrl ? ` <a href="${wikiUrl}" target="_blank" class="rp-link rp-link-uncertain">${t('tt_uncertain')}</a>` : '';
      msg = `<div class="tt-loading" style="color:#9a8a62">${t('tt_imprecise')}${linkHtml}</div>`;
    } else {
      const titleEl = document.getElementById('tt-name');
      const _slug = titleEl ? encodeURIComponent(titleEl.textContent.replace(/ /g,'_')) : null;
      const _wikiHref = knowledge.wikipedia || (_slug ? `https://en.wikipedia.org/wiki/${_slug}` : null);
      const _link = _wikiHref ? ` <a href="${_wikiHref}" target="_blank" class="rp-link">${t('tt_wiki_link')}</a>` : '';
      msg = `<div class="tt-loading" style="color:#7a6a4a;font-style:italic">${t('tt_no_precise')}${_link}</div>`;
    }
    rulerArea.innerHTML = msg;
    return;
  }

  const fmt = y => y < 0 ? Math.abs(y)+' BC' : y+' AD';
  window._currentTerritoryLabel = knowledge.contextLabel || document.getElementById('tt-name')?.textContent || '';
  window._currentRulers = knowledge.rulers;
  rulerArea.innerHTML = knowledge.rulers.map((r, i) => {
    const s = r.start ? fmt(r.start) : '?';
    const e = r.end   ? (r._endInferred ? 'c. '+fmt(r.end) : fmt(r.end)) : '–';
    return `<div class="tt-ruler tt-ruler-link" onclick="openRulerDetail(window._currentRulers[${i}])">${r.name}<span class="tt-ruler-years">(${s}–${e})</span></div>`;
  }).join('');
}

function showCityTT(event, city) {
  if (isMobile()) { _mSheetOpenCity(city); return; }
  ++_tooltipSerial;
  const typeIconEl2 = document.getElementById('tt-type-icon');
  if (typeIconEl2) typeIconEl2.textContent = city.capital ? '◎' : '⊙';
  document.getElementById('tt-name').textContent = city.name;
  document.getElementById('tt-sub').textContent = city.capital ? t('tt_capital_city') : t('tt_notable_city');
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
  const aiNoteElC = document.getElementById('tt-ai-note');
  if (aiNoteElC) aiNoteElC.style.display = 'none';
  const ctxSection = document.getElementById('tt-context-section');
  if (ctxSection) ctxSection.style.display = descHtml ? 'block' : 'none';
  const flagEl = document.getElementById('tt-flag');
  if (flagEl) flagEl.style.display = 'none';
  const evImgEl3 = document.getElementById('tt-event-img');
  if (evImgEl3) { evImgEl3.style.display = 'none'; evImgEl3.src = ''; }
  const capRow = document.getElementById('tt-capital-row');
  if (capRow) capRow.style.display = 'none';
  const wikiName = encodeURIComponent(city.name.replace(/ /g,'_'));
  document.getElementById('tt-wiki-txt').textContent = 'Wikipedia →';
  document.getElementById('tt-wiki-wp').onclick = () => window.open('https://en.wikipedia.org/wiki/'+wikiName,'_blank');
  const wdEl = document.getElementById('tt-wiki-wd');
  if (city.wikidata) {
    wdEl.style.display = 'flex';
    document.getElementById('tt-wd-txt').textContent = 'Wikidata '+city.wikidata+' →';
    wdEl.onclick = () => window.open('https://www.wikidata.org/wiki/'+city.wikidata,'_blank');
  } else { wdEl.style.display = 'none'; }
  _showTooltipEl();
  moveTooltip(event);
}

function moveTooltip(event) {
  if (tooltipPinned) return;
  const el = document.getElementById('tooltip');
  const x = event.clientX + 15;
  const y = event.clientY - 10;
  el.style.left = (x + 215 > window.innerWidth ? x - 230 : x) + 'px';
  el.style.top  = (y + 220 > window.innerHeight ? y - 210 : y) + 'px';
}

function hideTooltip() {
  if (tooltipPinned) return;
  _hideTooltipEl();
}

// Click on ocean = unpin legacy tooltip + clear highlights
d3.select('#ocean-bg').on('click', () => {
  unpinTooltip();
  // Also clear all territory highlights if no panels are open
  if (!document.querySelector('.terr-panel')) {
    d3.select('#g-terr').selectAll('.territory').classed('selected', false)
      .attr('stroke','none').attr('stroke-width',0);
  }
});

// ═══════════════════════════════════════════
//  LEGEND

// ── Herrscher Detail-Panels (draggable, mehrere gleichzeitig) ──
let _panelCount = 0;

function openRulerDetail(ruler, sourcePanel) {
  const fmt = y => y < 0 ? Math.abs(y)+' BC' : y+' AD';
  const s = ruler.start ? fmt(ruler.start) : '?';
  const e = ruler.end   ? (ruler._endInferred ? 'c. '+fmt(ruler.end) : fmt(ruler.end)) : '–';
  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(ruler.name.replace(/ /g,'_'))}`;
  const wdUrl   = ruler.wikidataId ? `https://www.wikidata.org/wiki/${ruler.wikidataId}` : null;

  // Mobile: bottom sheet
  if (isMobile()) {
    const terrLabel = (sourcePanel && sourcePanel._territoryLabel) || _mSheetCurrentTerrLabel || '';
    _mSheetOpenRuler(ruler, terrLabel);
    return;
  }

  const id = 'rp-' + (++_panelCount);
  const offsetX = 80 + (_panelCount % 5) * 30;
  const offsetY = 80 + (_panelCount % 5) * 30;

  const panel = document.createElement('div');
  panel.className = 'ruler-panel-float';
  panel.id = id;
  panel.style.left = offsetX + 'px';
  panel.style.top  = offsetY + 'px';
  const imgHtml = ruler.image
    ? `<img src="${ruler.image}" class="rp-img" style="opacity:0;transition:opacity 200ms ease-out" onload="this.style.opacity=1" alt="${ruler.name}">`
    : '';

  // Use panel-scoped label if available (multi-panel safe), else fall back to legacy global
  const territoryLabel = (sourcePanel && sourcePanel._territoryLabel)
    || window._currentTerritoryLabel || '';
  const flagEl = sourcePanel
    ? sourcePanel.querySelector('.tp-flag')
    : document.getElementById('tt-flag');
  const flagUrl = flagEl && flagEl.style.display !== 'none' ? flagEl.src : null;
  panel.innerHTML = `
    <div class="rp-drag-handle">
      ${flagUrl ? `<img src="${flagUrl}" class="rp-header-flag" alt="">` : ''}
      <span class="rp-title-group"><span class="rp-type-icon">♛</span><span class="rp-title">${territoryLabel || ruler.name}</span></span>
      <span class="rp-btn rp-snap" onclick="snapPanel('${id}')" title="Snap to top">⊟</span>
      <span class="rp-btn" onclick="toggleMinimize('${id}')" title="Minimize">−</span>
      <span class="rp-btn" onclick="document.getElementById('${id}').remove()" title="Close">✕</span>
    </div>
    <div class="rp-body">
      ${imgHtml}
      <div class="rp-ruler-name">${ruler.name}</div>
      <div class="rp-years">Ruled ${s} – ${e}</div>
      <div class="rp-links">
        <a href="${wikiUrl}" target="_blank" class="rp-link">Wikipedia →</a>
        ${wdUrl ? `<a href="${wdUrl}" target="_blank" class="rp-link">Wikidata ${ruler.wikidataId} →</a>` : ''}
      </div>
    </div>
    <div class="rp-mode-btns">
      <div class="rp-mode-btn rp-move-btn" title="Move">✥</div>
      <div class="rp-mode-btn rp-resize-btn" title="Resize">⤢</div>
    </div>
    <div class="rp-resize" title="Resize">⤢</div>`;

  // Touch-fähige Modus-Buttons für Panel
  const moveBtn   = panel.querySelector('.rp-move-btn');
  const resizeBtn = panel.querySelector('.rp-resize-btn');
  let panelMode = null;

  function setPanelMode(mode) {
    panelMode = panelMode === mode ? null : mode;
    moveBtn.classList.toggle('active', panelMode === 'move');
    resizeBtn.classList.toggle('active', panelMode === 'resize');
    panel.querySelector('.rp-drag-handle').style.cursor = panelMode === 'move' ? 'move' : 'default';
  }

  moveBtn.addEventListener('click', () => setPanelMode('move'));
  resizeBtn.addEventListener('click', () => setPanelMode('resize'));

  // Touch drag voor panel
  function getPanelXY(e) {
    return e.touches ? [e.touches[0].clientX, e.touches[0].clientY] : [e.clientX, e.clientY];
  }
  let pStartX, pStartY, pOrigL, pOrigT, pOrigW, pOrigH;

  panel.style.touchAction = 'none';
  panel.addEventListener('touchstart', e => {
    if (!panelMode) return;
    if (e.target.classList.contains('rp-mode-btn') || e.target.classList.contains('rp-btn')) return;
    const [cx,cy] = getPanelXY(e);
    const rect = panel.getBoundingClientRect();
    pStartX = cx; pStartY = cy;
    pOrigL = rect.left; pOrigT = rect.top;
    pOrigW = panel.offsetWidth; pOrigH = panel.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  }, {passive:false});

  panel.addEventListener('touchmove', e => {
    if (!panelMode || pStartX === undefined) return;
    const [cx,cy] = getPanelXY(e);
    if (panelMode === 'move') {
      panel.style.left = (pOrigL + cx - pStartX) + 'px';
      panel.style.top  = (pOrigT + cy - pStartY) + 'px';
    } else if (panelMode === 'resize') {
      panel.style.width  = Math.max(160, pOrigW + cx - pStartX) + 'px';
      panel.style.height = Math.max(100, pOrigH + cy - pStartY) + 'px';
    }
    e.preventDefault();
    e.stopPropagation();
  }, {passive:false});

  document.addEventListener('touchend', () => { pStartX = undefined; });

  document.body.appendChild(panel);
  // C7: active panel tracking
  panel.addEventListener('mousedown', () => {
    document.querySelectorAll('.terr-panel,.ruler-panel-float').forEach(p => p.classList.remove('active-panel'));
    panel.classList.add('active-panel');
  });
  panel.classList.add('active-panel');
  document.querySelectorAll('.terr-panel,.ruler-panel-float').forEach(p => { if (p !== panel) p.classList.remove('active-panel'); });
  makeDraggable(panel, panel.querySelector('.rp-drag-handle'));
  makeResizable(panel);
}

function makeDraggable(el, handle) {
  let x = 0, y = 0;

  function moveDrag(cx, cy) {
    const dx = cx - x, dy = cy - y;
    x = cx; y = cy;
    el.style.left = (el.offsetLeft + dx) + 'px';
    el.style.top  = (el.offsetTop  + dy) + 'px';
  }

  // Mouse — use addEventListener so release outside the window is always cleaned up
  handle.addEventListener('mousedown', e => {
    if (e.target.classList.contains('rp-btn') || e.target.classList.contains('tp-btn')) return;
    e.preventDefault();
    x = e.clientX; y = e.clientY;
    function onMove(e) { moveDrag(e.clientX, e.clientY); }
    function onUp()    { document.removeEventListener('mousemove', onMove);
                         document.removeEventListener('mouseup',   onUp); }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  });

  // Touch
  handle.addEventListener('touchstart', e => {
    if (e.target.classList.contains('rp-btn') || e.target.classList.contains('tp-btn')) return;
    const t = e.touches[0];
    x = t.clientX; y = t.clientY;
  }, {passive: true});
  handle.addEventListener('touchmove', e => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
    e.preventDefault();
  }, {passive: false});
}

function makeResizable(el) {
  const handle = el.querySelector('.rp-resize');
  if (!handle) return;
  let startX, startY, startW, startH;
  handle.addEventListener('mousedown', e => {
    e.preventDefault(); e.stopPropagation();
    startX = e.clientX; startY = e.clientY;
    startW = el.offsetWidth; startH = el.offsetHeight;
    function onMove(e) {
      el.style.width  = Math.max(180, startW + e.clientX - startX) + 'px';
      el.style.height = Math.max(80,  startH + e.clientY - startY) + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  });
}

function toggleMinimize(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  const body = panel.querySelector('.rp-body');
  const btn  = panel.querySelector('.rp-btn');
  if (!body) return;
  const minimized = body.style.display === 'none';
  body.style.display = minimized ? 'block' : 'none';
  btn.textContent    = minimized ? '−' : '+';
}

function closeRulerPanel() {
  document.getElementById('ruler-panel')?.remove();
}

// ── Tooltip: minimize ──
function toggleMinimizeTooltip() {
  const el  = document.getElementById('tooltip');
  const btn = document.getElementById('tt-minimize');
  if (!el || !btn) return;
  el.classList.toggle('minimized');
  btn.textContent = el.classList.contains('minimized') ? '+' : '−';
}


// ── Tooltip Modus-Buttons (Verschieben + Größe) ──────────────
let _ttMode = null; // 'move' | 'resize' | null

function toggleTooltipMode(mode) {
  const el     = document.getElementById('tooltip');
  const btnRes = document.getElementById('tt-btn-resize');
  if (!el) return;

  if (_ttMode === mode) {
    _ttMode = null;
    el.classList.remove('move-mode', 'resize-mode');
    el.style.touchAction = '';
    if (btnRes) btnRes.classList.remove('active');
  } else {
    _ttMode = mode;
    el.classList.remove('move-mode', 'resize-mode');
    el.classList.add(mode + '-mode');
    el.style.touchAction = 'none'; // verhindert Karten-Pan
    if (btnRes) btnRes.classList.toggle('active', mode === 'resize');

    if (mode === 'move') setupTooltipMove(el);
    if (mode === 'resize') setupTooltipResize(el);
  }
}

function setupTooltipMove(el) {
  let startX, startY, origLeft, origTop;

  function getXY(e) {
    return e.touches ? [e.touches[0].clientX, e.touches[0].clientY] : [e.clientX, e.clientY];
  }

  function onStart(e) {
    if (_ttMode !== 'move') return;
    if (e.target.classList.contains('tt-mode-btn')) return;
    const [cx, cy] = getXY(e);
    const rect = el.getBoundingClientRect();
    startX = cx; startY = cy;
    origLeft = rect.left; origTop = rect.top;
    el.style.left = origLeft + 'px';
    el.style.top  = origTop  + 'px';
    el.style.right = 'auto';
    e.preventDefault();
    e.stopPropagation();
  }

  function onMove(e) {
    if (_ttMode !== 'move' || startX === undefined) return;
    const [cx, cy] = getXY(e);
    el.style.left = (origLeft + cx - startX) + 'px';
    el.style.top  = (origTop  + cy - startY) + 'px';
    e.preventDefault();
    e.stopPropagation();
  }

  function onEnd() { startX = undefined; }

  el.addEventListener('touchstart', onStart, {passive:false});
  el.addEventListener('touchmove',  onMove,  {passive:false});
  el.addEventListener('touchend',   onEnd);
  el.addEventListener('mousedown',  onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onEnd);
}

function setupTooltipResize(el) {
  const handle = document.getElementById('tt-resize-handle');
  if (!handle) return;
  let startX, startY, startW, startH;

  function getXY(e) {
    return e.touches ? [e.touches[0].clientX, e.touches[0].clientY] : [e.clientX, e.clientY];
  }

  function onStart(e) {
    const [cx, cy] = getXY(e);
    startX = cx; startY = cy;
    startW = el.offsetWidth; startH = el.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  }

  function onMove(e) {
    if (startX === undefined) return;
    const [cx, cy] = getXY(e);
    el.style.width  = Math.max(160, startW + cx - startX) + 'px';
    el.style.height = Math.max(100, startH + cy - startY) + 'px';
    e.preventDefault();
  }

  function onEnd() { startX = undefined; }

  handle.addEventListener('touchstart', onStart, {passive:false});
  handle.addEventListener('mousedown',  onStart);
  document.addEventListener('touchmove', onMove, {passive:false});
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchend',  onEnd);
  document.addEventListener('mouseup',   onEnd);
}

// ── isMobile ───────────────────────────────
function isMobile() {
  return window.innerWidth <= 768;
}

// ═══════════════════════════════════════════
//  MOBILE BOTTOM SHEET
// ═══════════════════════════════════════════
let _mSheetCurrentTerrHTML  = null;
let _mSheetCurrentTerrLabel = null;

function _mSheetOpen(html, label, showBack) {
  const sheet  = document.getElementById('m-sheet');
  const scroll = document.getElementById('m-sheet-scroll');
  const lbl    = document.getElementById('m-sheet-nav-label');
  const back   = document.getElementById('m-sheet-back');
  if (scroll) scroll.innerHTML = html;
  if (lbl)    lbl.textContent  = label || '';
  if (back)   back.style.display = showBack ? 'block' : 'none';
  if (sheet)  sheet.classList.add('open');
}

function _mSheetClose() {
  const sheet = document.getElementById('m-sheet');
  if (sheet) sheet.classList.remove('open');
  _mSheetCurrentTerrHTML  = null;
  _mSheetCurrentTerrLabel = null;
  // Clear territory highlights
  d3.select('#g-terr').selectAll('.territory').classed('selected', false)
    .attr('stroke', 'none').attr('stroke-width', 0);
  if (typeof state !== 'undefined') state.selectedTerritory = null;
}

function _mSheetBack() {
  if (_mSheetCurrentTerrHTML) {
    const lbl  = document.getElementById('m-sheet-nav-label');
    const back = document.getElementById('m-sheet-back');
    const scroll = document.getElementById('m-sheet-scroll');
    if (scroll) scroll.innerHTML = _mSheetCurrentTerrHTML;
    if (lbl)    lbl.textContent  = _mSheetCurrentTerrLabel || '';
    if (back)   back.style.display = 'none';
    // Re-wire ruler click handlers after restoring HTML
    _mSheetRewireRulers();
  } else {
    _mSheetClose();
  }
}

function _mSheetSaveState() {
  const scroll = document.getElementById('m-sheet-scroll');
  if (scroll) _mSheetCurrentTerrHTML = scroll.innerHTML;
}

function _mSheetRewireRulers() {
  // After restoring territory HTML, re-attach ruler click handlers
  document.querySelectorAll('#m-sheet-scroll .ms-ruler[data-ridx]').forEach(el => {
    const i = parseInt(el.dataset.ridx);
    if (_mSheetRulersCache && _mSheetRulersCache[i]) {
      const r = _mSheetRulersCache[i];
      el.onclick = () => _mSheetOpenRuler(r, _mSheetCurrentTerrLabel || '');
    }
  });
}

let _mSheetRulersCache = null;

function _mSheetOpenTerritory(event, props, color) {
  _mSheetRulersCache = null;
  const name = (props.NAME || '').trim() || props.SUBJECTO || 'Unknown';
  const subj = props.SUBJECTO || (props.NAME || '').trim() || '';
  const culture = getCulture(props);
  const cultureLabel = (CULTURE_GROUPS[culture] || CULTURE_GROUPS.other).label;
  const currentYear  = pctToYear(state.pct);
  const prec = props.BORDERPRECISION || 1;
  const precLabels = {1:'Approximate',2:'Moderate',3:'Confirmed'};
  const precClass  = {1:'p1',2:'p2',3:'p3'};

  const ctx = buildContext(props, currentYear);
  const ctxLines = [
    ctx.macht        ? `<div class="ms-ctx-row"><span class="ctx-label">Power</span> ${ctx.macht}</div>` : '',
    ctx.phase        ? `<div class="ms-ctx-row"><span class="ctx-label">Period</span> ${ctx.phase}</div>` : '',
    ctx.besonderheit ? `<div class="ms-ctx-row"><span class="ctx-label">Notable</span> ${ctx.besonderheit}</div>` : '',
    ctx.grenze       ? `<div class="ms-ctx-row"><span class="ctx-label">Borders</span> ${ctx.grenze}</div>` : '',
  ].filter(Boolean).join('');

  let mapping  = getMappingForSubjecto(subj);
  if (!mapping) { const m2 = getMappingForSubjecto(name); if (m2) mapping = m2; }
  const wikiName = encodeURIComponent((props.NAME || subj || name).replace(/ /g, '_'));

  const html = `
    <div style="float:right;margin:0 0 6px 8px;display:none" id="ms-flag-wrap">
      <img id="ms-flag" alt="" style="height:28px;width:auto;max-width:48px;object-fit:contain;border:1px solid rgba(255,255,255,0.12);border-radius:2px;">
    </div>
    <div class="ms-title" id="ms-name">${name}</div>
    <div class="ms-sub">${cultureLabel ? 'Territory · ' + cultureLabel : 'Territory'}</div>
    <div class="ms-desc" id="ms-desc" style="display:none"></div>
    <div class="ms-ctx" id="ms-ctx">${ctxLines || ''}</div>
    ${ctxLines ? '<div class="tp-ai-note" id="ms-ai-note">This context is simplified · full Wikipedia context coming soon</div>' : ''}
    <div id="ms-ruler-section" style="display:none">
      <div class="ms-section-label">Rulers</div>
      <div id="ms-ruler-area">${mapping ? '<div class="ms-loading">Loading…</div>' : ''}</div>
    </div>
    <div class="tt-div"></div>
    <div class="ms-row" id="ms-capital-row" style="display:none">
      <span>Capital</span><span id="ms-capital"></span>
    </div>
    <div class="ms-row">
      <span>Border precision</span>
      <span><span class="prec-b ${precClass[prec]}">${precLabels[prec]}</span></span>
    </div>
    <div class="ms-links">
      <a href="https://en.wikipedia.org/wiki/${wikiName}" target="_blank" class="ms-link">Wikipedia →</a>
      ${mapping ? `<a href="https://www.wikidata.org/wiki/${mapping.wikidataId}" target="_blank" class="ms-link">Wikidata ${mapping.wikidataId} →</a>` : ''}
    </div>`;

  _mSheetCurrentTerrLabel = name;
  _mSheetCurrentTerrHTML  = null;
  _mSheetOpen(html, name, false);

  if (mapping) {
    loadWikidataKnowledge(mapping, currentYear).then(knowledge => {
      const nameEl = document.getElementById('ms-name');
      if (!nameEl) return;
      if (knowledge.contextLabel) {
        nameEl.textContent = knowledge.contextLabel;
        _mSheetCurrentTerrLabel = knowledge.contextLabel;
        const lbl = document.getElementById('m-sheet-nav-label');
        if (lbl) lbl.textContent = knowledge.contextLabel;
      }
      const rulerArea = document.getElementById('ms-ruler-area');
      if (!rulerArea) return;
      if (knowledge.error) {
        rulerArea.innerHTML = `<div class="ms-loading" style="color:#5a3a2a">${knowledge.error}</div>`;
        const sec = document.getElementById('ms-ruler-section');
        if (sec) sec.style.display = 'block';
        _mSheetSaveState();
        return;
      }
      if (!knowledge.rulers || !knowledge.rulers.length) {
        let msg;
        if (knowledge.note) {
          const noteUrl  = knowledge.note.match(/https?:\/\/\S+/)?.[0];
          const noteText = knowledge.note.replace(/https?:\/\/\S+/, '').trim();
          msg = `<div class="ms-loading">${noteText}${noteUrl ? ` <a href="${noteUrl}" target="_blank" class="ms-link">→ more</a>` : ''}</div>`;
        } else if (knowledge.hasRulers) {
          const linkUrl  = knowledge.rulersUrl || knowledge.wikipedia;
          const linkText = knowledge.rulersUrl ? '→ Ruler list' : '→ Wikipedia';
          msg = `<div class="ms-loading">No ruler for this period. <a href="${linkUrl}" target="_blank" class="ms-link">${linkText}</a></div>`;
        } else if (knowledge.rulerDataQuality === 'imprecise') {
          const wikiUrl = knowledge.wikipedia;
          const linkHtml = wikiUrl ? ` <a href="${wikiUrl}" target="_blank" class="ms-link">→ Uncertain records (Wikipedia)</a>` : '';
          msg = `<div class="ms-loading">Imprecise historical records.${linkHtml}</div>`;
        } else {
          const wikiHref = knowledge.wikipedia || null;
          const link = wikiHref ? ` <a href="${wikiHref}" target="_blank" class="ms-link">wiki link →</a>` : '';
          msg = `<div class="ms-loading" style="font-style:italic">No precise ruler data available, for more info follow the${link}</div>`;
        }
        rulerArea.innerHTML = msg;
        const sec = document.getElementById('ms-ruler-section');
        if (sec) sec.style.display = 'block';
        _mSheetSaveState();
        return;
      }
      const fmt = y => y < 0 ? Math.abs(y)+' BC' : y+' AD';
      _mSheetRulersCache = knowledge.rulers;
      rulerArea.innerHTML = knowledge.rulers.map((r, i) => {
        const s = r.start ? fmt(r.start) : '?';
        const e = r.end   ? (r._endInferred ? 'c. '+fmt(r.end) : fmt(r.end)) : '–';
        return `<div class="ms-ruler" data-ridx="${i}">${r.name}<span class="ms-ruler-years">(${s}–${e})</span></div>`;
      }).join('');
      knowledge.rulers.forEach((r, i) => {
        const el = rulerArea.querySelector(`[data-ridx="${i}"]`);
        if (el) el.onclick = () => _mSheetOpenRuler(r, knowledge.contextLabel || name);
      });
      const section = document.getElementById('ms-ruler-section');
      if (section) section.style.display = 'block';
      _mSheetSaveState();
    });

    loadTerritoriesData().then(territories => {
      const nameEl = document.getElementById('ms-name');
      if (!nameEl) return;
      const territory = territories[mapping.wikidataId];
      if (!territory) { _mSheetSaveState(); return; }

      let activeDesc = territory.description || '';
      let activeFlag = territory.flag || null;
      let activeCoat = territory.coatOfArms || null;
      if (territory.territory_type === 'multi_context' && territory.contexts) {
        const ac = territory.contexts.find(c => currentYear >= c.start && currentYear <= c.end);
        if (ac) {
          if (ac.description) activeDesc = ac.description;
          if (ac.flag) activeFlag = ac.flag;
          if (ac.coatOfArms) activeCoat = ac.coatOfArms;
        }
      }

      if (activeDesc.trim()) {
        const descEl = document.getElementById('ms-desc');
        if (descEl) { descEl.textContent = activeDesc; descEl.style.display = 'block'; }
        const ctxEl = document.getElementById('ms-ctx');
        if (ctxEl) ctxEl.style.display = 'none';
        const aiNoteEl = document.getElementById('ms-ai-note');
        if (aiNoteEl) aiNoteEl.style.display = 'none';
      }

      const capital = getCapitalForYear(territory.capitals, currentYear);
      if (capital) {
        const capEl  = document.getElementById('ms-capital');
        const capRow = document.getElementById('ms-capital-row');
        if (capEl && capRow) {
          const wikiUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(capital.replace(/ /g, '_'));
          capEl.innerHTML = `<a href="${wikiUrl}" target="_blank" class="ms-link">${capital}</a>`;
          capRow.style.display = 'flex';
        }
      }

      const flagSrc = activeFlag || activeCoat;
      if (flagSrc) {
        const wrap = document.getElementById('ms-flag-wrap');
        const img  = document.getElementById('ms-flag');
        if (wrap && img) { img.src = flagSrc; wrap.style.display = 'block'; }
      }
      _mSheetSaveState();
    });
  }
}

function _mSheetOpenRuler(ruler, territoryLabel) {
  const fmt = y => y < 0 ? Math.abs(y)+' BC' : y+' AD';
  const s = ruler.start ? fmt(ruler.start) : '?';
  const e = ruler.end   ? (ruler._endInferred ? 'c. '+fmt(ruler.end) : fmt(ruler.end)) : '–';
  const wikiUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(ruler.name.replace(/ /g, '_'));
  const wdUrl   = ruler.wikidataId ? 'https://www.wikidata.org/wiki/' + ruler.wikidataId : null;
  const imgHtml = ruler.image
    ? `<img src="${ruler.image}" class="ms-ruler-img" alt="${ruler.name}">`
    : '';

  if (!_mSheetCurrentTerrHTML) _mSheetSaveState();

  const html = `
    ${imgHtml}
    <div class="ms-ruler-name">${ruler.name}</div>
    ${territoryLabel ? `<div class="ms-sub">${territoryLabel}</div>` : ''}
    <div class="ms-years-big">${s} – ${e}</div>
    <div class="ms-links">
      <a href="${wikiUrl}" target="_blank" class="ms-link">Wikipedia →</a>
      ${wdUrl ? `<a href="${wdUrl}" target="_blank" class="ms-link">Wikidata ${ruler.wikidataId} →</a>` : ''}
    </div>`;

  _mSheetOpen(html, territoryLabel || ruler.name, true);
}

function _mSheetOpenCity(city) {
  const wikiName = encodeURIComponent(city.name.replace(/ /g, '_'));
  const wdUrl    = city.wikidata ? 'https://www.wikidata.org/wiki/' + city.wikidata : null;

  const html = `
    <div class="ms-sub">${city.capital ? 'Capital city' : 'Notable city'}</div>
    ${city.desc ? `<div class="ms-ctx-row" style="margin-top:6px">${city.desc}</div>` : ''}
    <div class="ms-links" style="margin-top:12px">
      <a href="https://en.wikipedia.org/wiki/${wikiName}" target="_blank" class="ms-link">Wikipedia →</a>
      ${wdUrl ? `<a href="${wdUrl}" target="_blank" class="ms-link">Wikidata ${city.wikidata} →</a>` : ''}
    </div>`;

  _mSheetCurrentTerrHTML  = null;
  _mSheetCurrentTerrLabel = null;
  _mSheetOpen(html, city.name, false);
}

function _mSheetOpenPleiades(city) {
  function fmtY(y) { return y < 0 ? Math.abs(y) + ' BC' : y + ' AD'; }
  const yearStr   = fmtY(city.start) + ' – ' + fmtY(city.end);
  const wikiName  = encodeURIComponent(city.name.replace(/ /g, '_'));
  const wdUrl     = city.wikidataId ? 'https://www.wikidata.org/wiki/' + city.wikidataId : null;

  const html = `
    <div class="ms-sub">Ancient ${city.type} · ${yearStr}</div>
    ${city.desc ? `<div class="ms-ctx-row" style="margin-top:6px">${city.desc}</div>` : ''}
    <div class="ms-links" style="margin-top:12px">
      <a href="https://en.wikipedia.org/wiki/${wikiName}" target="_blank" class="ms-link">Wikipedia →</a>
      ${wdUrl ? `<a href="${wdUrl}" target="_blank" class="ms-link">Wikidata ${city.wikidataId} →</a>` : ''}
    </div>`;

  _mSheetCurrentTerrHTML  = null;
  _mSheetCurrentTerrLabel = null;
  _mSheetOpen(html, city.name, false);
}

function _mSheetOpenEvent(ev) {
  function fmtY(y) { return y < 0 ? Math.abs(y) + ' BC' : y + ' AD'; }
  const wikiName = encodeURIComponent(ev.wiki.replace(/ /g, '_'));

  const html = `
    <img id="ms-ev-img" alt="${ev.title}" style="display:none;width:100%;max-height:160px;object-fit:cover;border-radius:4px;margin-bottom:8px">
    <div class="ms-sub">${fmtY(ev.year)}</div>
    <div class="ms-loading" id="ms-ev-desc">Loading…</div>
    <div class="ms-links" style="margin-top:12px">
      <a href="https://en.wikipedia.org/wiki/${wikiName}" target="_blank" class="ms-link">Wikipedia →</a>
    </div>
    <button class="ms-goto-year" onclick="_jumpToEventYear()">⏱ Go to ${fmtY(ev.year)}</button>`;

  _mSheetCurrentTerrHTML  = null;
  _mSheetCurrentTerrLabel = null;
  _mSheetOpen(html, ev.title, false);

  fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(ev.wiki))
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data) return;
      const descEl = document.getElementById('ms-ev-desc');
      if (descEl) {
        if (data.extract) {
          let txt = data.extract;
          if (txt.length > 300) txt = txt.substring(0, 298) + '…';
          descEl.textContent = txt;
          descEl.className = 'ms-ctx-row';
        } else {
          descEl.style.display = 'none';
        }
      }
      if (data.thumbnail && data.thumbnail.source) {
        const imgEl = document.getElementById('ms-ev-img');
        if (imgEl) { imgEl.src = data.thumbnail.source; imgEl.style.display = 'block'; }
      }
    })
    .catch(() => {
      const el = document.getElementById('ms-ev-desc');
      if (el) el.style.display = 'none';
    });
}

// ── #tooltip: drag by header (same as terr-panel / ruler-panel) ──
(function() {
  const tt  = document.getElementById('tooltip');
  const hdr = document.getElementById('tt-header');
  if (tt && hdr) makeDraggable(tt, hdr);
})();

// ── Sheet: swipe-to-dismiss ──
(function() {
  let _ty = 0;
  const handle = document.getElementById('m-sheet-handle');
  if (!handle) return;
  handle.addEventListener('touchstart', e => { _ty = e.touches[0].clientY; }, {passive: true});
  handle.addEventListener('touchend',   e => {
    if (e.changedTouches[0].clientY - _ty > 50) _mSheetClose();
  });
})();
