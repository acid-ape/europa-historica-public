// ═══════════════════════════════════════════
//  europa-historica — split from monolithic config.js
//  Loaded as classic <script>; declarations live on the
//  global scope. Other modules (cities.js (CITIES)) read these symbols.
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  CITIES — curated list with individual start/end years
//
//  start/end = years (negative = BC).
//  capital:true  → large diamond marker + label (major political center)
//  capital:false → small circle marker + label (notable city)
//  Filtered live: city visible when  start <= currentYear <= end
// ═══════════════════════════════════════════
const CITIES = [

  // ── Bronze Age Aegean (2000–1100 BC) ──────────────────────────
  {name:'Knossos',        lon:25.16, lat:35.30, capital:true,  wikidata:'Q179856',  start:-2000, end:-1100},
  {name:'Mycenae',        lon:22.76, lat:37.72, capital:true,  wikidata:'Q39816',   start:-1600, end:-1050},
  {name:'Troy',           lon:26.24, lat:39.96, capital:true,  wikidata:'Q12499',   start:-1800, end:550},
  {name:'Tiryns',         lon:22.80, lat:37.60, capital:false, wikidata:'Q193377',  start:-1400, end:-1050},
  {name:'Hattusa',        lon:34.62, lat:40.02, capital:true,  wikidata:'Q180485',  start:-1650, end:-1180},

  // ── Iron Age / Archaic (900–500 BC) ───────────────────────────
  {name:'Sparta',         lon:22.43, lat:37.07, capital:true,  wikidata:'Q5690',    start:-900,  end:400},
  {name:'Corinth',        lon:22.93, lat:37.94, capital:false, wikidata:'Q131531',  start:-900,  end:2100},
  {name:'Carthage',       lon:10.33, lat:36.85, capital:true,  wikidata:'Q6343',    start:-814,  end:698},
  {name:'Syracuse',       lon:15.28, lat:37.07, capital:true,  wikidata:'Q233804',  start:-734,  end:2100},
  {name:'Massalia',       lon:5.37,  lat:43.30, capital:false, wikidata:'Q49231',   start:-600,  end:500},
  {name:'Cyrene',         lon:21.86, lat:32.82, capital:true,  wikidata:'Q43594',   start:-631,  end:365},

  // ── Classical / Hellenistic (700 BC – 30 BC) ──────────────────
  {name:'Athens',         lon:23.73, lat:37.97, capital:true,  wikidata:'Q1524',    start:-700,  end:2100},
  {name:'Persepolis',     lon:52.89, lat:29.94, capital:true,  wikidata:'Q164160',  start:-518,  end:-330},
  {name:'Byzantium',      lon:28.98, lat:41.01, capital:false, wikidata:'Q844926',  start:-660,  end:330},
  {name:'Alexandria',     lon:29.92, lat:31.20, capital:true,  wikidata:'Q87',      start:-331,  end:2100},
  {name:'Antioch',        lon:36.16, lat:36.20, capital:true,  wikidata:'Q130968',  start:-300,  end:638},
  {name:'Pergamon',       lon:27.18, lat:39.13, capital:true,  wikidata:'Q159691',  start:-282,  end:400},
  {name:'Seleucia',       lon:44.56, lat:33.09, capital:true,  wikidata:'Q208437',  start:-305,  end:165},

  // ── Roman Republic / Empire (500 BC – 476 AD) ─────────────────
  {name:'Rome',           lon:12.50, lat:41.90, capital:true,  wikidata:'Q220',     start:-753,  end:2100},
  {name:'Mediolanum',     lon:9.19,  lat:45.46, capital:false, wikidata:'Q490',     start:-400,  end:500},
  {name:'Hispalis',       lon:-5.99, lat:37.39, capital:false, wikidata:'Q8717',    start:-200,  end:711},
  {name:'Lugdunum',       lon:4.83,  lat:45.76, capital:false, wikidata:'Q456',     start:-43,   end:500},
  {name:'Lutetia',        lon:2.35,  lat:48.85, capital:false, wikidata:'Q220711',  start:-250,  end:500},
  {name:'Londinium',      lon:-0.12, lat:51.50, capital:false, wikidata:'Q193506',  start:43,    end:410},
  {name:'Colonia',        lon:6.96,  lat:50.94, capital:false, wikidata:'Q365',     start:50,    end:500},
  {name:'Vindobona',      lon:16.37, lat:48.20, capital:false, wikidata:'Q131484',  start:100,   end:450},
  {name:'Thessalonica',   lon:22.94, lat:40.64, capital:false, wikidata:'Q17151',   start:-316,  end:2100},
  {name:'Ctesiphon',      lon:44.58, lat:33.09, capital:true,  wikidata:'Q172329',  start:-130,  end:637},

  // ── Late Antique / Early Byzantine (300–700) ──────────────────
  {name:'Constantinople', lon:28.98, lat:41.01, capital:true,  wikidata:'Q16869',   start:330,   end:1453},
  {name:'Ravenna',        lon:12.20, lat:44.42, capital:true,  wikidata:'Q1277',    start:402,   end:751},
  {name:'Jerusalem',      lon:35.22, lat:31.78, capital:true,  wikidata:'Q1218',    start:-1000, end:2100},

  // ── Medieval (600–1500) ───────────────────────────────────────
  {name:'Toledo',         lon:-3.99, lat:39.86, capital:true,  wikidata:'Q5836',    start:554,   end:1561},
  {name:'Baghdad',        lon:44.39, lat:33.34, capital:true,  wikidata:'Q1530',    start:762,   end:2100},
  {name:'Paris',          lon:2.35,  lat:48.85, capital:true,  wikidata:'Q90',      start:500,   end:2100},
  {name:'Córdoba',        lon:-4.78, lat:37.89, capital:true,  wikidata:'Q5818',    start:716,   end:1031},
  {name:'Aachen',         lon:6.08,  lat:50.77, capital:true,  wikidata:'Q1858',    start:794,   end:936},
  {name:'Venice',         lon:12.34, lat:45.44, capital:true,  wikidata:'Q641',     start:697,   end:1797},
  {name:'Kiev',           lon:30.52, lat:50.45, capital:true,  wikidata:'Q1899',    start:882,   end:1240},
  {name:'Gniezno',        lon:17.60, lat:52.54, capital:true,  wikidata:'Q47692',   start:960,   end:1038},
  {name:'Novgorod',       lon:31.27, lat:58.52, capital:true,  wikidata:'Q166546',  start:859,   end:1478},
  {name:'Palermo',        lon:13.36, lat:38.12, capital:true,  wikidata:'Q2656',    start:831,   end:1072},
  {name:'Kraków',         lon:19.94, lat:50.06, capital:true,  wikidata:'Q31487',   start:1038,  end:1596},
  {name:'Prague',         lon:14.42, lat:50.09, capital:true,  wikidata:'Q1085',    start:870,   end:2100},
  {name:'London',         lon:-0.12, lat:51.50, capital:true,  wikidata:'Q84',      start:1066,  end:2100},

  // ── Early Modern (1300–1800) ──────────────────────────────────
  {name:'Vienna',         lon:16.37, lat:48.21, capital:true,  wikidata:'Q1741',    start:1440,  end:2100},
  {name:'Lisbon',         lon:-9.14, lat:38.72, capital:true,  wikidata:'Q597',     start:1255,  end:2100},
  {name:'Moscow',         lon:37.62, lat:55.75, capital:true,  wikidata:'Q649',     start:1280,  end:2100},
  {name:'Istanbul',       lon:28.98, lat:41.01, capital:true,  wikidata:'Q406',     start:1453,  end:2100},
  {name:'Madrid',         lon:-3.70, lat:40.42, capital:true,  wikidata:'Q2807',    start:1561,  end:2100},
  {name:'Berlin',         lon:13.41, lat:52.52, capital:true,  wikidata:'Q64',      start:1415,  end:2100},
  {name:'Amsterdam',      lon:4.90,  lat:52.37, capital:false, wikidata:'Q727',     start:1400,  end:2100},
  {name:'Stockholm',      lon:18.07, lat:59.33, capital:true,  wikidata:'Q1754',    start:1523,  end:2100},
  {name:'Warsaw',         lon:21.01, lat:52.23, capital:true,  wikidata:'Q270',     start:1596,  end:2100},

  // ── Modern (1700–) ────────────────────────────────────────────
  {name:'St. Petersburg', lon:30.32, lat:59.95, capital:true,  wikidata:'Q656',     start:1703,  end:2100},
  {name:'Brussels',       lon:4.35,  lat:50.85, capital:false, wikidata:'Q239',     start:1830,  end:2100},
  {name:'Budapest',       lon:19.04, lat:47.50, capital:true,  wikidata:'Q1781',    start:1873,  end:2100},
  {name:'Bucharest',      lon:26.10, lat:44.43, capital:true,  wikidata:'Q19660',   start:1862,  end:2100},
  {name:'Ankara',         lon:32.86, lat:39.93, capital:true,  wikidata:'Q3640',    start:1923,  end:2100},
  {name:'Kyiv',           lon:30.52, lat:50.45, capital:true,  wikidata:'Q1899',    start:1991,  end:2100},
];


