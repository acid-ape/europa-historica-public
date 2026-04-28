// ═══════════════════════════════════════════
//  Europa Historica — Territory Render Module
//  Single source of truth for rendering territory knowledge
//  (context bullets, empty-ruler messages, border-precision).
//  Three call sites in tooltip.js share this module:
//    • showTooltip          → variant: 'tooltip'  (Desktop hover)
//    • createTerritoryPanel → variant: 'panel'    (Desktop click)
//    • _mSheetOpenTerritory → variant: 'mobile'   (Mobile bottom sheet)
//
//  All HTML strings re-evaluate t() per call, so language changes
//  take effect on the next render.
// ═══════════════════════════════════════════

window.EH = window.EH || {};

EH.territoryRender = (() => {
  // Border-precision label + class. Reused via tooltip.js _precLabel/_precClass.
  function precLabel(prec) {
    if (prec === 1) return t('legend_approximate');
    if (prec === 2) return t('legend_moderate');
    if (prec === 3) return t('legend_established');
    return '?';
  }
  const precClass = { 1: 'p1', 2: 'p2', 3: 'p3' };

  // Build context bullet HTML. Variant controls list vs row markup:
  //   'tooltip' / 'panel' → <li>…</li>
  //   'mobile'            → <div class="ms-ctx-row">…</div>
  function buildContextLines(ctx, variant = 'tooltip') {
    if (!ctx) return '';
    const isMobile = variant === 'mobile';
    const wrapOpen  = isMobile ? '<div class="ms-ctx-row">' : '<li>';
    const wrapClose = isMobile ? '</div>'                  : '</li>';
    const labelTag  = isMobile
      ? (label) => `<span class="ctx-label">${label}</span>`
      : (label) => `<span class="ctx-label">${label}</span>`;

    const fields = [
      ['macht',        'tt_ctx_power'],
      ['phase',        'tt_ctx_period'],
      ['besonderheit', 'tt_ctx_notable'],
      ['grenze',       'tt_ctx_borders'],
    ];
    return fields
      .map(([key, i18nKey]) => ctx[key]
        ? `${wrapOpen}${labelTag(t(i18nKey))} ${ctx[key]}${wrapClose}`
        : '')
      .filter(Boolean)
      .join('');
  }

  // Build the "no rulers"-style fallback HTML. Picks one of four messages
  // based on the knowledge object shape:
  //   - knowledge.note            → custom note (with optional URL)
  //   - knowledge.hasRulers       → ruler list / wiki link
  //   - knowledge.rulerDataQuality === 'imprecise'
  //   - else                      → "no precise data" + wiki link
  // Variant controls CSS classes:
  //   'tooltip' / 'panel' → tt-loading + rp-link
  //   'mobile'            → ms-loading + ms-link
  function buildEmptyRulerMessage(knowledge, variant = 'tooltip') {
    const isMobile  = variant === 'mobile';
    const wrapClass = isMobile ? 'ms-loading'  : 'tt-loading';
    const linkClass = isMobile ? 'ms-link'     : 'rp-link';

    if (knowledge.note) {
      const noteUrl  = knowledge.note.match(/https?:\/\/\S+/)?.[0];
      const noteText = knowledge.note.replace(/https?:\/\/\S+/, '').trim();
      const more = noteUrl ? ` <a href="${noteUrl}" target="_blank" class="${linkClass}">→ more</a>` : '';
      return `<div class="${wrapClass}" style="color:#9a8a62">${noteText}${more}</div>`;
    }
    if (knowledge.hasRulers) {
      const linkUrl  = knowledge.rulersUrl || knowledge.wikipedia;
      const linkText = knowledge.rulersUrl ? t('tt_ruler_list') : t('tt_wiki_arrow_back');
      return `<div class="${wrapClass}" style="color:#7a6a4a">${t('tt_no_ruler_period')} <a href="${linkUrl}" target="_blank" class="${linkClass}">${linkText}</a></div>`;
    }
    if (knowledge.rulerDataQuality === 'imprecise') {
      const wikiUrl = knowledge.wikipedia;
      const extraClass = isMobile ? '' : ' rp-link-uncertain';
      const linkHtml = wikiUrl
        ? ` <a href="${wikiUrl}" target="_blank" class="${linkClass}${extraClass}">${t('tt_uncertain')}</a>`
        : '';
      return `<div class="${wrapClass}" style="color:#9a8a62">${t('tt_imprecise')}${linkHtml}</div>`;
    }
    const wikiHref = knowledge.wikipedia || null;
    const link = wikiHref
      ? ` <a href="${wikiHref}" target="_blank" class="${linkClass}">${t('tt_wiki_link')}</a>`
      : '';
    const italic = isMobile ? 'font-style:italic' : 'color:#7a6a4a;font-style:italic';
    return `<div class="${wrapClass}" style="${italic}">${t('tt_no_precise')}${link}</div>`;
  }

  return {
    precLabel,
    precClass,
    buildContextLines,
    buildEmptyRulerMessage,
  };
})();
