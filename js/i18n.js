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
    // Legend info-popups (shown on click on a legend entry)
    legend_info_territory:    'A historical political entity — kingdom, empire, republic — at the moment shown.',
    legend_info_ruler:        'Listed for territories where ruler data is available. Clickable in the territory panel.',
    legend_info_capital_city: 'Diamond marker — capital of the territory at this point in time.',
    legend_info_notable_city: 'Circle marker — major city of the era, not necessarily a capital.',
    legend_info_settlement:   'Cross marker — ancient settlement from the Pleiades gazetteer. Visible while the Pleiades layer is on.',
    legend_info_event:        'Star marker — historical milestone event. Visible while the Events layer is on.',
    legend_info_established:  'Borders well documented in contemporary sources (treaties, surveys, written records).',
    legend_info_moderate:     'Approximate borders, derived from indirect evidence.',
    legend_info_approximate:  'Speculative borders where evidence is fragmentary or contested.',
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
    intro_tour_btn:    'Start Tutorial ↓',
    intro_explore_btn: 'Explore the map →',
    intro_lang_label:  'Language',
    // Controls
    ctrl_trails:   'Trails',
    ctrl_events:   'Events',
    ctrl_pleiades: 'Pleiades',
    ctrl_reset_view: 'Reset map view',
    ctrl_tutorial_btn_title: 'Restart tutorial',
    ctrl_info_title: 'About this project',
    ctrl_terr_list_title: 'Territories overview',
    ctrl_search_title: 'Search (Ctrl+K)',
    ctrl_legend_title: 'Legend',
    ctrl_logo_menu_title: 'Menu',
    ctrl_close_all: 'Close all panels (ESC)',
    // First-time snap-to-top hint (shown once per browser via localStorage)
    snap_hint: 'Tip: ⊟ docks the panel to the top edge.',
    ev_cluster_label: 'events at this location',
    tt_resize_mode: 'Resize',
    // Layer-Toggle states (tri-state cycle)
    state_off:    'off',
    state_window: 'recent',     // events: ±150yr; pleiades: curated tier
    state_all:    'all',
    // Era-range chip
    era_chip_close: 'Show all eras',
    era_chip_arrow: '–',         // visual separator between range start and end
    // Tutorial step controls
    tour_step_of:    'Step {n} of {total}',
    tour_end:        'End Tour',
    tour_next:       'Next →',
    tour_finish_explore: 'Explore the map →',
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
    // Legend info-popups (shown on click on a legend entry)
    legend_info_territory:    'Eine historische politische Einheit — Königreich, Kaiserreich, Republik — zum gezeigten Zeitpunkt.',
    legend_info_ruler:        'Aufgelistet bei Territorien, für die Herrscher-Daten vorliegen. Im Territoriums-Panel klickbar.',
    legend_info_capital_city: 'Raute-Marker — Hauptstadt des Territoriums zu diesem Zeitpunkt.',
    legend_info_notable_city: 'Kreis-Marker — bedeutende Stadt der Epoche, nicht zwingend Hauptstadt.',
    legend_info_settlement:   'Kreuz-Marker — antike Siedlung aus dem Pleiades-Verzeichnis. Sichtbar wenn der Pleiades-Layer aktiv ist.',
    legend_info_event:        'Stern-Marker — historisches Schlüsselereignis. Sichtbar wenn der Events-Layer aktiv ist.',
    legend_info_established:  'Grenzen sind in zeitgenössischen Quellen gut dokumentiert (Verträge, Vermessungen, Urkunden).',
    legend_info_moderate:     'Annähernde Grenzen, aus indirekten Hinweisen abgeleitet.',
    legend_info_approximate:  'Spekulative Grenzen — die Quellenlage ist fragmentarisch oder strittig.',
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
    intro_tour_btn:    'Tutorial starten ↓',
    intro_explore_btn: 'Karte erkunden →',
    intro_lang_label:  'Sprache',
    // Controls
    ctrl_trails:   'Trails',
    ctrl_events:   'Ereignisse',
    ctrl_pleiades: 'Pleiades',
    ctrl_reset_view: 'Karte zurücksetzen',
    ctrl_tutorial_btn_title: 'Tutorial neu starten',
    ctrl_info_title: 'Über dieses Projekt',
    ctrl_terr_list_title: 'Territoriums-Übersicht',
    // Layer-Toggle states
    state_off:    'aus',
    state_window: 'aktuell',
    state_all:    'alle',
    // Era-range chip
    era_chip_close: 'Alle Epochen anzeigen',
    era_chip_arrow: '–',
    ctrl_search_title: 'Suchen (Strg+K)',
    ctrl_legend_title: 'Legende',
    ctrl_logo_menu_title: 'Menü',
    ctrl_close_all: 'Alle Panels schließen (ESC)',
    snap_hint: 'Tipp: ⊟ dockt das Panel oben an.',
    ev_cluster_label: 'Ereignisse an dieser Stelle',
    tt_resize_mode: 'Größe ändern',
    // Tutorial step controls
    tour_step_of:    'Schritt {n} von {total}',
    tour_end:        'Tutorial beenden',
    tour_next:       'Weiter →',
    tour_finish_explore: 'Karte erkunden →',
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

// Update the .btn-state suffix on a tristate-toggle button. The span keeps
// its data-i18n attribute in sync so applyI18n picks it up after langchange.
function _setBtnState(btn, key) {
  if (!btn) return;
  const span = btn.querySelector('.btn-state');
  if (!span) return;
  span.dataset.i18n = key;
  span.textContent = t(key);
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
