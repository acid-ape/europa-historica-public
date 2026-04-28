// ═══════════════════════════════════════════
//  europa-historica — split from monolithic config.js
//  Loaded as classic <script>; declarations live on the
//  global scope. Other modules (tooltip.js, search.js (loadRulersData, loadTerritoriesData, loadWikidataKnowledge, getTerrDesc, getCtxDesc, getCapitalForYear, inferRulerEnds, pctToYear is in timeline.js)) read these symbols.
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  PHASE 3 — SYSTEM 3: WIKIDATA-LOADER
//  Lädt Daten lazy (nur bei Klick), cached im Memory.
//  Transformation vor UI — niemals Rohdaten anzeigen.
// ═══════════════════════════════════════════

const wikidataCache = {};

// Zeitkonversion: Wikidata-Zeitstring → Jahr (number)
function wdTimeToYear(timeStr) {
  if (!timeStr) return null;
  // Format: "+1453-00-00T00:00:00Z" oder "-0044-00-00T00:00:00Z"
  const match = timeStr.match(/^([+-])(\d+)-/);
  if (!match) return null;
  const sign = match[1] === '-' ? -1 : 1;
  const year = parseInt(match[2], 10);
  return sign * year;
}

// Für Herrscher ohne End-Datum: End aus nächstem Herrscher-Start inferieren.
// Letzter Herrscher ohne End bleibt null (unbekannt/offen).
function inferRulerEnds(rulers) {
  return rulers.map((r, i) => {
    if (r.end !== null && r.end !== undefined) return r;
    const nextStart = rulers[i + 1]?.start ?? null;
    // Only infer if next ruler starts strictly after this one (avoids 0-length reigns)
    return (nextStart !== null && nextStart > r.start) ? { ...r, end: nextStart, _endInferred: true } : r;
  });
}

// Herrscher-Filter: gültig wenn start vorhanden UND (end vorhanden ODER noch aktiv)
function isRulerActive(start, end, currentYear) {
  // Strict: only show rulers with at least a start date
  // Rulers without time data are not shown — data quality first
  if (!start) return false;
  if (end) return currentYear >= start && currentYear <= end;
  return currentYear >= start;
}

// Transformiert alle Herrscher ohne Zeitfilter (für Caching)
function transformWikidataRulersAll(sparqlResults) {
  if (!sparqlResults || !sparqlResults.results) return [];
  return sparqlResults.results.bindings
    .map(row => ({
      name:  row.rulerLabel?.value || null,
      start: wdTimeToYear(row.start?.value),
      end:   wdTimeToYear(row.end?.value)
    }))
    .filter(r => r.name && r.start !== null)
    .sort((a, b) => (a.start || 0) - (b.start || 0));
}

// Alias für Rückwärtskompatibilität
function transformWikidataRulers(sparqlResults, currentYear) {
  return transformWikidataRulersAll(sparqlResults)
    .filter(r => isRulerActive(r.start, r.end, currentYear));
}

// SPARQL-Query für Herrscher eines Territoriums
function buildRulerQuery(wikidataId, rulerPosition) {
  // Query by P39 (position held) with subclasses via wdt:P279*
  // This catches all variants: Roman Emperor, Princeps, Sultan etc.
  return `
SELECT DISTINCT ?ruler ?rulerLabel ?start ?end WHERE {
  ?ruler p:P39 ?stmt .
  ?stmt ps:P39/wdt:P279* wd:${rulerPosition} .
  OPTIONAL { ?stmt pq:P580 ?start }
  OPTIONAL { ?stmt pq:P582 ?end }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
}
ORDER BY ?start
LIMIT 200
  `.trim();
}

// Hauptfunktion: lädt und cached Wikidata-Daten
// Globaler rulers-Cache — wird einmal beim Start geladen
let rulersData = null;

async function loadRulersData() {
  if (rulersData) return rulersData;
  try {
    const r = await fetch('data/knowledge/rulers.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    rulersData = await r.json();
  } catch(e) {
    console.warn('rulers.json nicht geladen:', e.message);
    return {};  // nicht cachen — Retry beim nächsten Klick
  }
  return rulersData;
}

let territoriesData   = null;
let territoriesDataDe = null;
let _terrLoadPromise  = null;  // de-dupes concurrent calls

async function loadTerritoriesData() {
  if (territoriesData) return territoriesData;
  if (_terrLoadPromise) return _terrLoadPromise;
  _terrLoadPromise = (async () => {
    try {
      const [r, rDe] = await Promise.all([
        fetch('data/knowledge/territories.json', { cache: 'no-cache' }),
        fetch('data/knowledge/territories_de.json', { cache: 'no-cache' }).catch(() => null),
      ]);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      territoriesData = await r.json();
      if (rDe && rDe.ok) territoriesDataDe = await rDe.json();
      return territoriesData;
    } catch(e) {
      console.warn('territories.json nicht geladen:', e.message);
      _terrLoadPromise = null;  // allow retry on next call
      return {};
    }
  })();
  return _terrLoadPromise;
}

// Invalidate caches on language change. The next loadTerritoriesData() call
// will re-fetch both EN and DE variants. Also dispatched here so that any
// open territory tooltip / panel can re-render with new descriptions.
window.addEventListener('langchange', () => {
  territoriesData   = null;
  territoriesDataDe = null;
  _terrLoadPromise  = null;
});

// Returns translated description for a territory (falls back to EN)
function getTerrDesc(territory) {
  const lang = typeof getLang === 'function' ? getLang() : 'en';
  if (lang !== 'en' && territoriesDataDe) {
    const de = territoriesDataDe[territory.wikidataId || territory.id];
    if (de && de.description) return de.description;
  }
  return territory.description || '';
}

// Returns translated description for a multi_context sub-context (falls back to EN)
function getCtxDesc(ctx, territory) {
  const lang = typeof getLang === 'function' ? getLang() : 'en';
  if (lang !== 'en' && territoriesDataDe) {
    const de = territoriesDataDe[territory.wikidataId || territory.id];
    if (de && de.contexts) {
      const deCtx = de.contexts.find(c => c.start === ctx.start && c.end === ctx.end);
      if (deCtx && deCtx.description) return deCtx.description;
    }
  }
  return ctx.description || '';
}

function getCapitalForYear(capitals, year) {
  if (!capitals || capitals.length === 0) return null;
  // Finde Hauptstadt die zum Jahr passt
  const active = capitals.filter(c => {
    const s = c.start ?? -9999;
    const e = c.end   ??  9999;
    return year >= s && year <= e;
  });
  // Bevorzuge Einträge mit echten Zeitangaben
  const withDates = active.filter(c => c.start !== null);
  const best = withDates.length > 0 ? withDates[0] : active[0];
  return best ? best.name : null;
}

async function loadWikidataKnowledge(mapping, currentYear) {
  const [data, territories] = await Promise.all([loadRulersData(), loadTerritoriesData()]);
  const terrEntry = territories[mapping.wikidataId] || {};

  // ── Multi-context: aktiven Kontext für currentYear wählen ──
  if (terrEntry.territory_type === 'multi_context' && terrEntry.contexts) {
    const activeCtx = terrEntry.contexts.find(
      ctx => currentYear >= ctx.start && currentYear <= ctx.end
    );
    if (activeCtx) {
      const ctxLabel  = activeCtx.label || mapping.label;
      const ctxWikiId = activeCtx.wikidataId || mapping.wikidataId;

      // Single Source of Truth: Verhalten aus rulers.json ableiten.
      // Hat der Kontext Herrscher → ruler_based. Hat er keine → context_only.
      const ctxEntry  = data[ctxWikiId];
      const allRulers = inferRulerEnds(ctxEntry?.rulers || []);

      if (allRulers.length === 0) {
        // context_only-Verhalten: Note / Link anzeigen
        const rulersUrl = activeCtx.rulers_url || null;
        const wikiUrl   = activeCtx.wikipedia || terrEntry.wikipedia || null;
        const note = ctxEntry?.note ||
                     (rulersUrl ? `See: ${rulersUrl}` : wikiUrl ? `See: ${wikiUrl}` : null);
        return {
          id:                normalize(mapping.label),
          name:              ctxLabel,
          wikidataId:        ctxWikiId,
          rulers:            [],
          hasRulers:         false,
          note:              note,
          rulersUrl:         rulersUrl,
          rulerDataQuality:  terrEntry.ruler_data_quality || null,
          capital:           null,
          wikipedia:         wikiUrl,
          coatOfArms:        null,
          loaded:            true,
          loading:           false,
          error:             null,
          contextLabel:      ctxLabel
        };
      }

      // ruler_based-Verhalten: Herrscher für das aktuelle Jahr filtern
      const activeRulers = allRulers.filter(r => isRulerActive(r.start, r.end, currentYear));
      return {
        id:                normalize(mapping.label),
        name:              ctxLabel,
        wikidataId:        ctxWikiId,
        rulers:            activeRulers,
        hasRulers:         true,
        note:              ctxEntry.note || null,
        rulersUrl:         activeCtx.rulers_url || terrEntry.rulers_url || null,
        rulerDataQuality:  terrEntry.ruler_data_quality || null,
        capital:           null,
        wikipedia:         'https://en.wikipedia.org/wiki/' + encodeURIComponent(ctxLabel.replace(/ /g, '_')),
        coatOfArms:        null,
        loaded:            true,
        loading:           false,
        error:             null,
        contextLabel:      ctxLabel
      };
    }
    // Kein passender Kontext gefunden → kein Jahr-Match
    return {
      ...createEmptyKnowledge(normalize(mapping.label), mapping.label, mapping.wikidataId),
      loaded: true,
      error: null
    };
  }

  // ── Standard (kein multi_context) ──
  const entry = data[mapping.wikidataId];
  if (!entry) {
    return {
      ...createEmptyKnowledge(normalize(mapping.label), mapping.label, mapping.wikidataId),
      loaded: true,
      error: 'No data available'
    };
  }

  const allRulers = inferRulerEnds(entry.rulers || []);
  const activeRulers = allRulers.filter(r => isRulerActive(r.start, r.end, currentYear));

  return {
    id:               normalize(mapping.label),
    name:             mapping.label,
    wikidataId:       mapping.wikidataId,
    rulers:           activeRulers,
    hasRulers:        allRulers.length > 0,
    note:             entry.note || null,
    rulersUrl:        terrEntry.rulers_url || null,
    rulerDataQuality: terrEntry.ruler_data_quality || null,
    capital:          null,
    wikipedia:        terrEntry.wikipedia || ('https://en.wikipedia.org/wiki/' + encodeURIComponent(mapping.label.replace(/ /g, '_'))),
    coatOfArms:       null,
    loaded:           true,
    loading:          false,
    error:            null
  };
}

