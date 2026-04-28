// ═══════════════════════════════════════════
//  Europa Historica — i18n
//  UI strings: t(key)  ·  data suffix: getDataSuffix()
//  Add a language: add I18N[code] + a *_code.json for each data file
// ═══════════════════════════════════════════

const I18N = {
  en: {
    // Era buttons
    era_prehistoric:  'Prehistory',
    era_bronze_age:   'Bronze Age',
    era_antiquity:    'Antiquity',
    era_medieval:     'Middle Ages',
    era_early_modern: 'Early Modern',
    era_modern:       'Modern',
    // Legend
    legend_title:       'Legend',
    legend_types:       'Types',
    legend_territory:   'Territory',
    legend_ruler:       'Ruler',
    legend_capital_city:'Capital city',
    legend_notable_city:'Notable city',
    legend_settlement:  'Ancient settlement',
    legend_event:       'Historical event',
    legend_precision:   'Border Precision',
    legend_established: 'Established',
    legend_moderate:    'Moderate',
    legend_approximate: 'Approximate',
    // Tooltip
    tt_context:      'Context',
    tt_rulers:       'Rulers',
    tt_capital:      'Capital',
    tt_precision:    'Border precision',
    tt_loading:      'Loading rulers…',
    tt_no_ruler_period: 'No ruler for this period.',
    tt_ruler_list:   '→ Ruler list',
    tt_imprecise:    'Imprecise historical records.',
    tt_uncertain:    '→ Uncertain records (Wikipedia)',
    tt_no_precise:   'No precise ruler data available, for more info follow the',
    tt_wiki_link:    'wiki link →',
    tt_wiki_arrow:   'Wikipedia →',
    tt_wiki_arrow_back: '→ Wikipedia',
    tt_goto_year:    '⏱ Go to this year',
    // Context bullet labels
    tt_ctx_power:    'Power',
    tt_ctx_period:   'Period',
    tt_ctx_notable:  'Notable',
    tt_ctx_borders:  'Borders',
    tt_ai_note:      'This context is simplified · full Wikipedia context coming soon',
    // Territory label
    tt_territory_label: 'Territory',
    tt_ruled:        'Ruled',
    tt_modern_site:  'Description of the modern place at this site',
    ev_closest_state: 'Map shows closest available state',
    ev_jump_year:    '⏱ Jump to this year',
    ev_jump_to:      '⏱ Jump to',
    // City tooltip
    tt_capital_city: 'Capital city',
    tt_notable_city: 'Notable city',
    // Legend (extra)
    legend_cultures: 'Cultures',
    // Search
    search_placeholder: 'Search territories or rulers…',
    search_hint:        'Ctrl+K to open · ↑↓ navigate · Enter to select',
    search_loading:     'Loading…',
    search_no_results:  'No results found.',
    search_results_n:   'results',
    search_results_one: 'result',
    // Territories overview
    terr_title:    'Historical Territories',
    terr_subtitle: 'A simplified overview of all territories currently included in the system.',
    terr_search:   'Search territories…',
    terr_col_name:   'Territory',
    terr_col_qid:    'Wikidata ID',
    terr_col_type:   'Type',
    terr_col_rulers: 'Rulers',
    terr_col_period: 'Period',
    terr_loading:    'Loading…',
    terr_none:       'No territories found.',
    terr_count_n:    'territories',
    // Trails
    trail_choose:  '▼ Choose a trail',
    trail_steps:   'steps',
    trail_back:    '← Back',
    trail_next:    'Next →',
    trail_finish:  'Explore the map',
    // Intro
    intro_more:    'About this project',
    intro_updates: 'Updates',
    intro_trail_btn:   '← Take a Trail',
    intro_tour_btn:    'Take the Tour ↓',
    intro_explore_btn: 'Explore the map →',
    intro_lang_label:  'Language',
    // Controls
    ctrl_trails:   'Trails',
    ctrl_events:   'Events',
    ctrl_pleiades: 'Pleiades',
    // Loading screen
    loading_init: 'Initializing…',
    // Tour finish
    tour_finish: "You're all set!",
  },

  de: {
    // Era buttons
    era_prehistoric:  'Vorgeschichte',
    era_bronze_age:   'Bronzezeit',
    era_antiquity:    'Antike',
    era_medieval:     'Mittelalter',
    era_early_modern: 'Frühe Neuzeit',
    era_modern:       'Moderne',
    // Legend
    legend_title:       'Legende',
    legend_types:       'Typen',
    legend_territory:   'Territorium',
    legend_ruler:       'Herrscher',
    legend_capital_city:'Hauptstadt',
    legend_notable_city:'Bedeutende Stadt',
    legend_settlement:  'Antike Siedlung',
    legend_event:       'Historisches Ereignis',
    legend_precision:   'Grenzpräzision',
    legend_established: 'Gesichert',
    legend_moderate:    'Moderat',
    legend_approximate: 'Annähernd',
    // Tooltip
    tt_context:      'Kontext',
    tt_rulers:       'Herrscher',
    tt_capital:      'Hauptstadt',
    tt_precision:    'Grenzgenauigkeit',
    tt_loading:      'Herrscher werden geladen…',
    tt_no_ruler_period: 'Kein Herrscher für diesen Zeitraum.',
    tt_ruler_list:   '→ Herrscherliste',
    tt_imprecise:    'Ungenaue historische Überlieferung.',
    tt_uncertain:    '→ Unsichere Quellen (Wikipedia)',
    tt_no_precise:   'Keine genauen Herrscherdaten verfügbar, weitere Infos über den',
    tt_wiki_link:    'Wiki-Link →',
    tt_wiki_arrow:   'Wikipedia →',
    tt_wiki_arrow_back: '→ Wikipedia',
    tt_goto_year:    '⏱ Zu diesem Jahr',
    // Context bullet labels
    tt_ctx_power:    'Macht',
    tt_ctx_period:   'Periode',
    tt_ctx_notable:  'Besonderheit',
    tt_ctx_borders:  'Grenzen',
    tt_ai_note:      'Dieser Kontext ist vereinfacht · vollständige Wikipedia-Daten folgen',
    // Territory label
    tt_territory_label: 'Territorium',
    tt_ruled:        'Regierte',
    tt_modern_site:  'Beschreibung des heutigen Orts an dieser Stelle',
    ev_closest_state: 'Karte zeigt zeitlich nächstgelegenen Stand',
    ev_jump_year:    '⏱ Zu diesem Jahr springen',
    ev_jump_to:      '⏱ Springe zu',
    // City tooltip
    tt_capital_city: 'Hauptstadt',
    tt_notable_city: 'Bedeutende Stadt',
    // Legend (extra)
    legend_cultures: 'Kulturen',
    // Search
    search_placeholder: 'Territorien oder Herrscher suchen…',
    search_hint:        'Strg+K öffnen · ↑↓ navigieren · Enter wählen',
    search_loading:     'Lädt…',
    search_no_results:  'Keine Ergebnisse gefunden.',
    search_results_n:   'Ergebnisse',
    search_results_one: 'Ergebnis',
    // Territories overview
    terr_title:    'Historische Territorien',
    terr_subtitle: 'Eine vereinfachte Übersicht aller Territorien im System.',
    terr_search:   'Territorien suchen…',
    terr_col_name:   'Territorium',
    terr_col_qid:    'Wikidata-ID',
    terr_col_type:   'Typ',
    terr_col_rulers: 'Herrscher',
    terr_col_period: 'Zeitraum',
    terr_loading:    'Lädt…',
    terr_none:       'Keine Territorien gefunden.',
    terr_count_n:    'Territorien',
    // Trails
    trail_choose:  '▼ Trail auswählen',
    trail_steps:   'Schritte',
    trail_back:    '← Zurück',
    trail_next:    'Weiter →',
    trail_finish:  'Karte erkunden',
    // Intro
    intro_more:    'Über dieses Projekt',
    intro_updates: 'Updates',
    intro_trail_btn:   '← Trail starten',
    intro_tour_btn:    'Tour starten ↓',
    intro_explore_btn: 'Karte erkunden →',
    intro_lang_label:  'Sprache',
    // Controls
    ctrl_trails:   'Trails',
    ctrl_events:   'Ereignisse',
    ctrl_pleiades: 'Pleiades',
    // Loading screen
    loading_init: 'Wird geladen…',
    // Tour finish
    tour_finish: 'Bereit!',
  },
};

// ── State ─────────────────────────────────
let _lang = localStorage.getItem('eh_lang') || 'en';

function t(key) {
  return (I18N[_lang] && I18N[_lang][key]) || (I18N.en && I18N.en[key]) || key;
}

function getLang() { return _lang; }

function getDataSuffix() {
  return _lang === 'en' ? '' : '_' + _lang;
}

function setLang(lang) {
  if (!I18N[lang] || lang === _lang) return;
  _lang = lang;
  localStorage.setItem('eh_lang', lang);
  applyI18n();
  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

// ── Apply to DOM ──────────────────────────
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  // Sync lang toggle buttons
  document.querySelectorAll('.lang-btn, .lang-btn-sm').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === _lang);
  });
  // Accordion toggles: reset to closed state with current lang text
  const moreToggle = document.getElementById('intro-more-toggle');
  if (moreToggle) {
    moreToggle.textContent = t('intro_more') + ' ↓';
    moreToggle.classList.remove('open');
  }
  const updToggle = document.getElementById('intro-updates-toggle');
  if (updToggle) {
    updToggle.textContent = t('intro_updates') + ' ↓';
    updToggle.classList.remove('open');
  }
  // Close accordions on lang change
  const moreContent = document.getElementById('intro-more-content');
  if (moreContent) moreContent.classList.remove('open');
  const updContent = document.getElementById('intro-updates-content');
  if (updContent) updContent.classList.remove('open');
  // Re-render intro body
  if (typeof renderIntroBody === 'function') renderIntroBody();
}
