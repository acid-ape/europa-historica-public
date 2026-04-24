const EPOCHS = [
  { pct:  0.00, year: -8000, file:'world_bc8000.geojson', label:'8000 BC', era:'Mesolithic — Hunter-gatherers, beginning of settlement' },
  { pct: 29.97, year: -5000, file:'world_bc5000.geojson', label:'5000 BC', era:'Neolithic — First farming cultures in Europe' },
  { pct: 39.96, year: -4000, file:'world_bc4000.geojson', label:'4000 BC', era:'Chalcolithic — Megalithic cultures, first metalworking' },
  { pct: 49.95, year: -3000, file:'world_bc3000.geojson', label:'3000 BC', era:'Early Bronze Age — Rise of first great civilizations' },
  { pct: 59.94, year: -2000, file:'world_bc2000.geojson', label:'2000 BC', era:'Middle Bronze Age — Mycenaean culture, Minoans on Crete' },
  { pct: 64.94, year: -1500, file:'world_bc1500.geojson', label:'1500 BC', era:'Late Bronze Age — Sea Peoples, collapse of Bronze Age cultures' },
  { pct: 69.93, year: -1000, file:'world_bc1000.geojson', label:'1000 BC', era:'Early Iron Age — Phoenicians, first Greek colonies' },
  { pct: 72.93, year:  -700, file:'world_bc700.geojson',  label:'700 BC',  era:'Archaic Period — Greek city-states, Etruscan civilization' },
  { pct: 74.93, year:  -500, file:'world_bc500.geojson',  label:'500 BC',  era:'Classical Antiquity — Persian Wars, Athens at its peak' },
  { pct: 75.92, year:  -400, file:'world_bc400.geojson',  label:'400 BC',  era:'Classical Antiquity — Peloponnesian War, rise of Macedon' },
  { pct: 76.69, year:  -323, file:'world_bc323.geojson',  label:'323 BC',  era:'Hellenism — Death of Alexander, Diadochi kingdoms' },
  { pct: 76.92, year:  -300, file:'world_bc300.geojson',  label:'300 BC',  era:'Hellenism — Roman expansion in Italy' },
  { pct: 77.92, year:  -200, file:'world_bc200.geojson',  label:'200 BC',  era:'Roman Republic — Punic Wars, Mediterranean expansion' },
  { pct: 78.92, year:  -100, file:'world_bc100.geojson',  label:'100 BC',  era:'Late Republic — Marius, Sulla, Caesar' },
  { pct: 79.91, year:    -1, file:'world_bc1.geojson',    label:'1 BC',    era:'Pax Romana — Augustan Age, empire at its peak' },
  { pct: 80.92, year:   100, file:'world_100.geojson',    label:'100',     era:'Imperial Age — Nerva-Antonine dynasty, Trajan & Hadrian' },
  { pct: 81.92, year:   200, file:'world_200.geojson',    label:'200',     era:'Imperial Age — Severan dynasty, first signs of crisis' },
  { pct: 82.92, year:   300, file:'world_300.geojson',    label:'300',     era:'Late Antiquity — Diocletian, Constantine, Christianization' },
  { pct: 83.92, year:   400, file:'world_400.geojson',    label:'400',     era:'Late Antiquity — Migration Period, fall of the Western Empire' },
  { pct: 85.91, year:   600, file:'world_600.geojson',    label:'600',     era:'Early Middle Ages — Islam emerges, Lombards in Italy' },
  { pct: 86.91, year:   700, file:'world_700.geojson',    label:'700',     era:'Early Middle Ages — Spread of Islam, Frankish Kingdom' },
  { pct: 87.91, year:   800, file:'world_800.geojson',    label:'800',     era:'Carolingian Empire — Charlemagne, imperial coronation' },
  { pct: 88.91, year:   900, file:'world_900.geojson',    label:'900',     era:'Carolingian Collapse — Magyar raids, Norse invasions' },
  { pct: 89.91, year:  1000, file:'world_1000.geojson',   label:'1000',    era:'High Middle Ages — Holy Roman Empire, Byzantine Empire' },
  { pct: 90.91, year:  1100, file:'world_1100.geojson',   label:'1100',    era:'High Middle Ages — Crusades, Normans in Sicily' },
  { pct: 91.91, year:  1200, file:'world_1200.geojson',   label:'1200',    era:'High Middle Ages — Fourth Crusade, Mongol storm approaches' },
  { pct: 92.70, year:  1279, file:'world_1279.geojson',   label:'1279',    era:'Late Middle Ages — Mongols, Hanseatic League, urban culture' },
  { pct: 92.91, year:  1300, file:'world_1300.geojson',   label:'1300',    era:'Late Middle Ages — Plague approaches, Hundred Years War' },
  { pct: 93.91, year:  1400, file:'world_1400.geojson',   label:'1400',    era:'Late Middle Ages — Ottoman rise, Council period' },
  { pct: 94.83, year:  1492, file:'world_1492.geojson',   label:'1492',    era:'Age of Discovery — Columbus, Reconquista ends' },
  { pct: 94.91, year:  1500, file:'world_1500.geojson',   label:'1500',    era:'Early Modern — Habsburg hegemony, Reformation begins' },
  { pct: 95.20, year:  1530, file:'world_1530.geojson',   label:'1530',    era:'Reformation — Augsburg, Charles V, Ottoman expansion' },
  { pct: 95.90, year:  1600, file:'world_1600.geojson',   label:'1600',    era:'Confessional Age — Thirty Years War approaches' },
  { pct: 96.40, year:  1650, file:'world_1650.geojson',   label:'1650',    era:'Peace of Westphalia — Modern state system emerges' },
  { pct: 96.90, year:  1700, file:'world_1700.geojson',   label:'1700',    era:'Absolutism — Louis XIV, Great Northern War' },
  { pct: 97.05, year:  1715, file:'world_1715.geojson',   label:'1715',    era:'Absolutism — Regency, Peace of Utrecht' },
  { pct: 97.73, year:  1783, file:'world_1783.geojson',   label:'1783',    era:'Enlightenment — American independence, Prussia rises' },
  { pct: 97.90, year:  1800, file:'world_1800.geojson',   label:'1800',    era:'Revolutionary Era — Napoleonic Wars begin' },
  { pct: 98.05, year:  1815, file:'world_1815.geojson',   label:'1815',    era:'Congress of Vienna — Restoration, new European order' },
  { pct: 98.70, year:  1880, file:'world_1880.geojson',   label:'1880',    era:'Nationalism — German & Italian unification, imperialism' },
  { pct: 98.90, year:  1900, file:'world_1900.geojson',   label:'1900',    era:'Belle Époque — Industrialization, alliance systems' },
  { pct: 99.04, year:  1914, file:'world_1914.geojson',   label:'1914',    era:'World War I — Shots of Sarajevo' },
  { pct: 99.10, year:  1920, file:'world_1920.geojson',   label:'1920',    era:'Interwar Period — New state borders after WWI' },
  { pct: 99.20, year:  1930, file:'world_1930.geojson',   label:'1930',    era:'Interwar Period — Great Depression, rise of fascism' },
  { pct: 99.28, year:  1938, file:'world_1938.geojson',   label:'1938',    era:'Pre-War — Anschluss of Austria, Munich Agreement' },
  { pct: 99.35, year:  1945, file:'world_1945.geojson',   label:'1945',    era:'Post-WWII — Cold War begins, Europe in ruins' },
  { pct: 99.50, year:  1960, file:'world_1960.geojson',   label:'1960',    era:'Cold War — Berlin Wall, decolonization' },
  { pct: 99.84, year:  1994, file:'world_1994.geojson',   label:'1994',    era:'Post-Cold War — Yugoslav Wars, EU expansion' },
  { pct: 99.90, year:  2000, file:'world_2000.geojson',   label:'2000',    era:'Modern Era — European Union, post-Soviet states' },
  { pct:100.00, year:  2010, file:'world_2010.geojson',   label:'2010',    era:'Present — Eurozone crisis, Arab Spring' },
];

// ═══════════════════════════════════════════
//  CULTURAL COLOR GROUPS
//  Each territory belongs to a cultural group
//  Neighboring groups get contrasting colors
// ═══════════════════════════════════════════
const CULTURE_GROUPS = {
  roman:    { label:'Roman / Byzantine',      color:'#b02828' },
  frankish: { label:'Frankish / HRE',         color:'#5830a0' },
  french:   { label:'French',                 color:'#1848a0' },
  british:  { label:'British / Celtic',       color:'#187a58' },
  iberian:  { label:'Iberian',                color:'#b04018' },
  islamic:  { label:'Islamic',                color:'#3a8830' },
  slavic:   { label:'Slavic',                 color:'#2868a8' },
  nordic:   { label:'Nordic / Scandinavian',  color:'#c89010' },
  ottoman:  { label:'Ottoman / Turkish',      color:'#a06010' },
  habsburg: { label:'Habsburg / Hungarian',   color:'#603898' },
  italian:  { label:'Italian',                color:'#907010' },
  baltic:   { label:'Baltic',                 color:'#187870' },
  caucasus: { label:'Caucasian',              color:'#883050' },
  greek:    { label:'Greek',                  color:'#7828a0' },
  steppe:   { label:'Steppe peoples / Nomads',color:'#806020' },
  germanic: { label:'Germanic',               color:'#4a6830' },
  prehistoric:{ label:'Prehistoric',          color:'#505848' },
  persian:  { label:'Persian / Iranian',      color:'#9B5E00' },
  modern:   { label:'Modern nation state',    color:'#206080' },
  other:    { label:'Other',                  color:'#3a3a50' },
};

// Map every territory name to a culture group
const TERRITORY_CULTURE = {
  // Roman
  'Roman Empire':'roman','Eastern Roman Empire':'roman','Western Roman Empire':'roman',
  'Byzantine Empire':'roman','Bosporian Kingdom':'roman','Odrysian Kingdom':'roman',
  'Rome':'roman','Roman Republic':'roman',
  'Rome (Constantinus)':'roman','Rome (Diocletianus)':'roman',
  'Rome (Galerius)':'roman','Rome (Maximian)':'roman',
  // Frankish / HRR
  'Holy Roman Empire':'frankish','Duchy of Swabia':'frankish','Frankish Kingdom':'frankish',
  'Franks':'frankish','Germany':'frankish','Neustria':'frankish',
  'Pomerania':'frankish','East Prussia':'frankish','Prussia':'frankish',
  'Teutonic Knights':'frankish','Austrian Empire':'frankish','Austria Hungary':'frankish',
  // French
  'France':'french','Kingdom of France':'french','Britany':'french',
  'Burgandy':'french','Normandy':'french','Broërec':'french',
  'Franche-Comté':'french','Vasconia':'french',
  // British / Celtic
  'England':'british','United Kingdom':'british','Scotland':'british',
  'Celtic kingdoms':'british','Ireland':'british','Dumonii':'british',
  'Dumnonia':'british','Cantia':'british','England and Ireland':'british',
  'English territory':'british','United Kingdom of Great Britain and Ireland':'british',
  'Scottalnd':'british','Scottland':'british',
  // Iberian
  'Spain':'iberian','Portugal':'iberian','Castilla':'iberian','Aragón':'iberian',
  'León':'iberian','Navarre':'iberian','Castile':'iberian','Castille':'iberian',
  'Granada':'iberian','Spanish Habsburg':'iberian','Visigoths':'iberian',
  'Visigothic Kingdom':'iberian',
  // Islamic
  'Caliphate of Córdoba':'islamic','Fatimid Caliphate':'islamic',
  'Emirate of Sicily':'islamic','Umayyad Caliphate':'islamic',
  'Hafsid Caliphate':'islamic','Seljuk Caliphate':'islamic',
  'Merinides':'islamic','Wattasid Caliphate':'islamic','Zayyanid Caliphate':'islamic',
  'Abdelouadides':'islamic','Aures':'islamic','Mauri':'islamic',
  // Slavic
  'Kyivan Rus':'slavic','Poland':'slavic','Russia':'slavic','Ukraine':'slavic',
  'Byelarus':'slavic','Serbia':'slavic','Croatia':'slavic','Bulgaria':'slavic',
  'Bulgar Khanate':'slavic','Czech Republic':'slavic','Slovakia':'slavic',
  'Slovenia':'slavic','Bosnia and Herzegovina':'slavic','Bosnia-Herzegovina':'slavic',
  'Montenegro':'slavic','Macedonia':'slavic','Albania':'slavic','Romania':'slavic',
  'Moldova':'slavic','Yugoslavia':'slavic','Czechoslovakia':'slavic','Czechs':'slavic',
  'Moravians':'slavic','Proto-Slavs':'slavic','Slavic tribes':'slavic','Slavs':'slavic',
  'Polanes':'slavic','Severians':'slavic','Kryvichs':'slavic','White Russia':'slavic',
  'USSR':'slavic','Poland-Lithuania':'slavic','Polish–Lithuanian Commonwealth':'slavic',
  'Novgorod':'slavic','Pskov':'slavic','Ryazan':'slavic','Grand Duchy of Moscow':'slavic',
  'South Russia':'slavic','Bulgars':'slavic','Danube Bulgars':'slavic',
  'Bulgar Khanate':'slavic','Bulgaria':'slavic',
  // Nordic
  'Sweden':'nordic','Denmark':'nordic','Norway':'nordic','Denmark-Norway':'nordic',
  'Finland':'nordic','Icelandic Commonwealth':'nordic','Iceland':'nordic',
  'Samis':'nordic','Saami':'nordic','Sámi':'nordic','Swedes':'nordic',
  'Danes':'nordic','Geats':'nordic','Guta':'nordic','Finnmark':'nordic',
  'Sweden–Norway':'nordic',
  // Ottoman
  'Ottoman Empire':'ottoman','Ottoman Sultanate':'ottoman','Turkey':'ottoman',
  'Emirate of the White Sheep Turks':'ottoman','Trebizond':'ottoman',
  'Seljuk Caliphate':'ottoman','Crimean Khanate':'ottoman',
  // Habsburg / Hungarian
  'Austria':'habsburg','Hungary':'habsburg','Magyars':'habsburg',
  'Imperial Hungary':'habsburg',
  // Italian states
  'Venice':'italian','Italy':'italian','Sardinia':'italian',
  'Dutchy of Benevento':'italian','Corsica':'italian','Sicily':'italian',
  'Papal States':'italian','Milan':'italian','Genoa':'italian',
  'Naples':'italian','Tuscany':'italian','Lombardy':'italian',
  'Lombard principalities':'italian','Lucca':'italian','Modena':'italian',
  'Parma':'italian','Sardinia-Piedmont':'italian','Savoy-Piedmont':'italian',
  'Fivizzano':'italian','Massa':'italian','Pontremoli':'italian',
  // Baltic
  'Baltic Tribes':'baltic','Prussians':'baltic','Kurs':'baltic',
  'Estonia':'baltic','Latvia':'baltic','Lithuania':'baltic',
  'Balts':'baltic','Curonians':'baltic','Karelians':'baltic',
  'Chuds':'baltic','Suom':'baltic','Suomi':'baltic',
  'Finno-Ugric taiga hunter-gatherers':'baltic',
  // Caucasus
  'Armenia':'caucasus','Georgia':'caucasus','Kingdom of Georgia':'caucasus',
  'Georgian Kingdom':'caucasus','Cuacasian Albania':'caucasus',
  'Caucasian Alans':'caucasus','Shirvan':'caucasus','Trebizond':'caucasus',
  'Azerbaijan':'caucasus',
  // Greek & Aegean
  'Greece':'greek','Greek city-states':'greek','Minoan':'greek','Crete':'greek',
  'Cycladic':'greek','city-states':'greek','Bosporan Kingdom':'greek','Bithynia':'greek',
  // Steppe nomads
  'Khazars':'steppe','Alans':'steppe','Huns':'steppe','Hunnic Empire':'steppe',
  'Avars':'steppe','Peshemegs':'steppe','Akatziri':'steppe','Sabirs':'steppe',
  'Golden Horde':'steppe','Khanate of the Golden Horde':'steppe',
  'Mongol Empire':'steppe','Volga Bulgars':'steppe','Skirii':'steppe',
  'Gepids':'steppe','Scythians':'steppe','Sarmates':'steppe','Cimerians':'steppe',
  'Proto-Scythian culture':'steppe',
  // Germanic & Celtic
  'Saxons':'germanic','Ostrogoths':'germanic','Goths':'germanic',
  'Alamans':'germanic','Burgunds':'germanic','Frisians':'germanic',
  'Lombard principalities':'germanic','Norsemen':'germanic','Germanic tribes':'germanic',
  'Celts':'celtic','Celtiberians':'celtic','Celltic Hallsatt culture':'celtic',
  'La Tène culture':'celtic','Boii':'celtic',
  // Italic & Balkan
  'Etrurians':'italian','Samnites':'italian',
  'Illyrians':'byzantine','Dardania':'byzantine','Thrace':'byzantine',
  'Dacia':'byzantine','Daces':'byzantine',
  // Near East & Levant
  'Hittites':'persian','Phrygians':'persian','Atropatene':'persian',
  'Cappadocia':'persian','Urartu':'persian','Elam':'persian','Colchis':'caucasus',
  'Canaan':'islamic','Arameans':'islamic','Kingdom of David and Solomon':'islamic',
  'Semites':'islamic',
  // North Africa
  'Carthage':'islamic','Carthaginian Empire':'islamic',
  'Numidia':'islamic','Mauretania':'islamic','Berbers':'islamic',
  'Kingdom of Syphax':'islamic','Kingdom of Gala':'islamic',
  'Kerma':'islamic','Kush':'islamic',
  // Arabia
  'Himyarite Kingdom':'islamic','Arabs':'islamic','Arabian pastoral nomads':'islamic',
  'Nabatean Kingdom':'islamic',
  // European Bronze/Iron Age cultures
  'Beaker':'prehistoric','Bell-shaped burials culture':'prehistoric',
  'Brushed Pottery culture':'prehistoric','Plain-Pottery culture':'prehistoric',
  'Pomeranian culture ':'prehistoric','Eastern Masurian culture':'prehistoric',
  'Western Masurian culture':'prehistoric','Sambian-Nothangian culture':'prehistoric',
  'Milograd culture':'prehistoric','Catacomb culture':'prehistoric',
  'Únětice':'prehistoric','Urnfield cultures':'prehistoric',
  'Lusatian culture':'prehistoric','N. European Bronze Age cultures':'prehistoric',
  'Hunters-gatherers':'prehistoric','Boihaenum':'prehistoric',
  'Hurrian Kingdoms':'prehistoric','Anatolian tribes':'prehistoric',
  'Achaemenid Empire':'prehistoric',
  'Sabini':'prehistoric','East Getaes':'prehistoric','West Getaes':'prehistoric',
  // Modern states
  'Netherlands':'modern','Belgium':'modern','Luxembourg':'modern',
  'Switzerland':'modern','Swiss Confederation':'modern',
  'Republic of the Seven Zenden':'modern','Dutch Republic':'modern',
  'Andorra':'modern','Liechtenstein':'modern','Malta':'modern',
  'Cyprus':'modern','Turkey':'modern','Syria':'modern',
  'Lebanon':'modern','Tunisia':'modern','Algeria (FR)':'modern',
  'Iraq':'modern','Geneva':'modern','Arran':'british',
  'Turkish Cypriot-administered area':'ottoman',
  'Syria (France)':'modern','Lake Segozerskoye':'other',
  'Lake Vygozero':'other','Warsenis':'other',

  // ── British / Celtic variants ───────────────────────────────────
  'Irlanda':'british','Picts':'british','Scots':'british',
  'Kent':'british','Mercia':'british','Essex':'british',
  'Wessex':'british','Welsh':'british','Nothumbria':'british',
  'Kingdom of Ireland':'british',

  // ── Nordic variants ─────────────────────────────────────────────
  'Northmen':'nordic','Swedes and Goths':'nordic','Sami':'nordic',
  'Kalmar Union':'nordic','Kingdom of Norway':'nordic','Greenland':'nordic',
  'Norsemen':'nordic',

  // ── Frankish / Germanic — Carolingian + HRE fragments ──────────
  'Carolingian Empire':'frankish','East Francia':'frankish','West Francia':'frankish',
  'German Empire':'frankish','East Germany':'modern','West Germany':'frankish',
  'Austro-Hungarian Empire':'habsburg','Habsburg Austria':'habsburg',
  'Habsburg Netherlands':'habsburg',
  'Lombard duchies':'italian','Florence':'italian',
  'Savoy':'italian','Kingdom of Sardinia':'italian',
  'Kingdom of the Two Sicilies':'italian','Venetia':'italian','San Marino':'italian',
  'Angevin Empire':'french',
  // German micro-states (1700–1815 era)
  'Anhalt':'frankish','Baden':'frankish','Bavaria':'frankish',
  'Bremen':'frankish','Brunswick':'frankish','Cuxhaven':'frankish',
  'Hamburg':'frankish','Hanover':'frankish','Hohenzollern':'frankish',
  'Holstein':'frankish','Lippe-Detmold':'frankish','Lübeck':'frankish',
  'Mecklenburg-Schwerin':'frankish','Mecklenburg-Strelitz':'frankish',
  'Nassau':'frankish','Oldenburg':'frankish','Palatinate':'frankish',
  'Saxony':'frankish','Schaumburg-Lippe':'frankish','Schleswig':'frankish',
  'Swabia':'frankish','Thuringia':'frankish','Waldeck':'frankish',
  'Wetzlar':'frankish','Württemberg':'frankish',
  'Electoral Hesse':'frankish','Grand Duchy of Hesse':'frankish',
  'Danzig':'frankish',

  // ── Iberian ─────────────────────────────────────────────────────
  'Asturias':'iberian','Celtiberians':'iberian','Spanish Morocco':'iberian',

  // ── Islamic — North Africa / Caliphates ─────────────────────────
  'Aghlabid Emirate':'islamic','Emirate of Córdoba':'islamic',
  'Idrisid Caliphate':'islamic','Almohad Caliphate':'islamic',
  'Almoravid dynasty':'islamic','Watassid Morocco':'islamic',
  'Morocco':'islamic','Ibadites':'islamic',
  'Mamluke Sultanate':'islamic',
  // Ottoman North Africa
  'Algiers':'ottoman','Tunis':'ottoman','Tripolitania':'ottoman',
  'Cyrenaica':'ottoman','Egypt':'ottoman',

  // ── Slavic variants ─────────────────────────────────────────────
  'Great Moravia':'slavic',"Rus' Khaganate":'slavic',
  'Slavonic tribes':'slavic','Polyanians':'slavic',
  'Croatian kingdom':'slavic','Chelmia':'slavic',
  'Tsardom of Muscovy':'slavic','Russian Empire':'slavic',
  'Poland-Llituania':'slavic','Kievan Rus':'slavic',
  'Other Rus Principalities':'slavic',
  'Principality of Galicia-Volhynia':'slavic',
  'Principality of Kyiv':'slavic','Principality of Novgorod':'slavic',
  'Principality of Vladimir-Suzdal':'slavic','Principality of Polotsk':'slavic',
  'Novgorod-Seversky':'slavic','Bosnia':'slavic',
  'Raška':'slavic','Republic of Kraków':'slavic',
  'Principality of Wallachia':'slavic',

  // ── Steppe / Nomadic ────────────────────────────────────────────
  'Pechenegs':'steppe','Nogai Horde':'steppe',
  'Western Gokturk Khaganate':'steppe',
  'Cuman Khanates':'steppe','Cuman-Kipchak confederation':'steppe',
  'Oghuz':'steppe','Karakalpaks':'steppe',
  'Scythians':'steppe','Sarmates':'steppe','Cimerians':'steppe',
  'central Asian khanates':'steppe','Heruli':'germanic',

  // ── Baltic variants ─────────────────────────────────────────────
  'Baltic tribes':'baltic','Ests':'baltic','Finns':'nordic',
  'Mari':'baltic','Mordvinians':'baltic','Permians':'baltic','Veps':'baltic',

  // ── Greek / Hellenistic ─────────────────────────────────────────
  'Bosporan Kingdom':'greek','Ptolemaic Kingdom':'greek',
  'Seleucid Kingdom':'greek','Kingdom of Antigonus':'greek',
  'Kingdom of Kassander':'greek','Kingdom of Lysimachus':'greek',
  'Pergamon':'greek','Bithynia':'greek','Crete':'greek',
  'Thrace':'greek','Cappadocia':'other','Colchis':'caucasus',

  // ── Ancient Near East ───────────────────────────────────────────
  'Carthaginian Empire':'other','Carthage':'other',
  'Celts':'germanic','Daces':'other','Numidia':'other','Mauretania':'other',
  'Sarmates':'steppe','Nabatean Kingdom':'other',
  'Assyria':'other','Berbers':'other',
  'Celtiberians':'iberian','Germanic tribes':'germanic',

  // ── Prehistoric cultures ─────────────────────────────────────────
  'Yamnaya culture':'prehistoric','Sintashta':'prehistoric',
  'Urnfield cultures':'prehistoric','Cardial Ware culture':'prehistoric',
  'La Tène culture':'prehistoric','Lusatian culture':'prehistoric',
  'Chernoles culture':'prehistoric','Proto-Scythian culture':'prehistoric',
  'N. European Bronze Age cultures':'prehistoric',
  'Celltic Hallsatt culture':'prehistoric',
  'Coastal and Woodland Mesolithic Hunter-Foragers':'prehistoric',
  'Highland Mesolithic Hunter-Foragers':'prehistoric',
  'Steppe Mesolithic Hunter-Foragers':'prehistoric',
  'Neolithic Farmers':'prehistoric','Funnel-Beaker':'prehistoric',
  'Thule':'prehistoric','Canaan':'other',

  // ── Modern / post-1800 ──────────────────────────────────────────
  'Batavian Republic':'french','Helvetic Republic':'modern',
  'UK':'british','United Kingdom of Netherlands':'modern',
  'USA':'modern','Israel':'modern','Jordan':'modern',
  'Libya':'modern','Algeria':'modern',

  // ── Persian / Iranian ───────────────────────────────────────────
  'Persia':'persian','Sasanian Empire':'persian',
  'Sasanian dependencies':'persian','Parthian Empire':'persian',
  'Achaemenid Empire':'persian',   // overrides 'prehistoric' above
  'Safavid Empire':'persian','Iran':'persian',
  'Persi':'persian',               // GeoJSON typo variant (400 AD)
  'Parthia':'persian','Atropatene':'persian',
  'Elam':'persian','Urartu':'other','Babylonia':'other',
  'Ur':'other','Arameans':'other','Iranian pastoralists':'persian',
  // Islamic Near East / Central Asia
  'Abbasid Caliphate':'islamic','Buwayhid Emirates':'islamic',
  'Emirate of Tiflis':'islamic','Samanid Empire':'islamic',
  'Ghaznavid Emirate':'islamic','Bokhara Khanate':'islamic',
  'Khiva Khanate':'islamic',
  // Steppe / Central Asian
  'Ilkhanate':'steppe','Kara Khitai Khaganate':'steppe',
  'Seljuk Empire':'ottoman','Timurid Empire':'steppe','Timurid Emirates':'steppe',
  'Turan':'steppe','central Asian khanates':'steppe',
  // Caucasian principalities
  'Artsakh':'caucasus','Derbent':'caucasus','Durdzuks':'caucasus',
  'Goghtn':'caucasus','Kakheti-Hereti':'caucasus','Khundzi':'caucasus',
  'Leks':'caucasus','Syunik':'caucasus','Tashir':'caucasus',
  'Maskat':'caucasus','Arran':'caucasus','Emirate of the White Sheep Turks':'ottoman',
  // Empire of Alexander (Near East part)
  'Empire of Alexander':'greek',
  // Ancient Near East prehistoric
  'Andronovo':'prehistoric','Namazga':'prehistoric','Oxus':'prehistoric',
  'Ubaid':'prehistoric',
  // Modern states (Near East)
  'Afghanistan':'modern','Kuwait':'ottoman','India':'other',
  'Pakistan':'modern','Turkmenistan':'modern','Uzbekistan':'modern',
  // French mandate
  'France':'french',

  // ── Greek / Hellenistic (additional) ────────────────────────────
  'Macedon and Hellenic League':'greek','Dardania':'other',

  // ── Ottoman ─────────────────────────────────────────────────────
  'Beylik of Aydin':'ottoman',

  // ── Near East / Ancient ─────────────────────────────────────────
  'Phrygians':'other','Sabines':'other',
  'Kingdom of David and Solomon':'other',
  'Kingdom of Syphax':'other','Kingdom of Gala':'other',
  'Kingdom of Kapisa':'other','Kingdom of Zunbil':'other',
  'Kwarezm':'persian','Saharan pastoral nomads':'other',
  'Tuareg Nomadic Tribes':'other','minor states':'other',
  'state societies and Aramaean kingdoms':'other',

  // ── Prehistoric (remaining) ──────────────────────────────────────
  'Dimini':'prehistoric','Early combware':'prehistoric',
  'Ghassul':'prehistoric','Amuq D':'prehistoric',
  'La Almagra culture':'prehistoric','Narva':'prehistoric',
  'Nemay':'prehistoric','Stentinello culture':'prehistoric',
  'Volga-Kamm':'prehistoric','Karasuk culture':'prehistoric',
  'Levantine Corridor (Neolithic Farmers)':'prehistoric',
  'Alluvial Lowland Mesolithic Hunter-Foragers':'prehistoric',
  'HIghland Mesolithic Hunter-Foragers':'prehistoric',
  'Magadha':'other',
};

function getCulture(props) {
  const s = props.SUBJECTO || props.NAME || '';
  const n = props.NAME || '';
  return TERRITORY_CULTURE[s] || TERRITORY_CULTURE[n] || 'other';
}

function getColor(props) {
  const group = getCulture(props);
  return (CULTURE_GROUPS[group] || CULTURE_GROUPS.other).color;
}

// ═══════════════════════════════════════════
//  PHASE 3 — SYSTEM 1: TERRITORY MAPPING
//  Verbindet SUBJECTO-Werte mit Wikidata-IDs
//  Startumfang: 3 Territorien (System validieren, nicht Daten sammeln)
// ═══════════════════════════════════════════

function normalize(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Territories outside project scope (Asia, Americas, Sub-Saharan Africa, Pacific)
// These are hidden from map rendering entirely — no polygon, no tooltip.
const OUT_OF_SCOPE_SUBJECTOS = new Set([
  'aboriginal tasmanians', 'aboriginal tribes', 'austronesians', 'bantu',
  'jōmon', 'khoisan', 'khoiasan', 'ainu', 'okhotsk culture',
  'dakapeng culture', 'dravidians', 'norte chico', 'valdivia',
  'indus valley civilization', 'archaic amerindian hunter-gatherers',
  'arctic marine mammal hunters', 'australian aboriginal hunter-gatherers',
  'austroasian rice cultures', 'chinchorro culture', 'koreans',
  'mesoamerican hunter-gatherers and maïze farmers',
  'paleo-siberian hunter-gatherers', 'tasmanian hunter-gatherers',
  'thai', 'tibeto-burmanese', 'xia',
]);

const TERRITORY_MAPPING = {
  "roman empire": {
    wikidataId:    "Q2277",
    rulerPosition: "Q842606",   // Roman emperor (Q842606) - correct Wikidata ID
    label:         "Roman Empire"
  },
  "eastern roman empire": {
    wikidataId:    "Q12544",
    rulerPosition: "Q842606",   // Byzantine emperor also subclass
    label:         "Eastern Roman Empire"
  },
  "ottoman empire": {
    wikidataId:    "Q12560",
    rulerPosition: "Q83172",    // Sultan (Q83172)
    label:         "Ottoman Empire"
  },
  "holy roman empire": {
    wikidataId:    "Q12548",
    rulerPosition: "Q193522",
    label:         "Holy Roman Empire"
  },
  "byzantine empire": {
    wikidataId:    "Q12544",
    rulerPosition: "Q842606",
    label:         "Byzantine Empire"
  },
  "western roman empire": {
    wikidataId:    "Q83286",
    rulerPosition: "Q842606",
    label:         "Western Roman Empire"
  },
  "roman republic": {
    wikidataId:    "Q62832",
    rulerPosition: null,
    label:         "Roman Republic"
  },
  "rome (diocletianus)": {
    wikidataId:    "Q1415",
    rulerPosition: null,
    label:         "Rome (Diocletianus)"
  },
  "rome (maximian)": {
    wikidataId:    "Q181503",
    rulerPosition: null,
    label:         "Rome (Maximian)"
  },
  "rome (constantinus)": {
    wikidataId:    "Q9431",
    rulerPosition: null,
    label:         "Rome (Constantinus)"
  },
  "rome (galerius)": {
    wikidataId:    "Q177463",
    rulerPosition: null,
    label:         "Rome (Galerius)"
  },
  "rome": {
    wikidataId:    "Q62832",
    rulerPosition: null,
    label:         "Rome"
  },  
  "empire of alexander": {
    wikidataId:    "Q8409",
    rulerPosition: null,
    label:         "Empire of Alexander"
  },
  "ptolemaic kingdom": {
    wikidataId:    "Q11751",
    rulerPosition: null,
    label:         "Ptolemaic Kingdom"
  },
  "macedon and hellenic league": {
    wikidataId:    "Q83958",
    rulerPosition: null,
    label:         "Macedon and Hellenic League"
  },
  "greek city-states": {
    wikidataId:    "Q11772",
    rulerPosition: null,
    label:         "Greek City-States"
  },
  "greek colonies": {
    wikidataId:    null,
    rulerPosition: null,
    label:         "Greek Colonies"
  },
  "frankish kingdom": {
    wikidataId:    "Q146246",
    rulerPosition: null,
    label:         "Frankish Kingdom"
  },
  "visigothic kingdom": {
    wikidataId:    "Q126936",
    rulerPosition: null,
    label:         "Visigothic Kingdom"
  },
  "carolingian empire": {
    wikidataId:    "Q31929",
    rulerPosition: null,
    label:         "Carolingian Empire"
  },
  "franks": {
    wikidataId:    "Q203849",
    rulerPosition: null,
    label:         "Franks"
  },
  "east francia": {
    wikidataId:    "Q160853",
    rulerPosition: null,
    label:         "East Francia"
  },
  "west francia": {
    wikidataId:    "Q46370",
    rulerPosition: null,
    label:         "West Francia"
  },
  "wessex": {
    wikidataId:    "Q105313",
    rulerPosition: null,
    label:         "Wessex"
  },
  "mercia": {
    wikidataId:    "Q105092",
    rulerPosition: null,
    label:         "Mercia"
  },
  "kent": {
    wikidataId:    "Q104906",
    rulerPosition: null,
    label:         "Kent"
  },
  "essex": {
    wikidataId:    "Q105390",
    rulerPosition: null,
    label:         "Essex"
  },
  "nothumbria": {
    wikidataId:    "Q131491",
    rulerPosition: null,
    label:         "Nothumbria"
  },
  "welsh": {
    wikidataId:    "Q161885",
    rulerPosition: null,
    label:         "Welsh"
  },
  // ── England / United Kingdom (multi_context: Q784963 / Q179876 / Q145) ──
  "england": {
    wikidataId:    "Q145",
    rulerPosition: null,
    label:         "England / United Kingdom"
  },
  "england and ireland": {
    wikidataId:    "Q145",
    rulerPosition: null,
    label:         "England / United Kingdom"
  },
  "english territory": {
    wikidataId:    "Q145",
    rulerPosition: null,
    label:         "England / United Kingdom"
  },
  "great britain": {
    wikidataId:    "Q145",
    rulerPosition: null,
    label:         "England / United Kingdom"
  },
  "united kingdom": {
    wikidataId:    "Q145",
    rulerPosition: null,
    label:         "England / United Kingdom"
  },
  "united kingdom of great britain and ireland": {
    wikidataId:    "Q145",
    rulerPosition: null,
    label:         "England / United Kingdom"
  },
  "uk": {
    wikidataId:    "Q145",
    rulerPosition: null,
    label:         "England / United Kingdom"
  },
  "france": {
    wikidataId:    "Q142",
    rulerPosition: null,
    label:         "France"
  },
  "irlanda": {
    wikidataId:    "Q22890",
    rulerPosition: null,
    label:         "Irlanda"
  },
  "celtic kingdoms": {
    wikidataId:    "Q849967",
    rulerPosition: null,
    label:         "Celtic kingdoms"
  },
  "scotland": {
    wikidataId:    "Q230791",
    rulerPosition: null,
    label:         "Scotland"
  },
  "león": {
    wikidataId:    "Q134497",
    rulerPosition: null,
    label:         "León"
  },
  "alamans": {
    wikidataId:    "Q132990",
    rulerPosition: null,
    label:         "Alamans"
  },
  "dumonii": {
    wikidataId:    "Q7246122",
    rulerPosition: null,
    label:         "Dumonii"
  },
  "visigoths": {
    wikidataId:    "Q23693",
    rulerPosition: null,
    label:         "Visigoths"
  },
  "saami": {
    wikidataId:    "Q48199",
    rulerPosition: null,
    label:         "Saami"
  },
  "sami": {
    wikidataId:    "Q48199",
    rulerPosition: null,
    label:         "Saami"
  },
  "samis": {
    wikidataId:    "Q48199",
    rulerPosition: null,
    label:         "Saami"
  },
  "sámi": {
    wikidataId:    "Q48199",
    rulerPosition: null,
    label:         "Saami"
  },
  "burgunds": {
    wikidataId:    "Q150412",
    rulerPosition: null,
    label:         "Burgunds"
  },
  "swedes": {
    wikidataId:    "Q956420",
    rulerPosition: null,
    label:         "Swedes"
  },
  "geats": {
    wikidataId:    "Q1496339",
    rulerPosition: null,
    label:         "Geats"
  },
  "hunnic empire": {
    wikidataId:    "Q45813",
    rulerPosition: null,
    label:         "Hunnic Empire"
  },
  "ostrogoths": {
    wikidataId:    "Q103122",
    rulerPosition: null,
    label:         "Ostrogoths"
  },
  "poland": {
    wikidataId:    "Q36",
    rulerPosition: null,
    label:         "Poland"
  },
  "poland-lithuania": {
    wikidataId:    "Q36",
    rulerPosition: null,
    label:         "Poland"
  },
  "poland-llituania": {
    wikidataId:    "Q36",
    rulerPosition: null,
    label:         "Poland"
  },
  "polish\u2013lithuanian commonwealth": {
    wikidataId:    "Q36",
    rulerPosition: null,
    label:         "Poland"
  },

  // ─── Germany (multi_context root Q183) ───────────────────────
  // Both "Germany" and "German Empire" SUBJECTOs map to Q183 root
  "germany": {
    wikidataId:    "Q183",
    rulerPosition: null,
    label:         "Germany"
  },
  "german empire": {
    wikidataId:    "Q183",
    rulerPosition: null,
    label:         "Germany"
  },

  // ─── West Germany ─────────────────────────────────────────────
  "west germany": {
    wikidataId:    "Q713750",
    rulerPosition: null,
    label:         "West Germany"
  },

  // ─── East Germany ─────────────────────────────────────────────
  "east germany": {
    wikidataId:    "Q16957",
    rulerPosition: null,
    label:         "East Germany"
  },

  // ─── Austria (multi_context root Q40) ────────────────────────
  // All historical SUBJECTO variants map to Q40 root
  "austria": {
    wikidataId:    "Q40",
    rulerPosition: null,
    label:         "Austria"
  },
  "habsburg austria": {
    wikidataId:    "Q40",
    rulerPosition: null,
    label:         "Austria"
  },
  "austrian empire": {
    wikidataId:    "Q40",
    rulerPosition: null,
    label:         "Austria"
  },
  "austria hungary": {
    wikidataId:    "Q40",
    rulerPosition: null,
    label:         "Austria"
  },
  "austro-hungarian empire": {
    wikidataId:    "Q40",
    rulerPosition: null,
    label:         "Austria"
  },
  // ── Hungary (ruler_based: Q28, Magyars 955–1918) ──
  "hungary": {
    wikidataId:    "Q28",
    rulerPosition: null,
    label:         "Hungary"
  },
  "kingdom of hungary": {
    wikidataId:    "Q28",
    rulerPosition: null,
    label:         "Hungary"
  },
  "imperial hungary": {
    wikidataId:    "Q28",
    rulerPosition: null,
    label:         "Hungary"
  },
  "magyars": {
    wikidataId:    "Q28",
    rulerPosition: null,
    label:         "Hungary"
  },
  "prussia": {
    wikidataId:    "Q38872",
    rulerPosition: null,
    label:         "Prussia"
  },
  "spain": {
    wikidataId:    "Q29",
    rulerPosition: null,
    label:         "Spain"
  },
  "spanish habsburg": {
    wikidataId:    "Q29",
    rulerPosition: null,
    label:         "Spain"
  },
  "parthian empire": {
    wikidataId:    "Q794",
    rulerPosition: null,
    label:         "Parthian Empire"
  },
  "parthia": {
    wikidataId:    "Q794",
    rulerPosition: null,
    label:         "Parthian Empire"
  },
  "sasanian empire": {
    wikidataId:    "Q794",
    rulerPosition: null,
    label:         "Sasanian Empire"
  },
  "sasanian dependencies": {
    wikidataId:    "Q794",
    rulerPosition: null,
    label:         "Sasanian Empire"
  },
  "safavid empire": {
    wikidataId:    "Q794",
    rulerPosition: null,
    label:         "Safavid dynasty"
  },
  "persia": {
    wikidataId:    "Q794",
    rulerPosition: null,
    label:         "Persia"
  },
  "persi": {
    wikidataId:    "Q794",
    rulerPosition: null,
    label:         "Persia"
  },
  "iran": {
    wikidataId:    "Q794",
    rulerPosition: null,
    label:         "Iran"
  },
  "curonians": {
    wikidataId:    "Q756922",
    rulerPosition: null,
    label:         "Curonians"
  },
  "milograd culture": {
    wikidataId:    "Q2446445",
    rulerPosition: null,
    label:         "Milograd culture"
  },
  "pomeranian culture": {
    wikidataId:    "Q972472",
    rulerPosition: null,
    label:         "Pomeranian culture"
  },
  "bell-shaped burials culture": {
    wikidataId:    "Q470867",
    rulerPosition: null,
    label:         "Bell-shaped burials culture"
  },
  "blemmyes": {
    wikidataId:    "Q934374",
    rulerPosition: null,
    label:         "Blemmyes"
  },
  "meroe": {
    wikidataId:    "Q5780",
    rulerPosition: null,
    label:         "Meroe"
  },
  "hadramaut": {
    wikidataId:    "Q1517159",
    rulerPosition: null,
    label:         "Hadramaut"
  },
  "guanches": {
    wikidataId:    "Q219995",
    rulerPosition: null,
    label:         "Guanches"
  },
  "saba": {
    wikidataId:    "Q216068",
    rulerPosition: null,
    label:         "Saba"
  },
  "achaemenid empire": {
    wikidataId:    "Q389688",
    rulerPosition: null,
    label:         "Achaemenid Empire"
  },
  "armenia": {
    wikidataId:    "Q208404",
    rulerPosition: null,
    label:         "Armenia"
  },
  "axum": {
    wikidataId:    "Q139377",
    rulerPosition: null,
    label:         "Axum"
  },

  // ── Tier 1 Ancient context-only batch ──
  // Aegean Bronze Age
  "minoan":                        { wikidataId: "Q134178",   rulerPosition: null, label: "Minoan" },
  "crete":                         { wikidataId: "Q134178",   rulerPosition: null, label: "Crete" },
  "cycladic":                      { wikidataId: "Q318144",   rulerPosition: null, label: "Cycladic" },
  // Anatolia
  "hittites":                      { wikidataId: "Q5406",     rulerPosition: null, label: "Hittites" },
  "phrygians":                     { wikidataId: "Q32579",    rulerPosition: null, label: "Phrygians" },
  "atropatene":                    { wikidataId: "Q260437",   rulerPosition: null, label: "Atropatene" },
  "cappadocia":                    { wikidataId: "Q29654286", rulerPosition: null, label: "Cappadocia" },
  "bithynia":                      { wikidataId: "Q373189",   rulerPosition: null, label: "Bithynia" },
  // Levant & Mesopotamia
  "canaan":                        { wikidataId: "Q163329",   rulerPosition: null, label: "Canaan" },
  "arameans":                      { wikidataId: "Q175064",   rulerPosition: null, label: "Arameans" },
  "urartu":                        { wikidataId: "Q185068",   rulerPosition: null, label: "Urartu" },
  "elam":                          { wikidataId: "Q128904",   rulerPosition: null, label: "Elam" },
  "kingdom of david and solomon":  { wikidataId: "Q3185305",  rulerPosition: null, label: "Kingdom of David and Solomon" },
  // Caucasus
  "colchis":                       { wikidataId: "Q183150",   rulerPosition: null, label: "Colchis" },
  // North Africa
  "carthage":                      { wikidataId: "Q6343",     rulerPosition: null, label: "Carthage" },
  "carthaginian empire":           { wikidataId: "Q2429397",  rulerPosition: null, label: "Carthaginian Empire" },
  "numidia":                       { wikidataId: "Q102679",   rulerPosition: null, label: "Numidia" },
  "mauretania":                    { wikidataId: "Q309272",   rulerPosition: null, label: "Mauretania" },
  "berbers":                       { wikidataId: "Q45315",    rulerPosition: null, label: "Berbers" },
  "kingdom of syphax":             { wikidataId: "Q353141",   rulerPosition: null, label: "Kingdom of Syphax" },
  "kingdom of gala":               { wikidataId: "Q314685",   rulerPosition: null, label: "Kingdom of Gala" },
  "kerma":                         { wikidataId: "Q1739282",  rulerPosition: null, label: "Kerma" },
  "kush":                          { wikidataId: "Q241790",   rulerPosition: null, label: "Kush" },
  "himyarite kingdom":             { wikidataId: "Q289577",   rulerPosition: null, label: "Himyarite Kingdom" },
  // Arabian Peninsula
  "arabs":                         { wikidataId: "Q35323",    rulerPosition: null, label: "Arabs" },
  "arabian pastoral nomads":       { wikidataId: "Q31945",    rulerPosition: null, label: "Arabian pastoral nomads" },
  // Italy & Balkans
  "etrurians":                     { wikidataId: "Q17161",    rulerPosition: null, label: "Etrurians" },
  "samnites":                      { wikidataId: "Q500272",   rulerPosition: null, label: "Samnites" },
  "illyrians":                     { wikidataId: "Q146715",   rulerPosition: null, label: "Illyrians" },
  "dardania":                      { wikidataId: "Q7043335",  rulerPosition: null, label: "Dardania" },
  "thrace":                        { wikidataId: "Q41741",    rulerPosition: null, label: "Thrace" },
  "dacia":                         { wikidataId: "Q173082",   rulerPosition: null, label: "Dacia" },
  "daces":                         { wikidataId: "Q212853",   rulerPosition: null, label: "Daces" },
  // Celts
  "celts":                         { wikidataId: "Q35966",    rulerPosition: null, label: "Celts" },
  "celtiberians":                  { wikidataId: "Q5011445",  rulerPosition: null, label: "Celtiberians" },
  "celltic hallsatt culture":      { wikidataId: "Q202165",   rulerPosition: null, label: "Celltic Hallstatt culture" },
  "la tène culture":               { wikidataId: "Q208247",   rulerPosition: null, label: "La Tène culture" },
  "boii":                          { wikidataId: "Q157676",   rulerPosition: null, label: "Boii" },
  // Germanic & North
  "germanic tribes":               { wikidataId: "Q22633",    rulerPosition: null, label: "Germanic tribes" },
  "norsemen":                      { wikidataId: "Q1211290",  rulerPosition: null, label: "Norsemen" },
  // Steppe
  "scythians":                     { wikidataId: "Q131802",   rulerPosition: null, label: "Scythians" },
  "cimerians":                     { wikidataId: "Q192730",   rulerPosition: null, label: "Cimerians" },
  "sarmates":                      { wikidataId: "Q162858",   rulerPosition: null, label: "Sarmates" },
  "alans":                         { wikidataId: "Q178054",   rulerPosition: null, label: "Alans" },
  "proto-scythian culture":        { wikidataId: "Q192730",   rulerPosition: null, label: "Proto-Scythian culture" },
  "bosporan kingdom":              { wikidataId: "Q321371",   rulerPosition: null, label: "Bosporan Kingdom" },
  // European Bronze/Iron Age cultures
  "urnfield cultures":             { wikidataId: "Q223998",   rulerPosition: null, label: "Urnfield cultures" },
  "lusatian culture":              { wikidataId: "Q611017",   rulerPosition: null, label: "Lusatian culture" },
  "n. european bronze age cultures": { wikidataId: "Q605601", rulerPosition: null, label: "N. European Bronze Age cultures" },
  "únětice":                       { wikidataId: "Q773818",   rulerPosition: null, label: "Únětice" },
  "boihaenum":                     { wikidataId: "Q39193",    rulerPosition: null, label: "Boihaenum" },
  // Near East / Arabia
  "nabatean kingdom":              { wikidataId: "Q11029653", rulerPosition: null, label: "Nabatean Kingdom" },
  "semites":                       { wikidataId: "Q62928",    rulerPosition: null, label: "Semites" },

  // ── Neolithic / Mesolithic / Bronze Age gaps ──
  "hunters-gatherers":             { wikidataId: "Q27443",    rulerPosition: null, label: "Hunters-gatherers" },
  "coastal and woodland mesolithic hunter-foragers": { wikidataId: "Q44155", rulerPosition: null, label: "Coastal and Woodland Mesolithic Hunter-Foragers" },
  "highland mesolithic hunter-foragers": { wikidataId: "Q44155", rulerPosition: null, label: "HIghland Mesolithic Hunter-Foragers" },
  "steppe mesolithic hunter-foragers":   { wikidataId: "Q599529", rulerPosition: null, label: "Steppe Mesolithic Hunter-Foragers" },
  "funnel-beaker":                 { wikidataId: "Q875115",   rulerPosition: null, label: "Funnel-Beaker" },
  "cardial ware culture":          { wikidataId: "Q1035710",  rulerPosition: null, label: "Cardial Ware culture" },
  "dimini":                        { wikidataId: "Q667357",   rulerPosition: null, label: "Dimini" },
  "narva":                         { wikidataId: "Q181459",   rulerPosition: null, label: "Narva" },
  "volga-kamm":                    { wikidataId: "Q129385",   rulerPosition: null, label: "Volga-Kamm" },
  "early combware":                { wikidataId: "Q129385",   rulerPosition: null, label: "Early combware" },
  "stentinello culture":           { wikidataId: "Q16545225", rulerPosition: null, label: "Stentinello culture" },
  "la almagra culture":            { wikidataId: "Q5641860",  rulerPosition: null, label: "La Almagra culture" },
  "beaker":                        { wikidataId: "Q470867",   rulerPosition: null, label: "Beaker" },
  "yamnaya culture":               { wikidataId: "Q426737",   rulerPosition: null, label: "Yamnaya culture" },
  "catacomb culture":              { wikidataId: "Q1511519",  rulerPosition: null, label: "Catacomb culture" },
  "anatolian tribes":              { wikidataId: "Q51614",    rulerPosition: null, label: "Anatolian tribes" },
  "ghassul":                       { wikidataId: "Q1521465",  rulerPosition: null, label: "Ghassul" },
  "amuq d":                        { wikidataId: "Q481670",   rulerPosition: null, label: "Amuq D" },
  "ubaid":                         { wikidataId: "Q245156",   rulerPosition: null, label: "Ubaid" },
  "hurrian kingdoms":              { wikidataId: "Q190394",   rulerPosition: null, label: "Hurrian Kingdoms" },
  "ur":                            { wikidataId: "Q5699",     rulerPosition: null, label: "Ur" },
  "city-states":                   { wikidataId: "Q11767",    rulerPosition: null, label: "city-states" },
  "nemay":                         { wikidataId: "Q208520",   rulerPosition: null, label: "Nemay" },
  "naquada i":                     { wikidataId: "Q753391",   rulerPosition: null, label: "Naquada I" },
  "saharan pastoral nomads":       { wikidataId: "Q2505359",  rulerPosition: null, label: "Saharan pastoral nomads" },

  // ── Near East Neolithic ──
  "alluvial lowland mesolithic hunter-foragers": { wikidataId: "Q44155",    rulerPosition: null, label: "Alluvial Lowland Mesolithic Hunter-Foragers" },
  "levantine corridor (neolithic farmers)":      { wikidataId: "Q1190360",  rulerPosition: null, label: "Levantine Corridor (Neolithic Farmers)" },
  "neolithic farmers":                           { wikidataId: "Q1275904",  rulerPosition: null, label: "Neolithic Farmers" },

  // ── Steppe & Central Asia ──
  "kelteminar":                  { wikidataId: "Q4132697",  rulerPosition: null, label: "Kelteminar" },
  "kelteminar culture":          { wikidataId: "Q4132697",  rulerPosition: null, label: "Kelteminar" },
  "namazga":                     { wikidataId: "Q203663",   rulerPosition: null, label: "Namazga" },
  "afanasevo":                   { wikidataId: "Q80974",    rulerPosition: null, label: "Afanasevo" },
  "andronovo":                   { wikidataId: "Q459376",   rulerPosition: null, label: "Andronovo" },
  "sintashta":                   { wikidataId: "Q656393",   rulerPosition: null, label: "Sintashta" },
  "oxus":                        { wikidataId: "Q1054850",  rulerPosition: null, label: "Oxus" },

  "seleucid kingdom": {
    wikidataId:    "Q93180",
    rulerPosition: null,
    label:         "Seleucid Kingdom"
  },
  "pergamon": {
    wikidataId:    "Q2022162",
    rulerPosition: null,
    label:         "Pergamon"
  },
  "assyria": {
    wikidataId:    "Q41137",
    rulerPosition: null,
    label:         "Assyria"
  },
  "babylonia": {
    wikidataId:    "Q47690",
    rulerPosition: null,
    label:         "Babylonia"
  },
  "ancient egypt": {
    wikidataId:    "Q11768",
    rulerPosition: null,
    label:         "Ancient Egypt"
  },
  "egypt": {
    wikidataId:    "Q11768",
    rulerPosition: null,
    label:         "Ancient Egypt"
  },

  // ── A3: Context-only cultures ──────────────────────────────
  "finno-ugric taiga hunter-gatherers": {
    wikidataId:    "Q79890",
    rulerPosition: null,
    label:         "Finno-Ugric taiga hunter-gatherers"
  },
  "karasuk culture": {
    wikidataId:    "Q129282",
    rulerPosition: null,
    label:         "Karasuk culture"
  },
  "iranian pastoralists": {
    wikidataId:    "Q1672477",
    rulerPosition: null,
    label:         "Iranian pastoralists"
  },
  "chernoles culture": {
    wikidataId:    "Q2636498",
    rulerPosition: null,
    label:         "Chernoles culture"
  },
  "brushed pottery culture": {
    wikidataId:    "Q4246708",
    rulerPosition: null,
    label:         "Brushed Pottery culture"
  },
  "sabini": {
    wikidataId:    "Q108356",
    rulerPosition: null,
    label:         "Sabini"
  },
  "heruli": {
    wikidataId:    "Q220643",
    rulerPosition: null,
    label:         "Heruli"
  },
  "state societies and aramaean kingdoms": {
    wikidataId:    "Q6104781",
    rulerPosition: null,
    label:         "State societies and Aramaean kingdoms"
  },
  "sambian-nothangian culture": {
    wikidataId:    "LOCAL_SAMBIAN-NOTHANGIAN_C",
    rulerPosition: null,
    label:         "Sambian-Nothangian culture"
  },
  "western masurian culture": {
    wikidataId:    "LOCAL_WESTERN_MASURIAN_CUL",
    rulerPosition: null,
    label:         "Western Masurian culture"
  },
  "eastern masurian culture": {
    wikidataId:    "LOCAL_EASTERN_MASURIAN_CUL",
    rulerPosition: null,
    label:         "Eastern Masurian culture"
  },
  "plain-pottery culture": {
    wikidataId:    "LOCAL_PLAIN-POTTERY_CULTUR",
    rulerPosition: null,
    label:         "Plain-Pottery culture"
  },
  "minor states": {
    wikidataId:    "LOCAL_MINOR_STATES",
    rulerPosition: null,
    label:         "Minor States"
  },

  // ── Diadochi kingdoms ──────────────────────────────────────
  "kingdom of antigonus": {
    wikidataId:    "Q200401",
    rulerPosition: null,
    label:         "Kingdom of Antigonus"
  },
  "kingdom of lysimachus": {
    wikidataId:    "Q32133",
    rulerPosition: null,
    label:         "Kingdom of Lysimachus"
  },
  "kingdom of kassander": {
    wikidataId:    "Q207183",
    rulerPosition: null,
    label:         "Kingdom of Kassander"
  },

  // ── Middle Ages — context_only batch ───────────────────────
  "avars": {
    wikidataId:    "Q68962",
    rulerPosition: null,
    label:         "Avars"
  },
  "khazars": {
    wikidataId:    "Q173282",
    rulerPosition: null,
    label:         "Khazars"
  },
  "great moravia": {
    wikidataId:    "Q193152",
    rulerPosition: null,
    label:         "Great Moravia"
  },
  "picts": {
    wikidataId:    "Q102891",
    rulerPosition: null,
    label:         "Picts"
  },
  "saxons": {
    wikidataId:    "Q101985",
    rulerPosition: null,
    label:         "Saxons"
  },
  "lombard principalities": {
    wikidataId:    "Q130900",
    rulerPosition: null,
    label:         "Lombards"
  },
  "lombard duchies": {
    wikidataId:    "Q130900",
    rulerPosition: null,
    label:         "Lombards"
  },
  "neustria": {
    wikidataId:    "Q106577",
    rulerPosition: null,
    label:         "Neustria"
  },
  "vasconia": {
    wikidataId:    "Q11705002",
    rulerPosition: null,
    label:         "Vasconia"
  },
  "pomerania": {
    wikidataId:    "Q104520",
    rulerPosition: null,
    label:         "Pomerania"
  },
  "frisians": {
    wikidataId:    "Q106416",
    rulerPosition: null,
    label:         "Frisians"
  },
  "pechenegs": {
    wikidataId:    "Q181752",
    rulerPosition: null,
    label:         "Pechenegs"
  },
  "slavs": {
    wikidataId:    "Q40477",
    rulerPosition: null,
    label:         "Slavic tribes"
  },
  "slavonic tribes": {
    wikidataId:    "Q40477",
    rulerPosition: null,
    label:         "Slavic tribes"
  },
  "slavic tribes": {
    wikidataId:    "Q40477",
    rulerPosition: null,
    label:         "Slavic tribes"
  },
  "bulgars": {
    wikidataId:    "Q110117",
    rulerPosition: null,
    label:         "Bulgars"
  },
  "bulgar khanate": {
    wikidataId:    "Q110117",
    rulerPosition: null,
    label:         "Bulgars"
  },

  // ── 500–1000 AD batch ─────────────────────────────────────
  "suren kingdom": { wikidataId: "Q13415387", rulerPosition: null, label: "Suren Kingdom" },
  "yueban":        { wikidataId: "Q154923",   rulerPosition: null, label: "Yueban" },
  "ruanruan":      { wikidataId: "Q155361",   rulerPosition: null, label: "Rouran Khaganate" },
  "dumnonia":      { wikidataId: "Q313136",   rulerPosition: null, label: "Dumnonia" },
  "guta":          { wikidataId: "Q1449447",  rulerPosition: null, label: "Gutar" },
  "nobatia":       { wikidataId: "Q568523",   rulerPosition: null, label: "Nobatia" },
  "hejaz":         { wikidataId: "Q169977",   rulerPosition: null, label: "Hejaz" },
  "mazun":         { wikidataId: "Q842",      rulerPosition: null, label: "Oman" },
  "danes":         { wikidataId: "Q35",       rulerPosition: null, label: "Denmark" },
  "kryvichs":      { wikidataId: "Q48287",    rulerPosition: null, label: "Krivichs" },
  "balts":         { wikidataId: "Q207761",   rulerPosition: null, label: "Balts" },
  "proto-slavs":   { wikidataId: "Q2378782",  rulerPosition: null, label: "Early Slavs" },
  "polanes":       { wikidataId: "Q722913",   rulerPosition: null, label: "Polans" },
  "danube bulgars":{ wikidataId: "Q203817",   rulerPosition: null, label: "First Bulgarian Empire" },
  "moravians":     { wikidataId: "Q43266",    rulerPosition: null, label: "Moravia" },
  "georgian kingdom": { wikidataId: "Q19083", rulerPosition: null, label: "Kingdom of Iberia" },
  "sabirs":        { wikidataId: "Q370957",   rulerPosition: null, label: "Sabirs" },
  "western gokturk khaganate": { wikidataId: "Q874357",  rulerPosition: null, label: "Western Turkic Khaganate" },
  "kingdom of kapisa":         { wikidataId: "Q6412614", rulerPosition: null, label: "Kingdom of Kapisa" },
  "kingdom of zunbil":         { wikidataId: "Q229780",  rulerPosition: null, label: "Zunbils" },
  "kingdom of sind":           { wikidataId: "Q16931424",rulerPosition: null, label: "Rai dynasty" },
  "scots":         { wikidataId: "Q111471",   rulerPosition: null, label: "Dál Riata" },
  "permians":      { wikidataId: "Q2634718",  rulerPosition: null, label: "Permians" },
  "veps":          { wikidataId: "Q37556",    rulerPosition: null, label: "Vepsians" },
  "karelians":     { wikidataId: "Q213470",   rulerPosition: null, label: "Karelians" },
  "finns":         { wikidataId: "Q170284",   rulerPosition: null, label: "Finns" },
  "ests":          { wikidataId: "Q173302",   rulerPosition: null, label: "Estonians" },
  "baltic tribes": { wikidataId: "Q207761",   rulerPosition: null, label: "Balts" },
  "rus' khaganate":{ wikidataId: "Q1618896",  rulerPosition: null, label: "Rus' Khaganate" },
  "mari":          { wikidataId: "Q214361",   rulerPosition: null, label: "Mari people" },
  "volga bulgars": { wikidataId: "Q185488",   rulerPosition: null, label: "Volga Bulgaria" },
  "bashkirs":      { wikidataId: "Q485348",   rulerPosition: null, label: "Bashkirs" },
  "mordvinians":   { wikidataId: "Q33543",    rulerPosition: null, label: "Mordvins" },
  "cyprus":        { wikidataId: "Q229",      rulerPosition: null, label: "Cyprus" },
  "tuaregs":       { wikidataId: "Q58843",    rulerPosition: null, label: "Tuareg people" },
  "aghlabid emirate":      { wikidataId: "Q207600",   rulerPosition: null, label: "Aghlabid Emirate" },
  "idrisid caliphate":     { wikidataId: "Q431575",   rulerPosition: null, label: "Idrisid Caliphate" },
  "emirate of sicily":     { wikidataId: "Q1250763",  rulerPosition: null, label: "Emirate of Sicily" },
  "icelandic commonwealth":{ wikidataId: "Q62389",    rulerPosition: null, label: "Icelandic Commonwealth" },
  "finland":       { wikidataId: "Q170284",   rulerPosition: null, label: "Finns" },
  "kurs":          { wikidataId: "Q756922",   rulerPosition: null, label: "Curonians" },
  "prussians":     { wikidataId: "Q109073",   rulerPosition: null, label: "Old Prussians" },
  "kimek-kipchak khaganate": { wikidataId: "Q2477776", rulerPosition: null, label: "Kimek–Kipchak confederation" },
  "buwayhid emirates":     { wikidataId: "Q273874",   rulerPosition: null, label: "Buwayhid Emirates" },
  "ghaznavid emirate":     { wikidataId: "Q12844800", rulerPosition: null, label: "Ghaznavid Emirate" },
  "shirvan":       { wikidataId: "Q17526620", rulerPosition: null, label: "Shirvanshah" },
  "muscat":        { wikidataId: "Q842",      rulerPosition: null, label: "Oman" },
  "sardinia":      { wikidataId: "Q742313",   rulerPosition: null, label: "Judicates of Sardinia" },
  "corsica":       { wikidataId: "Q6806804",  rulerPosition: null, label: "Medieval Corsica" },
  "peshemegs":     { wikidataId: "Q181752",   rulerPosition: null, label: "Pechenegs" },
  "cantia":        { wikidataId: "Q104906",   rulerPosition: null, label: "Kent" },

  // ── 1100–1492 AD batch ────────────────────────────────────
  // 1100 AD
  "soomra emirate":               { wikidataId: "Q3042057",  rulerPosition: null, label: "Soomra Dynasty" },
  "oghuz":                        { wikidataId: "Q494462",   rulerPosition: null, label: "Oghuz Turks" },
  "cuman-kipchak confederation":  { wikidataId: "Q1035516",  rulerPosition: null, label: "Cumans" },
  "karakalpaks":                  { wikidataId: "Q276315",   rulerPosition: null, label: "Karakalpaks" },
  "goghtn":                       { wikidataId: "Q2066863",  rulerPosition: null, label: "Goghtn" },
  "syunik":                       { wikidataId: "Q4448526",  rulerPosition: null, label: "Syunik" },
  "artsakh":                      { wikidataId: "Q1550130",  rulerPosition: null, label: "Kingdom of Artsakh" },
  "arran":                        { wikidataId: "Q177076",   rulerPosition: null, label: "Caucasian Albania" },
  "maskat":                       { wikidataId: "Q3826",     rulerPosition: null, label: "Muscat" },
  "leks":                         { wikidataId: "Q26962106", rulerPosition: null, label: "Lak people" },
  "durdzuks":                     { wikidataId: "Q15916991", rulerPosition: null, label: "Durdzuks" },
  "khundzi":                      { wikidataId: "Q2667578",  rulerPosition: null, label: "Khunzakh" },
  "kakheti-hereti":               { wikidataId: "Q7216494",  rulerPosition: null, label: "Kingdom of Kakheti-Hereti" },
  "tashir":                       { wikidataId: "Q112745",   rulerPosition: null, label: "Kingdom of Tashir-Dzoraget" },
  "principality of polotsk":      { wikidataId: "Q517333",   rulerPosition: null, label: "Principality of Polotsk" },
  "dutchy of benevento":          { wikidataId: "Q267816",   rulerPosition: null, label: "Duchy of Benevento" },
  "burgandy":                     { wikidataId: "Q530670",   rulerPosition: null, label: "Kingdom of Burgundy" },
  "kievan rus":                   { wikidataId: "Q1108445",  rulerPosition: null, label: "Kyivan Rus" },
  // 1200 AD
  "ibadites":                     { wikidataId: "Q2342282",  rulerPosition: null, label: "Imamate of Oman" },
  "angevin empire":               { wikidataId: "Q538677",   rulerPosition: null, label: "Angevin Empire" },
  "principality of novgorod":     { wikidataId: "Q151536",   rulerPosition: null, label: "Novgorod Republic" },
  "principality of vladimir-suzdal": { wikidataId: "Q83546", rulerPosition: null, label: "Vladimir-Suzdal" },
  "principality of kyiv":         { wikidataId: "Q1483430",  rulerPosition: null, label: "Principality of Kiev" },
  "principality of galicia-volhynia": { wikidataId: "Q239502", rulerPosition: null, label: "Kingdom of Galicia-Volhynia" },
  "cuman khanates":               { wikidataId: "Q1035516",  rulerPosition: null, label: "Cumans" },
  "other rus principalities":     { wikidataId: "Q13403037", rulerPosition: null, label: "Russian principalities" },
  // 1279 AD
  "touareg":                      { wikidataId: "Q58843",    rulerPosition: null, label: "Tuareg people" },
  // 1300 AD
  "grand duchy of moscow":        { wikidataId: "Q170770",   rulerPosition: null, label: "Grand Principality of Moscow" },
  "raška":                        { wikidataId: "Q1311990",  rulerPosition: null, label: "Serbia" },
  "novgorod":                     { wikidataId: "Q151536",   rulerPosition: null, label: "Novgorod Republic" },
  // 1400 AD
  "bosnia":                       { wikidataId: "Q2980623",  rulerPosition: null, label: "Kingdom of Bosnia" },
  "moldova":                      { wikidataId: "Q10957559", rulerPosition: null, label: "Principality of Moldavia" },
  "principality of wallachia":    { wikidataId: "Q171393",   rulerPosition: null, label: "Wallachia" },
  "kalmar union":                 { wikidataId: "Q62623",    rulerPosition: null, label: "Kalmar Union" },
  // 1492 AD
  "sind":                         { wikidataId: "Q27260",    rulerPosition: null, label: "Samma dynasty" },
  "zayyanid caliphate":           { wikidataId: "Q307697",   rulerPosition: null, label: "Zayyanid dynasty" },
  "khanate of sibir":             { wikidataId: "Q190513",   rulerPosition: null, label: "Khanate of Sibir" },
  "oirat confederation":          { wikidataId: "Q7081520",  rulerPosition: null, label: "Oirat" },
  "golden horde":                 { wikidataId: "Q79965",    rulerPosition: null, label: "Golden Horde" },
  "white horde":                  { wikidataId: "Q2553863",  rulerPosition: null, label: "White Horde" },
  "ryazan":                       { wikidataId: "Q269109",   rulerPosition: null, label: "Principality of Ryazan" },

  // ── Middle Ages — ruler_based batch ───────────────────────
  "umayyad caliphate": {
    wikidataId:    "Q8575586",
    rulerPosition: null,
    label:         "Umayyad Caliphate"
  },
  "abbasid caliphate": {
    wikidataId:    "Q12536",
    rulerPosition: null,
    label:         "Abbasid Caliphate"
  },
  "emirate of córdoba": {
    wikidataId:    "Q1337854",
    rulerPosition: null,
    label:         "Emirate / Caliphate of Cordoba"
  },
  "emirate of cordoba": {
    wikidataId:    "Q1337854",
    rulerPosition: null,
    label:         "Emirate / Caliphate of Cordoba"
  },
  "caliphate of córdoba": {
    wikidataId:    "Q1337854",
    rulerPosition: null,
    label:         "Emirate / Caliphate of Cordoba"
  },
  "caliphate of cordoba": {
    wikidataId:    "Q1337854",
    rulerPosition: null,
    label:         "Emirate / Caliphate of Cordoba"
  },
  "fatimid caliphate": {
    wikidataId:    "Q160307",
    rulerPosition: null,
    label:         "Fatimid Caliphate"
  },
  "kyivan rus": {
    wikidataId:    "Q1108445",
    rulerPosition: null,
    label:         "Kyivan Rus"
  },
  "denmark-norway": {
    wikidataId:    "Q35",
    rulerPosition: null,
    label:         "Denmark"
  },
  "denmark": {
    wikidataId:    "Q35",
    rulerPosition: null,
    label:         "Denmark"
  },
  "kingdom of norway": {
    wikidataId:    "Q20",
    rulerPosition: null,
    label:         "Norway"
  },
  "norway": {
    wikidataId:    "Q20",
    rulerPosition: null,
    label:         "Norway"
  },
  "sweden": {
    wikidataId:    "Q34",
    rulerPosition: null,
    label:         "Sweden"
  },
  "swedes and goths": {
    wikidataId:    "Q34",
    rulerPosition: null,
    label:         "Sweden"
  },
  "serbia": {
    wikidataId:    "Q1311990",
    rulerPosition: null,
    label:         "Serbia"
  },
  "croatian kingdom": {
    wikidataId:    "Q858841",
    rulerPosition: null,
    label:         "Croatia"
  },
  "croatia": {
    wikidataId:    "Q858841",
    rulerPosition: null,
    label:         "Croatia"
  },
  "venice": {
    wikidataId:    "Q4948",
    rulerPosition: null,
    label:         "Venice"
  },
  "papal states": {
    wikidataId:    "Q170174",
    rulerPosition: null,
    label:         "Papal States"
  },
  "asturias": {
    wikidataId:    "Q231392",
    rulerPosition: null,
    label:         "Asturias"
  },
  "aragón": {
    wikidataId:    "Q204920",
    rulerPosition: null,
    label:         "Aragon"
  },
  "aragon": {
    wikidataId:    "Q204920",
    rulerPosition: null,
    label:         "Aragon"
  },
  "castilla": {
    wikidataId:    "Q179293",
    rulerPosition: null,
    label:         "Castile"
  },
  "navarre": {
    wikidataId:    "Q200262",
    rulerPosition: null,
    label:         "Navarre"
  },
  "britany": {
    wikidataId:    "Q71747",
    rulerPosition: null,
    label:         "Brittany"
  },
  "brittany": {
    wikidataId:    "Q71747",
    rulerPosition: null,
    label:         "Brittany"
  },
  "kingdom of georgia": {
    wikidataId:    "Q154667",
    rulerPosition: null,
    label:         "Kingdom of Georgia"
  },
  "georgia": {
    wikidataId:    "Q154667",
    rulerPosition: null,
    label:         "Kingdom of Georgia"
  },

  // ── Edge cases ─────────────────────────────────────────────
  "?": {
    wikidataId:    "LOCAL_UNKNOWN",
    rulerPosition: null,
    label:         "Unknown territory"
  },
  "cordoba": {
    wikidataId:    "Q1337854",
    rulerPosition: null,
    label:         "Cordoba"
  },
  "almoravid dynasty": {
    wikidataId:    "Q163422",
    rulerPosition: null,
    label:         "Almoravid dynasty"
  },
  "seljuk empire": {
    wikidataId:    "Q8733",
    rulerPosition: null,
    label:         "Seljuk Empire"
  },
  "portugal": {
    wikidataId:    "Q45",
    rulerPosition: null,
    label:         "Portugal"
  },
  "almohad caliphate": {
    wikidataId:    "Q199688",
    rulerPosition: null,
    label:         "Almohad Caliphate"
  },
  "trebizond": {
    wikidataId:    "Q178913",
    rulerPosition: null,
    label:         "Empire of Trebizond"
  },
  "hafsid caliphate": {
    wikidataId:    "Q752662",
    rulerPosition: null,
    label:         "Hafsid Caliphate"
  },
  "mamluke sultanate": {
    wikidataId:    "Q282428",
    rulerPosition: null,
    label:         "Mamluke Sultanate"
  },
  "kwarizm-shah": {
    wikidataId:    "Q81009",
    rulerPosition: null,
    label:         "Kwarizm-Shah"
  },
  "lithuania": {
    wikidataId:    "Q49683",
    rulerPosition: null,
    label:         "Lithuania"
  },
  "ilkhanate": {
    wikidataId:    "Q178084",
    rulerPosition: null,
    label:         "Ilkhanate"
  },
  "teutonic knights": {
    wikidataId:    "Q48189",
    rulerPosition: null,
    label:         "Teutonic Knights"
  },
  "merinides": {
    wikidataId:    "Q582861",
    rulerPosition: null,
    label:         "Merinides"
  },
  "timurid empire": {
    wikidataId:    "Q20737645",
    rulerPosition: null,
    label:         "Timurid Empire"
  },
  "seljuk caliphate": {
    wikidataId:    "Q975405",
    rulerPosition: null,
    label:         "Seljuk Caliphate"
  },
  "morocco": {
    wikidataId:    "Q1028",
    rulerPosition: null,
    label:         "Morocco"
  },
  "timurid emirates": {
    wikidataId:    "Q20737645",
    rulerPosition: null,
    label:         "Timurid Emirates"
  },
  "castile": {
    wikidataId:    "Q179293",
    rulerPosition: null,
    label:         "Castile"
  },
  "castille": {
    wikidataId:    "Q179293",
    rulerPosition: null,
    label:         "Castile"
  },
  "khanate of the golden horde": {
    wikidataId:    "Q79965",
    rulerPosition: null,
    label:         "Khanate of the Golden Horde"
  },
  "sicily": {
    wikidataId:    "Q188586",
    rulerPosition: null,
    label:         "Sicily"
  }
};

// ─── TerritoryKnowledge — internes Datenmodell ───
// Das einzige Format das das UI jemals sieht.
// Wikidata-Rohdaten werden NIEMALS direkt ans UI weitergegeben.
//
// TerritoryKnowledge {
//   id          string   — normalisierter SUBJECTO-Wert
//   name        string   — Anzeigename
//   wikidataId  string   — z.B. "Q2277"
//   rulers      Array    — [{name, start, end}] gefiltert auf aktuelle Epoche
//   capital     string|null
//   wikipedia   string|null  — URL
//   coatOfArms  string|null  — Wikimedia-Bild-URL (für später)
// }

function createEmptyKnowledge(id, name, wikidataId) {
  return {
    id,
    name,
    wikidataId,
    rulers:     [],
    capital:    null,
    wikipedia:  null,
    coatOfArms: null,
    loaded:     false,
    loading:    false,
    error:      null
  };
}

// ─── Lookup: SUBJECTO → Mapping-Eintrag ───
function getMappingForSubjecto(subjecto) {
  const key = normalize(subjecto);
  const mapping = TERRITORY_MAPPING[key] || null;
  if (!mapping) console.warn('[EH] Unmapped SUBJECTO:', subjecto);
  return mapping;
}

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

async function loadTerritoriesData() {
  if (territoriesData) return territoriesData;
  try {
    const [r, rDe] = await Promise.all([
      fetch('data/knowledge/territories.json', { cache: 'no-cache' }),
      fetch('data/knowledge/territories_de.json', { cache: 'no-cache' }).catch(() => null),
    ]);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    territoriesData = await r.json();
    if (rDe && rDe.ok) territoriesDataDe = await rDe.json();
  } catch(e) {
    console.warn('territories.json nicht geladen:', e.message);
    return {};
  }
  return territoriesData;
}

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

