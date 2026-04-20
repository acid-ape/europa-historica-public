const state = {
  pct:0, playing:false, speed:1, raf:null, lastT:null,
  cache:{}, currentEpochIdx:null, selectedTerritory:null,
};
let tooltipPinned = false;
let pinnedX = 0, pinnedY = 0;

// ═══════════════════════════════════════════
//  D3 PROJECTION
// ═══════════════════════════════════════════
const W = () => window.innerWidth;
const H = () => window.innerHeight - 216;

const proj = d3.geoMercator()
  .center([15,52])
  .scale(Math.min(W(),1200) < 800 ? 480 : 680)
  .translate([W()/2, H()/2]);

const pathGen = d3.geoPath().projection(proj);

// ═══════════════════════════════════════════
//  GEOJSON LOADING & FILTERING
// ═══════════════════════════════════════════
function centroid(f) {
  try {
    const g = f.geometry;
    if (!g) return null;
    let c = [];
    if (g.type==='Polygon') c = g.coordinates[0];
    else if (g.type==='MultiPolygon') g.coordinates.forEach(p=>c.push(...p[0]));
    if (!c.length) return null;
    return [c.reduce((s,x)=>s+x[0],0)/c.length, c.reduce((s,x)=>s+x[1],0)/c.length];
  } catch { return null; }
}

function isEurope(f) {
  function inBounds(lon, lat) {
    if (lon >= -30 && lon <= 45 && lat >= 34 && lat <= 73) return true;  // Core Europe
    if (lon > 45 && lon <= 95 && lat >= 45 && lat <= 68) return true;    // Russia / Former Soviet
    if (lon >= -10 && lon <= 37 && lat >= 22 && lat <= 37) return true;  // North Africa (incl. Egypt)
    if (lon >= 35 && lon <= 70 && lat >= 22 && lat <= 43) return true;   // Near East / Persia / Arabia
    return false;
  }
  try {
    const g = f.geometry;
    if (!g) return false;
    // For MultiPolygon: check each sub-polygon centroid separately
    // (fixes empires with colonial territories — e.g. Spain 1783 with Americas)
    if (g.type === 'MultiPolygon') {
      return g.coordinates.some(poly => {
        const ring = poly[0];
        const n = ring.length;
        const cx = ring.reduce((s,c)=>s+c[0],0)/n;
        const cy = ring.reduce((s,c)=>s+c[1],0)/n;
        return inBounds(cx, cy);
      });
    }
    if (g.type === 'Polygon') {
      const ring = g.coordinates[0];
      const n = ring.length;
      const cx = ring.reduce((s,c)=>s+c[0],0)/n;
      const cy = ring.reduce((s,c)=>s+c[1],0)/n;
      return inBounds(cx, cy);
    }
  } catch {}
  return false;
}

async function loadEpoch(epoch) {
  if (state.cache[epoch.file]) return state.cache[epoch.file];
  setMsg(`Loading ${epoch.label}…`);
  try {
    const r = await fetch('data/epochs/' + epoch.file);
    if (!r.ok) throw new Error();
    const data = await r.json();
    const filtered = {...data, features: data.features.filter(isEurope)};
    state.cache[epoch.file] = filtered;
    return filtered;
  } catch(e) {
    console.warn('Failed to load', epoch.file);
    return null;
  }
}

// Returns true if a single flat coordinate array (from one polygon ring)
// has its highest latitude below -5° (i.e. entirely sub-equatorial).
function _ringMaxLat(flat) {
  let max = -Infinity;
  for (let i = 1; i < flat.length; i += 2) if (flat[i] > max) max = flat[i];
  return max;
}

// Clips a GeoJSON feature to only in-scope polygon parts (lat > -5°).
// For simple Polygons: returns null if out of scope, else the feature unchanged.
// For MultiPolygons: drops individual parts that are entirely south of -5°,
//   returns null if all parts are out of scope.
function clipToScope(f) {
  const geom = f.geometry;
  if (!geom) return f;
  if (geom.type === 'Polygon') {
    const flat = geom.coordinates.flat(Infinity);
    return _ringMaxLat(flat) < -5 ? null : f;
  }
  if (geom.type === 'MultiPolygon') {
    const valid = geom.coordinates.filter(rings => _ringMaxLat(rings.flat(Infinity)) >= -5);
    if (valid.length === 0) return null;
    if (valid.length === geom.coordinates.length) return f; // nothing clipped
    const newGeom = valid.length === 1
      ? { type: 'Polygon', coordinates: valid[0] }
      : { type: 'MultiPolygon', coordinates: valid };
    return { ...f, geometry: newGeom };
  }
  return f;
}

// ═══════════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════════
async function renderEpoch(idx) {
  const epoch = EPOCHS[idx];
  state.currentEpochIdx = idx;

  // Load while old epoch stays visible — no black gap
  const geo = await loadEpoch(epoch);
  if (!geo) return;

  const gT = d3.select('#g-terr');
  const gB = d3.select('#g-bord');
  const gL = d3.select('#g-labels');

  // C8/C11: true crossfade — clone old layers, render new behind, fade simultaneously
  const DUR = 260;

  // Remove any leftover clone from a rapid previous transition
  document.querySelectorAll('#g-terr-old,#g-labels-old').forEach(el => el.remove());

  // Clone old content and insert before active groups (so new renders on top)
  function cloneOld(sel, newId) {
    const node = sel.node();
    const clone = node.cloneNode(true);
    clone.id = newId;
    clone.style.pointerEvents = 'none';
    node.parentNode.insertBefore(clone, node);
    return clone;
  }
  const terrOld   = cloneOld(gT, 'g-terr-old');
  const labelsOld = cloneOld(gL, 'g-labels-old');

  // New content starts invisible, rendered on top of clone
  gT.style('opacity', 0);
  gL.style('opacity', 0);
  gT.selectAll('*').remove();
  gB.selectAll('*').remove();
  gL.selectAll('*').remove();

  geo.features.forEach(f => {
    const props = f.properties;
    const name = (props.NAME || '').trim() || props.SUBJECTO || '';
    if (!name) return; // skip unnamed features (coastal fragments, unclaimed areas)
    const subjLower = (props.SUBJECTO || '').toLowerCase().trim();
    if (OUT_OF_SCOPE_SUBJECTOS.has(subjLower)) return; // skip out-of-scope global territories
    const fc = clipToScope(f);
    if (!fc) return; // entirely out of scope (south of -5° lat)
    const color = getColor(props);
    const prec = props.BORDERPRECISION || 1;

    // Territory fill (use clipped feature fc so sub-equatorial parts are excluded)
    const path = gT.append('path')
      .datum(fc)
      .attr('class','territory')
      .attr('d', pathGen)
      .attr('fill', color)
      .attr('fill-opacity', prec===1 ? 0.52 : prec===2 ? 0.65 : 0.75)
      .attr('stroke','none');

    if (name) {
      path
        .on('mouseenter', function(event) { if (!tooltipPinned) showTooltip(event,props,color); })
        .on('mousemove',  function(event) { if (!tooltipPinned) moveTooltip(event); })
        .on('mouseleave', function()      { if (!tooltipPinned) hideTooltip(); })
        .on('click touchend', function(event) {
          event.stopPropagation();
          if (event.type === 'touchend') {
            event.preventDefault();
            // Suppress if the map was panned or zoomed since touchstart
            const mc = document.getElementById('map-container');
            const t  = d3.zoomTransform(mc);
            const s  = _touchStartTransform;
            if (Math.hypot(t.x - s.x, t.y - s.y) > 3 || Math.abs(t.k - s.k) > 0.01) return;
          }
          selectTerritory(this, event.touches ? event.changedTouches[0] : event, props, color);
        });
    }

    // Border line
    const strokeColor = prec===3 ? 'rgba(200,185,138,0.6)' :
                        prec===2 ? 'rgba(200,185,138,0.32)' :
                                   'rgba(200,185,138,0.13)';
    const strokeW = prec===3 ? 0.9 : prec===2 ? 0.6 : 0.4;
    const dash = prec===3 ? null : prec===2 ? '5,3' : '3,6';

    const border = gB.append('path')
      .datum(f)
      .attr('class','border-line')
      .attr('d', pathGen)
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeW);
    if (dash) border.style('stroke-dasharray', dash);
  });

  // Country name labels with bounding-box collision detection
  const labelCandidates = [];
  geo.features.forEach(f => {
    const props = f.properties;
    const name = (props.NAME || '').trim() || props.SUBJECTO || '';
    if (!name) return;
    const subjLower = (props.SUBJECTO || '').toLowerCase().trim();
    if (OUT_OF_SCOPE_SUBJECTOS.has(subjLower)) return;
    const fl = clipToScope(f);
    if (!fl) return;
    try {
      const c = pathGen.centroid(fl);
      if (!c || isNaN(c[0]) || isNaN(c[1])) return;
      const bounds = pathGen.bounds(fl);
      const w = bounds[1][0] - bounds[0][0];
      const h = bounds[1][1] - bounds[0][1];
      const area = w * h;
      if (area < 500) return;
      const fontSize = area > 12000 ? 9 : area > 5000 ? 8 : 7;
      const displayName = name.length > 24 ? name.substring(0,22)+'…' : name;
      // Estimate text width (approx 0.55 * fontSize * chars)
      const tw = displayName.length * fontSize * 0.55;
      const th = fontSize * 1.4;
      labelCandidates.push({ x:c[0], y:c[1], name:displayName, fontSize, area,
        bbox:{ x:c[0]-tw/2, y:c[1]-th, w:tw, h:th } });
    } catch {}
  });

  // Sort large → small (large territories win)
  labelCandidates.sort((a,b) => b.area - a.area);

  // Place with bbox collision check
  const placedBoxes = [];
  function overlaps(a, b) {
    return !(a.x+a.w < b.x || b.x+b.w < a.x || a.y+a.h < b.y || b.y+b.h < a.y);
  }

  labelCandidates.forEach(lb => {
    // Expand bbox slightly for margin
    const box = { x:lb.bbox.x-4, y:lb.bbox.y-3, w:lb.bbox.w+8, h:lb.bbox.h+6 };
    if (placedBoxes.some(p => overlaps(p, box))) return;
    placedBoxes.push(box);
    gL.append('text')
      .attr('class','map-label')
      .attr('x', lb.x)
      .attr('y', lb.y)
      .attr('font-size', lb.fontSize)
      .text(lb.name);
  });

  renderCities(epoch.year);
  if (typeof renderPleiadesCities === 'function') renderPleiadesCities(pctToYear(state.pct));
  updateLegend(geo);

  // C8/C11: simultaneous crossfade — new in, old out at the same time
  requestAnimationFrame(() => {
    gT.transition().duration(DUR).style('opacity', 1);
    gL.transition().duration(DUR).style('opacity', 1);
    d3.select(terrOld).transition().duration(DUR).style('opacity', 0)
      .on('end', function() { this.remove(); });
    d3.select(labelsOld).transition().duration(DUR).style('opacity', 0)
      .on('end', function() { this.remove(); });
  });
}

function renderCities(year) {
  const gC = d3.select('#g-cities');
  gC.selectAll('*').remove();

  const cities = CITIES.filter(c => c.start <= year && year <= c.end);

  cities.forEach(city => {
    const [cx,cy] = proj([city.lon, city.lat]);
    if (!cx||!cy||isNaN(cx)) return;
    const g = gC.append('g').datum({cx, cy}).style('cursor','pointer')
      .on('mouseenter', e => { if (!tooltipPinned) showCityTT(e,city); })
      .on('mousemove',  e => { if (!tooltipPinned) moveTooltip(e); })
      .on('mouseleave', () => { if (!tooltipPinned) hideTooltip(); })
      .on('click', e => {
        e.stopPropagation();
        selectCity(e, city);
      });

    if (city.capital) {
      g.append('circle').attr('cx',cx).attr('cy',cy).attr('r',6)
        .attr('fill','rgba(240,224,160,0.05)').attr('stroke','rgba(240,224,160,0.12)').attr('stroke-width',0.8);
    }
    if (city.capital) {
      // Diamond shape for capitals
      const d = 3.5;
      g.append('path')
        .attr('d', `M${cx},${cy-d} L${cx+d},${cy} L${cx},${cy+d} L${cx-d},${cy} Z`)
        .attr('fill', '#f0e0a0')
        .attr('fill-opacity', 0.88)
        .attr('stroke', 'rgba(240,224,160,0.35)')
        .attr('stroke-width', 0.7)
        .style('filter','url(#city-glow)');
    } else {
      g.append('circle').attr('class','city-dot')
        .attr('cx',cx).attr('cy',cy)
        .attr('r', 2.0)
        .attr('fill', '#c0a860')
        .attr('fill-opacity', 0.82)
        .style('filter','url(#city-glow)');
    }
    g.append('text').attr('class','city-label')
      .attr('x',cx+6).attr('y',cy)
      .attr('font-size', city.capital ? 7 : 6.5)
      .text(city.name);
  });
}

