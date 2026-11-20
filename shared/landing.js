/* Landing: mapa de una zona cerrada, vista de tarjetas, cifras y filtro por necesidad. Sin build. */
(function () {
  "use strict";
  var M = window.BC_MAPA, sem = window.BC_SEMILLA ? window.BC_SEMILLA() : null;
  var $ = function (s) { return document.querySelector(s); };
  if (!M || !sem || !$("#mapa-lienzo")) return;

  var IMG = "shared/img/landing/";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  /* Azar con semilla fija: los datos de ejemplo salen siempre iguales. */
  var s0 = 11; var azar = function () { s0 = (s0 * 16807) % 2147483647; return s0 / 2147483647; };
  var elegir = function (a) { return a[Math.floor(azar() * a.length)]; };
  var DIAS = { lu: "Lun", ma: "Mar", mi: "Mié", ju: "Jue", vi: "Vie", sa: "Sáb", "do": "Dom" };
  var foto = function (cat) { return IMG + (M.fotos[cat] || M.fotoBase) + ".jpg"; };

  function cuando(t) {
    if (!t) return "";
    if (t.forma === "estadia") return "Estancia";
    if (t.forma === "unico") return "Un día" + (t.hora ? " · " + t.hora : "");
    var d = (t.dias || []), txt = d.length === 7 ? "Todos los días" : d.length === 5 && d.indexOf("sa") < 0 && d.indexOf("do") < 0 ? "Lun a vie" : d.map(function (x) { return DIAS[x]; }).join(" y ");
    return txt + (t.hora ? " · " + t.hora : "");
  }
  function porSemana(t) {
    if (!t || t.forma === "estadia") return 0;
    var hoy = new Date().toISOString().slice(0, 10), en7 = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
    if (t.forma === "unico") return t.inicio >= hoy && t.inicio <= en7 ? 1 : 0;
    if (t.fin && t.fin < hoy) return 0;
    if (t.inicio && t.inicio > en7) return 0;
    return (t.dias || []).length;
  }

  /* Puntos: los de la semilla y los de las entidades de ejemplo de la zona. */
  var ent = {}; sem.entidades.forEach(function (e) { ent[e.id] = e; });
  var puntos = sem.recursos.filter(function (r) { return !r.pausado && M.entidades[r.entidad]; }).map(function (r) {
    var c = M.entidades[r.entidad];
    return { real: true, nombre: r.nombre, cat: r.cat, entidad: ent[r.entidad].nombre, barrio: c.barrio, cuando: cuando(r.tiempo), semana: porSemana(r.tiempo), plazas: r.cupo || 0, modo: r.modo,
      lat: c.lat + (azar() - 0.5) * 0.010, lng: c.lng + (azar() - 0.5) * 0.014 };
  });
  var CATS_EJ = Object.keys(M.nombres), DIAS_EJ = [["lu", "mi"], ["ma", "ju"], ["vi"], ["sa"], ["lu", "ma", "mi", "ju", "vi"], ["mi"], ["ju"]], HORAS = ["10:00", "11:30", "16:30", "17:00", "18:00"];
  M.vecinas.forEach(function (v) {
    for (var i = 0; i < v.n; i++) {
      var cat = elegir(CATS_EJ), d = elegir(DIAS_EJ);
      puntos.push({ real: false, nombre: elegir(M.nombres[cat]), cat: cat, entidad: v.nombre, barrio: v.barrio, cuando: cuando({ forma: "recurrente", dias: d, hora: elegir(HORAS) }), semana: d.length,
        plazas: azar() < 0.3 ? 0 : 8 + Math.floor(azar() * 20), modo: elegir(["Libre", "Inscripción", "Inscripción", "Solicitud"]),
        lat: v.lat + (azar() - 0.5) * 0.008, lng: v.lng + (azar() - 0.5) * 0.011 });
    }
  });
  puntos.forEach(function (p, i) { p.id = i; });
  var nEntidades = sem.entidades.length + M.vecinas.length;

  /* Estado: filtro (null = todas), vista y cuántas tarjetas se muestran. */
  var filtro = null, etiqueta = "", vista = "mapa", tope = 9;
  var visibles = function () { return puntos.filter(function (p) { return !filtro || filtro.indexOf(p.cat) >= 0; }); };

  var cuenta = {}; puntos.forEach(function (p) { cuenta[p.cat] = (cuenta[p.cat] || 0) + 1; });
  var chipsCats = Object.keys(cuenta).sort(function (a, b) { return cuenta[b] - cuenta[a]; });
  function pintarChips() {
    var uno = filtro && filtro.length === 1 ? filtro[0] : null;
    $("#mapa-chips").innerHTML = '<button type="button" class="lp-chip" aria-pressed="' + !filtro + '" data-cat="">Todas</button>' +
      (filtro && !uno ? '<button type="button" class="lp-chip" aria-pressed="true" data-cat="*">' + esc(etiqueta) + "</button>" : "") +
      chipsCats.map(function (c) { return '<button type="button" class="lp-chip" aria-pressed="' + (uno === c) + '" data-cat="' + esc(c) + '">' + esc(c) + " <i>" + cuenta[c] + "</i></button>"; }).join("");
  }
  function pintarCifras() {
    var v = puntos, sm = v.reduce(function (n, p) { return n + p.semana; }, 0);
    [["recursos", v.length], ["semana", sm], ["entidades", nEntidades]].forEach(function (x) {
      document.querySelectorAll('[data-cifra="' + x[0] + '"]').forEach(function (n) { n.textContent = x[1]; });
    });
    var vis = visibles(); var cu = $("#mapa-cuenta"); if (cu) cu.textContent = vis.length + (vis.length === 1 ? " recurso" : " recursos") + (filtro ? " de " + (filtro.length === 1 ? filtro[0] : etiqueta) : " en " + M.zona.nombre);
  }
  var acceso = function (p) { return p.modo === "Libre" ? "Acceso libre" : p.modo === "Solicitud" ? "Por solicitud" : "Con inscripción"; };

  /* Lista junto al mapa: por barrio. Es la alternativa accesible al mapa. */
  function pintarLista() {
    var v = visibles(), bar = {};
    v.forEach(function (p) { (bar[p.barrio] = bar[p.barrio] || []).push(p); });
    var ks = Object.keys(bar).sort(function (a, b) { return bar[b].length - bar[a].length; });
    $("#mapa-lista").innerHTML = "<h3>Por barrio</h3>" + (ks.length ? '<ul class="lp-barrios">' + ks.map(function (k) {
      return '<li><button type="button" data-barrio="' + esc(k) + '"><span class="lp-bi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>' + '</svg></span><b>' + esc(k) + "</b><span>" + bar[k].slice(0, 2).map(function (p) { return esc(p.nombre); }).join(" · ") + (bar[k].length > 2 ? "…" : "") + "</span><i>" + bar[k].length + "</i></button></li>";
    }).join("") + "</ul>" : '<p class="lp-mas">No hay recursos de esta necesidad en la zona.</p>');
  }

  /* Tarjetas: la misma información que el mapa, para quien prefiere leer que buscar en un plano. */
  function pintarTarjetas() {
    var v = visibles();
    var tarjeta = function (p) {
      return '<article class="lp-rc"><div class="lp-rc__f"><img src="' + foto(p.cat) + '" alt="" loading="lazy"><span class="lp-rc__c">' + esc(p.cat) + "</span></div>" +
        '<div class="lp-rc__b"><h3>' + esc(p.nombre) + '</h3><p class="lp-rc__e"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4"/></svg><span>' + esc(p.entidad) + " · " + esc(p.barrio) + "</span></p>" +
        '<ul class="lp-rc__d"><li>' + esc(p.cuando) + "</li><li>" + acceso(p) + "</li>" + (p.plazas ? "<li>" + p.plazas + " plazas</li>" : "") + "</ul>" +
        '<div class="lp-rc__p"><button type="button" class="lp-enlace" data-ver="' + p.id + '">Ver en el mapa →</button>' + (p.real ? "" : '<span class="lp-ej">Ejemplo</span>') + "</div></div></article>";
    };
    $("#tarjetas").innerHTML = v.slice(0, tope).map(tarjeta).join("") || '<p class="lp-mas">No hay recursos de esta necesidad en la zona.</p>';
    /* El botón solo existe en mapa.html; la landing enlaza a la página completa. */
    var mas = $("#tarjetas-mas"); if (mas) { mas.hidden = v.length <= tope; mas.textContent = "Ver " + Math.min(9, v.length - tope) + " más"; }
  }

  /* Mapa (Leaflet), encerrado en la zona: no se puede arrastrar ni alejar fuera de ella. */
  var mapa = null, grupo = null, marcas = {}, L = window.L;
  var S = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; };
  var USERS = '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6M16 5a3.5 3.5 0 0 1 0 6.5M18 14c2.5.5 3.5 2.5 3.5 6"/>';
  var ICONOS = {
    "Alimentación": '<path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v8M7 3v8"/><path d="M17 3c-2 2-3 5-3 8h3v10"/>',
    "Vivienda": '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    "Salud y Bienestar": '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    "Empleo": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    "Formación": '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    "Competencias Digitales": '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    "Documentación y Trámites": '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    "Movilidad": '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M7 21v-4M17 21v-4"/>',
    "Infancia y Menores": '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01"/>',
    "Mujer y Cuidados": USERS, "Familia": USERS, "Autonomía Personal y Cuidados": USERS,
    "Red de Apoyo": '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 10 18.7l1-1"/>',
    "Participación y Comunidad": '<path d="M4 5h16v11H9l-5 4z"/>',
    "Organización y Dirección": '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4"/>',
    "Ingresos": '<circle cx="12" cy="12" r="9"/><path d="M14.5 9a3 2 0 0 0-5 1c0 3 5 1.5 5 4.5a3 2 0 0 1-5 1M12 6v12"/>'
  };
  function pintarMapa() {
    if (!mapa) return;
    grupo.clearLayers(); marcas = {};
    visibles().forEach(function (p) {
      var m = L.marker([p.lat, p.lng], { title: p.nombre, alt: p.nombre, icon: L.divIcon({ className: "lp-pin" + (p.real ? "" : " lp-pin--ej"), html: ICONOS[p.cat] ? S(ICONOS[p.cat]) : "", iconSize: [32, 32], popupAnchor: [0, -16] }) });
      m.bindPopup('<img class="lp-pop" src="' + foto(p.cat) + '" alt=""><b>' + esc(p.nombre) + "</b><br>" + esc(p.entidad) + " · " + esc(p.barrio) + "<br>" + esc(p.cuando) + " · " + acceso(p) +
        (p.real ? "" : '<br><span class="lp-ej">Dato de ejemplo</span>'), { minWidth: 220, maxWidth: 240 });
      marcas[p.id] = m; grupo.addLayer(m);
    });
  }
  function crearMapa() {
    if (!L) { $("#mapa-lienzo").classList.add("lp-mapa--sin"); return; }
    var lim = L.latLngBounds(M.zona.so, M.zona.ne);
    /* Zoom en enteros: el agrupador de puntos falla con zooms fraccionarios. */
    mapa = L.map("mapa-lienzo", { scrollWheelZoom: false, maxBounds: lim, maxBoundsViscosity: 1, maxZoom: 16 });
    var z0 = Math.floor(mapa.getBoundsZoom(lim)); mapa.setMinZoom(z0); mapa.setView(lim.getCenter(), z0);
    /* Fondo de OpenStreetMap: no pide clave. Se atenúa por CSS para que mande el dato, no el mapa. */
    var capa = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, className: "lp-fondo", bounds: lim.pad(0.3),
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(mapa);
    var fallos = 0; capa.on("tileerror", function () { if (++fallos === 4) $("#mapa-aviso").hidden = false; });
    grupo = L.markerClusterGroup ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 34, disableClusteringAtZoom: 14,
      iconCreateFunction: function (c) { var n = c.getChildCount(); return L.divIcon({ html: "<span>" + n + "</span>", className: "lp-grupo" + (n >= 8 ? " lp-grupo--g" : ""), iconSize: [38, 38] }); } }) : L.layerGroup();
    mapa.addLayer(grupo);
    mapa.on("click", function () { mapa.scrollWheelZoom.enable(); });
    /* Trackpad: pellizco (ctrl+rueda) acerca; en la vista completa, dos dedos desplazan. En la landing el scroll sigue siendo de la página. */
    var completa = document.body.classList.contains("mv");
    mapa.options.zoomSnap = 0.25; mapa.options.zoomDelta = 0.5;
    mapa.getContainer().addEventListener("wheel", function (e) {
      if (e.ctrlKey) { e.preventDefault(); mapa.setZoomAround(mapa.mouseEventToContainerPoint(e), mapa.getZoom() - e.deltaY * 0.02, { animate: false }); }
      else if (completa) { e.preventDefault(); mapa.panBy([e.deltaX, e.deltaY], { animate: false }); }
    }, { passive: false });
  }

  function ponerVista(v) {
    vista = v;
    $("#vista-mapa").hidden = v !== "mapa"; $("#vista-tarjetas").hidden = v !== "tarjetas";
    document.querySelectorAll("[data-vista]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.vista === v)); });
    if (v === "mapa" && mapa) mapa.invalidateSize();
  }
  function pintar() { pintarChips(); pintarCifras(); pintarLista(); pintarTarjetas(); pintarMapa(); }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat],[data-barrio],[data-vista],[data-linea],[data-ver],#tarjetas-mas,#mapa-todo"); if (!b) return;
    if (b.id === "tarjetas-mas") { tope += 9; pintarTarjetas(); }
    else if (b.id === "mapa-todo") { if (mapa) mapa.flyToBounds([M.zona.so, M.zona.ne], { duration: 0.6 }); }
    else if (b.dataset.cat != null) { if (b.dataset.cat === "*") return; filtro = b.dataset.cat ? [b.dataset.cat] : null; tope = 9; pintar(); var c = $('#mapa-chips [aria-pressed="true"]'); if (c) c.focus(); }
    else if (b.dataset.vista) ponerVista(b.dataset.vista);
    else if (b.dataset.barrio) { var ps = visibles().filter(function (p) { return p.barrio === b.dataset.barrio; }); if (mapa && ps.length) mapa.flyToBounds(L.latLngBounds(ps.map(function (p) { return [p.lat, p.lng]; })).pad(0.5), { duration: 0.6, maxZoom: 15 }); }
    else if (b.dataset.ver) { var p = puntos[+b.dataset.ver]; ponerVista("mapa"); $("#mapa").scrollIntoView({ behavior: "smooth" });
      if (mapa && marcas[p.id]) { mapa.setView([p.lat, p.lng], 15); setTimeout(function () { marcas[p.id].openPopup(); }, 350); } }
    else if (b.dataset.linea) { var ln = M.lineas.filter(function (x) { return x.id === b.dataset.linea; })[0]; if (!ln) return; filtro = ln.cats.slice(); etiqueta = ln.titulo; tope = 9; pintar(); ponerVista("tarjetas"); $("#mapa").scrollIntoView({ behavior: "smooth" }); }
  });

  /* Líneas de participación: foto y número real de recursos. */
  var lineas = $("#lineas");
  if (lineas) lineas.innerHTML = M.lineas.map(function (ln) {
    var n = puntos.filter(function (p) { return ln.cats.indexOf(p.cat) >= 0; }).length;
    return '<button type="button" class="lp-linea" data-linea="' + ln.id + '"><img src="' + IMG + ln.foto + '.jpg" alt="" loading="lazy"><span class="lp-linea__t"><b>' + n + " recursos</b><strong>" + esc(ln.titulo) + "</strong><span>" + esc(ln.texto) + "</span><em>Ver cuáles →</em></span></button>";
  }).join("");

  /* ?vista=tarjetas abre directo en tarjetas (sirve para enlazar y para el recorrido). */
  var chipsEl = $("#mapa-chips");
  var bordes = function () { var x = chipsEl.scrollLeft, max = chipsEl.scrollWidth - chipsEl.clientWidth; chipsEl.style.setProperty("--fi", Math.min(x, 72) + "px"); chipsEl.style.setProperty("--fd", Math.min(Math.max(max - x, 0), chipsEl.parentNode.classList.contains("lp-chips-wrap") && innerWidth > 700 ? 140 : 72) + "px"); };
  chipsEl.addEventListener("scroll", bordes, { passive: true }); window.addEventListener("resize", bordes);
  /* ?linea=mayores abre con esa línea de participación ya filtrada. */
  var q = /[?&]linea=([a-z]+)/.exec(location.search), l0 = q && M.lineas.filter(function (x) { return x.id === q[1]; })[0];
  if (l0) { filtro = l0.cats.slice(); etiqueta = l0.titulo; }
  crearMapa(); pintar(); ponerVista(/[?&]vista=tarjetas/.test(location.search) ? "tarjetas" : "mapa"); bordes();
})();
