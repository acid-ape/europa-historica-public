// ═══════════════════════════════════════════
//  europa-historica — split from monolithic config.js
//  Loaded as classic <script>; declarations live on the
//  global scope. Other modules (tooltip.js, territory_render.js, events.js (buildContext, getPhaseForYear, PHASE_BY_YEAR)) read these symbols.
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  PHASE 3 — SYSTEM 2: KONTEXT-SYSTEM
//  Baut 2–4 kontextuelle Aussagen aus lokalen Daten.
//  Kein Netzwerk, synchron, sofort verfügbar.
//  Reihenfolge garantiert: Kultur → Macht → Dynamik
// ═══════════════════════════════════════════

// ── Kontext-Daten: strukturiert nach Macht / Phase / Besonderheit ──
// Jeder Eintrag hat: macht, phase, besonderheit (alle optional)

const CULTURE_CONTEXT = {
  roman:       { macht: "Roman-Byzantine cultural sphere",       phase: null, besonderheit: null },
  frankish:    { macht: "Frankish-Germanic cultural sphere",     phase: null, besonderheit: null },
  french:      { macht: "Western European / French sphere",      phase: null, besonderheit: null },
  british:     { macht: "British-Celtic cultural sphere",        phase: null, besonderheit: null },
  iberian:     { macht: "Iberian Peninsula",                     phase: null, besonderheit: "Romance-influenced" },
  islamic:     { macht: "Islamic cultural world",                phase: null, besonderheit: null },
  slavic:      { macht: "Slavic cultural sphere",                phase: null, besonderheit: null },
  nordic:      { macht: "Nordic-Scandinavian sphere",            phase: null, besonderheit: null },
  ottoman:     { macht: "Ottoman-Turkish cultural sphere",       phase: null, besonderheit: null },
  habsburg:    { macht: "Habsburg Central European sphere",      phase: null, besonderheit: null },
  italian:     { macht: "Italian city-states",                   phase: null, besonderheit: null },
  baltic:      { macht: "Baltic cultural sphere",                phase: null, besonderheit: null },
  caucasus:    { macht: "Caucasian cultural sphere",             phase: null, besonderheit: null },
  greek:       { macht: "Greek-Hellenistic sphere",              phase: null, besonderheit: null },
  steppe:      { macht: "Eurasian steppe culture",               phase: null, besonderheit: null },
  germanic:    { macht: "Germanic tribal confederation",         phase: null, besonderheit: null },
  prehistoric: { macht: "Prehistoric culture",                   phase: null, besonderheit: null },
  persian:     { macht: "Persian-Iranian cultural sphere",       phase: null, besonderheit: null },
  modern:      { macht: "Modern nation state",                   phase: null, besonderheit: null },
  other:       null
};

const SUBJECTO_CONTEXT = {
  "roman empire":         { macht: "Dominant power of the Mediterranean",    phase: null,                          besonderheit: null },
  "eastern roman empire": { macht: "Eastern Roman Empire",                   phase: "Successor to Rome in the East", besonderheit: null },
  "holy roman empire":    { macht: "Holy Roman Empire",                      phase: "Decentralized power structure", besonderheit: null },
  "ottoman empire":       { macht: "Ottoman Empire",                         phase: "Dominant power in the Near East", besonderheit: null },
  "byzantine empire":     { macht: "Byzantine Empire",                       phase: "Successor to Rome",           besonderheit: null },
  "frankish kingdom":     { macht: "Frankish Kingdom",                       phase: null,                          besonderheit: null },
  "mongol empire":        { macht: "Mongol World Empire",                    phase: "Largest contiguous empire in history", besonderheit: null },
  "ussr":                 { macht: "Soviet Union",                           phase: "Cold War",                    besonderheit: null },
};

// Dynamische Kontext-Ergänzungen nach Zeit und Eigenschaften
const PHASE_BY_YEAR = [
  { from: -8000, to: -3000, phase: "Prehistory" },
  { from: -3000, to: -500,  phase: "Ancient civilizations" },
  { from: -500,  to:  500,  phase: "Classical Antiquity" },
  { from:  500,  to: 1000,  phase: "Early Middle Ages" },
  { from: 1000,  to: 1500,  phase: "Middle Ages" },
  { from: 1500,  to: 1800,  phase: "Early Modern" },
  { from: 1800,  to: 1914,  phase: "Industrialization & Nationalism" },
  { from: 1914,  to: 1945,  phase: "World Wars" },
  { from: 1945,  to: 1991,  phase: "Cold War" },
  { from: 1991,  to: 2100,  phase: "Present" },
];

function getPhaseForYear(year) {
  const p = PHASE_BY_YEAR.find(p => year >= p.from && year < p.to);
  return p ? p.phase : null;
}

function buildContext(properties, year) {
  const culture  = getCulture(properties);
  const subjecto = normalize(properties.SUBJECTO || '');
  const prec     = properties.BORDERPRECISION || 1;

  const cultureCtx  = CULTURE_CONTEXT[culture];
  const subjectoCtx = SUBJECTO_CONTEXT[subjecto];

  // Macht: aus SUBJECTO wenn vorhanden, sonst aus Kultur
  const macht = (subjectoCtx && subjectoCtx.macht) || (cultureCtx && cultureCtx.macht) || null;

  // Phase: aus SUBJECTO, sonst aus Jahr
  const phase = (subjectoCtx && subjectoCtx.phase) || getPhaseForYear(year);

  // Besonderheit: aus SUBJECTO oder Kultur
  const besonderheit = (subjectoCtx && subjectoCtx.besonderheit) || (cultureCtx && cultureCtx.besonderheit) || null;

  // Grenzpräzision
  const grenze = prec === 1 ? "Borders not clearly defined"
               : prec === 3 ? "Internationally recognized borders"
               : null;

  return { macht, phase, besonderheit, grenze };
}

