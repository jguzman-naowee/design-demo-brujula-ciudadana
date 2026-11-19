(() => {
  "use strict";
  const CAT = window.BC_CATALOGO, KEY = "brujula.demo.v8";
  const qs = new URLSearchParams(location.search);
  const ROL = ["ciudadano", "conector", "entidad", "red"].includes(qs.get("rol")) ? qs.get("rol") : "ciudadano";
  document.body.classList.add("rol-" + ROL);
  if (ROL === "red") document.body.classList.add("rol-entidad");
  /* Sesión simulada por rol: no hay cambio de usuario dentro de la app. */
  /* Entidad activa: quien trabaja en varias elige en cuál (spec 01); la red no tiene entidad propia. */
  let ENT = "e1"; const YO = "c1";

  let S, D = null;
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } };
  const sembrar = () => { S = window.BC_SEMILLA(); S.ciudadano = null; guardar(); };
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || qs.has("semilla")) sembrar();
  /* Datos de contacto de los conectores: se completan desde la semilla si el estado guardado es anterior. */
  if (S && S.conectores) { const sem = window.BC_SEMILLA().conectores; S.conectores.forEach((c) => { const n = sem.find((x) => x.id === c.id); if (n) ["foto", "doc", "tel", "email"].forEach((k) => { if (c[k] == null && n[k] != null) c[k] = n[k]; }); }); }
  /* Recursos y solicitudes que la semilla ganó después: se añaden por id sin tocar lo ya decidido. */
  if (S) { const sem = window.BC_SEMILLA(); ["recursos", "solicitudes", "familiares", "familias", "usos", "asistencias", "comunicados", "redes", "gestoresRed"].forEach((k) => (sem[k] || []).forEach((x) => { if (!S[k]) S[k] = []; if (!x.id || !S[k].some((y) => y.id === x.id)) S[k].push(x); })); }
  if (qs.has("sinsesion") && S.ciudadano) { S.ciudadano = null; guardar(); }
  const MIS_ENT = ROL === "conector" ? ((S.conectores.find((c) => c.id === YO) || {}).entidades || ["e1"]) : ROL === "entidad" ? ["e1", "e2"] : [];
  try { const g = localStorage.getItem("brujula.ent." + ROL); if (MIS_ENT.includes(g)) ENT = g; } catch (e) { /* sin almacenamiento */ }
  window.DEMO = { restablecer() { sembrar(); D = null; } };

  /* ── utilidades ── */
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ent = (id) => S.entidades.find((x) => x.id === id) || { nombre: "—" };
  const con = (id) => S.conectores.find((x) => x.id === id);
  const rec = (id) => S.recursos.find((x) => x.id === id);
  const per = (id) => S.personas.find((x) => x.id === id) || (S.familiares || []).find((x) => x.id === id);
  const solsDe = (pid) => S.solicitudes.filter((s) => s.persona === pid);
  const nom = (p) => p.nombre + " " + p.apellidos;
  const ini = (n) => n.split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase();
  const fecha = (f) => { const d = new Date(f.length === 10 ? f + "T00:00" : f.replace(" ", "T")); return isNaN(d) ? f : d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }); };
  const ahora = () => { const d = new Date(), p = (n) => String(n).padStart(2, "0"); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()); };
  const hoy = () => ahora().slice(0, 10);
  const cuando = (f) => fecha(f.slice(0, 10)) + " · " + esc(f.slice(11));
  const nuevoId = () => "BC-2026-" + String(Math.max(...S.personas.concat(S.familiares || []).map((p) => +p.id.slice(-4))) + 1).padStart(4, "0");
  const propias = (p) => solsDe(p.id).filter((s) => s.por === ENT || rec(s.recurso).entidad === ENT);
  const ajenas = (p) => solsDe(p.id).filter((s) => s.por !== ENT && rec(s.recurso).entidad !== ENT);
  const plazo = (r) => r.urg === "Urgente" ? "Urgente · respuesta en 24 h" : "Normal · 5 días hábiles";

  /* ── piezas con el marcado de los componentes Nwt del SDK ── */
  const ic = (n, cls) => '<div class="nwt-icon' + (cls ? " " + cls : "") + '"><i class="naotech-icon-' + n + '"></i></div>';
  const attrs = (o) => Object.entries(o || {}).map(([k, v]) => " " + k + '="' + esc(v) + '"').join("");
  const btn = (label, o = {}) => {
    const a = Object.assign({ class: "nwt-button", "nwt-variant": o.v || "loud", "nwt-size": o.size || "medium" }, o.theme ? { "nwt-theme": o.theme } : {}, o.act ? { "data-act": o.act } : {}, o.a || {});
    const inner = '<span class="nwt-button__content">' + (o.icon ? ic(o.icon, "nwt-button__icon") : "") + esc(label) + (o.iconEnd ? ic(o.iconEnd, "nwt-button__icon") : "") + "</span>";
    return o.href ? "<a" + attrs(a) + ' href="' + o.href + '">' + inner + "</a>" : '<button type="button"' + attrs(a) + ">" + inner + "</button>";
  };
  /* Estados y semáforo van en NwtBadge: NwtTag es un filtro clicable, no una etiqueta de estado. */
  const tag = (t, theme, size, dot) => '<span class="nwt-badge' + (dot ? " nwt-badge--vignette" : "") + '" role="status" nwt-theme="' + (theme || "neutral") + '" nwt-size="' + (size === "medium" ? "medium" : "small") + '" nwt-variant="quiet"><div class="nwt-badge__content"><div class="nwt-badge__label">' + esc(t) + "</div></div></span>";
  const avatar = (t, color, size) => '<div class="nwt-avatar" nwt-color="' + (color || "blue") + '" nwt-size="' + (size || "medium") + '" nwt-variant="loud"><div class="nwt-avatar__content"><span>' + esc(t) + "</span></div></div>";
  const alerta = (html, theme) => '<div class="nwt-alert nwt-alert--visible" nwt-theme="' + (theme || "informative") + '" nwt-variant="quiet"><div class="nwt-alert__content"><span class="nwt-alert__label">' + html + "</span></div></div>";
  const card = (body, o = {}) => '<div class="nwt-card' + (o.cls ? " " + o.cls : "") + '" nwt-variant="quiet" nwt-size="medium"' + (o.id ? ' id="' + o.id + '"' : "") + attrs(o.a) + '><div class="nwt-card__body"><div class="nwt-card__content">' + body + "</div></div></div>";
  const cardH = (titulo, extra) => '<div class="bc-card-h"><h2>' + titulo + "</h2>" + (extra || "") + "</div>";
  const stat = (label, value, href, id) => '<a class="nwt-stat-card" href="' + href + '"' + (id ? ' id="' + id + '"' : "") + ' style="text-decoration:none;color:inherit"><div class="nwt-stat-card__content"><span class="nwt-stat-card__label">' + esc(label) + '</span><span class="nwt-stat-card__value">' + esc(value) + "</span></div></a>";
  const SEM = { v: ["Estable", "positive"], a: ["En proceso", "warning"], r: ["Necesita apoyo", "negative"] };
  const sem = (v) => v ? tag(SEM[v][0], SEM[v][1], "small", true) : tag("Sin evaluar", "neutral");
  const ST = { "Pendiente": "warning", "Aprobada": "positive", "Rechazada": "negative", "En lista de espera": "informative", "Falta información": "caution" };
  const st = (e) => tag(e, ST[e] || "neutral");
  const mini = (m) => {
    const c = { r: 0, a: 0, v: 0 }; Object.values(m || {}).forEach((v) => { if (c[v] != null) c[v]++; });
    if (!c.r && !c.a && !c.v) return '<span class="bc-mini vacio">Sin evaluar</span>';
    return '<span class="bc-mini" role="img" aria-label="' + c.r + " necesitan apoyo, " + c.a + " en proceso, " + c.v + ' estables">' + ["r", "a", "v"].filter((k) => c[k]).map((k) => '<i class="' + k + '" style="flex:' + c[k] + '"></i>').join("") + "</span>";
  };
  const stepper = (labels, pos) => '<div class="bc-prog"><div class="bc-prog__bar" role="progressbar" aria-valuemin="1" aria-valuemax="' + labels.length + '" aria-valuenow="' + (pos + 1) + '">' + labels.map((l, i) => '<i class="' + (i <= pos ? "on" : "") + '"></i>').join("") +
    '</div><span>Paso ' + (pos + 1) + " de " + labels.length + " · <b>" + esc(labels[pos]) + "</b></span></div>";
  const selNative = (id, opts, val, extra) => '<select id="' + id + '" class="bc-sel"' + (extra || "") + ">" + opts + "</select>";

  /* Campos: misma estructura que NwtTextField / NwtSelect (nwt-input-box). */
  const fld = (k, label, o = {}) => {
    const v = D.datos[k] || "", e = D.err[k], id = "f-" + k;
    const ctl = o.opts
      ? '<div class="nwt-select__content"><select id="' + id + '" class="nwt-select__input" data-f="' + k + '"><option value="">Selecciona…</option>' + o.opts.map((x) => "<option" + (x === v ? " selected" : "") + ">" + esc(x) + "</option>").join("") + "</select>" + '<div class="nwt-select__chevron" aria-hidden="true">' + ic("chevron-down") + "</div></div>"
      : '<input id="' + id + '" class="nwt-text-field__input" data-f="' + k + '" type="' + (o.type || "text") + '" value="' + esc(v) + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : "") + (o.mode ? ' inputmode="' + o.mode + '"' : "") + (e ? ' aria-invalid="true" aria-describedby="' + id + '-m"' : "") + ">";
    const msg = e ? '<div class="nwt-input-box__message" id="' + id + '-m"><div class="nwt-avatar-icon" nwt-theme="negative">' + ic("caution") + "</div><span>" + esc(e) + "</span></div>" : o.h ? '<div class="nwt-input-box__message"><span>' + esc(o.h) + "</span></div>" : "";
    return '<div class="' + (o.opts ? "nwt-select" : "nwt-text-field") + '" nwt-size="medium"><div class="nwt-input-box' + (e ? " nwt-input-box--error" : "") + '"><div class="nwt-input-box__content"><label class="nwt-input-box__label" for="' + id + '">' + esc(label) + (o.opc ? " (opcional)" : "") + '</label><div class="nwt-input-box__control">' + ctl + "</div>" + msg + "</div></div></div>";
  };
  const checkbox = (id, on, label, help, dataAttr) => '<div class="bc-opt' + (on ? " on" : "") + '" data-act="chk" ' + dataAttr + '="' + id + '"><div class="nwt-checkbox' + (on ? " nwt-checkbox--checked" : "") + '" role="checkbox" nwt-size="medium" aria-checked="' + on + '" tabindex="0"><div class="nwt-checkbox__control">' + ic("positive") + '</div><span class="nwt-checkbox__label">' + label + (help ? '<span class="bc-help">' + help + "</span>" : "") + "</span></div></div>";
  const radio = (on, label, data) => '<div class="bc-opt' + (on ? " on" : "") + '" ' + data + '><div class="nwt-radio-button' + (on ? " nwt-radio-button--checked" : "") + '" role="radio" aria-checked="' + on + '" tabindex="0"><div class="nwt-radio-button__control"><div class="nwt-radio-button__dot"></div></div><span class="nwt-radio-button__label">' + label + "</span></div></div>";

  function toast(t) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { el.hidden = true; }, 3200); }
  const ir = (h) => { if (location.hash === h) { render(); velo(true); } else location.hash = h; };
  const salir = () => { try { top.location.href = new URL("../../index.html", location.href).href; } catch (e) { location.href = "../../index.html"; } };

  /* ── borrador de registro ── */
  const nuevo = (tipo) => ({ tipo, consent: {}, datos: {}, mapa: {}, auto: {}, recursos: [], entidad: ENT, err: {}, busqueda: null, q: "", notas: "" });
  const EJEMPLO = {
    yo: { nombre: "Amina", apellidos: "Belkadi", nac: "1994-05-19", docTipo: "En trámite", doc: "", tel: "+34 612 448 901", email: "", municipio: "Madrid", cp: "28026", idioma: ["Árabe", "Español"], canal: "WhatsApp" },
    con: { nombre: "Jorge Luis", apellidos: "Paredes", nac: "1990-08-07", docTipo: "No", doc: "", tel: "+34 600 123 456", email: "jl.paredes@correo.es", municipio: "Madrid", cp: "28041", idioma: "Español", canal: "Teléfono" }
  };
  const MAPA_EJ = { vivienda: "r", ingresos: "a", alimentacion: "a", salud: "v", documentacion: "r", red: "a", familia: "v", menores: "v", cuidados: "v", empleo: "r", formacion: "a", movilidad: "v", digital: "a", autonomia: "v", direccion: "a", comunidad: "a" };
  const REQ = ["nombre", "apellidos", "nac", "docTipo", "tel", "municipio", "cp", "idioma", "canal"];
  const validarDatos = () => {
    D.err = {};
    REQ.forEach((k) => { if (!String(D.datos[k] || "").trim()) D.err[k] = "Este dato es obligatorio."; });
    if (D.datos.cp && !/^\d{5}$/.test(D.datos.cp)) D.err.cp = "Escribe los 5 dígitos del código postal.";
    return !Object.keys(D.err).length;
  };

  const vDatos = (yo) =>
    '<div class="stack">' +
    '<fieldset class="bc-fs"><legend>Datos personales</legend><div class="grid2">' + fld("nombre", "Nombre") + fld("apellidos", "Apellidos") + fld("nac", "Fecha de nacimiento", { type: "date" }) + fld("docTipo", yo ? "¿Tienes documento nacional?" : "¿Tiene documento nacional?", { opts: CAT.documento }) + fld("doc", "DNI / NIE / Pasaporte", { opc: true, h: "No es necesario para empezar." }) + "</div></fieldset>" +
    '<fieldset class="bc-fs"><legend>Contacto</legend><div class="grid2">' + fld("tel", "Teléfono", { type: "tel", mode: "tel", ph: "+34 600 000 000", h: "Es el canal principal de contacto." }) + fld("email", "Email", { type: "email", opc: true }) + "</div></fieldset>" +
    '<fieldset class="bc-fs"><legend>Ubicación</legend><div class="grid2">' + fld("municipio", "Municipio") + fld("cp", "Código postal", { mode: "numeric", ph: "28000", h: (yo ? "No pedimos tu" : "No se pide la") + " dirección exacta." }) + "</div></fieldset>" +
    '<fieldset class="bc-fs"><legend>Idioma y canal</legend><div class="grid2">' + fld("idioma", "Idioma preferente", { opts: CAT.idiomas }) + fld("canal", "Canal preferido", { opts: CAT.canales }) + "</div></fieldset></div>";

  const vConsent = (yo) => '<div class="stack-s">' + CAT.consentimientos.map((c) =>
    checkbox(c.id, !!D.consent[c.id], "<b>" + esc(c.txt) + "</b> " + (c.obligatorio ? tag("Obligatorio", "negative") : tag("Opcional", "neutral")), c.ayuda ? esc(c.ayuda) : "", "data-c")).join("") +
    (D.err.consent ? alerta(esc(D.err.consent), "negative") : "") +
    '<p class="mut" style="font-size:13px">' + (yo ? "Puedes retirar tu consentimiento cuando quieras. Cada vez que alguien vea tus datos, queda registrado." : "Lee los consentimientos con la persona. Los dos obligatorios son bloqueantes: sin ellos no se crea expediente.") + "</p></div>";

  const vMapa = (dims) => dims.map((d) =>
    '<div class="bc-dim" data-dim="' + d.id + '"><h3 class="bc-dh">' + gi(d) + "<span>" + esc(d.n) + (d.opcional ? ' <span class="mut" style="font-weight:400">(opcional)</span>' : "") + '</span></h3><p class="mut">' + esc(d.q) + '</p><div class="stack-s" role="radiogroup" aria-label="' + esc(d.n) + '">' +
    d.o.map((t, i) => { const v = "var"[i]; return radio(D.mapa[d.id] === v, esc(t) + " " + sem(v), 'data-act="sem" data-d="' + d.id + '" data-v="' + v + '"'); }).join("") + "</div></div>").join("") +
    (D.err.mapa ? '<div style="margin-top:12px">' + alerta(esc(D.err.mapa), "negative") + "</div>" : "");

  const wiz = (o) =>
    '<div class="bc-page narrow stack"><div class="stack-s"><span class="bc-eyebrow">' + esc(o.eyebrow) + "</span><h1>" + esc(o.titulo) + "</h1>" + (o.sub ? '<p class="mut">' + o.sub + "</p>" : "") + "</div>" +
    stepper(o.pasos, o.pos) +
    (o.ejemplo ? '<div class="bc-ejemplo">' + btn("Completar con datos de ejemplo", { v: "quiet", size: "small", icon: "sparkles", act: "ejemplo", a: { "data-k": o.ejemplo } }) + "</div>" : "") +
    card(o.cuerpo) +
    '<div class="bc-wiz-f">' + btn("Atrás", { v: "mute", href: o.atras }) + (o.extra || "") + btn(o.sig || "Continuar", { act: o.act, iconEnd: o.sigIcon || "arrow-right", a: { id: "btn-sig" } }) + "</div></div>";

  const bloquesMapa = (m, compacto) => CAT.bloques.map((b) => {
    const ds = CAT.dimensiones.filter((d) => d.b === b.id && m[d.id]);
    const DI={vivienda:"home",ingresos:"cash",alimentacion:"apple",salud:"heartbeat",documentacion:"id",red:"heart-handshake",familia:"users",menores:"baby-carriage",cuidados:"woman",empleo:"briefcase",formacion:"school",movilidad:"bus",digital:"device-laptop",autonomia:"user-check",direccion:"sitemap",comunidad:"building-community"};
    return ds.length ? '<div class="bc-bl"><h3>' + (compacto ? "" : '<i style="--c:var(--bc-rb' + (CAT.bloques.indexOf(b) + 1) + ')"></i>') + esc(b.nombre) + "</h3>" + ds.map((d) => compacto ? '<div class="bc-d bc-d--' + m[d.id] + '"><i class="ti ti-' + (DI[d.id] || "circle") + ' bc-di bc-di--' + m[d.id] + '" role="img" aria-label="' + SEM[m[d.id]][0] + '"></i><span class="grow">' + esc(d.n) + "</span></div>" : '<div class="bc-d"><span class="grow">' + esc(d.n) + "</span>" + sem(m[d.id]) + "</div>").join("") + "</div>" : "";
  }).join("");

  /* Radar de 4 ejes (uno por bloque), como en la presentación: r=0, a=.5, v=1; el centro es «sin evaluar». */
  const RB = [["b1", 0, -1, "m"], ["b2", 1, 0, "s"], ["b3", 0, 1, "m"], ["b4", -1, 0, "e"]], VSC = { r: 0, a: 0.5, v: 1 };
  const mapaRadar = (m) => {
    const cx = 220, cy = 140, R = 104, pt = (dx, dy, f) => [cx + dx * R * f, cy + dy * R * f];
    const val = RB.map(([b]) => { const v = CAT.dimensiones.filter((d) => d.b === b && m[d.id]).map((d) => VSC[m[d.id]]); return v.length ? 0.2 + 0.8 * (v.reduce((x, y) => x + y, 0) / v.length) : 0.1; });
    const ring = (f) => RB.map(([, dx, dy]) => pt(dx, dy, f).join(",")).join(" ");
    const lbl = RB.map(([b, dx, dy, an]) => {
      const [x, y] = pt(dx, dy, 1.0), n = CAT.bloques.find((k) => k.id === b).nombre, ls = n.length > 10 && n.includes(" ") ? [n.slice(0, n.indexOf(" ")), n.slice(n.indexOf(" ") + 1)] : [n];
      const y0 = dy < 0 ? y - 10 - (ls.length - 1) * 14 : dy > 0 ? y + 17 : y + 4 - (ls.length - 1) * 7;
      return '<text class="bc-rd-ax' + (an === "s" ? " s" : an === "e" ? " e" : "") + '" x="' + (x + dx * 10) + '" y="' + y0 + '">' + ls.map((t, k) => '<tspan x="' + (x + dx * 10) + '"' + (k ? ' dy="14"' : "") + ">" + esc(t) + "</tspan>").join("") + "</text>";
    }).join("");
    const dots = RB.map(([, dx, dy], i) => { const [x, y] = pt(dx, dy, val[i]); return '<circle class="bc-rd-d" style="--c:var(--bc-rb' + (i + 1) + ')" r="7.5" cx="' + x + '" cy="' + y + '"/>'; }).join("");
    return '<svg class="bc-radar" viewBox="0 0 440 280" role="img" aria-label="Mapa de Vida por bloque"><g class="bc-rd-g"><polygon points="' + ring(1) + '"/><polygon points="' + ring(0.66) + '"/><polygon points="' + ring(0.33) + '"/><path d="M' + cx + " " + (cy - R) + "V" + (cy + R) + "M" + (cx - R) + " " + cy + "H" + (cx + R) + '"/></g><polygon class="bc-rd-p" points="' + RB.map(([, dx, dy], i) => pt(dx, dy, val[i]).join(",")).join(" ") + '"/>' + dots + lbl + "</svg>";
  };
  const mapaBloques = (m) => '<div class="bc-rd-leg">' + CAT.bloques.map((b, i) => {
    const c = { r: 0, a: 0, v: 0 }; CAT.dimensiones.filter((d) => d.b === b.id && m[d.id]).forEach((d) => c[m[d.id]]++);
    return '<div class="bc-rd-row"><i style="--c:var(--bc-rb' + (i + 1) + ')"></i><span class="grow">' + esc(b.nombre) + "</span>" + mini(c.r + c.a + c.v ? Object.fromEntries(CAT.dimensiones.filter((d) => d.b === b.id && m[d.id]).map((d) => [d.id, m[d.id]])) : {}) + "</div>";
  }).join("") + "</div>";
  const perfilMapa = (m) => '<div class="bc-rd">' + mapaRadar(m) + mapaBloques(m) + "</div>";

  /* ════════ CIUDADANO ════════ */
  const yoP = () => S.ciudadano && per(S.ciudadano);
  /* Piezas propias del Ciudadano (cz-*): lo que el SDK no trae. */
  const MARCA = '<svg class="bc-marca" viewBox="0 0 200 200" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M110.6 24.8A76 76 0 0 1 110.6 175.2" stroke="#f49a2d" stroke-width="14"/><path d="M89.4 175.2A76 76 0 0 1 89.4 24.8" stroke="#ed722e" stroke-width="14"/><g transform="rotate(40 100 100)"><path d="M100 156L82 100H118Z" stroke="#f49a2d" stroke-width="11"/><path d="M100 44L118 100H82Z" stroke="#ed722e" stroke-width="11"/></g></svg>';
  const PALABRA = '<svg class="bc-pal" viewBox="0 0 268 126" role="img" aria-label="Brújula Ciudadana"><g fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V80"/><circle cx="34" cy="60" r="20"/><path d="M62 40V80M62 60Q62 40 80 40"/><path d="M92 40V62A18 18 0 0 0 128 62M128 40V80"/><path d="M142 40V88A8 8 0 0 1 134 96"/><path d="M156 40V62A18 18 0 0 0 192 62M192 40V80"/><path d="M206 18V80"/><circle cx="232" cy="60" r="20"/><path d="M252 40V80"/></g><path d="M106 28L122 13" stroke="#ed722e" stroke-width="9" stroke-linecap="round"/><circle cx="142" cy="20" r="6" fill="#f49a2d"/><text x="9" y="121" font-family="Space Grotesk,Inter,system-ui,sans-serif" font-size="22" font-weight="700" fill="currentColor" textLength="250" lengthAdjust="spacing">CIUDADANA</text></svg>';
  const BRUJULA_SVG = '<svg class="cz-brujula" width="300" height="300" viewBox="0 0 300 300" aria-hidden="true"><circle cx="150" cy="150" r="140" fill="none" stroke="#2B2D45" stroke-width="1.5"/><circle cx="150" cy="150" r="100" fill="none" stroke="#2B2D45" stroke-width="1.5"/><circle cx="150" cy="150" r="60" fill="none" stroke="#33354F" stroke-width="1.5"/><circle cx="150" cy="150" r="7" fill="#FF9A5C"/><circle cx="78" cy="88" r="9" fill="#17B26A"/><circle cx="232" cy="190" r="9" fill="#F79009"/><circle cx="120" cy="246" r="9" fill="#5B8DEF"/><path d="M150 150 78 88M150 150l82 40M150 150l-30 96" stroke="#4A4D6A" stroke-width="1.5" stroke-dasharray="4 5"/></svg>';
  /* Ficha con gradiente por bloque del Mapa de Vida (b1–b4), como los emojis del doc 03 pero dentro de la marca. */
  const gi = (d) => '<span class="bc-gi" data-b="' + d.b + '">' + ic(CZ_ICO[d.id] || "target") + "</span>";
  const CZ_ICO = { vivienda: "home", ingresos: "banknote", alimentacion: "basket", salud: "favorite", documentacion: "file-text", red: "users", familia: "users-group", menores: "user-circle", cuidados: "hands-heart", empleo: "employees", formacion: "learning", movilidad: "car", digital: "laptop", autonomia: "accessibility", direccion: "target", comunidad: "handshake" };
  const CZ_CAT = { "Vivienda": "home", "Alimentación": "basket", "Salud y Bienestar": "favorite", "Empleo": "employees", "Formación": "learning", "Documentación y Trámites": "file-text", "Red de Apoyo": "users", "Competencias Digitales": "laptop" };
  const CZ_ST = { "Pendiente": ["Revisando", 2, "a"], "Aprobada": ["Aprobado", 3, "v"], "En lista de espera": ["En lista", 2, "b"], "Falta información": ["Falta info", 2, "a"], "Rechazada": ["Rechazado", 3, "r"] };
  const czSt = (e) => tag((CZ_ST[e] || [e])[0], ST[e] || "neutral");
  const czCuenta = (m) => { const c = { r: 0, a: 0, v: 0 }; Object.values(m || {}).forEach((v) => { if (c[v] != null) c[v]++; }); return c; };
  let czFiltro = "todos", czQ = "", czNec = "", czPedir = null, famRech = null;
  function cBienvenida() {
    return '<div class="cz-bienv"><div class="bc-hero cz-hero" data-tint="#272a55"><div class="cz-marca">' + MARCA + PALABRA + "</div>" + BRUJULA_SVG + "<h1>¿En qué programa<br><span>estás?</span></h1><p class='cz-sub'>Regístrate una vez y descubre qué ayuda te corresponde.</p></div>" +
      '<h2 class="cz-pasos-t" id="cz-como">Cómo funciona</h2><ul class="cz-pasos" aria-labelledby="cz-como">' + [["user-plus", "Cuéntanos tu situación", "5 min"], ["phone", "Un conector te orienta", "24–72 h"], ["map-pin", "Ves tus programas", "En tu zona"]].map(([i, t, n]) => '<li><span class="cz-pi">' + ic(i) + "</span><b>" + t + "</b>" + tag(n, "neutral", "small") + "</li>").join("") + "</ul>" +
      '<div class="cz-cta">' + btn("Empezar", { act: "empezar-yo", a: { id: "btn-registrarme" } }) + btn("Ya tengo expediente", { v: "quiet", act: "entrar-ejemplo", a: { id: "btn-ejemplo" } }) + "</div></div>";
  }
  const PASOS_YO = ["Consentimiento", "Tus datos", "Cómo estás", "Quién te acompaña"];
  const AUTO = CAT.autoevaluacion;
  const AUTO_EJ = { a1: "a", a2: "a", a3: "r", a4: "v", a5: "a", a6: "a", a7: "r", a8: "a" };
  function cRegistro(paso, n) {
    if (!D || D.tipo !== "yo") D = nuevo("yo");
    /* Un segmento por pantalla real: permisos, datos, cada pregunta del Mapa y la entidad; sin números. */
    const b = { pos: paso <= 2 ? paso - 1 : 2 + AUTO.length, total: 3 + AUTO.length };
    if (paso === 1) return czWiz(Object.assign(b, { titulo: "Tus permisos", cuerpo: czConsent(), atras: "#/inicio", act: "yo-1" }));
    if (paso === 2) return czWiz(Object.assign(b, { titulo: "Sobre ti", cuerpo: czDatos(), atras: "#/registro/1", act: "yo-2", ejemplo: "datos" }));
    if (paso === 3) {
      const q = AUTO[Math.min(Math.max(n || 1, 1), AUTO.length) - 1], i = AUTO.indexOf(q);
      b.pos = 2 + i;
      return czWiz(Object.assign(b, { titulo: q.q, icono: q.icono, eyebrow: "¿Cómo estás hoy? · " + q.sistema, cuerpo: czPregunta(q), atras: i ? "#/registro/3/" + i : "#/registro/2", act: "yo-3", ejemplo: i ? "" : "mapa", sig: i < AUTO.length - 1 ? "Siguiente" : "Continuar" }));
    }
    const urg = Object.values(D.auto).includes("r");
    return czWiz(Object.assign(b, {
      titulo: "¿Quién te acompaña?", atras: "#/registro/3/" + AUTO.length, act: "yo-crear", sig: "Crear mi expediente", sigIcon: "check", cuerpo: czEntidades(),
      pie: '<div class="cz-plazo">' + ic("clock") + (urg ? "Te llamamos en menos de 24 h" : "Te llamamos en 5 días hábiles como máximo") + "</div>"
    }));
  }
  /* Asistente del ciudadano: cabecera con atrás y progreso, cuerpo y botón fijo abajo. */
  const czWiz = (o) => '<div class="bc-page cz-pg cz-wiz"><div class="cz-cab' + (o.eyebrow ? "" : " cz-cab--t") + '"><a class="cz-atras" href="' + o.atras + '" aria-label="Atrás">' + ic("chevron-left") + "</a>" + (o.eyebrow ? "" : '<h1 class="cz-tit">' + esc(o.titulo) + "</h1>") + '<div class="cz-prog" role="img" aria-label="Paso ' + (o.pos + 1) + ' de ' + o.total + '">' + Array.from({ length: o.total }, (x, i) => '<i class="' + (i <= o.pos ? "on" : "") + '"></i>').join("") + "</div></div>" +
    '<div class="cz-cuerpo">' + (o.eyebrow ? '<div class="cz-hd"><div class="cz-hd__t"><h1>' + esc(o.titulo) + '</h1><span class="cz-qk">' + esc(o.eyebrow) + "</span></div>" + (o.icono ? '<div class="cz-ico">' + ic(o.icono) + "</div>" : "") + "</div>" : (o.icono ? '<div class="cz-ico">' + ic(o.icono) + "</div>" : "")) +
    (o.ejemplo ? '<div class="bc-ejemplo">' + btn("Completar con datos de ejemplo", { v: "quiet", size: "small", icon: "sparkles", act: "ejemplo", a: { "data-k": o.ejemplo } }) + "</div>" : "") + o.cuerpo + "</div>" +
    '<div class="cz-pie">' + (o.pie || "") + btn(o.sig || "Continuar", { act: o.act, iconEnd: o.sigIcon || "arrow-right", a: { id: "btn-sig" } }) + "</div></div>";
  const CZ_PERM = { privacidad: ["Política de privacidad", "Necesario"], tratamiento: ["Tratar mis datos", "Necesario"], entidades: ["Compartir mi itinerario", "Para que tus entidades vean tus recursos"], comunicaciones: ["Recibir comunicados", "Los avisos de tus recursos llegan siempre"] };
  const czConsent = () => '<div class="cz-card cz-perm">' + CAT.consentimientos.map((c) => { const t = CZ_PERM[c.id] || [c.txt, c.obligatorio ? "Necesario" : ""]; return checkbox(c.id, !!D.consent[c.id], '<span class="cz-pt">' + esc(t[0]) + '</span><span class="cz-ps' + (c.obligatorio ? " req" : "") + '">' + esc(t[1]) + "</span>", "", "data-c"); }).join("") + "</div>" +
    (D.err.consent ? alerta(esc(D.err.consent), "negative") : "");
  /* Opciones únicas (documento, canal, idioma): botones que escriben en D.datos igual que el select. */
  const czOpt = (k, v, cls, inner) => '<button type="button" role="radio" class="' + cls + '" aria-checked="' + (D.datos[k] === v) + '" data-act="c-set" data-k="' + k + '" data-v="' + esc(v) + '">' + (inner || esc(v)) + "</button>";
  const czGrupo = (k, label, cls, opts, inner) => '<div class="cz-grupo"><span class="cz-gl" id="g-' + k + '">' + label + '</span><div class="' + cls + '" role="radiogroup" aria-labelledby="g-' + k + '">' + opts.map((v) => czOpt(k, v, cls + "-o", inner && inner(v))).join("") + "</div>" + (D.err[k] ? '<p class="cz-err" id="e-' + k + '">' + esc(D.err[k]) + "</p>" : "") + "</div>";
  /* Idioma admite varios: lista en el borrador (D.datos.idioma), texto "A, B" al crear la persona. */
  const czLista = (v) => (Array.isArray(v) ? v : v ? String(v).split(", ") : []);
  const czMulti = (k, label, cls, opts) => '<div class="cz-grupo"><span class="cz-gl" id="g-' + k + '">' + label + '</span><div class="' + cls + '" role="group" aria-labelledby="g-' + k + '">' + opts.map((v) => '<button type="button" role="checkbox" class="' + cls + '-o" aria-checked="' + czLista(D.datos[k]).includes(v) + '" data-act="c-multi" data-k="' + k + '" data-v="' + esc(v) + '">' + esc(v) + "</button>").join("") + "</div>" + (D.err[k] ? '<p class="cz-err" id="e-' + k + '">' + esc(D.err[k]) + "</p>" : "") + "</div>";
  const CZ_CANAL = { "WhatsApp": "message-circle", "Teléfono": "phone", "Email": "mail" };
  const czDatos = () => '<div class="cz-card cz-datos"><div class="cz-g2">' + fld("nombre", "Nombre") + fld("apellidos", "Apellidos") + "</div>" + fld("tel", "Teléfono", { type: "tel", mode: "tel", ph: "+34 600 000 000" }) +
    '<div class="cz-g2">' + fld("nac", "Nacimiento", { type: "date" }) + fld("cp", "Código postal", { mode: "numeric", ph: "28000" }) + "</div>" + fld("municipio", "Municipio") + fld("email", "Email", { type: "email", opc: true }) + "</div>" +
    czGrupo("docTipo", "¿Documento nacional?", "cz-seg", ["Sí", "En trámite", "No"].filter((x) => CAT.documento.includes(x))) +
    czGrupo("canal", "¿Cómo te contactamos?", "cz-fichas", CAT.canales, (v) => ic(CZ_CANAL[v] || "message-text") + "<span>" + esc(v) + "</span>") +
    czMulti("idioma", "Idiomas que hablas", "cz-chips", CAT.idiomas);
  /* Cada pregunta del Mapa de Vida: ícono, pregunta grande y tres respuestas con el color del semáforo. */
  const czPreguntas = (dims) => '<div class="cz-qs">' + dims.map((d) => '<section class="bc-dim cz-q" data-dim="' + d.id + '"><div class="cz-qh"><div class="cz-qi">' + gi(d) + '</div><div><span class="cz-qk">' + esc(d.n) + "</span><h2>" + esc(d.q) + '</h2></div></div><div class="cz-qo" role="radiogroup" aria-label="' + esc(d.n) + '">' +
    d.o.map((t, i) => { const v = "var"[i]; return radio(D.mapa[d.id] === v, '<i class="cz-dot cz-' + v + '"></i>' + esc(t), 'data-act="sem" data-d="' + d.id + '" data-v="' + v + '"'); }).join("") + "</div></section>").join("") + "</div>" +
    (D.err.mapa ? alerta(esc(D.err.mapa), "negative") : "");
  /* Una pregunta por pantalla: la respuesta va a D.auto y se traduce al Mapa de Vida al crear el expediente. */
  const czPregunta = (q) => '<section class="bc-dim cz-q cz-q1" data-q="' + q.id + '"><div class="cz-qo" role="radiogroup" aria-label="' + esc(q.q) + '">' +
    q.o.map((t, i) => { const v = "var"[i]; return radio(D.auto[q.id] === v, '<i class="cz-dot cz-' + v + '"></i>' + esc(t), 'data-act="c-auto" data-q="' + q.id + '" data-v="' + v + '"'); }).join("") + "</div></section>" +
    (q.id === "a6" ? '<div class="cz-nota">' + ic("shield-check") + "Estos datos pueden ser verificados.</div>" : "") +
    (D.err.auto ? alerta(esc(D.err.auto), "negative") : "");
  /* Mini-mapa ilustrativo: los pines están en posiciones fijas, no son coordenadas reales. */
  const CZ_PIN = [[92, 52], [270, 40], [230, 128]];
  /* Entidades por cercanía al código postal (en Madrid crece con la distancia); sin CP válido, orden de la red. */
  const czCp = () => /^\d{5}$/.test((D.datos || {}).cp || "") ? +D.datos.cp : 0;
  const czOrd = () => { const cp = czCp(), o = cp ? [...S.entidades].sort((x, y) => Math.abs(+x.cp - cp) - Math.abs(+y.cp - cp)) : S.entidades; if (!D.entTocada && o[0]) D.entidad = o[0].id; return o; };
  const czEntidades = () => '<p class="cz-expl">' + (czCp() ? "Según tu código postal (" + czCp() + ") te mostramos primero las entidades más cercanas. La que elijas te asigna un conector y te acompaña; los recursos pueden ser de cualquier entidad de la red." : "Sin código postal te mostramos todas las entidades de la red. Con tu código postal te ubicamos las más cercanas.") + '</p><div class="cz-map" role="img" aria-label="Mapa con ' + S.entidades.length + ' entidades' + (czCp() ? ', ordenadas por cercanía a tu código postal' : ' cerca de ti') + '"><svg viewBox="0 0 350 168" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="M-10 120 C 80 90, 140 150, 220 110 S 340 60, 370 80" stroke="#fff" stroke-width="14" fill="none"/><path d="M60 -10 L 110 180" stroke="#fff" stroke-width="10"/><path d="M250 -10 L 230 180" stroke="#fff" stroke-width="8"/><rect x="140" y="20" width="60" height="40" rx="8" fill="#D6EBDD"/><circle cx="175" cy="96" r="22" fill="rgba(91,141,239,.18)"/><circle cx="175" cy="96" r="7" fill="#2E6BE6" stroke="#fff" stroke-width="3"/></svg>' +
    czOrd().map((e, i) => { const q = CZ_PIN[i % 3]; return '<span class="cz-pin' + (D.entidad === e.id ? " on" : "") + '" style="left:' + (q[0] / 3.5).toFixed(1) + "%;top:" + (q[1] / 1.68).toFixed(1) + '%" aria-hidden="true">' + (i + 1) + "</span>"; }).join("") + "</div>" +
    '<div class="cz-ents" role="radiogroup" aria-label="Entidad">' + czOrd().map((e, i) => '<button type="button" role="radio" class="cz-ent" aria-checked="' + (D.entidad === e.id) + '" data-act="ent" data-e="' + e.id + '"><span class="cz-en">' + (i + 1) + '</span><span class="cz-et"><b>' + esc(e.nombre) + "</b><span>" + esc(e.zona) + "</span></span>" + (czCp() && i === 0 ? '<span class="cz-near">' + (+e.cp === czCp() ? "En tu zona" : "Más cerca") + "</span>" : "") + "</button>").join("") + "</div>";
  /* Fechas de los recursos aprobados de la persona, de hoy a «dias» adelante. */
  /* Confirmar asistencia solo donde hay plazas que liberar; plazo: config.confirmarAntes horas (24). */
  const pideConf = (r) => !!r.cupo && (r.tiempo || {}).forma !== "estadia";
  const confAntes = (r) => (r.config || {}).confirmarAntes || 24;
  const limiteConf = (r, f) => { const d = new Date(f + "T" + ((r.tiempo || {}).hora || "00:00")); d.setHours(d.getHours() - confAntes(r)); return d; };
  const limiteTxt = (d) => DNOM[DSEM[d.getDay()]].toLowerCase() + " " + d.getDate() + " a las " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  const asisDe = (pid, rid, f) => (S.asistencias || []).find((a) => a.persona === pid && a.recurso === rid && a.fecha === f);
  const usoEn = (pid, rid, f) => (S.usos || []).find((u) => u.persona === pid && u.recurso === rid && u.fecha === f);
  function czConf(o) {
    if (!pideConf(o.r) || o.s.persona !== S.ciudadano || o.f < hoy()) return "";
    const a = asisDe(o.s.persona, o.r.id, o.f), lim = limiteConf(o.r, o.f), con = (o.s.acompanantes || []).length ? " con " + o.s.acompanantes.map((x) => per(x).nombre).join(" y ") : "";
    const b = (t, e, on) => '<button type="button" class="cz-voy' + (on ? " on" : "") + '" data-act="c-voy" data-r="' + o.r.id + '" data-f="' + o.f + '" data-e="' + e + '" aria-pressed="' + !!on + '">' + esc(t) + "</button>";
    if (a) return '<span class="cz-conf">' + b("Voy" + con, "Confirmada", a.estado === "Confirmada") + b("No voy", "No va", a.estado === "No va") + "</span>";
    if (new Date() > lim) return '<span class="cz-conf__x">Sin confirmar: la plaza de ese día se ofreció a la lista de espera</span>';
    return '<span class="cz-conf">' + b("Voy" + con, "Confirmada") + b("No voy", "No va") + "<small>Confirma antes del " + limiteTxt(lim) + "</small></span>";
  }
  function agendaDe(pid, dias) {
    const lim = new Date(); lim.setDate(lim.getDate() + dias); const tope = isoDe(lim), out = [];
    solsDe(pid).filter((x) => x.estado === "Aprobada").forEach((x) => { const r = rec(x.recurso); proximas(r, 40, x.desde && x.desde > hoy() ? x.desde : hoy()).filter((f) => f <= tope).forEach((f) => out.push({ f, r, s: x })); });
    return out.sort((a, b) => (a.f + (a.r.tiempo.hora || "")).localeCompare(b.f + (b.r.tiempo.hora || "")));
  }
  const czDia = (f) => { const m = new Date(); m.setDate(m.getDate() + 1); return f === hoy() ? "Hoy" : f === isoDe(m) ? "Mañana" : fCorta(f); };
  const czFila = (o, conDia) => '<div class="cz-ag"><time>' + (conDia ? "<small>" + czDia(o.f) + "</small>" : "") + esc(o.r.tiempo.hora || "") + '</time><span class="cz-ri">' + ic(CZ_CAT[o.r.cat] || "hands-heart") + '</span><div class="grow"><b>' + esc(o.r.nombre) + "</b><span>" + esc(ent(o.r.entidad).nombre) + "</span>" + czConf(o) + "</div></div>";
  function cFamilia() {
    const p = yoP(); if (!p) return cBienvenida();
    const gs = gruposDe(p.id), at = ent(p.entidad).nombre;
    const fila = (f) => '<div class="cz-fm">' + avatar(ini(f.nombre + " " + f.apellidos), f.verificacion === "Verificada" ? "teal" : "amber", "medium") + '<div class="grow"><b>' + esc(f.nombre + " " + f.apellidos) + "</b><span>" + esc(f.vinculo) + (f.nac ? " · " + fecha(f.nac) : "") + "</span>" + (f.verificacion === "Por verificar" ? '<span class="cz-fm__n">Lo verifica ' + esc(at) + "</span>" : f.motivo ? '<span class="cz-fm__n">' + esc(f.motivo) + "</span>" : "") + "</div>" + tag(f.verificacion, VERIF[f.verificacion], "small") + "</div>" +
      (f.verificacion === "Por verificar" ? '<div class="cz-fm__demo">' + btn("Simular que " + at + " la verifica", { v: "mute", size: "small", icon: "sparkles", act: "c-fam-ver", a: { "data-fid": f.id } }) + "</div>" : "");
    return '<div class="bc-page cz-pg cz-familia"><a class="bc-back" href="#/inicio">← Inicio</a><div><h1>Mi familia</h1><p class="cz-mp-sub">Quién puede ir contigo a un recurso. Cada persona ocupa su plaza y lleva su propio consumo.</p></div>' +
      (gs.length ? gs.map((g) => '<section class="cz-bl"><h2>' + esc(g.nombre) + "<span>" + g.miembros.length + (g.miembros.length === 1 ? " persona" : " personas") + '</span></h2><div class="cz-card cz-fms">' + g.miembros.map(per).filter(Boolean).map(fila).join("") + "</div></section>").join("")
        : '<p class="cz-vacio">Aún no agregaste a nadie. Si vas con tu familia a un recurso, agrégala aquí y tu entidad la verifica.</p>') +
      '<div class="cz-cta">' + btn("Agregar familiar", { icon: "user-plus", href: "#/familia/nuevo", a: { id: "btn-fam-nuevo" } }) + "</div></div>";
  }
  /* Hoja «¿Quién viene contigo?»: solo familiares verificados y sin esa necesidad en curso. */
  function modalPedir() {
    const p = yoP(), r = rec(czPedir.r); if (!p || !r) return "";
    const fs = famDe(p.id), max = (r.config || {}).maxAcompanantes || 99, sel = czPedir.sel, n = 1 + sel.length, libres = r.cupo ? usoRec(r).libres : null;
    const fila = (f) => { const mot = motivoFam(f, r), on = sel.includes(f.id), tope = !on && sel.length >= max, dis = !!mot || tope;
      return '<div class="bc-opt cz-qv' + (on ? " on" : "") + (dis ? " cz-qv--off" : "") + '"' + (dis ? "" : ' data-act="c-pedir-fam" data-fid="' + f.id + '"') + '><div class="nwt-checkbox' + (on ? " nwt-checkbox--checked" : "") + '" role="checkbox" nwt-size="medium" aria-checked="' + on + '" aria-disabled="' + dis + '" tabindex="' + (dis ? -1 : 0) + '"><div class="nwt-checkbox__control">' + ic("positive") + '</div><span class="nwt-checkbox__label"><b>' + esc(f.nombre) + "</b> · " + esc(f.vinculo) + (mot || tope ? '<span class="cz-qv__m">' + esc(mot || "Máximo " + max + (max === 1 ? " acompañante" : " acompañantes")) + "</span>" : "") + "</span></div></div>"; };
    return '<div class="ez-mb" data-act="c-pedir-no"></div><div class="ez-modal cz-hoja" role="dialog" aria-modal="true" aria-labelledby="cz-qv-t"><h2 id="cz-qv-t">¿Quién viene contigo?</h2><p class="mut">' + esc(r.nombre) + (proxTxt(r) ? " · primera fecha " + esc(proxTxt(r)) : "") + ". Cada acompañante ocupa una plaza y lleva su propio consumo.</p>" +
      '<div class="stack-s">' + fs.map(fila).join("") + "</div>" +
      '<div class="cz-qv__res">' + ic("users") + "<span>Ocupáis <b>" + n + (n === 1 ? " plaza" : " plazas") + "</b>" + (libres != null ? " · quedan " + libres : "") + "</span></div>" +
      (libres != null && libres < n ? alerta("No hay plazas para todos: quedaréis <b>en lista de espera juntos</b>. No separamos a la familia.", "warning") : "") +
      '<div class="ez-modal__f">' + btn("Cancelar", { v: "mute", act: "c-pedir-no" }) + btn(r.modo === "Solicitud" ? "Solicitar" : "Apuntarme", { act: "c-pedir-ok", a: { id: "btn-pedir-ok" } }) + "</div></div>";
  }
  function pedirCz(p, r, acomp) {
    const n = 1 + acomp.length, lleno = r.cupo && usoRec(r).libres < n, quien = acomp.length ? " con " + acomp.map((id) => per(id).nombre).join(" y ") : "";
    S.solicitudes.push({ id: "s" + Date.now(), persona: p.id, recurso: r.id, por: "persona", estado: lleno ? "En lista de espera" : r.modo === "Solicitud" ? "Pendiente" : "Aprobada", fecha: hoy(), desde: desdeDe(r), acompanantes: acomp });
    czPedir = null; guardar(); czFiltro = "todos"; ir("#/recursos");
    toast(lleno ? (acomp.length ? "Quedáis" : "Quedas") + " en lista de espera de " + r.nombre + "." : r.modo === "Solicitud" ? ent(r.entidad).nombre + " revisará tu solicitud" + quien + "." : "Te apuntamos a " + r.nombre + quien + (proxTxt(r) ? ". Primera fecha: " + proxTxt(r) + "." : "."));
  }
  const avisosDe = (pid) => (S.comunicados || []).filter((c) => c.estado === "Enviado" && c.destinatarios.includes(pid)).sort((a, b) => b.enviado.localeCompare(a.enviado));
  function cAvisos() {
    const p = yoP(); if (!p) return cBienvenida();
    const ls = avisosDe(p.id), nuevos = ls.filter((c) => !(c.leidos || []).includes(p.id)).map((c) => c.id);
    const html = '<div class="bc-page cz-pg cz-avisos"><a class="bc-back" href="#/inicio">← Inicio</a><div><h1>Avisos</h1><p class="cz-mp-sub">Lo que te comunican tus entidades. Los avisos de tus recursos te llegan siempre.</p></div>' +
      (ls.length ? '<div class="cz-lista">' + ls.map((c) => { const r = c.recurso && rec(c.recurso), sl = r && S.solicitudes.find((x) => x.persona === p.id && x.recurso === r.id && x.estado === "Aprobada");
        return '<article class="cz-card cz-av' + (nuevos.includes(c.id) ? " cz-av--n" : "") + '"><div class="cz-av__h"><b>' + esc(firmaTxt(c)) + "</b>" + (c.porRed ? "<span>vía la red</span>" : "") + "<time>" + cuando(c.enviado) + "</time></div><h2>" + esc(c.asunto) + "</h2><p>" + esc(c.cuerpo) + "</p>" + (c.clase === "aviso" && sl && c.fechaEvento ? czConf({ r, f: c.fechaEvento, s: sl }) : "") + "</article>"; }).join("") + "</div>"
        : '<p class="cz-vacio">Todavía no tienes avisos.</p>') + "</div>";
    if (nuevos.length) { ls.forEach((c) => { c.leidos = c.leidos || []; if (!c.leidos.includes(p.id)) c.leidos.push(p.id); }); guardar(); }
    return html;
  }
  function cAgenda() {
    const p = yoP(); if (!p) return cBienvenida();
    const ev = agendaDe(p.id, 14), dias = [...new Set(ev.map((o) => o.f))];
    const est = solsDe(p.id).filter((x) => x.estado === "Aprobada" && (rec(x.recurso).tiempo || {}).forma === "estadia");
    return '<div class="bc-page cz-pg cz-agenda"><div><h1>Agenda</h1><p class="cz-mp-sub">Tus próximas dos semanas</p></div>' +
      est.map((x) => '<a class="cz-ya" href="#/recursos">' + ic("home") + '<span class="grow"><b>' + esc(rec(x.recurso).nombre) + "</b><span>Alojamiento" + (x.desde ? " desde " + fCorta(x.desde) : "") + "</span></span></a>").join("") +
      (dias.length ? dias.map((f) => '<section class="cz-bl"><h2>' + czDia(f) + '</h2><div class="cz-card cz-ags">' + ev.filter((o) => o.f === f).map((o) => czFila(o)).join("") + "</div></section>").join("")
        : '<p class="cz-vacio">No tienes fechas en las próximas dos semanas. Busca ayuda en «Buscar».</p>') + "</div>";
  }
  function cInicio() {
    const p = yoP(); if (!p) return cBienvenida();
    const sols = solsDe(p.id), c = p.conector && con(p.conector), pend = sols.filter((s) => s.estado === "Pendiente"), ag = agendaDe(p.id, 30).slice(0, 3);
    const pasos = [];
    if (!c) pasos.push(["phone", "Espera la llamada de tu conector", ent(p.entidad).nombre + " te contactará por " + p.canal + (Object.values(p.mapa).includes("r") ? " en menos de 24 horas." : " en un máximo de 5 días hábiles.")]);
    famDe(p.id).filter((f) => f.verificacion === "Por verificar").forEach((f) => pasos.push(["users", f.nombre + " está por verificar", ent(p.entidad).nombre + " revisa su ficha para que pueda acompañarte."]));
    if (p.mapaTipo === "corto") pasos.push(["clipboard-list", "Completa tu Mapa de Vida", "En la entrevista con tu conector completas las " + (CAT.dimensiones.length - Object.keys(p.mapa).length) + " áreas que faltan."]);
    pend.forEach((s) => { const r = rec(s.recurso); pasos.push(["clock", ent(r.entidad).nombre + " está revisando tu solicitud", r.nombre + " · " + plazo(r)]); });
    if (!pasos.length) pasos.push(["check-circle", "Todo al día", "Tu conector te avisará si hay algo nuevo."]);
    const cn = czCuenta(p.mapa), tot = cn.r + cn.a + cn.v, L = 163.4;
    let off = 0;
    const arcos = ["v", "a", "r"].map((k) => { const l = tot ? cn[k] / tot * L : 0, s = l ? '<circle class="cz-sv ' + k + '" cx="32" cy="32" r="26" stroke-dasharray="' + l.toFixed(1) + " " + L + '" stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 32 32)"/>' : ""; off += l; return s; }).join("");
    const hdr = c ? '<div class="cz-cn">' + avatar(ini(c.nombre), "blue", "large") + '<div class="grow"><span class="cz-k">Tu conector</span><b>' + esc(c.nombre) + '</b></div><button type="button" class="cz-rb" data-act="c-contacto" aria-label="Escribir a ' + esc(c.nombre) + '">' + ic("message-circle") + '</button><button type="button" class="cz-rb acc" data-act="c-contacto" aria-label="Llamar a ' + esc(c.nombre) + '">' + ic("phone") + "</button></div>"
      : '<div class="cz-cn">' + avatar("?", "amber", "large") + '<div class="grow"><span class="cz-k">Tu conector</span><b>Te estamos asignando uno</b></div></div>';
    return '<div class="bc-page cz-pg cz-inicio">' + (S.recienCreado === p.id ? alerta("<b>Tu expediente está creado.</b> Número " + esc(p.id) + ".", "positive") : "") +
      '<div class="cz-hola"><div><span>Hola,</span><h1>' + esc(p.nombre) + '</h1></div>' + (() => { const n = avisosDe(p.id).filter((c) => !(c.leidos || []).includes(p.id)).length; return '<a class="cz-bell" href="#/avisos" id="mis-avisos" aria-label="Avisos' + (n ? ", " + n + " sin leer" : "") + '">' + ic("bell") + (n ? "<i>" + n + "</i>" : "") + "</a>"; })() + '<a class="cz-me" href="#/privacidad" aria-label="Mi privacidad">' + avatar(ini(nom(p)), "orange", "large") + "</a></div>" +
      '<div class="cz-dark" id="mi-conector">' + hdr + pasos.slice(0, 2).map(([i, t, d]) => '<div class="cz-pr"><span class="cz-pi">' + ic(i) + '</span><div class="grow"><b>' + esc(t) + "</b><span>" + esc(d) + "</span></div></div>").join("") + "</div>" +
      '<a class="cz-ring" href="#/mapa"><svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="Mapa de Vida: ' + cn.r + " necesitan apoyo, " + cn.a + " en proceso, " + cn.v + ' estables"><circle class="cz-pista" cx="32" cy="32" r="26"/>' + arcos + '</svg><div class="grow"><b>Mi Mapa de Vida</b><div class="cz-cuentas"><span><b class="r">' + cn.r + "</b> apoyo</span><span><b class=\"a\">" + cn.a + "</b> proceso</span><span><b class=\"v\">" + cn.v + "</b> bien</span></div></div>" + ic("chevron-right") + "</a>" +
      (() => { const fs = famDe(p.id), pv = fs.filter((f) => f.verificacion === "Por verificar").length;
        return '<a class="cz-ring cz-fam" href="#/familia" id="mi-familia"><span class="cz-fam__av">' + (fs.length ? fs.slice(0, 3).map((f) => avatar(ini(f.nombre + " " + f.apellidos), f.verificacion === "Verificada" ? "teal" : "amber", "small")).join("") : avatar("+", "blue", "small")) + '</span><div class="grow"><b>Mi familia</b><div class="cz-cuentas">' + (fs.length ? "<span>" + fs.length + (fs.length === 1 ? " persona" : " personas") + "</span>" + (pv ? '<span><b class="a">' + pv + "</b> por verificar</span>" : "") : "<span>Agrégala para ir juntos</span>") + "</div></div>" + ic("chevron-right") + "</a>"; })() +
      (ag.length ? '<div class="cz-sh"><h2>Próximas fechas</h2><a href="#/agenda">Ver agenda</a></div><div class="cz-card cz-ags" id="proximas">' + ag.map((o) => czFila(o, true)).join("") + "</div>" : "") +
      '<div class="cz-sh"><h2>Mis recursos</h2>' + (sols.length ? '<a href="#/recursos">Ver todos</a>' : "") + "</div>" +
      (sols.length ? '<div class="cz-minis">' + sols.slice(0, 3).map((s) => { const r = rec(s.recurso); return '<div class="cz-mini cz-e-' + CZ_ST[s.estado][2] + '"><span class="cz-ri">' + ic(CZ_CAT[r.cat] || "hands-heart") + "</span><b>" + esc(r.nombre) + "</b>" + czSt(s.estado) + "</div>"; }).join("") + "</div>" : '<p class="cz-vacio">Aún no tienes recursos.</p>') + "</div>";
  }
  function cRecursos() {
    const p = yoP(); if (!p) return cBienvenida();
    const sols = solsDe(p.id);
    const FIL = [["todos", "Todos · " + sols.length, () => true], ["activos", "Activos", (s) => s.estado === "Aprobada"], ["tramite", "En trámite", (s) => ["Pendiente", "En lista de espera", "Falta información"].includes(s.estado)]];
    const lista = sols.filter((FIL.find((f) => f[0] === czFiltro) || FIL[0])[2]);
    return '<div class="bc-page cz-pg cz-recursos"><h1>Mis recursos</h1>' +
      '<div class="cz-tabs" role="tablist" aria-label="Filtro">' + FIL.map(([k, t]) => '<button type="button" role="tab" aria-selected="' + (k === czFiltro) + '" data-act="c-filtro" data-v="' + k + '">' + t + "</button>").join("") + "</div>" +
      '<div class="cz-lista" id="mis-recursos">' + (lista.length ? lista.map((s) => {
        const r = rec(s.recurso), [fin, n, k] = CZ_ST[s.estado];
        return '<article class="cz-rec cz-e-' + k + '"><div class="cz-rh"><span class="cz-ri">' + ic(CZ_CAT[r.cat] || "hands-heart") + '</span><div class="grow"><b>' + esc(r.nombre) + "</b><span>" + esc(ent(r.entidad).nombre) + " · " + esc(cuandoTxt(r)) + "</span></div>" + czSt(s.estado) + "</div>" +
          '<div class="cz-etapas" role="img" aria-label="' + esc(r.nombre) + ": " + s.estado.toLowerCase() + '"><div class="cz-barra"><i></i><i class="' + (n >= 2 ? "" : "off") + '"></i><i class="' + (n >= 3 ? "" : "off") + '"></i></div><div class="cz-et3"><span>Solicitado</span><span>Revisión</span><span class="' + (n >= 3 ? "fin" : "") + '">' + (n >= 3 ? fin : "Resultado") + "</span></div></div>" +
          (s.estado === "Aprobada" && proxTxt(r) ? '<div class="cz-prox">' + ic("calendar") + "<span>Próxima: <b>" + esc(proxTxt(r)) + "</b></span>" + (pideConf(r) && ["recurrente", "sesiones"].includes(r.tiempo.forma) ? btn("Voy a las próximas 4", { v: "quiet", size: "small", act: "c-voy-lote", a: { "data-r": r.id } }) : "") + "</div>" : "") +
          (s.estado === "Rechazada" && s.motivo ? '<p class="cz-mot">' + esc(s.motivo) + "</p>" : "") + ((s.acompanantes || []).length ? '<div class="cz-prox">' + ic("users") + "<span>Va con: <b>" + esc(vaCon(s)) + "</b></span></div>" : "") + usoBloque(s) + "</article>";
      }).join("") : '<p class="cz-vacio">' + (sols.length ? "Nada en esta lista." : "Aún no tienes recursos. Búscalos en «Buscar».") + "</p>") + "</div></div>";
  }
  /* Buscar: cruza lo que pesa en su Mapa con lo que ofrece cada entidad. Una necesidad ya pedida
     oculta sus parecidos para no pedir lo mismo en dos lugares. */
  function cBuscar() {
    const p = yoP(); if (!p) return cBienvenida();
    const sols = solsDe(p.id), tiene = new Set(sols.filter((s) => s.estado !== "Rechazada").map((s) => s.recurso));
    const curso = {}; sols.filter((s) => ACTIVAS.includes(s.estado)).forEach((s) => { const r = rec(s.recurso); if (r && !curso[r.cat]) curso[r.cat] = r; });
    const peso = {}; CAT.dimensiones.forEach((d) => { const v = p.mapa[d.id]; if (v === "r" || v === "a") peso[d.cat] = peso[d.cat] === "r" ? "r" : v; });
    const cats = CATS.filter((c) => S.recursos.some((r) => r.cat === c && !r.pausado));
    const ORD = { r: 0, a: 1 }, orden = cats.slice().sort((x, y) => (ORD[peso[x]] ?? 2) - (ORD[peso[y]] ?? 2));
    const nec = czNec || (Object.keys(peso).some((c) => cats.includes(c) && !curso[c]) ? "mias" : "todas");
    const q = czQ.trim().toLowerCase(), hay = (r) => !q || (r.nombre + " " + r.cat + " " + ent(r.entidad).nombre).toLowerCase().includes(q);
    const ver = orden.filter((c) => nec === "todas" || (nec === "mias" ? peso[c] : nec === c));
    const libres = (c) => S.recursos.filter((r) => r.cat === c && !r.pausado && !tiene.has(r.id) && hay(r));
    const chip = (k, t) => '<button type="button" class="bc-chip" data-act="c-nec" data-v="' + esc(k) + '" aria-pressed="' + (nec === k) + '">' + t + "</button>";
    const acceso = (r) => r.modo === "Libre" ? "Acceso libre" : r.modo === "Inscripción" ? "Inscripción" : "La entidad decide · " + (r.urg === "Urgente" ? "24 h" : "5 días");
    const tarjeta = (r) => { const u = usoRec(r), lleno = r.cupo && u.activas >= r.cupo;
      return '<article class="cz-rec cz-hall"><div class="cz-rh"><span class="cz-ri">' + ic(CZ_CAT[r.cat] || "hands-heart") + '</span><div class="grow"><b>' + esc(r.nombre) + "</b><span>" + esc(ent(r.entidad).nombre) + "</span></div></div>" +
        '<div class="cz-hall__p"><span>' + esc(cuandoTxt(r)) + "</span><span>" + acceso(r) + "</span><span>" + (r.cupo ? (lleno ? "Sin plazas ahora" : (r.cupo - u.activas) + " plazas libres" + (proximas(r, 1)[0] ? " · " + fCorta(proximas(r, 1)[0]) : "")) : "Sin límite de plazas") + "</span></div>" +
        btn(lleno ? "Apuntarme en lista de espera" : r.modo === "Solicitud" ? "Solicitar" : "Apuntarme", { v: lleno ? "quiet" : "loud", size: "medium", act: "c-pedir", a: { "data-r": r.id } }) + "</article>"; };
    const grupo = (c) => {
      const rs = libres(c), pedido = curso[c], cabeza = '<h2>' + esc(c) + "<span>" + (peso[c] === "r" ? "Necesitas apoyo" : peso[c] === "a" ? "En camino" : "") + "</span></h2>";
      if (pedido) { const n = S.recursos.filter((r) => r.cat === c && !r.pausado && !tiene.has(r.id)).length;
        return (q && !S.recursos.some((r) => r.cat === c && hay(r))) ? "" : '<section class="cz-bl">' + cabeza + '<a class="cz-ya" href="#/recursos">' + ic("check") + '<span class="grow"><b>Ya pediste ' + esc(pedido.nombre) + "</b><span>" + (n ? "Ocultamos " + n + (n > 1 ? " opciones parecidas" : " opción parecida") + " para que no pidas lo mismo en dos lugares." : "Lo sigues en Mis recursos.") + "</span></span>" + ic("chevron-right") + "</a></section>"; }
      return rs.length ? '<section class="cz-bl">' + cabeza + '<div class="cz-lista">' + rs.map(tarjeta).join("") + "</div></section>" : "";
    };
    const cuerpo = ver.map(grupo).join("");
    return '<div class="bc-page cz-pg cz-buscar"><div><h1>Buscar ayuda</h1><p class="cz-mp-sub">Recursos de todas las entidades de la red</p></div>' +
      '<label class="cz-busca">' + ic("search") + '<span class="sr">Buscar recurso o entidad</span><input id="f-czq" type="search" data-czq placeholder="Ej.: alquiler, comida, español" value="' + esc(czQ) + '" autocomplete="off"></label>' +
      '<div class="cz-chips" role="group" aria-label="Necesidad">' + chip("mias", "Para ti") + chip("todas", "Todas") + orden.filter((c) => peso[c]).map((c) => chip(c, esc(c))).join("") + "</div>" +
      (cuerpo || '<p class="cz-vacio">' + (q ? "No hay recursos que coincidan con «" + esc(czQ) + "»." : "Ya pediste ayuda en todo lo que marcaste. Mira «Todas» para ver el resto de la red.") + "</p>") + "</div>";
  }
  function cMapa() {
    const p = yoP(); if (!p) return cBienvenida();
    const cn = czCuenta(p.mapa), BL = [["Básico", ["vivienda", "ingresos", "alimentacion", "salud"]], ["Entorno", ["documentacion", "red", "familia", "menores"]], ["Autonomía", ["cuidados", "empleo", "formacion", "movilidad"]], ["Participación", ["digital", "autonomia", "direccion", "comunidad"]]];
    const CORTO_D = { alimentacion: "Comida", salud: "Salud", documentacion: "Trámites", menores: "Infancia", formacion: "Formación", digital: "Digital", autonomia: "Autonomía", direccion: "Gestión", comunidad: "Comunidad", ingresos: "Ingresos", vivienda: "Vivienda", red: "Red", familia: "Familia", cuidados: "Cuidados", empleo: "Empleo", movilidad: "Movilidad" };
    const SM = { r: "necesita apoyo", a: "en proceso", v: "estable" }, falta = 16 - cn.r - cn.a - cn.v;
    const ORD = { r: 0, a: 1, v: 2 }, ids = BL.flatMap((x) => x[1]), DIM = (id) => CAT.dimensiones.find((d) => d.id === id);
    const nRec = (id) => S.recursos.filter((r) => r.cat === DIM(id).cat && !r.pausado).length;
    const barra = ids.slice().sort((x, y) => (ORD[p.mapa[x]] ?? 3) - (ORD[p.mapa[y]] ?? 3)).map((id) => '<i class="cz-' + (p.mapa[id] || "n") + '"></i>').join("");
    const c = p.conector && con(p.conector), rojas = ids.filter((id) => p.mapa[id] === "r");
    const leg = (k, n, t) => '<span><i class="cz-dot cz-' + k + '"></i><b>' + n + "</b> " + t + "</span>";
    const tile = (id) => { const v = p.mapa[id] || "n"; return '<div class="cz-tile cz-' + v + '" role="img" aria-label="' + CORTO_D[id] + ": " + (SM[v] || "sin evaluar") + '"><span class="cz-tb">' + ic(CZ_ICO[id]) + "</span><b>" + CORTO_D[id] + "</b><small>" + ({ r: "Apoyo", a: "En camino", v: "Bien", n: "Sin dato" })[v] + "</small></div>"; };
    return '<div class="bc-page cz-pg cz-mapa"><div><h1>Mi Mapa de Vida</h1><p class="cz-mp-sub">16 áreas de tu vida, según lo que contaste</p></div>' +
      '<section class="cz-dark cz-mp-hero"><div class="cz-mp-bar" aria-hidden="true">' + barra + '</div><div class="cz-mp-leg">' + leg("r", cn.r, "con apoyo") + leg("a", cn.a, "en camino") + leg("v", cn.v, "bien") + (falta ? leg("n", falta, "sin dato") : "") + "</div>" +
      (c ? '<button type="button" class="cz-mp-con" data-act="ver-mi-con" aria-haspopup="dialog">' + avatar(ini(c.nombre), "blue", "small") + "<span>" + esc(c.nombre.split(" ")[0]) + (rojas.length ? " te acompaña en lo que más pesa ahora" : " revisa tu mapa contigo") + "</span>" + ic("chevron-right") + "</button>" : "") + "</section>" +
      (rojas.length ? '<section class="cz-bl"><h2>Empieza por aquí</h2>' + rojas.map((id) => { const n = nRec(id); return '<a class="cz-foco" href="#/buscar/' + encodeURIComponent(DIM(id).cat) + '"><span class="cz-tb">' + ic(CZ_ICO[id]) + '</span><div class="grow"><b>' + esc(DIM(id).n) + "</b><span>" + (n ? n + (n > 1 ? " recursos disponibles" : " recurso disponible") : "Tu conector busca opciones") + "</span></div>" + ic("chevron-right") + "</a>"; }).join("") + "</section>" : "") +
      BL.map(([t, ids2]) => { const nr = ids2.filter((id) => p.mapa[id] === "r" || p.mapa[id] === "a").length; return '<section class="cz-bl"><h2>' + t + '<span>' + (nr ? nr + " de 4 por atender" : "Todo bien") + '</span></h2><div class="cz-tiles">' + ids2.map(tile).join("") + "</div></section>"; }).join("") + "</div>";
  }
  function cPrivacidad() {
    const p = yoP(); if (!p) return cBienvenida();
    const acc = S.accesos.filter((a) => a.persona === p.id).sort((x, y) => y.cuando.localeCompare(x.cuando));
    const on = !!p.consent.entidades, ents = [...new Set([p.entidad].concat(solsDe(p.id).map((s) => rec(s.recurso).entidad)))];
    const sw = (c, lbl, on2) => '<button type="button" class="cz-sw" role="switch" aria-checked="' + on2 + '" data-act="consent" data-c="' + c + '" aria-label="' + lbl + '"><i></i></button>';
    const sig = (t) => { const x = ini(t); return x.length < 2 ? t.slice(0, 2).toUpperCase() : x; };
    const corta = (f) => f.slice(0, 10) === hoy() ? "Hoy" : new Date(f.slice(0, 10) + "T00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "");
    const COL = { e1: "blue", e2: "teal", e3: "orange" };
    return '<div class="bc-page cz-pg cz-priv"><h1>Privacidad</h1><div class="cz-stack" id="consentimientos"><div class="cz-dark"><div class="cz-cn"><div class="grow"><b class="cz-g">Compartir mi itinerario</b><span class="cz-sub' + (on ? " on" : "") + '">' + (on ? ents.length + (ents.length > 1 ? " entidades ven" : " entidad ve") + " recurso y estado" : "Sin esto, cada entidad solo ve lo que tienes con ella") + "</span></div>" + sw("entidades", "Compartir mi itinerario con otras entidades", on) + "</div>" +
      '<div class="cz-cadena" aria-hidden="true">' + avatar(ini(nom(p)), "orange", "medium") + ents.map((e, i) => '<span class="cz-lin' + (i && !on ? " off" : "") + '"></span><span class="cz-nodo' + (i && !on ? " off" : "") + '">' + avatar(sig(ent(e).nombre), COL[e] || "blue", "medium") + "</span>").join("") + "</div></div>" +
      '<div class="cz-card cz-aviso"><div class="grow"><b>Recibir comunicados</b><span>Los avisos de tus recursos (cambios, cancelaciones) te llegan siempre</span></div>' + sw("comunicaciones", "Recibir comunicados de mis entidades", !!p.consent.comunicaciones) + "</div></div>" +
      '<div class="cz-card cz-accesos" id="accesos"><h2>' + ic("eye") + "Quién vio tus datos</h2>" + acc.map((a) => '<div class="cz-ac">' + avatar(a.quien === "Sistema" ? "SI" : sig(a.quien), a.quien === "Sistema" ? "purple" : COL[a.entidad] || "blue", "medium") + '<div class="grow"><b>' + esc(a.quien) + "</b><span>" + esc(a.para) + "</span></div><time>" + corta(a.cuando) + "</time></div>").join("") + "</div></div>";
  }

  /* ════════ CONECTOR ════════ */
  const filaTh = () => '<div class="bc-tr bc-th"><span>Persona</span><span>Origen</span><span>Conector</span><span>Mapa de Vida</span><span>Estado</span><span>En otras entidades</span></div>';
  function otrasTxt(p) {
    const a = ajenas(p);
    if (!p.consent.entidades) return a.length || p.entidad === ENT ? '<span class="mut">No autorizado</span>' : "—";
    if (!a.length) return '<span class="mut">—</span>';
    const ents = [...new Set(a.map((s) => ent(rec(s.recurso).entidad).nombre))];
    return a.length + " recurso" + (a.length > 1 ? "s" : "") + ' · <span class="mut">' + esc(ents.join(", ")) + "</span>";
  }
  const fila = (p) => '<a class="bc-tr" href="#/persona/' + esc(p.id) + '" data-p="' + esc(p.id) + '"><span><b>' + esc(nom(p)) + '</b><br><span class="mut" style="font-size:13px">' + esc(p.id) + "</span></span>" +
    "<span>" + tag(p.origen === "autorregistro" ? "Autorregistro" : "Conector", p.origen === "autorregistro" ? "caution" : "neutral") + "</span>" +
    '<span data-l="Conector">' + (p.conector ? esc(con(p.conector).nombre) : '<span class="bc-pend">Por asignar</span>') + "</span>" +
    '<span data-l="Mapa">' + mini(p.mapa) + (p.mapaTipo === "corto" ? ' <span class="mut" style="font-size:12px">corto</span>' : "") + "</span>" +
    '<span data-l="Estado">' + esc(p.estado) + '</span><span data-l="Otras entidades">' + otrasTxt(p) + "</span></a>";

  /* Barra r/a/v del Mapa de Vida; sin datos es un trazo gris. */
  const kzBarra = (m) => {
    const c = { r: 0, a: 0, v: 0 }; Object.values(m || {}).forEach((v) => { if (c[v] != null) c[v]++; });
    if (!c.r && !c.a && !c.v) return '<span class="kz-bar kz-bar--vacio" role="img" aria-label="Mapa sin evaluar"></span>';
    return '<span class="kz-pin" role="img" aria-label="' + c.r + " necesitan apoyo, " + c.a + " en proceso, " + c.v + ' estables">' + ["r", "a", "v"].filter((k) => c[k]).map((k) => '<i class="' + k + '" style="flex:' + c[k] + '"></i>').join("") + "</span>";
  };
  const kFila = (p) => {
    const pend = solsDe(p.id).filter((s) => s.estado === "Pendiente").length, corto = p.mapaTipo === "corto";
    const sub = corto ? "Mapa por completar" : pend ? pend + (pend > 1 ? " solicitudes pendientes" : " solicitud pendiente") : p.estado;
    return '<a class="bc-tr kz-row" href="#/persona/' + esc(p.id) + '" data-p="' + esc(p.id) + '">' + avatar(ini(nom(p)), p.origen === "autorregistro" ? "amber" : "blue", "medium") +
      '<span class="kz-row__t"><b>' + esc(nom(p)) + '</b><span class="kz-sub' + (corto || pend ? " kz-hot" : "") + '">' + esc(sub) + "</span></span>" + kzBarra(p.mapa) + "</a>";
  };
  function kPersonas() {
    const mias = S.personas.filter((p) => p.conector === YO && p.entidad === ENT), ids = new Set(mias.map((p) => p.id));
    const porAsignar = S.personas.filter((p) => p.entidad === ENT && !p.conector).length;
    const pend = S.solicitudes.filter((s) => s.estado === "Pendiente" && ids.has(s.persona)).length;
    const apoyo = mias.filter((p) => Object.values(p.mapa || {}).includes("r")).length;
    const q = busca.trim().toLowerCase(), lista = mias.filter((p) => !q || (nom(p) + " " + p.id).toLowerCase().includes(q));
    const cifra = (n, l, cls) => '<div class="kz-stat' + (cls ? " " + cls : "") + '"><b>' + n + "</b><span>" + l + "</span></div>";
    return '<div class="bc-page kz-page kz-lista"><div class="kz-head"><div><span class="kz-eyebrow">' + esc(ent(ENT).nombre) + "</span><h1>Mis personas</h1></div>" +
      '</div>' +
      '<div class="kz-stats">' + cifra(mias.length, "Activas", "kz-stat--dark") + cifra(pend, "Pendientes") + cifra(apoyo, "Por apoyar", apoyo ? "kz-stat--alert" : "") + "</div>" +
      (porAsignar ? '<div class="kz-aviso">' + ic("bell") + "<span>" + porAsignar + (porAsignar > 1 ? " autorregistros esperan" : " autorregistro espera") + " conector.</span></div>" : "") +
      '<label class="kz-search kz-search--s">' + ic("search") + '<span class="sr">Buscar persona</span><input id="f-busca" type="search" data-busca placeholder="Buscar" value="' + esc(busca) + '" autocomplete="off"></label>' +
      '<div class="kz-list">' + (lista.length ? lista.map(kFila).join("") : '<p class="kz-vacio">Nadie coincide con la búsqueda.</p>') + "</div></div>";
  }
  const PASOS_CON = ["Búsqueda", "Consentimiento", "Perfil", "Mapa de Vida", "Recursos"];
  /* Cabecera de app nativa del registro: cerrar o atrás, cinco segmentos y contador. */
  const kzTop = (pos, atras) => '<div class="kz-top"><a class="kz-round" href="' + (pos ? atras : "#/personas") + '" aria-label="' + (pos ? "Atrás" : "Cerrar") + '">' + ic(pos ? "chevron-left" : "close") + "</a>" +
    '<div class="kz-seg" role="img" aria-label="Paso ' + (pos + 1) + ' de 5">' + PASOS_CON.map((x, i) => '<i class="' + (i <= pos ? "on" : "") + '"></i>').join("") + '</div><span class="kz-cnt">' + (pos + 1) + "/5</span></div>";
  const kzW = (paso, html) => '<div class="kz-wizwrap">' + kzTop(paso <= 3 ? paso - 1 : 3, "#/registrar/" + (paso - 1)) + html + "</div>";
  function kzBuscar() {
    const r = D.busqueda, p = r && r.p;
    const res = !r ? "" : p
      ? '<div class="kz-match">' + alerta("Ya existe · no se duplica", "warning") + '<div class="kz-match__p">' + avatar(ini(nom(p)), "amber", "large") + '<div class="grow"><b>' + esc(nom(p)) + '</b><span class="kz-id">' + esc(p.id) + "</span></div></div>" +
        '<div class="kz-tiles"><div><span>Le atiende</span><b>' + esc(ent(p.entidad).nombre) + "</b></div><div><span>Conector</span><b>" + (p.conector ? esc(con(p.conector).nombre) : "Por asignar") + "</b></div></div>" +
        (p.entidad === ENT ? "" : '<p class="kz-nota">Su caso lo lleva otra entidad: debe autorizar compartirlo.</p>') + "</div>"
      : '<div class="kz-match">' + alerta("Sin coincidencias. Puedes crear el expediente.", "positive") + "</div>";
    const pie = p ? btn("Abrir su ficha", { href: "#/persona/" + p.id, size: "large" }) + btn("Es otra persona", { v: "mute", size: "large", act: "con-1", a: { id: "btn-sig" } })
      : btn("Continuar", { size: "large", act: "con-1", iconEnd: "arrow-right", a: { id: "btn-sig" } });
    return '<div class="kz-wizwrap kz-buscar">' + kzTop(0) + "<h1>¿Ya tiene expediente?</h1>" +
      '<label class="kz-search kz-search--l">' + ic("search") + '<span class="sr">Teléfono o documento</span><input id="f-q" type="text" inputmode="tel" data-q value="' + esc(D.q) + '" placeholder="+34 600 000 000" autocomplete="off">' +
      (D.q ? '<button type="button" class="kz-clear" data-act="k-borrar" aria-label="Borrar">' + ic("close") + "</button>" : "") + "</label>" + res +
      '<div class="kz-try">' + btn("Probar con un número nuevo", { v: "mute", size: "small", icon: "sparkles", act: "probar", a: { "data-v": "nuevo" } }) + btn("Probar con uno que ya existe", { v: "mute", size: "small", icon: "sparkles", act: "probar", a: { "data-v": "+34 688 219 774" } }) + "</div>" +
      '<div class="kz-foot">' + pie + "</div></div>";
  }
  const KZ_ICO = { "Vivienda": "home", "Documentación y Trámites": "file-text", "Alimentación": "cart", "Ingresos": "wallet", "Movilidad": "car", "Competencias Digitales": "laptop", "Empleo": "hand-money", "Formación": "checklist-pen" };
  function kzRecursos() {
    const sug = sugeridos().filter((x, i, a) => a.findIndex((y) => y.r.id === x.r.id) === i), nec = [];
    sug.forEach(({ d }) => { if (!nec.some((x) => x.n === d.n)) nec.push(d); });
    const tarjeta = ({ r, d }) => {
      const on = D.recursos.includes(r.id), mio = r.entidad === ENT;
      return '<div class="bc-opt kz-rec' + (on ? " on" : "") + '" data-act="chk" data-rec="' + r.id + '"><div class="nwt-checkbox' + (on ? " nwt-checkbox--checked" : "") + '" role="checkbox" nwt-size="medium" aria-checked="' + on + '" tabindex="0">' +
        '<span class="kz-rec__ico' + (mio ? "" : " kz-rec__ico--der") + '">' + ic(KZ_ICO[r.cat] || "hands-heart") + '</span><span class="nwt-checkbox__label kz-rec__t">' + esc(r.nombre) + '<span class="kz-rec__m"><span class="kz-who' + (mio ? "" : " kz-who--der") + '">' + (mio ? "Tu entidad" : "Derivación") + "</span>" +
        (r.urg === "Urgente" ? "Urgente · 24 h" : esc(r.modo) + (r.modo === "Solicitud" ? " · 5 días" : "")) + " · " + (proxTxt(r) ? "Desde " + esc(proxTxt(r)) : esc(cuandoTxt(r))) + '</span><span class="sr">Necesidad: ' + esc(d.n) + "</span></span>" +
        '<div class="nwt-checkbox__control">' + ic("positive") + "</div></div></div>";
    };
    return '<div class="kz-wizwrap kz-sugs">' + kzTop(4, "#/registrar/7") + "<h1>Recursos para " + esc(D.datos.nombre || "la persona") + "</h1>" +
      (nec.length ? '<div class="kz-chips">' + nec.sort((x, y) => (x.v === "r" ? 0 : 1) - (y.v === "r" ? 0 : 1)).slice(0, 4).map((d) => '<span class="kz-chip kz-chip--' + d.v + '"><i></i>' + esc(d.n) + "</span>").join("") + (nec.length > 4 ? '<span class="kz-chip kz-chip--n">+' + (nec.length - 4) + "</span>" : "") + "</div>" : "") +
      '<div class="bc-ejemplo">' + btn("Completar con datos de ejemplo", { v: "quiet", size: "small", icon: "sparkles", act: "ejemplo", a: { "data-k": "recursos" } }) + "</div>" +
      '<div class="kz-reclist">' + (sug.length ? sug.map(tarjeta).join("") : '<p class="kz-vacio">Sin necesidades marcadas: no hay recursos.</p>') + "</div>" +
      '<details class="kz-det"><summary>Añadir nota interna</summary><div class="nwt-text-area" nwt-size="medium"><div class="nwt-input-box"><div class="nwt-input-box__content"><label class="nwt-input-box__label" for="f-notas">Solo la ve tu entidad</label><div class="nwt-input-box__control"><textarea id="f-notas" class="nwt-text-area__input" rows="2" data-notas>' + esc(D.notas) + "</textarea></div></div></div></div></details>" +
      '<div class="kz-foot">' + btn("Asignar itinerario", { size: "large", act: "con-crear", a: { id: "btn-sig" } }) + "</div></div>";
  }
  function kRegistrar(paso) {
    if (!D || D.tipo !== "con") D = nuevo("con");
    return paso === 1 ? kzBuscar() : paso >= 8 ? kzRecursos() : kzW(paso, kRegistrarWiz(paso));
  }
  function kRegistrarWiz(paso) {
    const pos = paso <= 3 ? paso - 1 : paso <= 7 ? 3 : 4;
    const b = { eyebrow: "Registrar persona", pasos: PASOS_CON, pos };
    if (paso === 2) return wiz(Object.assign(b, { titulo: "Consentimientos", sub: "Sin los dos obligatorios el proceso termina y no se registra nada.", cuerpo: vConsent(false), atras: "#/registrar/1", act: "con-2", extra: btn("Cancelar", { v: "quiet", theme: "negative", act: "no-acepta" }) }));
    if (paso === 3) return wiz(Object.assign(b, { titulo: "Perfil básico", sub: "El número de expediente, la fecha de alta, la entidad y el conector los pone el sistema.", cuerpo: vDatos(false), atras: "#/registrar/2", act: "con-3", ejemplo: "datos" }));
    if (paso >= 4 && paso <= 7) {
      const bl = CAT.bloques[paso - 4];
      return wiz(Object.assign(b, { titulo: "Mapa de Vida · " + bl.nombre, sub: "Bloque " + (paso - 3) + " de 4. Lee la pregunta y marca la respuesta de la persona.", cuerpo: vMapa(CAT.dimensiones.filter((d) => d.b === bl.id)), atras: "#/registrar/" + (paso - 1), act: "con-mapa", ejemplo: "mapa" }));
    }
    return "";
  }
  function sugeridos() {
    const out = [];
    CAT.dimensiones.forEach((d) => { const v = D.mapa[d.id]; if (v === "r" || v === "a") S.recursos.filter((r) => r.cat === d.cat && !r.pausado).forEach((r) => out.push({ r, d: { n: d.n, v } })); });
    const peso = (x) => (x.d.v === "r" ? 0 : 10) + (x.r.urg === "Urgente" ? 0 : 2) + (x.r.entidad === ENT ? 0 : 1);
    return out.sort((a, b) => peso(a) - peso(b));
  }
  function kListo(id) {
    const p = per(id); if (!p) return kPersonas();
    const sols = solsDe(p.id);
    return '<div class="kz-wizwrap kz-listo"><div class="kz-ok" role="img" aria-label="Expediente creado"><i><b>' + ic("check") + "</b></i></div>" +
      '<div class="kz-listo__t"><h1>Expediente creado</h1><p>' + esc(nom(p)) + ' · <span class="kz-id">' + esc(p.id) + "</span></p></div>" +
      card(sols.length ? sols.map((s) => { const r = rec(s.recurso); return '<div class="kz-it"><span class="kz-dot' + (r.entidad === ENT ? "" : " kz-dot--der") + '"></span><div class="grow"><b>' + esc(r.nombre) + "</b><span>" + (r.entidad === ENT ? "Tu entidad" : "Va a la bandeja de " + esc(ent(r.entidad).nombre)) + "</span></div>" + st(s.estado) + "</div>"; }).join("") : '<p class="kz-vacio">Sin recursos asignados todavía.</p>', { id: "itinerario-nuevo", cls: "kz-card" }) +
      '<p class="kz-sub kz-fam-l">¿Viene con familia? <a href="#/persona/' + esc(p.id) + '/familiar">Agrega a sus familiares</a>.</p>' +
      '<div class="kz-foot">' + btn("Ver ficha", { href: "#/persona/" + p.id, size: "large" }) + btn("Registrar otra persona", { v: "mute", size: "large", act: "empezar-con" }) + "</div></div>";
  }
  function kRed() {
    return '<div class="bc-page kz-page stack"><div class="kz-head"><div><span class="kz-eyebrow">Catálogo</span><h1>Recursos de entidades</h1></div></div>' +
      S.entidades.map((e) => S.recursos.filter((r) => r.entidad === e.id && !r.pausado).map((r) => card('<span class="kz-ent">' + ic("building") + esc(e.nombre) + " · " + esc(e.zona) + '</span><div class="bc-item"><div class="grow"><div class="t">' + esc(r.nombre) + '</div><div class="s">' + esc(r.cat) + " · " + esc(cuandoTxt(r)) + (proxTxt(r) ? " · próxima " + esc(proxTxt(r)) : "") + (r.cupo ? " · " + r.cupo + " plazas" : "") + '</div></div><span class="row" style="gap:6px">' + tag("Acceso: " + r.modo) + tag(r.urg, r.urg === "Urgente" ? "warning" : "neutral") + "</span></div>", { cls: "kz-recurso" })).join("")).join("") + "</div>";
  }

  /* ════════ ENTIDAD ════════ */
  let filtro = "todas", busca = "", rechazando = null, btab = "asignar", asignando = null, conSel = null, ezSel = null, qL = "", fL = "todas", vL = null; let fCons = [], conOp = false; let vCon = "cards"; let vSol = "cards"; let aprobando = null, verMiCon = false; const solCol = new Set(); const solAb = new Set(); let popOp = false;
  /* Ícono y tinte por necesidad: el color solo ayuda a reconocerla, el nombre siempre va escrito. */
  const EZ_IC = { "Vivienda": "home", "Ingresos": "banknote", "Alimentación": "shopping-bag", "Salud y Bienestar": "favorite", "Documentación y Trámites": "file-text", "Red de Apoyo": "handshake", "Familia": "users-group", "Infancia y Menores": "users", "Mujer y Cuidados": "hands-heart", "Empleo": "employees", "Formación": "learning", "Movilidad": "car", "Competencias Digitales": "laptop", "Autonomía Personal y Cuidados": "accessibility", "Organización y Dirección": "clipboard-check", "Participación y Comunidad": "megaphone" };
  const EZ_AV = ["orange", "blue", "teal", "pink"];
  const ezCat = (c) => ({ ic: EZ_IC[c] || "shapes", t: Math.max(0, CATS.indexOf(c)) % 4, n: (CAT.dimensiones.find((d) => d.cat === c) || { n: c }).n });
  const ezIco = (c, nombreIc, t) => { const k = c ? ezCat(c) : { ic: nombreIc, t: t || 0 }; return '<span class="ez-ico ez-t' + k.t + '">' + ic(k.ic) + "</span>"; };
  /* Tras una acción que repinta, el foco vuelve al control pulsado para quien navega con teclado. */
  const ezRe = (sel) => { render(); const n = document.querySelector(sel); if (n) n.focus(); };
  const ezAnillo = (f, tam, trazo, texto, aria, color) => {
    const r = (tam - trazo) / 2, c = 2 * Math.PI * r, m = tam / 2;
    return '<svg class="ez-ring" width="' + tam + '" height="' + tam + '" viewBox="0 0 ' + tam + " " + tam + '" role="img" aria-label="' + esc(aria) + '"><circle cx="' + m + '" cy="' + m + '" r="' + r + '" fill="none" stroke="#ECEDF2" stroke-width="' + trazo + '"/><circle cx="' + m + '" cy="' + m + '" r="' + r + '" fill="none" style="stroke:' + (color || "var(--bc-acc)") + '" stroke-width="' + trazo + '" stroke-linecap="round" stroke-dasharray="' + (c * Math.min(1, f)).toFixed(1) + " " + c.toFixed(1) + '" transform="rotate(-90 ' + m + " " + m + ')"/><text x="' + m + '" y="' + (m + tam * 0.08) + '" text-anchor="middle" font-size="' + Math.round(tam * 0.22) + '" font-weight="700" fill="#16172B">' + esc(texto) + "</text></svg>";
  };
  function eResumen() {
    const mias = S.personas.filter((p) => p.entidad === ENT), porAsignar = mias.filter((p) => !p.conector), entrantes = entrantesDe();
    const comparten = mias.filter((p) => p.consent.entidades).length, usan = mias.filter((p) => ajenas(p).length && p.consent.entidades).length;
    const recs = S.recursos.filter((r) => r.entidad === ENT), activos = recs.filter((r) => !r.pausado);
    const hoyTxt = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }), h = new Date().getHours();
    const cola = porAsignar.map((p) => ({ ico: ezIco(null, "user", 0), t: nom(p), s: "Autorregistro · " + fecha(p.alta), cta: "Revisar", v: "asignar", id: p.id }))
      .concat(entrantes.map((s) => { const r = rec(s.recurso); return { ico: ezIco(r.cat), t: r.nombre, s: s.por === ENT ? "Postulada por tu entidad" : s.por === "persona" ? "Pedida por la persona" : "Derivación de " + ent(s.por).nombre, cta: "Revisar", v: "solicitudes", id: s.id }; })).concat(porVerificar().map((f) => ({ ico: ezIco(null, "users-group", 1), t: f.nombre + " " + f.apellidos, s: "Familiar de " + nom(per(f.titular)) + " · por verificar", cta: "Verificar", v: "verificar", id: f.id }))).concat((S.comunicados || []).filter((c) => c.estado === "Por aprobar" && c.firma.id === ENT).map((c) => ({ ico: ezIco(null, "megaphone", 2), t: c.asunto, s: "Comunicado de " + c.autorNombre + " · por aprobar", cta: "Revisar", v: "comunicados", id: c.id }))).slice(0, 5);
    const ocup = activos.filter((r) => r.cupo).slice(0, 3);
    return '<div class="bc-page stack"><div class="ez-head"><div><p class="ez-fecha">' + esc(hoyTxt[0].toUpperCase() + hoyTxt.slice(1)) + "</p><h1>" + (h < 13 ? "Buenos días" : h < 21 ? "Buenas tardes" : "Buenas noches") + '</h1></div><span class="ez-solo">' + ic("lock") + "Solo lo ve tu entidad</span></div>" +
      '<div class="kpis"><a class="ez-kpi" href="#/personas/solicitudes"><span class="ez-kpi__t">Por decidir<span class="ez-kpi__go" aria-hidden="true">' + ic("arrow-right") + '</span></span><span class="ez-kpi__n">' + (porAsignar.length + entrantes.length) + "</span></a>" +
      stat("Personas", mias.filter((p) => p.estado !== "Cerrado").length, "#/personas") + stat("Esperan conector", porAsignar.length, "#/personas/asignar", "kpi-asignar") + stat("Recursos activos", activos.length, "#/recursos", "kpi-recursos") + "</div>" +
      '<div class="cols ez-cols">' +
      card(cardH("Necesita tu decisión", '<a class="bc-back" href="#/personas/solicitudes">Solicitudes</a>') + (cola.length ? cola.map((c) => '<div class="ez-fila">' + c.ico + '<div class="grow"><div class="t">' + esc(c.t) + '</div><div class="s">' + esc(c.s) + "</div></div>" + btn(c.cta, { v: "quiet", size: "small", act: "e-ir", a: { "data-v": c.v, "data-id": c.id } }) + "</div>").join("") : '<p class="mut">Todo al día.</p>')) +
      '<div class="stack">' + card('<div class="ez-red"><div class="ez-red__r">' + ezAnillo(mias.length ? comparten / mias.length : 0, 96, 12, (mias.length ? Math.round((comparten / mias.length) * 100) : 0) + "%", comparten + " de " + mias.length + " personas comparten su itinerario") + '</div><div class="grow stack-s"><h2>En la red</h2><div class="ez-kv"><span class="mut">Usan otras entidades</span><b>' + usan + '</b></div><div class="ez-kv"><span class="mut">' + ic("lock") + "Sin permiso</span><b>" + (mias.length - comparten) + "</b></div></div></div>") +
      card(cardH("Ocupación", '<a class="bc-back" href="#/recursos">Recursos</a>') + '<div class="stack-s ez-ocup">' + (ocup.length ? ocup.map((r) => { const u = usoRec(r).activas; return '<div class="ez-ocu"><div class="ez-kv"><span>' + esc(r.nombre) + "</span><b>" + u + " / " + r.cupo + '</b></div><div class="bc-bar' + (u >= r.cupo ? " ez-lleno" : "") + '" aria-hidden="true"><i style="width:' + Math.min(100, Math.round((u / r.cupo) * 100)) + '%"></i></div></div>'; }).join("") : '<p class="mut">Sin plazas limitadas.</p>') + "</div>") + "</div></div></div>";
  }
  const entrantesDe = () => S.solicitudes.filter((s) => rec(s.recurso).entidad === ENT && (s.estado === "Pendiente" || s.estado === "Falta información"));
  /* Pestañas internas de Personas: solo en móvil, donde el menú inferior no cabe con sus tres vistas. */
  const ptabs = (activo) => {
    const t = [["mis", "Mis personas", S.personas.filter((p) => p.entidad === ENT).length, "#/personas"], ["solicitudes", "Recursos solicitados", entrantesDe().length, "#/personas/solicitudes"], ["asignar", "Asignar conector", S.personas.filter((p) => p.entidad === ENT && !p.conector).length, "#/personas/asignar"]];
    t.push(["verificar", "Por verificar", porVerificar().length, "#/personas/verificar"]);
    return '<div class="nwt-tabs bc-subtabs ez-seg ez-ptabs"><div class="nwt-tabs__list" role="tablist" aria-label="Personas">' + t.map(([k, n, c, h]) => '<a class="nwt-tabs__tab' + (k === activo ? " nwt-tabs__tab--active" : "") + '" role="tab" aria-selected="' + (k === activo) + '" href="' + h + '" data-ptab="' + k + '"><span class="nwt-tabs__label"><span class="nwt-tabs__label-text">' + n + '<span class="ez-cnt"> · ' + c + "</span></span></span></a>").join("") + "</div></div>";
  };
  function ePersonas() {
    const mias = S.personas.filter((p) => p.entidad === ENT);
    const F = { todas: () => true, asignar: (p) => !p.conector, apoyo: (p) => Object.values(p.mapa || {}).includes("r"), otras: (p) => ajenas(p).length && p.consent.entidades };
    if (!F[filtro]) filtro = "todas";
    const q = busca.toLowerCase(), lista = mias.filter(F[filtro]).filter((p) => !fCons.length || fCons.includes(p.conector)).filter((p) => !q || (nom(p) + " " + p.id).toLowerCase().includes(q));
    /* Primero quien más necesita: sin conector, luego el Mapa más complicado; los cerrados al final. */
    const cuenta = (p, k) => Object.values(p.mapa || {}).filter((v) => v === k).length;
    lista.sort((x, y) => (x.estado === "Cerrado") - (y.estado === "Cerrado") || !!x.conector - !!y.conector || cuenta(y, "r") - cuenta(x, "r") || cuenta(y, "a") - cuenta(x, "a"));
    const EST = { "En seguimiento": "informative", "Abierto": "caution" };
    const red = (p) => { const a = ajenas(p); return !p.consent.entidades ? ic("lock") + "Sin permiso" : a.length ? a.length + " recurso" + (a.length > 1 ? "s" : "") : "—"; };
    const sAb = (p) => { const n = S.solicitudes.filter((x) => x.persona === p.id && rec(x.recurso).entidad === ENT && abierta(x)).length; return n ? '<span title="' + n + (n === 1 ? " solicitud abierta" : " solicitudes abiertas") + '">' + tag(n + (n === 1 ? " solicitud" : " solicitudes"), "caution") + "</span>" : ""; };
    const ezFila = (p, i) => '<a class="bc-tr ez-tr" href="#/persona/' + esc(p.id) + '" data-p="' + esc(p.id) + '"><span class="ez-per">' + avatar(ini(nom(p)), EZ_AV[i % 4], "small") + '<span><b>' + esc(nom(p)) + '</b><span class="ez-id">' + esc(p.id) + "</span></span></span>" +
      '<span data-l="Conector">' + (p.conector ? esc(con(p.conector).nombre) : '<span class="bc-pend">Por asignar</span>') + "</span><span>" + mini(p.mapa) + '</span><span class="ez-redc" data-l="En la red">' + red(p) + "</span><span class=\"ez-est\">" + tag(p.estado, EST[p.estado] || "neutral") + sAb(p) + "</span></a>";
    return '<div class="bc-page stack"><div class="ez-head"><h1>Mis personas <span class="ez-n">' + mias.length + "</span></h1></div>" + ptabs("mis") +
      '<div class="row ez-filtros" role="group" aria-label="Filtro">' + '<div class="ez-popw"><button type="button" class="bc-chip" id="btn-fcon" data-act="pop-con" aria-haspopup="true" aria-expanded="' + conOp + '" aria-pressed="' + (fCons.length > 0) + '">' + ic("user") + "<span>Conector" + (fCons.length ? " · " + fCons.length : "") + ' ▾</span></button>' +
        (conOp ? '<div class="ez-pop ez-pop--f" role="group" aria-label="Filtrar por conector">' + S.conectores.filter((c) => (c.entidades || [c.entidad]).includes(ENT)).map((c, ci) => '<label class="ez-pop__ck"><input type="checkbox" data-fcon="' + c.id + '"' + (fCons.includes(c.id) ? " checked" : "") + ">" + (c.foto ? '<img class="ez-foto ez-foto--xs" src="' + esc(c.foto) + '" alt="" width="28" height="28">' : '<span class="ez-ini ez-t' + (ci % 4) + '" aria-hidden="true">' + esc(ini(c.nombre)) + "</span>") + "<span>" + esc(c.nombre) + "</span><em>" + mias.filter((p) => p.conector === c.id).length + "</em></label>").join("") + (fCons.length ? '<button type="button" class="ez-pop__i" data-act="quitar-con">Quitar filtro</button>' : "") + "</div>" : "") + "</div>" + [["todas", "Todas"], ["asignar", "Sin conector"], ["apoyo", "Necesitan apoyo"], ["otras", "En otras entidades"]].map(([k, t]) => '<button type="button" class="bc-chip" data-act="filtro" data-v="' + k + '" aria-pressed="' + (filtro === k) + '">' + t + (k === "todas" ? "" : " · " + mias.filter(F[k]).length) + "</button>").join("") + '<div class="nwt-searchbox ez-busca" nwt-size="medium"><div class="nwt-input-box"><div class="nwt-input-box__content"><div class="nwt-input-box__control"><div class="nwt-searchbox__container">' + ic("search") + '<label class="sr" for="f-busca">Buscar persona</label><input id="f-busca" type="text" class="nwt-searchbox__input" data-busca placeholder="Nombre o número" value="' + esc(busca) + '"></div></div></div></div></div>' + "</div>" +
      '<div class="bc-tbl"><div class="bc-tr bc-th ez-tr"><span>Persona</span><span>Conector</span><span>Mapa de Vida</span><span>En la red</span><span>Estado</span></div>' + (lista.length ? lista.map(ezFila).join("") : '<div class="bc-tr ez-tr"><span class="mut">Sin resultados.</span></div>') + "</div></div>";
  }
  function eConectores() {
    const cs = S.conectores.filter((c) => (c.entidades || [c.entidad]).includes(ENT));
    const CAP = 12; /* La semilla no trae capacidad por conector: se fija una de referencia para el anillo. */
    const dat = (c) => { const ps = S.personas.filter((p) => p.conector === c.id), act = ps.filter((p) => p.estado !== "Cerrado"); return { ps, act, pend: ps.reduce((n, p) => n + solsDe(p.id).filter((x) => x.estado === "Pendiente").length, 0), hoyOn: /^hoy/i.test(c.ultima) }; };
    const foto = (c, i, tam) => c.foto ? '<img class="ez-foto' + (tam === "s" ? " ez-foto--s" : "") + '" src="' + esc(c.foto) + '" alt="Foto de ' + esc(c.nombre) + '" width="64" height="64">' : avatar(ini(c.nombre), EZ_AV[i % 4], tam === "s" ? "medium" : "large");
    const contacto = (c) => (c.doc ? "<span>" + esc(c.doc) + "</span>" : "") + (c.tel ? '<a href="tel:' + esc(c.tel.replace(/\s/g, "")) + '">' + esc(c.tel) + "</a>" : "") + (c.email ? '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>" : "");
    const chat = (c) => btn("Chat", { v: "quiet", size: "small", act: "chat", a: { "data-c": c.id } });
    const verTodas = (c, n) => btn("Ver todas · " + n, { v: "quiet", size: "small", act: "ver-con", a: { "data-c": c.id } });
    const vista = '<div class="ez-vt" role="group" aria-label="Vista">' + [["cards", "Vista de tarjetas", "view-grid"], ["lista", "Vista de lista", "view-list"]].map(([k, t, icn]) => '<button type="button" class="ez-vb" data-act="vcon" data-v="' + k + '" aria-pressed="' + (vCon === k) + '" aria-label="' + t + '" title="' + t + '">' + ic(icn) + "</button>").join("") + "</div>";
    const personas = (ps, c) => '<div class="ez-pers"><div class="ez-pers__h"><b>Personas · ' + ps.length + "</b>" + (ps.length ? btn("Ver en Personas", { v: "quiet", size: "small", act: "ver-con", a: { "data-c": c.id } }) : '<span class="mut ez-sub">Sin personas asignadas</span>') + "</div></div>";
    let cuerpo;
    if (vCon === "lista") {
      cuerpo = '<div class="bc-tbl"><div class="bc-tr bc-th ez-ct"><span>Conector</span><span>Documento</span><span>Contacto</span><span>Personas</span><span>Por decidir</span><span>Última vez</span><span></span></div>' + cs.map((c, i) => {
        const d = dat(c);
        return '<div class="bc-tr ez-ct" data-con="' + c.id + '"><span class="ez-ct__n">' + foto(c, i, "s") + "<span><b>" + esc(c.nombre) + '</b><span class="ez-sub">' + esc(c.rol) + "</span></span></span><span>" + esc(c.doc || "—") + '</span><span class="ez-ct__c">' + (c.tel ? '<a href="tel:' + esc(c.tel.replace(/\s/g, "")) + '">' + esc(c.tel) + "</a>" : "") + (c.email ? '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>" : "") + "</span><span>" + (d.ps.length > 3 ? verTodas(c, d.act.length) : d.act.length + " / " + CAP) + "</span><span>" + d.pend + "</span><span>" + esc(c.ultima.split(",")[0]) + "</span><span>" + chat(c) + "</span></div>";
      }).join("") + "</div>";
    } else {
      cuerpo = '<div class="cols ez-grid">' + cs.map((c, i) => {
        const d = dat(c);
        return card('<div class="ez-con"><div class="ez-con__h">' + foto(c, i) + '<div class="grow"><b>' + esc(c.nombre) + '</b><span class="ez-sub">' + esc(c.rol) + '</span></div><span class="ez-dot' + (d.hoyOn ? " on" : "") + '" role="img" aria-label="Última actividad: ' + esc(c.ultima) + '"></span></div>' +
          '<div class="ez-con__m">' + ezAnillo(d.act.length / CAP, 88, 10, String(d.act.length), d.act.length + " personas activas de " + CAP + " de capacidad", d.act.length / CAP > 0.7 ? "var(--bc-acc)" : "var(--bc-ink)") +
          '<div class="grow stack-s"><div class="ez-kv"><span class="mut">Personas activas</span><b>' + d.act.length + '</b></div><div class="ez-kv"><span class="mut">Por decidir</span><b>' + d.pend + '</b></div><div class="ez-kv"><span class="mut">Última vez</span><b>' + esc(c.ultima.split(",")[0]) + "</b></div></div></div>" +
          (c.doc || c.tel || c.email ? '<div class="ez-con__c"><div class="ez-con__d">' + contacto(c) + "</div>" + chat(c) + "</div>" : "") +
          personas(d.ps, c) + "</div>", { a: { "data-con": c.id } });
      }).join("") + "</div>";
    }
    return '<div class="bc-page stack"><div class="ez-head"><h1>Conectores <span class="ez-n">' + cs.length + "</span></h1>" + vista + "</div>" + cuerpo + "</div>";
  }
  const selConector = (pid) => '<label class="sr" for="sel-' + esc(pid) + '">Conector</label>' + selNative("sel-" + esc(pid), S.conectores.filter((c) => (c.entidades || [c.entidad]).includes(ENT)).map((c) => '<option value="' + c.id + '">' + esc(c.nombre) + "</option>").join(""));
  function fichaMinima(p, r) {
    const rel = CAT.dimensiones.filter((d) => d.cat === r.cat && p.mapa[d.id]), TX = { r: "apoyo", a: "en proceso", v: "estable" };
    const peor = rel.some((d) => p.mapa[d.id] === "r") ? "r" : rel.some((d) => p.mapa[d.id] === "a") ? "a" : "";
    const celda = (k, v, c) => '<div class="ez-cel' + (c ? " ez-cel--" + c : "") + '"><span>' + k + "</span><b>" + v + "</b></div>";
    return '<div class="ez-cells">' + celda("Persona", esc(p.nombre + " " + p.apellidos[0] + ".")) + celda("Zona", esc(p.municipio + " · " + p.cp)) + celda("Contacto", esc(p.canal + " · " + p.idioma)) +
      celda("Necesidad", rel.length ? rel.map((d) => esc(d.n) + " · " + TX[p.mapa[d.id]]).join(", ") : "—", peor) + '</div><div class="ez-lock">' + ic("lock") + "Ficha mínima: sin diagnóstico ni notas</div>";
  }
  function eBandeja(vista) {
    if (vista === "solicitudes") return eSolicitudes();
    const porAsignar = S.personas.filter((p) => p.entidad === ENT && !p.conector);
    const pill = (urg) => '<span class="ez-pl' + (urg ? " ez-pl--u" : "") + '">' + (urg ? "24 h" : "5 d") + "</span>";
    const rojasDe = (p) => CAT.dimensiones.filter((d) => p.mapa[d.id] === "r").map((d) => d.n);
    if (vL !== vista) { vL = vista; qL = ""; fL = "todas"; }
    const FL = [["todas", "Todas", () => true], ["urgentes", "Necesitan apoyo", (x) => rojasDe(x).length], ["normales", "Sin urgencia", (x) => !rojasDe(x).length]];
    if (!FL.some(([k]) => k === fL)) fL = "todas";
    const base = porAsignar, ql = qL.toLowerCase();
    const txt = (x) => (nom(x) + " " + x.id).toLowerCase();
    const filt = base.filter(FL.find(([k]) => k === fL)[2]).filter((x) => !ql || txt(x).includes(ql));
    const barra = filtrosBarra(FL, base, "Nombre o número");
    const items = filt.map((p) => ({ id: p.id, av: avatar(ini(nom(p)), "amber", "small"), t: nom(p), s: "Autorregistro · " + fecha(p.alta), pl: rojasDe(p).length ? pill(true) : "" }));
    const cur = items.find((i) => i.id === ezSel) || items[0];
    const lista = items.map((i) => '<button type="button" class="ez-it" aria-pressed="' + (cur && i.id === cur.id) + '" data-act="e-sel" data-id="' + esc(i.id) + '">' + i.av + '<span class="grow"><span class="ez-it__t">' + esc(i.t) + '</span><span class="ez-it__s">' + esc(i.s) + "</span></span>" + i.pl + "</button>").join("");
    let det = card('<p class="mut">' + (base.length ? "Ninguna coincide con la búsqueda." : "Nadie esperando conector.") + "</p>");
    if (cur) {
      const p = per(cur.id), rojas = rojasDe(p);
      det = card('<div class="ez-det"><div class="ez-det__h">' + avatar(ini(nom(p)), "amber", "large") + '<div class="grow"><p class="ez-sub">' + esc(p.id) + " · " + fecha(p.alta) + '</p><h2><a class="bc-plain" href="#/persona/' + esc(p.id) + '">' + esc(nom(p)) + "</a></h2>" + mini(p.mapa) + "</div>" + btn("Ver perfil completo", { v: "quiet", href: "#/persona/" + encodeURIComponent(p.id) }) + "</div>" +
        '<div class="ez-cells"><div class="ez-cel"><span>Zona</span><b>' + esc(p.municipio + " · " + p.cp) + '</b></div><div class="ez-cel"><span>Contacto</span><b>' + esc(p.canal + " · " + p.idioma) + '</b></div><div class="ez-cel' + (rojas.length ? " ez-cel--r" : "") + '"><span>Necesita apoyo</span><b>' + (rojas.length ? esc(rojas.join(", ")) : "Nada urgente") + "</b></div></div>" +
        '<div class="ez-con"><h3>Conectores recomendados</h3><ul class="ez-conl">' + S.conectores.filter((c) => (c.entidades || [c.entidad]).includes(ENT)).sort((x, y) => S.personas.filter((q) => q.conector === x.id).length - S.personas.filter((q) => q.conector === y.id).length).map((c, ci) => '<li class="ez-conr"><span class="ez-cr">' + (c.foto ? '<img class="ez-foto ez-foto--m" src="' + esc(c.foto) + '" alt="" width="44" height="44">' : '<span class="ez-ini ez-ini--m ez-t' + (ci % 4) + '" aria-hidden="true">' + esc(ini(c.nombre)) + "</span>") + '<span class="ez-cr__t"><b>' + esc(c.nombre) + (ci === 0 ? ' <span class="ez-menos">Menos carga</span>' : "") + "</b><span>" + esc(c.rol) + " · " + (n1 => n1 + (n1 === 1 ? " persona" : " personas"))(S.personas.filter((x) => x.conector === c.id).length) + "</span></span></span>" + btn("Asignar", { size: "small", act: "asignar-a", a: { "data-p": p.id, "data-c": c.id, id: "btn-asignar-" + c.id } }) + "</li>").join("") + "</ul></div>" +
        "</div>", { cls: "ez-detcard", a: { "data-asignar": p.id } });
    }
    return '<div class="bc-page stack"><h1>Asignar conector</h1>' + ptabs(vista) + barra + '<div class="ez-band"><div class="ez-izq"><h2 class="ez-lh">Personas</h2><div class="ez-lista">' + lista + '</div></div><div class="ez-der">' + det + "</div></div></div>";
  }
  const filtrosBarra = (FL, base, ph) => '<div class="row ez-filtros" role="group" aria-label="Filtro">' + FL.map(([k, t, f]) => '<button type="button" class="bc-chip" data-act="filtro2" data-v="' + k + '" aria-pressed="' + (fL === k) + '">' + t + (k === "todas" ? "" : " · " + base.filter(f).length) + "</button>").join("") +
    '<div class="nwt-searchbox ez-busca" nwt-size="medium"><div class="nwt-input-box"><div class="nwt-input-box__content"><div class="nwt-input-box__control"><div class="nwt-searchbox__container">' + ic("search") + '<label class="sr" for="f-busca2">Buscar</label><input id="f-busca2" type="text" class="nwt-searchbox__input" data-busca2 placeholder="' + ph + '" value="' + esc(qL) + '"></div></div></div></div></div></div>';

  /* ── Solicitudes de recursos: una tarjeta por persona con todo lo que pide a la entidad ── */
  const ACTIVAS = ["Aprobada", "Pendiente", "En lista de espera", "Falta información"];
  const abierta = (s) => s.estado === "Pendiente" || s.estado === "Falta información";
  const dimDe = (r) => CAT.dimensiones.find((d) => d.cat === r.cat);
  const habiles = (a, b) => { let n = 0; const d = new Date(a + "T00:00"), f = new Date(b + "T00:00"); while (d < f) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) n++; } return n; };
  const spPlazo = (s) => {
    if (s.estado === "Falta información") return { t: "Plazo en pausa hasta que responda", venc: false, q: 99 };
    const q = (rec(s.recurso).urg === "Urgente" ? 1 : 5) - habiles(s.fecha, hoy());
    return q < 0 ? { t: "Plazo vencido hace " + -q + (q === -1 ? " día hábil" : " días hábiles"), venc: true, q } : { t: q === 0 ? "Vence hoy" : "Quedan " + q + (q === 1 ? " día hábil" : " días hábiles"), venc: false, q };
  };
  /* Única fuente de las dos reglas: «similar» solo informa; «bloqueo» quita Aprobar.
     Lo de otras entidades solo cuenta si la persona autorizó compartir. */
  const avisosSol = (s) => {
    const r = rec(s.recurso), p = per(s.persona), u = usoRec(r), otras = solsDe(p.id).filter((x) => x.id !== s.id && ACTIVAS.includes(x.estado));
    const ve = (x) => rec(x.recurso).entidad === ENT || x.por === ENT || !!p.consent.entidades;
    const similar = otras.filter((x) => rec(x.recurso).cat === r.cat && ve(x));
    const previa = otras.find((x) => x.recurso === r.id && (!abierta(x) || x.fecha < s.fecha || (x.fecha === s.fecha && x.id < s.id)));
    const mismaNec = otras.find((x) => rec(x.recurso).cat === r.cat);
    const famDup = (s.acompanantes || []).map(per).filter(Boolean).find((f) => enCursoDe(f.id, r, s.id));
    const bloqueo = !abierta(s) ? null
      : r.pausado ? { k: "pausa", t: "El recurso está pausado y no admite personas nuevas." }
      : previa ? { k: "duplicada", t: "Ya tiene otra solicitud activa a este recurso (" + previa.estado.toLowerCase() + ")." }
      : mismaNec ? { k: "necesidad", t: "Ya tiene una solicitud de " + r.cat + " en curso. No se puede pedir lo mismo en dos lugares a la vez." }
      : famDup ? { k: "necesidad", t: famDup.nombre + " ya tiene " + r.cat + " en curso. No se pide lo mismo en dos lugares a la vez." }
      : r.cupo && u.libres < plazasDe(s) ? { k: "cupo", caben: u.libres, t: plazasDe(s) > 1 ? "Necesita " + plazasDe(s) + " plazas (va con " + vaCon(s) + ") y quedan " + u.libres + "." : "Las " + r.cupo + " plazas están ocupadas. Solo puede pasar a lista de espera." } : null;
    return { similar, bloqueo };
  };
  const SP_SEM = { r: ["Necesita apoyo", "caution"], a: ["En camino", "clock"], v: ["Estable", "check-circle"] };
  const SP_EST = { "Aprobada": ["aprobado", "aprobados"], "Pendiente": ["pendiente", "pendientes"], "En lista de espera": ["en lista de espera", "en lista de espera"], "Falta información": ["a falta de información", "a falta de información"] };
  const spLockRed = '<div class="sp-lock" data-aviso="sin-permiso">' + ic("lock") + "<span>No ves si tiene recursos en otras entidades: no autorizó compartir su itinerario.</span></div>";
  /* Un aviso por categoría: separa lo que pide ahora a la vez de lo que ya tiene activo. */
  const spAvisos = (abiertas) => {
    const ids = new Set(abiertas.map((s) => s.id)), porCat = {};
    abiertas.forEach((s) => avisosSol(s).similar.forEach((x) => { const c = rec(x.recurso).cat; (porCat[c] = porCat[c] || new Map()).set(x.id, x); }));
    const frases = Object.entries(porCat).map(([c, m]) => {
      const n = ezCat(c).n, todas = [...m.values()], aqui = todas.filter((x) => ids.has(x.id)), cuenta = {}, partes = [];
      if (aqui.length > 1) partes.push("Pide " + aqui.length + " recursos de " + n + " a tu entidad a la vez");
      todas.filter((x) => !ids.has(x.id)).forEach((x) => { const k = x.estado + "|" + rec(x.recurso).entidad; cuenta[k] = (cuenta[k] || 0) + 1; });
      Object.entries(cuenta).forEach(([k, q]) => { const [e, en] = k.split("|"); partes.push((partes.length ? "ya tiene " : "Ya tiene ") + q + (q === 1 ? " recurso de " : " recursos de ") + n + " " + SP_EST[e][q === 1 ? 0 : 1] + " en " + (en === ENT ? "tu entidad" : esc(ent(en).nombre))); });
      return partes.join(" y ") + ".";
    }).filter((f) => f.length > 1);
    const tx = frases.join(" ") + " Es informativo: puedes decidir igualmente.";
    return frases.length ? '<span class="sp-tag" data-aviso="similar" tabindex="0" title="' + tx + '" aria-label="Recurso similar. ' + tx + '">' + ic("info-circle") + "Solicita varios recursos similares</span>" : "";
  };
  /* Un solo nombre por persona: el corto de la ficha mínima si es de otra entidad. */
  const spNombre = (p) => p.entidad === ENT ? nom(p) : p.nombre + " " + p.apellidos[0] + ".";
  /* Panel igual para toda persona: la identidad va en el encabezado; aquí solo origen y necesidad ligada a lo que pide. */
  function spLinea(g) {
    const p = g.p, mia = p.entidad === ENT, ORD = { r: 0, a: 1 };
    const nec = [...new Set(g.ab.concat(g.de).map((s) => (dimDe(rec(s.recurso)) || {}).id))].map((id) => CAT.dimensiones.find((d) => d.id === id))
      .filter((d) => d && ORD[p.mapa[d.id]] != null).sort((x, y) => ORD[p.mapa[x.id]] - ORD[p.mapa[y.id]]).slice(0, 2);
    return '<div class="sp-linea"><span>' + ic("building") + (mia ? "Tu entidad" + (p.conector ? " · Conector: " + esc(con(p.conector).nombre) : " · Sin conector") : esc(ent(p.entidad).nombre)) + "</span>" +
      nec.map((d) => '<span class="sp-dim sp-dim--' + p.mapa[d.id] + '">' + ic(SP_SEM[p.mapa[d.id]][1]) + esc(d.n) + " · " + SP_SEM[p.mapa[d.id]][0] + "</span>").join("") +
      spAvisos(g.ab) + (vSol === "lista" ? btn(mia ? "Ver perfil" : "Ver ficha mínima", { v: "quiet", size: "small", href: "#/persona/" + encodeURIComponent(p.id) }) : "") + (mia ? "" : '<span class="sp-minima" data-aviso="ficha-minima">' + ic("lock") + "Ficha mínima</span>") + "</div>";
  }
  function spFila(s, p) {
    const r = rec(s.recurso), d = dimDe(r), v = d && p.mapa[d.id], pz = spPlazo(s), u = usoRec(r), { bloqueo } = avisosSol(s), op = popOp === s.id;
    const cab = '<div class="sp-sol__h">' + (d ? gi(d) : ezIco(r.cat)) + '<div class="grow"><h3>' + esc(r.nombre) + '</h3><p class="sp-meta">' + (s.por === ENT ? "Postulada por tu entidad" : s.por === "persona" ? "Pedida por la persona" : "Derivada por " + esc(ent(s.por).nombre)) + " · " + fecha(s.fecha) + ((s.acompanantes || []).length ? " · va con " + esc(vaCon(s)) : "") + "</p></div>" + (s.estado === "Pendiente" ? "" : st(s.estado)) + "</div>";
    const chips = '<div class="sp-chips">' + (v ? '<span class="sp-chip sp-chip--' + v + '">' + ic(SP_SEM[v][1]) + "Responde a " + esc(d.n) + ": " + SP_SEM[v][0].toLowerCase() + "</span>" : "") +
      '<span class="sp-chip' + (pz.venc ? " sp-chip--r" : "") + '">' + ic(pz.venc ? "caution" : "clock") + pz.t + "</span>" +
      (r.cupo ? '<span class="sp-chip' + (u.libres ? "" : " sp-chip--r") + '" data-plazas="' + u.libres + '">' + ic("users") + (u.libres ? u.libres + " de " + r.cupo + " plazas libres" : "Sin plazas libres · " + r.cupo + " de " + r.cupo + " ocupadas") + "</span>" : "") + "</div>";
    const item = (t, a, neg) => '<button type="button" role="menuitem" class="ez-pop__i' + (neg ? " ez-pop__i--neg" : "") + '"' + a + ">" + t + "</button>";
    const menu = () => '<div class="ez-popw sp-popw">' + btn("Otras opciones", { v: "quiet", act: "pop-dec", iconEnd: "chevron-down", a: Object.assign({ "data-s": s.id, "aria-haspopup": "menu", "aria-expanded": String(op), id: "btn-otras-" + s.id }, op ? { "aria-controls": "pop-" + s.id } : {}) }) +
      (op ? '<div class="ez-pop" id="pop-' + s.id + '" role="menu" aria-label="Otras decisiones sobre ' + esc(r.nombre) + '">' +
        (s.estado !== "En lista de espera" ? item("Lista de espera", ' data-act="decidir" data-s="' + s.id + '" data-e="En lista de espera"') : "") +
        (s.estado === "Pendiente" ? item("Pedir información", ' data-act="decidir" data-s="' + s.id + '" data-e="Falta información"') : "") +
        item("Rechazar", ' data-act="rechazar-ab" data-s="' + s.id + '"', true) + "</div>" : "") + "</div>";
    let acc;
    if (rechazando === s.id) {
      const id = "mot-" + s.id;
      acc = '<div class="sp-rech" role="group" aria-labelledby="rt-' + s.id + '"><p class="sp-rech__t" id="rt-' + s.id + '">Rechazar ' + esc(r.nombre) + "</p>" +
        '<label for="' + id + '">Motivo del rechazo (obligatorio)</label>' + selNative(id, '<option value="">Selecciona un motivo…</option><option>No cumple los requisitos de acceso</option><option>Fuera del territorio del recurso</option><option>El recurso no responde a la necesidad</option><option>Sin plazas disponibles</option>', "", ' required aria-required="true" aria-describedby="' + id + '-h" data-mot="' + s.id + '"') +
        '<div class="sp-hint" id="' + id + '-h">' + ic("caution") + "<span>Sin motivo no se puede confirmar. " + (s.por === ENT ? "El conector" : s.por === "persona" ? "La persona" : esc(ent(s.por).nombre)) + " lo recibirá para buscar otro recurso.</span></div>" +
        '<label for="txt-' + s.id + '">Mensaje para quien postuló (opcional)</label><textarea id="txt-' + s.id + '" class="sp-txt"></textarea>' +
        '<div class="sp-act">' + btn("Confirmar rechazo", { theme: "negative", icon: "close-circle", act: "rechazar", a: { "data-s": s.id, disabled: "" } }) + btn("Cancelar", { v: "quiet", act: "rechazar-cancel", a: { "data-s": s.id } }) + "</div></div>";
    } else if (bloqueo) {
      const nd = '<div class="sp-nodisp" data-bloqueo="' + bloqueo.k + '">' + ic("lock") + "<span><b>No disponible.</b> " + esc(bloqueo.t) + "</span></div>";
      acc = nd + '<div class="sp-act" role="group" aria-label="Decidir ' + esc(r.nombre) + '">' + (bloqueo.k === "cupo"
        ? btn("Pasar a lista de espera" + (plazasDe(s) > 1 ? " a todos" : ""), { icon: "clock", act: "decidir", a: { "data-s": s.id, "data-e": "En lista de espera" } }) + (bloqueo.caben > 0 && plazasDe(s) > 1 ? btn("Aprobar a los que caben (" + bloqueo.caben + ")", { v: "quiet", icon: "check", act: "aprobar-caben", a: { "data-s": s.id } }) : "")
        : menu()) + "</div>";
    } else {
      acc = '<div class="sp-act" role="group" aria-label="Decidir ' + esc(r.nombre) + '">' + btn("Aprobar", { icon: "check", act: "aprobar-ab", a: { "data-s": s.id } }) + menu() + "</div>";
    }
    return '<li class="sp-sol' + (pz.venc ? " sp-sol--venc" : "") + (bloqueo ? " sp-sol--nd" : "") + '" data-sol="' + s.id + '">' + cab + chips + acc + "</li>";
  }
  const spDecidida = (s) => {
    const r = rec(s.recurso), d = dimDe(r);
    return '<div class="sp-decr" data-dec="' + s.id + '">' + (d ? gi(d) : ezIco(r.cat)) + '<div class="grow"><b>' + esc(r.nombre) + "</b>" + (typeof s.decidida === "string" ? ' <span class="mut">· decidida el ' + fecha(s.decidida) + "</span>" : "") +
      (s.motivo ? '<div class="sp-motivo">' + ic("close-circle") + "<span><b>Motivo:</b> " + esc(s.motivo) + "</span></div>" : "") + "</div>" + st(s.estado) + "</div>";
  };
  /* Solicitudes de una persona a tu entidad: la misma pieza en Recursos solicitados y en su ficha. */
  const spGrupo = (p) => { const deMi = S.solicitudes.filter((s) => s.persona === p.id && rec(s.recurso).entidad === ENT); return { p, ab: deMi.filter(abierta).sort((a, b) => spPlazo(a).q - spPlazo(b).q), de: deMi.filter((s) => s.decidida) }; };
  const spSols = (g) => '<section class="sp-sols" aria-label="Solicitudes de ' + esc(spNombre(g.p)) + '">' + (g.p.consent.entidades ? "" : spLockRed) +
    (g.ab.length ? '<h3 class="sp-h4">Por decidir · ' + g.ab.length + '</h3><ul class="sp-lista">' + g.ab.map((s) => spFila(s, g.p)).join("") + "</ul>" : '<p class="sp-mas">Todo decidido con esta persona.</p>') +
    (g.de.length ? '<details class="sp-dec" open><summary>Ya decididas con esta persona · ' + g.de.length + ic("chevron-down") + "</summary>" + g.de.map(spDecidida).join("") + "</details>" : "") + "</section>";
  function eSolicitudes() {
    if (vL !== "solicitudes") { vL = "solicitudes"; qL = ""; fL = "todas"; }
    const deMi = S.solicitudes.filter((s) => rec(s.recurso).entidad === ENT), abiertas = deMi.filter(abierta);
    /* Quien ya no tiene nada abierto sigue visible el día que se decidió: el historial no desaparece al decidir. */
    const ids = [...new Set(abiertas.map((s) => s.persona).concat(deMi.filter((s) => s.decidida === hoy()).map((s) => s.persona)))];
    const minQ = (g) => g.ab.length ? Math.min(...g.ab.map((s) => spPlazo(s).q)) : 1e9;
    const grupos = ids.map((id) => ({ p: per(id), ab: abiertas.filter((s) => s.persona === id).sort((a, b) => spPlazo(a).q - spPlazo(b).q), de: deMi.filter((s) => s.persona === id && s.decidida) })).filter((g) => g.p).sort((x, y) => minQ(x) - minQ(y));
    const FL = [["todas", "Todas", () => true], ["vencidas", "Fuera de plazo", (g) => g.ab.some((s) => spPlazo(s).venc)], ["varias", "Piden varios recursos", (g) => g.ab.length > 1], ["otras", "De otras entidades", (g) => g.p.entidad !== ENT]];
    if (!FL.some(([k]) => k === fL)) fL = "todas";
    const ql = qL.toLowerCase(), txt = (g) => (nom(g.p) + " " + g.p.id + " " + g.ab.concat(g.de).map((s) => rec(s.recurso).nombre).join(" ")).toLowerCase();
    const vis = grupos.filter(FL.find(([k]) => k === fL)[2]).filter((g) => !ql || txt(g).includes(ql));
    const lista = vSol === "lista", abierta2 = (g) => lista ? solAb.has(g.p.id) : !solCol.has(g.p.id);
    /* El encabezado es la única identidad de la tarjeta; en vista de lista además la abre y la cierra. */
    const fila = (g) => {
      const ab = abierta2(g), n = g.ab.length, id = esc(g.p.id);
      const ident = avatar(ini(nom(g.p)), g.p.entidad === ENT ? "blue" : "teal") + '<span class="sp-row__n"><b id="h-' + id + '">' + esc(spNombre(g.p)) + "</b><small>" + id + "</small></span>";
      if (!lista) return '<div class="sp-row sp-row--fija"><button type="button" class="sp-row__tg" data-act="sol-plegar" data-p="' + id + '" aria-expanded="' + ab + '" aria-controls="b-' + id + '">' + ident + "</button>" +
        btn(g.p.entidad === ENT ? "Ver perfil" : "Ver ficha mínima", { v: "quiet", size: "small", href: "#/persona/" + encodeURIComponent(g.p.id) }) +
        '<button type="button" class="sp-row__ch" data-act="sol-plegar" data-p="' + id + '" aria-expanded="' + ab + '" aria-label="' + (ab ? "Plegar" : "Desplegar") + '">' + ic("chevron-down") + "</button></div>";
      const inner = ident + (!ab && n ? '<span class="sp-row__r">' + esc(g.ab.map((x) => rec(x.recurso).nombre).join(" · ")) + "</span>" : '<span class="grow"></span>') +
        '<span class="sp-row__c">' + (n ? n + " por decidir" : "Todo decidido") + "</span>" + ic("chevron-down");
      return '<button type="button" class="sp-row" data-act="sol-abrir" data-p="' + id + '" aria-expanded="' + ab + '" aria-controls="b-' + id + '">' + inner + "</button>";
    };
    const tarjeta = (g) => '<article class="sp-card' + (lista ? " sp-card--lista" : "") + (abierta2(g) ? " sp-card--abierta" : "") + '" data-persona="' + esc(g.p.id) + '" aria-labelledby="h-' + esc(g.p.id) + '">' + fila(g) + '<div class="sp-card__b" id="b-' + esc(g.p.id) + '">' + spLinea(g) + spSols(g) + "</div></article>";
    return '<div class="bc-page stack"><div><h1>Recursos solicitados</h1><p class="sp-intro">Cada persona con su situación y todo lo que pide a tu entidad.</p></div>' + ptabs("solicitudes") +
      
      filtrosBarra(FL, grupos, "Persona o recurso").replace(/<\/div>$/, '<div class="ez-vt sp-vt" role="group" aria-label="Vista">' + [["cards", "Vista de tarjetas", "view-grid"], ["lista", "Vista de lista", "view-list"]].map(([k, t, icn]) => '<button type="button" class="ez-vb" data-act="vsol" data-v="' + k + '" aria-pressed="' + (vSol === k) + '" aria-label="' + t + '" title="' + t + '">' + ic(icn) + "</button>").join("") + "</div>" + "</div>") +
      '<div class="sp-feed">' + (vis.length ? vis.map(tarjeta).join("") : card('<p class="mut">' + (grupos.length ? "Ninguna persona coincide con el filtro." : "No hay solicitudes pendientes.") + "</p>")) + "</div></div>";
  }

  /* ── Mis recursos: lo que la entidad ofrece a la red ── */
  const CATS = [...new Set(CAT.dimensiones.map((d) => d.cat))];
  const REC_OPC = { modo: ["Libre", "Inscripción", "Solicitud"], urg: ["Normal", "Urgente"] };
  const REQ_REC = ["cat", "nombre", "formato", "modo", "urg"];
  const EJ_REC = { cat: "Documentación y Trámites", catalogo: "k044", nombre: "Acompañamiento en trámites de empadronamiento", formato: "atencion", modo: "Solicitud", urg: "Normal", cupo: "10", forma: "recurrente", cada: "semana", dias: ["ma"], hora: "10:00", duracion: "60", desc: "Cita individual para preparar y presentar el empadronamiento.", requisitos: "Residir en Madrid" };
  const FMT = (id) => (CAT.formatos || []).find((f) => f.id === id), KAT = (id) => (CAT.recursos || []).find((k) => k.id === id);
  const DIAS_ORD = ["lu", "ma", "mi", "ju", "vi", "sa", "do"];
  /* Elegir formato precarga cómo ocurre, cómo se accede y las plazas (spec 07); todo se puede cambiar después. */
  const aplicarFmt = (x, id) => {
    const f = FMT(id); if (!f) return;
    Object.assign(x, { formato: id, modo: f.modo, forma: f.forma, cada: f.cada || "", cupo: f.plazas ? String(f.plazas) : "", limite: f.limite ? String(f.limite) : "", acomp: !!f.acompanantes, maxAcomp: f.maxAcompanantes ? String(f.maxAcompanantes) : f.acompanantes ? "3" : "" });
    if (!(x.dias || []).length) x.dias = f.cada === "dia" ? ["lu", "ma", "mi", "ju", "vi"] : ["lu"];
    x.urg = x.urg || "Normal";
    if (f.forma === "sesiones" && !x.fin) { const d = new Date((x.inicio || hoy()) + "T00:00"); d.setDate(d.getDate() + 56); x.fin = isoDe(d); }
    if (f.forma !== "estadia") { x.hora = x.hora || "10:00"; x.duracion = x.duracion || "60"; }
  };
  const tiempoDe = (x) => {
    const t = { forma: x.forma, inicio: x.inicio || hoy() };
    if (x.forma === "recurrente") t.cada = x.cada || "semana";
    if ((x.forma === "recurrente" && t.cada !== "mes") || x.forma === "sesiones") t.dias = DIAS_ORD.filter((d) => (x.dias || []).includes(d));
    if (x.fin && (x.forma === "recurrente" || x.forma === "sesiones")) t.fin = x.fin;
    if (x.forma !== "estadia") { if (x.hora) t.hora = x.hora; if (x.duracion) t.duracion = +x.duracion; }
    return t;
  };
  const TAB_DE = { cat: "catalogo", catalogo: "catalogo", nombre: "basico", formato: "basico", forma: "cuando", dias: "cuando", inicio: "cuando", fin: "cuando", modo: "acceso", urg: "acceso", cupo: "acceso" };
  const REC_TABS = [["catalogo", "Catálogo"], ["basico", "Básico"], ["cuando", "Cuándo"], ["acceso", "Acceso y plazas"], ["detalles", "Detalles"]];
  const usoRec = (r) => {
    const ss = S.solicitudes.filter((s) => s.recurso === r.id), activas = (r.base || 0) + ss.filter((s) => s.estado === "Aprobada").reduce((n, s) => n + plazasDe(s), 0);
    return { activas, pend: ss.filter((s) => s.estado === "Pendiente" || s.estado === "Falta información").length, espera: ss.filter((s) => s.estado === "En lista de espera").length, libres: r.cupo ? Math.max(0, r.cupo - activas) : null, lleno: !!r.cupo && activas >= r.cupo };
  };
  /* ── Tiempo del recurso (spec 02): todo recurso es un evento con fecha o recurrencia ── */
  const DSEM = ["do", "lu", "ma", "mi", "ju", "vi", "sa"], DNOM = { lu: "Lun", ma: "Mar", mi: "Mié", ju: "Jue", vi: "Vie", sa: "Sáb", do: "Dom" };
  const isoDe = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const fCorta = (f) => { const d = new Date(f + "T00:00"); return DNOM[DSEM[d.getDay()]] + " " + d.getDate() + " " + d.toLocaleDateString("es-ES", { month: "short" }).replace(".", ""); };
  /* Próximas ocurrencias desde hoy; la estadía no tiene fechas fijas (cuenta noches por persona). */
  function proximas(r, n, desde) {
    const t = r && r.tiempo, out = [], ini = desde || hoy(); if (!t || t.forma === "estadia") return out;
    if (t.forma === "unico") return t.inicio >= ini ? [t.inicio] : out;
    const d = new Date((t.inicio > ini ? t.inicio : ini) + "T00:00"), dia0 = +t.inicio.slice(8);
    for (let i = 0; i < 400 && out.length < (n || 4); i++, d.setDate(d.getDate() + 1)) {
      const f = isoDe(d); if (t.fin && f > t.fin) break;
      if (t.cada === "mes" ? d.getDate() === dia0 : (t.dias || DSEM).includes(DSEM[d.getDay()])) out.push(f);
    }
    return out;
  }
  const listaDias = (ds) => { const o = ds.map((x) => DNOM[x]); if (ds.length === 7) return "Cada día"; if (ds.join() === "lu,ma,mi,ju,vi") return "Lun a vie"; return o.length > 1 ? o.slice(0, -1).join(", ") + " y " + o[o.length - 1].toLowerCase() : o[0]; };
  /* «Cuándo ocurre» en una línea: lo que lee el ciudadano, el conector y la entidad. */
  function cuandoTxt(r) {
    const t = r && r.tiempo; if (!t) return "";
    const h = t.hora ? " · " + t.hora : "";
    if (t.forma === "unico") return fCorta(t.inicio) + h;
    if (t.forma === "estadia") return "Estadía · plazas por noche";
    if (t.cada === "mes") return "Cada mes";
    const base = listaDias(t.dias || DSEM) + h;
    return t.forma === "sesiones" ? base + (t.fin ? " · hasta " + fCorta(t.fin).slice(4) : "") : base;
  }
  const proxTxt = (r) => { const p = proximas(r, 1)[0]; return p ? fCorta(p) + (r.tiempo.hora ? ", " + r.tiempo.hora : "") : ""; };
  /* Primera fecha de una solicitud: la próxima ocurrencia; la estadía empieza hoy. */
  const desdeDe = (r) => (r.tiempo && r.tiempo.forma === "estadia") ? hoy() : (proximas(r, 1)[0] || hoy());
  const minDe = (h) => { const [a, b] = (h || "0:0").split(":"); return +a * 60 + +b; };
  /* Solape por persona: otro recurso activo ese mismo día con el horario cruzado. */
  function solape(pid, r, f) {
    const t = (r && r.tiempo) || {}; if (!t.hora || !f) return null;
    const i0 = minDe(t.hora), i1 = i0 + (t.duracion || 60);
    return solsDe(pid).filter((x) => ACTIVAS.includes(x.estado) && x.recurso !== r.id).map((x) => rec(x.recurso)).find((o) => {
      const u = o.tiempo || {}; if (!u.hora || !proximas(o, 60).includes(f)) return false;
      const j0 = minDe(u.hora), j1 = j0 + (u.duracion || 60); return i0 < j1 && j0 < i1;
    }) || null;
  }
  const FORMA_T = { unico: "Un día", recurrente: "Se repite", sesiones: "Por sesiones", estadia: "Estadía" };
  /* ── Familia (spec 03): ficha propia por familiar, plazas y consumo por persona ── */
  const famDe = (pid) => (S.familiares || []).filter((f) => f.titular === pid);
  const gruposDe = (pid) => (S.familias || []).filter((g) => g.titular === pid);
  const plazasDe = (s) => 1 + (s.acompanantes || []).length;
  const VERIF = { "Por verificar": "warning", "Verificada": "positive", "Rechazada": "negative" };
  /* Solicitudes en las que alguien participa, como titular o como acompañante. */
  const participa = (pid) => S.solicitudes.filter((s) => s.persona === pid || (s.acompanantes || []).includes(pid));
  /* Duplicidad por persona: la misma necesidad activa, en cualquier entidad. */
  const enCursoDe = (pid, r, sinId) => participa(pid).find((s) => s.id !== sinId && ACTIVAS.includes(s.estado) && rec(s.recurso).cat === r.cat);
  function motivoFam(f, r) {
    if (f.verificacion !== "Verificada") return f.verificacion === "Rechazada" ? "Ficha rechazada" : "Lo verifica " + ent((per(f.titular) || {}).entidad).nombre;
    return enCursoDe(f.id, r) ? "Ya tiene " + r.cat + " en curso" : "";
  }
  const vaCon = (s) => (s.acompanantes || []).map((id) => { const f = per(id); return f ? f.nombre + (f.vinculo ? " (" + f.vinculo.toLowerCase() + ")" : "") : ""; }).filter(Boolean).join(", ");
  const porVerificar = () => (S.familiares || []).filter((f) => f.verificacion === "Por verificar" && (per(f.titular) || {}).entidad === ENT);
  /* Verificar o rechazar: solo el equipo de la entidad que atiende al titular. */
  const famAcc = (f) => famRech === f.id
    ? '<div class="fam-rech">' + selNative("mot-" + f.id, '<option value="">Motivo…</option><option>Los datos no coinciden con su documento</option><option>No convive con la persona</option><option>Falta documentación</option>') + btn("Rechazar", { size: "small", theme: "negative", act: "fam-rech", a: { "data-fid": f.id } }) + btn("Cancelar", { size: "small", v: "quiet", act: "fam-rech-no" }) + "</div>"
    : '<div class="fam-acc">' + btn("Verificar", { size: "small", icon: "check", act: "fam-ver", a: { "data-fid": f.id } }) + btn("Rechazar", { size: "small", v: "quiet", act: "fam-rech-ab", a: { "data-fid": f.id } }) + "</div>";
  function famCard(p) {
    const fs = famDe(p.id), mia = p.entidad === ENT;
    const fila = (f) => '<div class="kz-it fam-it"><div class="grow"><b>' + esc(f.nombre + " " + f.apellidos) + "</b><span>" + esc(f.vinculo) + (f.nac ? " · " + fecha(f.nac) : "") + (f.motivo ? " · " + esc(f.motivo) : "") + "</span></div>" + tag(f.verificacion, VERIF[f.verificacion], "small") + "</div>" + (f.verificacion === "Por verificar" && mia ? famAcc(f) : "");
    return card('<div class="kz-card-h"><h2>Familia</h2><span class="kz-mut">' + fs.length + "</span></div>" + (fs.length ? fs.map(fila).join("") : '<p class="kz-vacio">Sin familiares registrados.</p>') +
      (mia ? '<div class="kz-post">' + btn("Agregar familiar", { v: "quiet", size: "small", icon: "user-plus", href: "#/persona/" + encodeURIComponent(p.id) + "/familiar" }) + "</div>" : ""), { id: "familia", cls: "kz-card" });
  }
  const VINCULOS = ["Hija", "Hijo", "Pareja", "Madre", "Padre", "Hermana", "Hermano", "Otro"];
  /* Alta de un familiar: la persona la deja por verificar; el equipo que le atiende, ya verificada. */
  function famNuevo(tit, volver) {
    const p = per(tit); if (!p) return "";
    if (!D || D.tipo !== "fam" || D.tit !== tit) D = { tipo: "fam", tit, volver, datos: { grupo: (gruposDe(tit)[0] || {}).id || "nuevo" }, err: {} };
    const gs = gruposDe(tit), x = D.datos, cz = ROL === "ciudadano";
    const chip = (act, v, t, on) => '<button type="button" class="bc-chip" aria-pressed="' + on + '" data-act="' + act + '" data-v="' + esc(v) + '">' + esc(t) + "</button>";
    return '<div class="bc-page ' + (cz ? "cz-pg " : "") + 'stack fam-nuevo"><a class="bc-back" href="' + volver + '">← Volver</a><div><h1>Agregar familiar</h1><p class="mut">' + (cz ? "Su ficha queda por verificar: " + esc(ent(p.entidad).nombre) + " la revisa antes de que pueda acompañarte." : "Para " + esc(nom(p)) + ". Lo agregas desde la entidad que le atiende: queda verificado.") + "</p></div>" +
      card('<div class="stack"><div class="grid2">' + fld("nombre", "Nombre") + fld("apellidos", "Apellidos") + "</div>" + fld("nac", "Fecha de nacimiento", { type: "date", opc: true }) +
        '<div class="fam-g"><span class="fam-l" id="fam-vl">Vínculo</span><div class="fam-chips" role="group" aria-labelledby="fam-vl">' + VINCULOS.map((v) => chip("fam-vin", v, v, x.vinculo === v)).join("") + "</div>" + (D.err.vinculo ? '<p class="fam-err">' + esc(D.err.vinculo) + "</p>" : "") + "</div>" +
        '<div class="fam-g"><span class="fam-l" id="fam-gl">Grupo familiar</span><div class="fam-chips" role="group" aria-labelledby="fam-gl">' + gs.map((g) => chip("fam-gru", g.id, g.nombre, x.grupo === g.id)).join("") + chip("fam-gru", "nuevo", "Grupo nuevo", x.grupo === "nuevo") + "</div>" + (x.grupo === "nuevo" ? fld("grupoNombre", "Nombre del grupo", { ph: "Ej.: Mis hijos" }) : "") + "</div></div>") +
      '<div class="row fam-pie">' + btn("Cancelar", { v: "quiet", href: volver }) + btn("Guardar familiar", { act: "fam-guardar", a: { id: "btn-sig" } }) + "</div></div>";
  }
  function eVerificar() {
    const fs = porVerificar();
    const fila = (f) => { const t = per(f.titular); return '<div class="bc-tr ez-tr ez-vf" data-fam="' + f.id + '"><span class="ez-per">' + avatar(ini(f.nombre + " " + f.apellidos), "amber", "small") + "<span><b>" + esc(f.nombre + " " + f.apellidos) + '</b><span class="ez-id">' + esc(f.vinculo) + (f.nac ? " · " + fecha(f.nac) : "") + "</span></span></span>" +
      '<span data-l="Titular"><a class="bc-plain" href="#/persona/' + esc(t.id) + '">' + esc(nom(t)) + '</a></span><span data-l="Agregado">' + fecha(f.creada) + (f.creadaPor === "persona" ? " · por la persona" : "") + '</span><span class="ez-vf__acc">' + famAcc(f) + "</span></div>"; };
    return '<div class="bc-page stack"><div class="ez-head"><h1>Por verificar <span class="ez-n">' + fs.length + "</span></h1></div>" + ptabs("verificar") +
      '<p class="mut">Familiares que agregaron las personas que atiende tu entidad. Hasta que los verifiques no pueden acompañarlas a ningún recurso.</p>' +
      '<div class="bc-tbl"><div class="bc-tr bc-th ez-tr ez-vf"><span>Familiar</span><span>Titular</span><span>Agregado</span><span></span></div>' + (fs.length ? fs.map(fila).join("") : '<div class="bc-tr ez-tr"><span class="mut">No hay fichas por verificar.</span></div>') + "</div></div>";
  }
  /* ── Panel del recurso (spec 04): lo abre el equipo de la entidad dueña ── */
  const inscritosDe = (r, f) => S.solicitudes.filter((s) => s.recurso === r.id && s.estado === "Aprobada" && (!f || !s.desde || s.desde <= f));
  function pasadas(r, n) { const t = r.tiempo || {}; if (!t.forma || t.forma === "estadia") return []; const d = new Date(); d.setDate(d.getDate() - 60); const i = isoDe(d) < t.inicio ? t.inicio : isoDe(d); return proximas(r, 200, i).filter((f) => f <= hoy()).slice(-n); }
  const pnKpi = (k, v) => '<div class="pn-kpi"><span>' + k + "</span><b>" + v + "</b></div>";
  const pnTabla = (cols, rows, vacio) => '<div class="pn-tbl" style="--cols:' + cols.length + '"><div class="pn-tr pn-th">' + cols.map((c) => "<span>" + c + "</span>").join("") + "</div>" + (rows.length ? rows.map((rw) => '<div class="pn-tr">' + rw.map((c, i) => '<span data-l="' + esc(cols[i]) + '">' + c + "</span>").join("") + "</div>").join("") : '<div class="pn-tr pn-vacio"><span class="mut">' + vacio + "</span></div>") + "</div>";
  const PN_TABS = [["resumen", "Resumen"], ["inscritos", "Inscritos"], ["fechas", "Fechas"], ["lista", "Pasar lista"]];
  function pRecurso(id, tab, fq) {
    const r = rec(id); if (!r || r.entidad !== ENT) return '<div class="bc-page"><p class="mut">Este recurso no es de tu entidad.</p></div>';
    const T = tab || "resumen", est = (r.tiempo || {}).forma === "estadia", u = usoRec(r), ins = inscritosDe(r), prox = proximas(r, 6), pas = pasadas(r, 4);
    const base = "#/panel/" + r.id, uniq = (x, i, a) => a.indexOf(x) === i;
    const conf = (f) => { let si = 0, no = 0, tot = 0; inscritosDe(r, f).forEach((s) => { tot += plazasDe(s); const a = asisDe(s.persona, r.id, f); if (a && a.estado === "Confirmada") si += 1 + (a.acompanantes || []).length; else if (a) no += plazasDe(s); }); return { si, no, sin: tot - si - no }; };
    const listaHecha = (f) => inscritosDe(r, f).some((s) => usoEn(s.persona, r.id, f));
    const sinLista = pas.filter((f) => inscritosDe(r, f).length && !listaHecha(f));
    let cuerpo = "";
    if (T === "resumen") {
      const c0 = prox[0] && pideConf(r) ? conf(prox[0]) : null;
      cuerpo = (sinLista.length ? alerta("<b>Falta pasar lista</b> del " + sinLista.map(fCorta).join(", ") + '. <a href="' + base + "/lista/" + sinLista[sinLista.length - 1] + '">Pasar lista</a>', "warning") : "") +
        '<div class="pn-kpis">' + pnKpi("Plazas ocupadas", u.activas + (r.cupo ? " / " + r.cupo : "")) + pnKpi("Inscritos", ins.length) + pnKpi("En lista de espera", u.espera) + (c0 ? pnKpi("Confirmados · " + fCorta(prox[0]), c0.si + (c0.sin ? " <small>· " + c0.sin + " sin confirmar</small>" : "")) : pnKpi("Próxima fecha", est ? "Estadía" : prox[0] ? fCorta(prox[0]) : "—")) + "</div>" +
        card('<h2 class="pn-h">Cómo funciona</h2><p class="mut">' + esc(cuandoTxt(r)) + " · " + esc(MODO_T[r.modo]) + ((r.config || {}).acompanantes ? " · admite acompañantes" : "") + (r.limite ? " · " + r.limite + " usos por persona" : "") + "</p>" + (pideConf(r) ? '<p class="mut">Las personas confirman «Voy» hasta ' + confAntes(r) + " h antes; sin confirmar, la plaza de ese día se ofrece a la lista de espera.</p>" : ""));
    } else if (T === "inscritos") {
      cuerpo = pnTabla(["Persona", "Va con", "Desde", "Uso"], ins.map((s) => [esc(nom(per(s.persona))), esc(vaCon(s)) || "—", s.desde ? fCorta(s.desde) : "—", usosDe(s.persona, r.id).length + (r.limite ? " de " + r.limite : " usos")]), "Nadie inscrito todavía.");
    } else if (T === "fechas") {
      cuerpo = est ? card('<p class="mut">Es una estadía: cada persona entra y sale en sus fechas. Ocupación actual: ' + u.activas + (r.cupo ? " de " + r.cupo : "") + " plazas.</p>")
        : pnTabla(["Fecha", "Confirmados", "No van", "Sin confirmar", "Lista"], pas.concat(prox).filter(uniq).map((f) => { const c = conf(f); return [czDia(f) + (r.tiempo.hora ? " · " + r.tiempo.hora : ""), pideConf(r) ? c.si : "—", pideConf(r) ? c.no : "—", pideConf(r) ? c.sin : "—", f <= hoy() ? '<a href="' + base + "/lista/" + f + '">' + (listaHecha(f) ? "Ver lista" : "Pasar lista") + "</a>" : '<span class="mut">—</span>']; }), "Sin fechas.");
    } else if (T === "lista" && !est) {
      const fL = fq || (pas.length ? pas[pas.length - 1] : prox[0]), filas = [];
      inscritosDe(r, fL).forEach((s) => { const a = asisDe(s.persona, r.id, fL); [s.persona].concat(s.acompanantes || []).forEach((pid, i) => filas.push({ pid, s, tit: i === 0, conf: !pideConf(r) ? "" : !a ? "Sin confirmar" : a.estado === "Confirmada" && (i === 0 || (a.acompanantes || []).includes(pid)) ? "Confirmó" : "No va" })); });
      const vinieron = filas.filter((x) => (usoEn(x.pid, r.id, fL) || {}).estado === "Usó").length;
      cuerpo = '<div class="kz-fechas pn-fechas" role="group" aria-label="Fecha">' + pas.concat(prox.slice(0, 1)).concat(fL ? [fL] : []).filter(uniq).sort().map((f) => '<a class="bc-chip" aria-pressed="' + (f === fL) + '" href="' + base + "/lista/" + f + '">' + czDia(f) + "</a>").join("") + "</div>" +
        (fL && fL > hoy() ? alerta("Esta fecha todavía no llegó: la lista se pasa ese día.", "informative") : "") +
        '<p class="pn-cuenta"><b>' + vinieron + "</b> de " + filas.length + " vinieron · " + (fL ? czDia(fL) : "") + "</p>" +
        '<div class="pn-lista">' + (filas.length ? filas.map((x) => { const p = per(x.pid), us = (usoEn(x.pid, r.id, fL) || {}).estado;
          return '<div class="pn-fila' + (x.tit ? "" : " pn-fila--a") + '"><div class="grow"><b>' + esc(nom(p)) + "</b>" + (x.tit ? "" : "<span>con " + esc(per(x.s.persona).nombre) + "</span>") + (x.conf ? '<span class="pn-conf pn-conf--' + (x.conf === "Confirmó" ? "v" : x.conf === "No va" ? "r" : "n") + '">' + x.conf + "</span>" : "") + '</div><div class="pn-bt" role="group" aria-label="Asistencia de ' + esc(p.nombre) + '">' + ["Usó", "No vino"].map((e) => '<button type="button" aria-pressed="' + (us === e) + '" data-act="p-uso" data-r="' + r.id + '" data-p="' + x.pid + '" data-f="' + fL + '" data-e="' + e + '">' + e + "</button>").join("") + "</div></div>"; }).join("")
          : '<p class="mut">Nadie inscrito para esta fecha.</p>') + "</div>";
    }
    const tabs = PN_TABS.concat(typeof pnComunicados === "function" ? [["comunicados", "Comunicados"]] : []).filter(([k]) => !(est && k === "lista"));
    if (T === "comunicados" && typeof pnComunicados === "function") cuerpo = pnComunicados(r);
    return '<div class="bc-page stack pn"><a class="bc-back" href="' + (ROL === "entidad" ? "#/recursos" : "#/mis-recursos") + '">← ' + (ROL === "entidad" ? "Mis recursos" : "Recursos de mi entidad") + "</a>" +
      '<div class="pn-head">' + ezIco(r.cat) + '<div class="grow"><h1>' + esc(r.nombre) + '</h1><p class="mut">' + esc(cuandoTxt(r)) + (proxTxt(r) ? " · próxima " + esc(proxTxt(r)) : "") + "</p></div>" + (ROL === "entidad" ? btn("Editar", { v: "quiet", size: "small", icon: "edit", href: "#/recurso/" + r.id }) : "") + "</div>" +
      '<div class="nwt-tabs bc-subtabs pn-tabs"><div class="nwt-tabs__list" role="tablist" aria-label="Panel del recurso">' + tabs.map(([k, t]) => '<a class="nwt-tabs__tab' + (k === T ? " nwt-tabs__tab--active" : "") + '" role="tab" aria-selected="' + (k === T) + '" href="' + base + "/" + k + '"><span class="nwt-tabs__label"><span class="nwt-tabs__label-text">' + t + "</span></span></a>").join("") + "</div></div>" + cuerpo + "</div>";
  }
  /* ── Comunicados (spec 05): aviso atado a una fecha o comunicado general, con registro ── */
  let cm = null, cmDev = null, cmFirma0 = null;
  const PLANT = {
    recordatorio: ["Recordatorio", (r, f) => "Te recordamos " + r.nombre + " el " + fCorta(f) + (r.tiempo.hora ? " a las " + r.tiempo.hora : "") + ". Si no puedes venir, avísanos para dar tu plaza a otra persona."],
    hora: ["Cambio de hora", (r, f) => r.nombre + " del " + fCorta(f) + " cambia de hora: empieza a las 18:00."],
    cancelacion: ["Cancelación", (r, f) => r.nombre + " del " + fCorta(f) + " se cancela. Te avisamos de la próxima fecha."]
  };
  const CM_EST = { "Enviado": "positive", "Por aprobar": "warning", "Devuelto": "negative" };
  const firmaTxt = (c) => c.firma.tipo === "red" ? ((S.redes || []).find((x) => x.id === c.firma.id) || { nombre: "La red" }).nombre : ent(c.firma.id).nombre;
  /* A quién llega: los casos protegidos y quien no autorizó comunicaciones no reciben comunicados generales. */
  function destinatarios(o) {
    let ids = [];
    if (o.filtro === "inscritos") ids = S.solicitudes.filter((x) => x.recurso === o.recurso && x.estado === "Aprobada").map((x) => x.persona);
    else if (o.filtro === "espera") ids = S.solicitudes.filter((x) => x.recurso === o.recurso && x.estado === "En lista de espera").map((x) => x.persona);
    else if (o.filtro === "noasistieron") ids = (S.usos || []).filter((u) => u.recurso === o.recurso && u.estado === "No vino").map((u) => u.persona);
    else { const es = o.filtro && o.filtro.indexOf("ent:") === 0 ? [o.filtro.slice(4)] : o.entidades || []; ids = S.personas.filter((p) => es.includes(p.entidad)).map((p) => p.id).concat(S.solicitudes.filter((x) => es.includes(rec(x.recurso).entidad) && ACTIVAS.includes(x.estado)).map((x) => x.persona)); }
    let ps = [...new Set(ids)].map((id) => S.personas.find((p) => p.id === id)).filter(Boolean);
    if (o.clase === "comunicado") ps = ps.filter((p) => !p.protegido && p.consent && p.consent.comunicaciones);
    return ps;
  }
  function cmAuto(force) { const r = cm.base.recurso && rec(cm.base.recurso); if (!r || cm.clase !== "aviso" || !cm.fecha || (!cm.auto && !force)) return; cm.asunto = PLANT[cm.plantilla][0] + " · " + r.nombre; cm.cuerpo = PLANT[cm.plantilla][1](r, cm.fecha); cm.auto = true; }
  /* Editor común: panel del recurso, comunicados de la entidad y de la red. */
  function cmForm(base) {
    if (!cm || cm.key !== base.key) { cm = { key: base.key, base, clase: base.recurso ? "aviso" : "comunicado", plantilla: "recordatorio", fecha: base.recurso ? proximas(rec(base.recurso), 1)[0] : null, asunto: "", cuerpo: "", canales: ["app", "correo"], filtro: base.filtros[0][0], firma: base.firmas ? base.firmas[0][0] : "entidad:" + ENT, auto: true };
      if (cmFirma0 && base.firmas && base.firmas.some((f) => f[0] === cmFirma0)) { cm.firma = cmFirma0; cm.filtro = "ent:" + cmFirma0.split(":")[1]; } cmFirma0 = null; cmAuto(true); }
    cm.base = base;
    const r = base.recurso && rec(base.recurso), aviso = cm.clase === "aviso";
    const dest = destinatarios({ filtro: aviso ? "inscritos" : cm.filtro, recurso: base.recurso, entidades: base.entidades, clase: cm.clase });
    const chip = (act, v, t, on) => '<button type="button" class="bc-chip" aria-pressed="' + on + '" data-act="' + act + '" data-v="' + esc(v) + '">' + esc(t) + "</button>";
    const grupo = (t, html) => '<div class="fam-g"><span class="fam-l">' + t + '</span><div class="fam-chips">' + html + "</div></div>";
    const aprob = ROL === "conector" && !aviso;
    return card('<div class="stack cm-form"><h2 class="pn-h">Nuevo mensaje</h2>' + (!aviso && !cm.asunto ? '<div class="bc-ejemplo">' + btn("Completar con un ejemplo", { v: "quiet", size: "small", icon: "sparkles", act: "cm-ej", a: { id: "btn-cm-ej" } }) + "</div>" : "") +
      (r ? grupo("Qué envías", chip("cm-clase", "aviso", "Aviso de una fecha", aviso) + chip("cm-clase", "comunicado", "Comunicado", !aviso)) : "") +
      (aviso ? grupo("Qué avisas", Object.entries(PLANT).map(([k, [t]]) => chip("cm-plant", k, t, cm.plantilla === k)).join("")) + grupo("Qué fecha", proximas(r, 4).map((f) => chip("cm-fecha", f, fCorta(f), cm.fecha === f)).join(""))
        : grupo("A quién", base.filtros.map(([k, t]) => chip("cm-filtro", k, t, cm.filtro === k)).join(""))) +
      (base.firmas ? grupo("Firma", base.firmas.map(([k, t]) => chip("cm-firma", k, t, cm.firma === k)).join("")) : "") +
      '<label class="ez-campo"><span>Asunto</span><input data-cm="asunto" value="' + esc(cm.asunto) + '"></label><label class="ez-campo"><span>Mensaje</span><textarea class="cm-txt" data-cm="cuerpo" rows="3">' + esc(cm.cuerpo) + "</textarea></label>" +
      grupo("Canales", [["app", "App"], ["correo", "Correo"]].map(([k, t]) => chip("cm-canal", k, t, cm.canales.includes(k))).join("")) +
      '<div class="cm-n">' + ic("users") + "<span>Llegará a <b>" + dest.length + (dest.length === 1 ? " persona" : " personas") + "</b>" + (aviso ? " inscritas" : " · sin casos protegidos ni quien no autorizó comunicados") + "</span></div>" +
      (aprob ? '<p class="mut cm-x">Los comunicados del conector los aprueba la coordinación antes de salir. Los avisos de una fecha salen directo.</p>' : "") +
      '<div class="row fam-pie">' + btn(aprob ? "Enviar a aprobación" : "Enviar", { icon: "megaphone", act: "cm-enviar", a: { id: "btn-cm" } }) + "</div></div>", { id: "cm-nuevo" });
  }
  function cmLista(lista, conAprob) {
    if (!lista.length) return "";
    return '<div class="cm-lista">' + lista.slice().sort((a, b) => (b.enviado || b.creado).localeCompare(a.enviado || a.creado)).map((c) => '<article class="cm-it" data-cm-id="' + c.id + '"><div class="cm-it__h">' + tag(c.clase === "aviso" ? "Aviso" : "Comunicado", c.clase === "aviso" ? "informative" : "neutral", "small") + tag(c.estado, CM_EST[c.estado], "small") + '<span class="grow"></span><time>' + cuando(c.enviado || c.creado) + "</time></div>" +
      "<h3>" + esc(c.asunto) + '</h3><p class="cm-cuerpo">' + esc(c.cuerpo) + '</p><p class="cm-meta">Firma ' + esc(firmaTxt(c)) + (c.porRed ? " · enviado por la red" : "") + " · escribió " + esc(c.autorNombre || "—") + (c.aprobadoPor ? " · aprobó " + esc(c.aprobadoPor) : "") + (c.recurso ? " · " + esc(rec(c.recurso).nombre) : "") + (c.estado === "Enviado" ? " · " + c.destinatarios.length + " destinatarios por " + c.canales.join(" y ") + " · leído por " + (c.leidos || []).length : "") + "</p>" +
      (c.comentario ? '<div class="cm-dev">' + ic("message-circle") + "<span><b>Devuelto:</b> " + esc(c.comentario) + "</span></div>" : "") +
      (conAprob && c.estado === "Por aprobar" ? (cmDev === c.id ? '<div class="stack-s"><label class="ez-campo"><span>Qué tiene que cambiar</span><textarea id="dev-' + c.id + '" class="cm-txt" rows="2"></textarea></label><div class="row fam-pie">' + btn("Cancelar", { v: "quiet", size: "small", act: "cm-dev-no" }) + btn("Devolver", { size: "small", theme: "negative", act: "cm-devolver", a: { "data-id": c.id } }) + "</div></div>"
        : '<div class="row cm-acc">' + btn("Aprobar y enviar", { size: "small", icon: "check", act: "cm-aprobar", a: { "data-id": c.id } }) + btn("Devolver", { size: "small", v: "quiet", act: "cm-dev-ab", a: { "data-id": c.id } }) + "</div>") : "") + "</article>").join("") + "</div>";
  }
  /* Pestaña Comunicados del panel: su historial y el editor de avisos. */
  function pnComunicados(r) {
    return cmLista((S.comunicados || []).filter((c) => c.recurso === r.id), ROL === "entidad") +
      cmForm({ key: "r:" + r.id, recurso: r.id, entidades: [ENT], filtros: [["inscritos", "Inscritos"], ["espera", "Lista de espera"], ["noasistieron", "No vinieron"]] });
  }
  function eComunicados(tab) {
    const mios = (S.comunicados || []).filter((c) => c.firma.tipo === "entidad" && c.firma.id === ENT), pend = mios.filter((c) => c.estado === "Por aprobar");
    const T = tab || (pend.length ? "aprobar" : "enviados");
    const tabs = [["aprobar", "Por aprobar", pend.length], ["enviados", "Enviados", mios.filter((c) => c.estado !== "Por aprobar").length], ["nuevo", "Redactar"]];
    const cuerpo = T === "aprobar" ? cmLista(pend, true) || card('<p class="mut">Nada por aprobar.</p>') : T === "nuevo" ? cmForm({ key: "ent", entidades: [ENT], filtros: [["todas", "Todas mis personas"]] }) : cmLista(mios.filter((c) => c.estado !== "Por aprobar")) || card('<p class="mut">Todavía no enviaste nada.</p>');
    return '<div class="bc-page stack"><div class="ez-head"><h1>Comunicados</h1></div><div class="nwt-tabs bc-subtabs pn-tabs"><div class="nwt-tabs__list" role="tablist" aria-label="Comunicados">' + tabs.map(([k, t, n]) => '<a class="nwt-tabs__tab' + (k === T ? " nwt-tabs__tab--active" : "") + '" role="tab" aria-selected="' + (k === T) + '" href="#/comunicados/' + k + '"><span class="nwt-tabs__label"><span class="nwt-tabs__label-text">' + t + (n ? " · " + n : "") + "</span></span></a>").join("") + "</div></div>" + cuerpo + "</div>";
  }
  /* ── Perfil (spec 06): notas internas con autor y fecha; solo las ve la entidad que las escribió ── */
  const notasDe = (p) => Array.isArray(p.notas) ? p.notas : p.notas ? [{ texto: p.notas, autor: p.conector || "entidad", entidad: p.entidad, fecha: (p.alta || hoy()) + " 00:00" }] : [];
  const autorTxt = (a) => a === "entidad" ? "Coordinación" : (con(a) || { nombre: a }).nombre;
  function notasCard(p) {
    const ns = notasDe(p).filter((n) => n.entidad === ENT).slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
    return card('<div class="kz-card-h"><h2>Notas internas</h2>' + tag("Solo tu entidad", "neutral", "small") + "</div>" + (ns.length ? ns.map((n) => '<div class="kz-it nota"><div class="grow"><b class="nota__t">' + esc(n.texto) + "</b><span>" + esc(autorTxt(n.autor)) + " · " + cuando(n.fecha) + "</span></div></div>").join("") : '<p class="kz-vacio">Sin notas. Lo que el formulario no pide va aquí.</p>') +
      '<label class="sr" for="f-nota-' + esc(p.id) + '">Nueva nota</label><textarea id="f-nota-' + esc(p.id) + '" class="cm-txt" rows="2" placeholder="Escribe una nota interna…"></textarea><div class="kz-post">' + btn("Agregar nota", { v: "quiet", size: "small", icon: "plus", act: "nota-add", a: { "data-p": p.id } }) + "</div>", { id: "notas", cls: "kz-card" });
  }
  function comCard(p) {
    const ls = (S.comunicados || []).filter((c) => c.estado === "Enviado" && c.destinatarios.includes(p.id)).sort((a, b) => b.enviado.localeCompare(a.enviado)).slice(0, 4);
    return card('<div class="kz-card-h"><h2>Comunicados recibidos</h2><span class="kz-mut">' + ls.length + "</span></div>" + (ls.length ? ls.map((c) => '<div class="kz-it"><div class="grow"><b>' + esc(c.asunto) + "</b><span>" + esc(firmaTxt(c)) + " · " + cuando(c.enviado) + ((c.leidos || []).includes(p.id) ? " · leído" : " · sin leer") + "</span></div></div>").join("") : '<p class="kz-vacio">No ha recibido comunicados.</p>'), { id: "comunicados", cls: "kz-card" });
  }
  /* ── Red (spec 01): agregados por entidad, sin datos de personas ── */
  const miRed = () => (S.redes || [])[0] || { id: "red1", nombre: "La red", entidades: S.entidades.map((e) => e.id) };
  const gestor = () => (S.gestoresRed || [])[0] || { nombre: "Gestión de la red" };
  function aggEnt(eid) {
    const rs = S.recursos.filter((r) => r.entidad === eid && !r.pausado), lim = new Date(); lim.setDate(lim.getDate() + 7); const tope = isoDe(lim);
    return { rs, personas: S.personas.filter((p) => p.entidad === eid).length, recursos: rs.length, ocup: rs.filter((r) => r.cupo).reduce((n, r) => n + usoRec(r).activas, 0), plazas: rs.reduce((n, r) => n + (r.cupo || 0), 0),
      semana: rs.reduce((n, r) => n + proximas(r, 14).filter((f) => f <= tope).length, 0), pend: S.solicitudes.filter((x) => rec(x.recurso).entidad === eid && abierta(x)).length };
  }
  function rResumen() {
    const red = miRed(), es = red.entidades.map((id) => S.entidades.find((e) => e.id === id)).filter(Boolean), ag = es.map((e) => [e, aggEnt(e.id)]), sum = (k) => ag.reduce((n, [, a]) => n + a[k], 0);
    return '<div class="bc-page stack"><div class="ez-head"><div><p class="ez-fecha">' + esc(red.tipo || "Red") + "</p><h1>" + esc(red.nombre) + '</h1></div><span class="ez-solo">' + ic("lock") + "Solo agregados: sin datos de personas</span></div>" +
      '<div class="pn-kpis">' + pnKpi("Entidades", es.length) + pnKpi("Personas atendidas", sum("personas")) + pnKpi("Recursos activos", sum("recursos")) + pnKpi("Fechas esta semana", sum("semana")) + pnKpi("Solicitudes por decidir", sum("pend")) + "</div>" +
      '<div class="rd-grid">' + ag.map(([e, a]) => '<a class="rd-ent" href="#/red/' + e.id + '" data-entidad="' + e.id + '"><span class="rd-ent__h">' + ic("building") + '<span class="grow"><b>' + esc(e.nombre) + "</b><span>" + esc(e.tipo + " · " + e.zona) + "</span></span>" + ic("chevron-right") + '</span><span class="rd-ent__n"><span><b>' + a.personas + "</b>" + (a.personas === 1 ? " persona" : " personas") + "</span><span><b>" + a.recursos + "</b>" + (a.recursos === 1 ? " recurso" : " recursos") + "</span><span><b>" + a.semana + "</b>" + (a.semana === 1 ? " fecha" : " fechas") + " esta semana</span></span>" +
        (a.plazas ? '<span class="ez-kv"><span class="mut">Ocupación de plazas</span><b>' + a.ocup + " / " + a.plazas + '</b></span><span class="bc-bar" aria-hidden="true"><i style="width:' + Math.min(100, Math.round(a.ocup / a.plazas * 100)) + '%"></i></span>' : "") + "</a>").join("") + "</div></div>";
  }
  function rEntidad(id) {
    const e = S.entidades.find((x) => x.id === id); if (!e || !miRed().entidades.includes(id)) return rResumen();
    const a = aggEnt(id);
    return '<div class="bc-page stack"><a class="bc-back" href="#/red">← ' + esc(miRed().nombre) + '</a><div class="ez-head"><div><p class="ez-fecha">' + esc(e.tipo + " · " + e.zona) + "</p><h1>" + esc(e.nombre) + '</h1></div><span class="ez-solo">' + ic("lock") + "Solo agregados</span></div>" +
      '<div class="pn-kpis">' + pnKpi("Personas atendidas", a.personas) + pnKpi("Recursos activos", a.recursos) + pnKpi("Ocupación de plazas", a.ocup + (a.plazas ? " / " + a.plazas : "")) + pnKpi("Por decidir", a.pend) + "</div>" +
      pnTabla(["Recurso", "Cuándo", "Próxima", "Ocupación"], a.rs.map((r) => { const u = usoRec(r); return [esc(r.nombre), esc(cuandoTxt(r)), proxTxt(r) ? esc(proxTxt(r)) : "—", u.activas + (r.cupo ? " / " + r.cupo : "")]; }), "Sin recursos activos.") +
      '<div class="row">' + btn("Escribir a nombre de " + e.nombre, { v: "quiet", icon: "megaphone", act: "r-firma", a: { "data-v": "entidad:" + e.id, id: "btn-r-firma" } }) + "</div></div>";
  }
  function rComunicados(tab) {
    const red = miRed(), mios = (S.comunicados || []).filter((c) => c.porRed || (c.firma.tipo === "red" && c.firma.id === red.id)), T = tab || "nuevo";
    const tabs = [["nuevo", "Redactar"], ["enviados", "Enviados", mios.length]];
    const firmas = [["red:" + red.id, red.nombre]].concat(red.entidades.map((id) => ["entidad:" + id, ent(id).nombre]));
    const filtros = [["todas", "Toda la red"]].concat(red.entidades.map((id) => ["ent:" + id, "Personas de " + ent(id).nombre]));
    const cuerpo = T === "nuevo" ? cmForm({ key: "red", entidades: red.entidades, filtros, firmas }) : cmLista(mios) || card('<p class="mut">La red todavía no envió nada.</p>');
    return '<div class="bc-page stack"><div class="ez-head"><h1>Comunicados de la red</h1></div><p class="mut">Escribe a nombre de la red o de una de sus entidades. La entidad lo ve en su historial como «enviado por la red».</p>' +
      '<div class="nwt-tabs bc-subtabs pn-tabs"><div class="nwt-tabs__list" role="tablist" aria-label="Comunicados">' + tabs.map(([k, t, n]) => '<a class="nwt-tabs__tab' + (k === T ? " nwt-tabs__tab--active" : "") + '" role="tab" aria-selected="' + (k === T) + '" href="#/comunicados/' + k + '"><span class="nwt-tabs__label"><span class="nwt-tabs__label-text">' + t + (n ? " · " + n : "") + "</span></span></a>").join("") + "</div></div>" + cuerpo + "</div>";
  }
  function kMisRecursos() {
    const rs = S.recursos.filter((r) => r.entidad === ENT && !r.pausado).sort((a, b) => (proximas(a, 1)[0] || "9").localeCompare(proximas(b, 1)[0] || "9"));
    return '<div class="bc-page kz-page stack"><div class="kz-head"><div><span class="kz-eyebrow">' + esc(ent(ENT).nombre) + "</span><h1>Recursos de mi entidad</h1></div></div>" +
      rs.map((r) => { const p = proximas(r, 1)[0], u = usoRec(r), hoyEs = p === hoy();
        return '<a class="kz-card pn-rec" href="#/panel/' + r.id + (hoyEs ? "/lista/" + p : "") + '" data-recurso="' + r.id + '">' + ezIco(r.cat) + '<span class="grow"><b>' + esc(r.nombre) + "</b><span>" + esc(cuandoTxt(r)) + "</span><span>" + u.activas + (r.cupo ? " / " + r.cupo : "") + " plazas" + (p ? " · " + (hoyEs ? "<b>hoy</b>" : "próxima " + fCorta(p)) : "") + "</span></span>" + (hoyEs ? tag("Pasar lista", "warning", "small") : ic("chevron-right")) + "</a>"; }).join("") + "</div>";
  }
  function eRecursos() {
    const rs = S.recursos.filter((r) => r.entidad === ENT), activos = rs.filter((r) => !r.pausado).length;
    return '<div class="bc-page stack"><div class="bc-head"><div class="stack-s"><h1>Mis recursos</h1><p class="mut">' + activos + " de " + rs.length + " activos en la red</p></div>" + btn("Nuevo recurso", { icon: "plus", href: "#/recurso/nuevo", a: { id: "btn-nuevo-rec" } }) + "</div>" +
      '<div class="cols ez-grid">' + rs.map((r) => {
        const u = usoRec(r), on = !r.pausado, lleno = u.lleno, urg = r.urg === "Urgente";
        const estado = !on ? ["Pausado", ""] : u.pend ? [u.pend + " por decidir", "ez-uso__e--a"] : lleno ? ["Completo", ""] : ["Al día", "ez-uso__e--v"];
        return card('<div class="ez-rec__h">' + ezIco(r.cat) + '<span class="grow"></span><a class="ez-edit" href="#/recurso/' + esc(r.id) + '" aria-label="Editar ' + esc(r.nombre) + '">' + ic("edit") + "</a>" +
          '<button type="button" role="switch" class="ez-sw" aria-checked="' + on + '" aria-label="' + (on ? "Pausar " : "Reactivar ") + esc(r.nombre) + '" data-act="rec-pausa" data-r="' + esc(r.id) + '"><i></i></button></div>' +
          '<div><h2><a class="bc-plain" href="#/panel/' + esc(r.id) + '">' + esc(r.nombre) + '</a></h2><p class="ez-sub">' + esc(ezCat(r.cat).n) + " · " + esc(cuandoTxt(r)) + "</p>" + (proxTxt(r) ? '<p class="ez-cuando">Próxima: ' + esc(proxTxt(r)) + "</p>" : "") + "</div>" +
          '<div class="row ez-chips"><span class="ez-chip">' + esc(MODO_T[r.modo] || r.modo) + '</span><span class="ez-chip' + (urg ? " ez-chip--a" : "") + '">' + (urg ? "24 h" : "5 días") + "</span></div>" +
          '<div class="ez-uso"><div class="ez-uso__r"><span class="ez-uso__n">' + u.activas + "<small>" + (r.cupo ? " / " + r.cupo : (u.activas === 1 ? " persona" : " personas")) + '</small></span><span class="ez-uso__e ' + estado[1] + '">' + estado[0] + '</span></div><div class="bc-bar' + (lleno || !on ? " ez-lleno" : "") + '" aria-hidden="true"><i style="width:' + (r.cupo ? Math.min(100, Math.round((u.activas / r.cupo) * 100)) : 100) + '%"></i></div></div>', { cls: "ez-rec" + (on ? "" : " ez-off"), a: { "data-recurso": r.id } });
      }).join("") + "</div></div>";
  }
  function eRecurso(id) {
    const r = id === "nuevo" ? null : rec(id);
    if (id !== "nuevo" && (!r || r.entidad !== ENT)) return eRecursos();
    if (!D || D.tipo !== "rec" || D.id !== id) {
      const t = (r && r.tiempo) || {}, cf = (r && r.config) || {};
      D = { tipo: "rec", id, err: {}, tab: r ? "basico" : "catalogo", datos: r ? { nombre: r.nombre, cat: r.cat, catalogo: r.catalogo || "propio", formato: r.formato || "", modo: r.modo, urg: r.urg, cupo: r.cupo ? String(r.cupo) : "", limite: r.limite ? String(r.limite) : "", forma: t.forma || "", cada: t.cada || "", dias: (t.dias || []).slice(), inicio: t.inicio || "", fin: t.fin || "", hora: t.hora || "", duracion: t.duracion ? String(t.duracion) : "", acomp: !!cf.acompanantes, maxAcomp: cf.maxAcompanantes ? String(cf.maxAcompanantes) : "", desc: r.desc || "", requisitos: r.requisitos || "" } : { dias: [], inicio: hoy() } };
    }
    const T = D.tab || "catalogo";
    const x = D.datos, c = x.cat ? ezCat(x.cat) : null, cupo = x.cupo ? +x.cupo : 0, nombre = (x.nombre || "").trim(), t = tiempoDe(x);
    const err = (k) => D.err[k] ? '<div class="ez-err" role="alert" data-k="' + k + '">' + ic("caution") + esc(D.err[k]) + "</div>" : "";
    const sec = (titulo, cuerpo, k, cls) => '<section class="ez-sec' + (cls ? " " + cls : "") + '"><h2>' + titulo + "</h2>" + cuerpo + (k ? err(k) : "") + "</section>";
    const segm = (k, act, opts, etiqueta) => '<div class="ez-segm" role="radiogroup" aria-label="' + etiqueta + '">' + opts.map(([v, tx]) => '<button type="button" role="radio" aria-checked="' + (x[k] === v) + '" data-act="' + act + '" data-v="' + esc(v) + '">' + tx + "</button>").join("") + "</div>";
    const pm = (act, n, vacio, nombreN) => '<div class="ez-cupo"><button type="button" class="ez-pm" data-act="' + act + '" data-d="-1" aria-label="Menos ' + nombreN + '">' + ic("minus") + '</button><span class="ez-cupo__n" aria-live="polite">' + (n || vacio) + '</span><button type="button" class="ez-pm" data-act="' + act + '" data-d="1" aria-label="Más ' + nombreN + '">' + ic("plus") + "</button></div>";
    const campoF = (k, label, tipo) => '<label class="ez-campo" for="f-' + k + '"><span>' + label + '</span><input id="f-' + k + '" type="' + (tipo || "date") + '" data-ez-f="' + k + '" data-ez-r value="' + esc(x[k] || "") + '"' + (tipo === "number" ? ' min="15" step="15"' : "") + (D.err[k] ? ' aria-invalid="true"' : "") + "></label>";
    const radioCard = (cls, on, act, v, b, sub) => '<button type="button" role="radio" class="' + cls + '" aria-checked="' + on + '" data-act="' + act + '" data-v="' + esc(v) + '"><b>' + esc(b) + "</b><span>" + esc(sub) + "</span></button>";
    /* Paso 1 · Catálogo: la necesidad y, dentro, los recursos comunes de la red (sin los fuera de alcance). */
    const kats = x.cat ? (CAT.recursos || []).filter((k) => k.cat === x.cat && !k.e) : [], subs = [...new Set(kats.map((k) => k.sub))];
    const vCat = sec("Qué necesidad atiende", '<div class="ez-cats" role="radiogroup" aria-label="Necesidad">' + CATS.map((k) => { const m = ezCat(k); return '<button type="button" role="radio" class="ez-cat" aria-checked="' + (x.cat === k) + '" data-act="e-cat" data-v="' + esc(k) + '">' + ic(m.ic) + "<span>" + esc(m.n) + "</span></button>"; }).join("") + "</div>", "cat") +
      (c ? sec("Elige del catálogo", '<p class="ez-sec__x">Son los recursos comunes de la red para ' + esc(c.n) + ". Al elegir uno se precargan su formato, cuándo ocurre y las plazas; luego puedes cambiarlo todo.</p>" +
        subs.map((sb) => '<div class="ez-kat-g"><h3>' + esc(sb) + '</h3><div class="ez-kats" role="radiogroup" aria-label="' + esc(sb) + '">' + kats.filter((k) => k.sub === sb).map((k) => radioCard("ez-kat", x.catalogo === k.id, "e-kat", k.id, k.n, FMT(k.f).n)).join("") + "</div></div>").join("") +
        '<div class="ez-kats" role="radiogroup" aria-label="Otro">' + radioCard("ez-kat ez-kat--propio", x.catalogo === "propio", "e-kat", "propio", "No está en el catálogo", "Lo describes tú y eliges su formato") + "</div>", "catalogo") : "");
    const vBas = '<section class="ez-sec"><label class="ez-nombre" for="f-nombre"><span>Nombre</span><input id="f-nombre" data-ez-f="nombre" value="' + esc(x.nombre || "") + '" placeholder="¿Qué ofrece tu entidad?" autocomplete="off"' + (D.err.nombre ? ' aria-invalid="true"' : "") + "></label>" + err("nombre") + "</section>" +
      sec("Formato", '<div class="ez-modos ez-fmts" role="radiogroup" aria-label="Formato">' + (CAT.formatos || []).map((f) => radioCard("ez-modo", x.formato === f.id, "e-fmt", f.id, f.n, f.d)).join("") + "</div>", "formato");
    /* Paso 3 · Cuándo: la forma decide qué campos pide; las próximas fechas se ven al momento. */
    const conDias = (x.forma === "recurrente" && x.cada !== "mes") || x.forma === "sesiones", prox = x.forma ? proximas({ tiempo: t }, 4) : [];
    const vCua = sec("Cómo ocurre", segm("forma", "e-forma", Object.entries(FORMA_T), "Cómo ocurre"), "forma") +
      (x.forma === "recurrente" ? sec("Cada cuánto", segm("cada", "e-cada", [["dia", "Cada día"], ["semana", "Cada semana"], ["mes", "Cada mes"]], "Cada cuánto")) : "") +
      (conDias ? sec("Qué días", '<div class="ez-dias" role="group" aria-label="Días">' + DIAS_ORD.map((d) => '<button type="button" role="checkbox" aria-checked="' + (x.dias || []).includes(d) + '" data-act="e-dia" data-v="' + d + '">' + DNOM[d] + "</button>").join("") + "</div>", "dias") : "") +
      (x.forma ? sec(x.forma === "unico" ? "Fecha y hora" : x.forma === "estadia" ? "Disponible desde" : "Fechas y horario", '<div class="ez-fechas">' + campoF("inicio", x.forma === "unico" ? "Fecha" : "Desde") + (x.forma === "sesiones" ? campoF("fin", "Última sesión") : x.forma === "recurrente" ? campoF("fin", "Hasta (opcional)") : "") + (x.forma !== "estadia" ? campoF("hora", "Hora", "time") + campoF("duracion", "Duración (min)", "number") : "") + "</div>" + err("inicio") + err("fin")) +
        sec("Próximas fechas", x.forma === "estadia" ? '<p class="ez-sec__x">Cada persona entra y sale en sus propias fechas; las plazas se cuentan por noche.</p>' : prox.length ? '<div class="ez-prox">' + prox.map((f) => "<span>" + fCorta(f) + (x.hora ? " · " + esc(x.hora) : "") + "</span>").join("") + "</div>" : '<p class="ez-sec__x">Con estos datos no hay fechas próximas.</p>') : "");
    const vAcc = sec("Cómo se accede", '<div class="ez-modos" role="radiogroup" aria-label="Acceso">' + REC_OPC.modo.map((m) => radioCard("ez-modo", x.modo === m, "e-modo", m, MODO_T[m], MODO_D[m])).join("") + "</div>", "modo") +
      '<div class="ez-dos">' + sec("Respuesta", segm("urg", "e-urg", [["Normal", "5 días"], ["Urgente", "24 h"]], "Plazo de respuesta"), "urg") +
      sec(x.forma === "estadia" ? "Plazas por noche" : x.forma === "recurrente" ? "Plazas por fecha" : "Plazas", pm("e-cupo", cupo, "Sin límite", "plazas"), "cupo") + "</div>" +
      '<div class="ez-dos">' + (x.forma === "recurrente" ? sec("Usos por persona", pm("e-lim", +x.limite || 0, "Sin límite", "usos")) : "") +
      sec("Acompañantes", '<div class="ez-acomp"><span class="grow">' + (x.acomp ? "Puede venir con su familia; cada acompañante ocupa plaza." : "Solo la persona inscrita.") + '</span><button type="button" role="switch" class="ez-sw" aria-checked="' + !!x.acomp + '" aria-label="Admite acompañantes" data-act="e-acomp"><i></i></button></div>' + (x.acomp ? '<p class="ez-sec__x">Máximo por persona</p>' + pm("e-maxac", +x.maxAcomp || 0, "Sin máximo", "acompañantes") : "")) + "</div>";
    const vDet = sec("Detalles", '<p class="ez-sec__x">Lo que cuentes aquí lo lee el conector antes de proponer el recurso: la descripción dice de qué trata y el requisito, quién puede acceder.</p><div class="grid2">' + fld("desc", "Descripción breve", { opc: true }) + fld("requisitos", "Requisito de acceso", { opc: true }) + "</div>");
    const conErr = (k) => Object.keys(D.err).some((e) => TAB_DE[e] === k), faltan = REC_TABS.filter(([k]) => conErr(k)).map(([, tx]) => tx);
    const aviso = T === "detalles" && faltan.length ? alerta("<b>Falta completar " + faltan.join(", ") + ".</b> Revísalo en " + (faltan.length > 1 ? "esos pasos" : "ese paso") + " o toca «Publicar» otra vez para completarlo con un ejemplo.", "warning") : "";
    const cuerpo = { catalogo: vCat, basico: vBas, cuando: vCua, acceso: vAcc, detalles: aviso + vDet }[T] || vCat, ult = T === "detalles";
    return '<div class="bc-page stack"><div class="ez-top"><a class="ez-x" href="#/recursos" aria-label="Cerrar">' + ic("close") + "</a><h1>" + (r ? "Editar recurso" : "Nuevo recurso") + "</h1></div>" +
      (r ? "" : '<div class="bc-ejemplo">' + btn("Completar con datos de ejemplo", { v: "quiet", size: "small", icon: "sparkles", act: "ejemplo", a: { "data-k": "rec" } }) + "</div>") +
      '<div class="ez-rg' + (ult ? "" : " ez-rg--solo") + '"><div class="stack ez-form">' +
      '<div class="nwt-tabs bc-subtabs"><div class="nwt-tabs__list" role="tablist" aria-label="Pasos">' + REC_TABS.map(([k, tx]) => '<button type="button" class="nwt-tabs__tab' + (k === T ? " nwt-tabs__tab--active" : "") + '" role="tab" aria-selected="' + (k === T) + '" data-act="e-tab" data-v="' + k + '"><span class="nwt-tabs__label"><span class="nwt-tabs__label-text">' + tx + (conErr(k) ? ' <span class="ez-tab-err" aria-label="falta completar">●</span>' : "") + "</span></span></button>").join("") + "</div></div>" +
      cuerpo + "</div>" +
      (!ult ? "" : '<aside class="ez-prev"><span class="ez-prev__t">' + ic("eye") + 'Así lo verán los conectores</span><p class="ez-prev__x">Es la tarjeta que cada conector ve cuando le sugerimos este recurso a una persona.</p><div class="ez-prev__c"><div class="ez-prev__h">' + (c ? ezIco(x.cat) : ezIco(null, "shapes", 0)) + "<div><span>" + esc(ent(ENT).nombre) + '</span><b class="ez-prev__nombre">' + esc(nombre || "Tu recurso") + "</b></div></div>" +
      '<div class="ez-prev__p">' + (x.forma ? "<span>" + esc(cuandoTxt({ tiempo: t })) + "</span>" : "") + (x.modo ? "<span>" + esc(MODO_T[x.modo]) + "</span>" : "") + "<span>" + (cupo ? cupo + " plazas" : "Sin límite") + "</span>" + (x.urg ? "<span>" + (x.urg === "Urgente" ? "24 h" : "5 días") + "</span>" : "") + "</div>" +
      '<p class="ez-prev__s"><i></i>' + (c ? "Se sugiere a quien marque " + esc(c.n) + " en su Mapa" : "Elige una necesidad para ver a quién se sugiere") + "</p></div></aside>") + "</div>" +
      /* Paso a paso: la barra inferior cambia de paso; en el último guarda (con el relleno de ejemplo al 2.º toque). */
      '<div class="ez-bar">' + (T === "catalogo" ? "<span></span>" : btn("Atrás", { v: "quiet", act: "e-prev" })) + (ult ? btn(r ? "Guardar cambios" : "Publicar en la red", { act: "rec-guardar", a: { id: "btn-sig" } }) : btn("Continuar", { act: "e-next", a: { id: "btn-sig" } })) + "</div></div>";
  }
  const MODO_T = { Libre: "Acceso libre", "Inscripción": "Inscripción", Solicitud: "Por solicitud" };
  const MODO_D = { Libre: "Sin decisión", "Inscripción": "Plaza directa si hay sitio", Solicitud: "Decides tú" };
  const ezCampo = (k) => (b) => { D.datos[k] = b.dataset.v; delete D.err[k]; ezRe('[data-act="' + b.dataset.act + '"][data-v="' + b.dataset.v + '"]'); };
  /* El nombre es un campo propio: actualiza la vista previa sin repintar y no pierde el foco. */
  document.addEventListener("input", (e) => {
    const t = e.target; if (!t.dataset || t.dataset.ezF == null) return;
    D.datos[t.dataset.ezF] = t.value; delete D.err[t.dataset.ezF]; t.removeAttribute("aria-invalid");
    const m = document.querySelector('.ez-err[data-k="' + t.dataset.ezF + '"]'); if (m) m.remove();
    const v = document.querySelector(".ez-prev__nombre"); if (v) v.textContent = t.value.trim() || "Tu recurso";
  });
  const validarRec = () => {
    D.err = {}; const x = D.datos;
    REQ_REC.forEach((k) => { if (!String(x[k] || "").trim()) D.err[k] = "Este dato es obligatorio."; });
    if (!x.catalogo) D.err.catalogo = "Elige un recurso del catálogo o «No está en el catálogo».";
    if (!x.forma) D.err.forma = "Elige cómo ocurre.";
    if (!x.inicio) D.err.inicio = "Pon la fecha de inicio.";
    if (((x.forma === "recurrente" && x.cada !== "mes") || x.forma === "sesiones") && !(x.dias || []).length) D.err.dias = "Marca al menos un día.";
    if (x.forma === "sesiones" && !x.fin) D.err.fin = "Pon la fecha de la última sesión.";
    else if (x.fin && x.inicio && x.fin < x.inicio) D.err.fin = "La fecha final no puede ser anterior a la de inicio.";
    if (x.cupo && !/^[1-9]\d*$/.test(String(x.cupo).trim())) D.err.cupo = "Escribe un número de plazas, o déjalo vacío.";
    return !Object.keys(D.err).length;
  };
  const rellenarRec = () => { Object.keys(EJ_REC).forEach((k) => { if (!String(D.datos[k] || "").trim() || D.err[k]) D.datos[k] = EJ_REC[k]; }); };

  /* ── ficha de persona (conector y entidad) ── */
  const vistos = new Set();
  function ficha(id) {
    const p = per(id), volver = '<a class="bc-back" href="#/personas">← ' + (ROL === "entidad" ? "Personas" : "Mis personas") + "</a>";
    if (!p) return '<div class="bc-page">' + volver + '<p class="mut">No existe este expediente.</p></div>';
    if (p.entidad !== ENT) {
      const s = solsDe(p.id).find((x) => rec(x.recurso).entidad === ENT);
      return '<div class="bc-page stack">' + volver + (s ? card(cardH("Ficha mínima") + fichaMinima(p, rec(s.recurso)) + '<div style="margin-top:14px">' + alerta("Le atiende " + esc(ent(p.entidad).nombre) + ". Solo ves lo necesario para decidir su solicitud.", "informative") + "</div>", { cls: "bc-minima" })
        : '<div class="bc-lock">' + ic("lock") + "<div><b>No tienes acceso a este expediente.</b><p class=\"mut\">Pertenece a otra entidad.</p></div></div>") + "</div>";
    }
    if (!vistos.has(p.id)) { vistos.add(p.id); S.accesos.push({ persona: p.id, quien: ROL === "entidad" ? "Coordinación" : con(YO).nombre, entidad: ENT, cuando: ahora(), para: ROL === "entidad" ? "Coordinación del caso" : "Seguimiento del caso" }); guardar(); }
    const prop = propias(p), aj = ajenas(p);
    const acc = S.accesos.filter((a) => a.persona === p.id).sort((x, y) => y.cuando.localeCompare(x.cuando));
    const tel = p.tel.replace(/\s/g, ""), dims = CAT.dimensiones, nEval = dims.filter((d) => p.mapa[d.id]).length;
    const cnt = (k) => dims.filter((d) => p.mapa[d.id] === k).length;
    
    const acto = (txt, icn, o) => '<' + (o.href ? "a" : 'button type="button"') + ' class="kz-act' + (o.main ? " kz-act--main" : "") + '"' + (o.href ? ' href="' + o.href + '"' : "") + ">" + ic(icn) + "<span>" + txt + "</span></" + (o.href ? "a" : "button") + ">";
    const accs = (v) => acto("Llamar", "phone", { href: "tel:" + tel, main: true }) + acto("Mensaje", "message-circle", { href: "sms:" + tel }) + acto("Postular<span class=\"kz-x\"> a un recurso</span>", "plus", { href: "#/persona/" + encodeURIComponent(p.id) + "/postular", main: true });
    const hero = '<div class="kz-barw"><div class="kz-pin" aria-hidden="true">' + avatar(ini(nom(p)), p.origen === "autorregistro" ? "amber" : "blue", "medium") + "<h2>" + esc(nom(p)) + '</h2><div class="kz-acts">' + accs() + '</div></div></div><section class="kz-hero"><div class="kz-hero__top"><a class="kz-round kz-round--dk" href="#/personas" aria-label="' + (ROL === "entidad" ? "Volver a Personas" : "Volver a Mis personas") + '">' + ic("chevron-left") + '</a><span class="kz-id">' + esc(p.id) + '</span>' + (p.entidad === ENT ? '<span class="kz-red" title="Esta persona ya está registrada en tu entidad">' + ic("building") + "De tu red · " + esc(ent(ENT).nombre) + "</span>" : "") + "</div>" +
      '<div class="kz-hero__p">' + avatar(ini(nom(p)), p.origen === "autorregistro" ? "amber" : "blue", "large") + '<div class="grow"><h1>' + esc(nom(p)) + "</h1><p>" + esc(p.municipio + " " + p.cp + " · " + p.idioma + " · " + p.canal) + "</p>" +
      '<p class="kz-hero__c">' + (p.conector ? "Conector · " + esc(con(p.conector).nombre) : '<span class="kz-pend">Por asignar a un conector</span>') + "</p></div></div>" +
      '<div class="kz-acts">' + acto("Llamar", "phone", { href: "tel:" + tel, main: true }) + acto("Mensaje", "message-circle", { href: "sms:" + tel }) + acto("Postular<span class=\"kz-x\"> a un recurso</span>", "plus", { href: "#/persona/" + encodeURIComponent(p.id) + "/postular", main: true }) + "</div></section>";
    const asig = !p.conector && ROL === "entidad" ? '<section class="kz-card kz-asig" aria-labelledby="asig-t"><div class="kz-asig__h">' + ic("user-plus", "kz-asig__ico") + '<div><h2 id="asig-t">Asignar conector</h2><p>Sin conector no empieza el acompañamiento.</p></div></div><div class="row kz-asig__row">' + selConector(p.id) + btn("Asignar", { act: "asignar", a: { "data-p": p.id } }) + "</div></section>" : "";
    const mapa = card('<div class="kz-card-h"><h2>Mapa de Vida</h2><span class="kz-mut">' + nEval + " de " + dims.length + "</span></div>" +
      '<div class="bc-rd bc-rd--ficha">' + mapaRadar(p.mapa) + '<div class="bc-mapa">' + bloquesMapa(p.mapa, true) + '</div></div><div class="bc-clave"><span><i class="bc-lg bc-lg--r"></i>Necesita apoyo</span><span><i class="bc-lg bc-lg--a"></i>En proceso</span><span><i class="bc-lg bc-lg--v"></i>Estable</span></div>' +
      (p.mapaTipo === "corto" ? '<p class="kz-nota">Versión corta: el resto se completa en la entrevista.</p>' : "") +
      "", { id: "mapa", cls: "kz-card" });
    const itin = card('<div class="kz-card-h"><h2>Itinerario</h2><span class="kz-mut">' + prop.length + "</span></div>" +
      (prop.length ? prop.map((s) => { const r = rec(s.recurso); return '<div class="kz-it"><div class="grow"><b>' + esc(r.nombre) + "</b><span>" + (r.entidad === ENT ? "Tu entidad" : esc(ent(r.entidad).nombre)) + " · " + fecha(s.fecha) + "</span>" + usoBloque(s) + "</div>" + st(s.estado) + "</div>"; }).join("") : '<p class="kz-vacio">Sin recursos todavía.</p>') +
      '<div class="kz-post">' + btn("Postular a un recurso", { v: "quiet", size: "small", icon: "plus", href: "#/persona/" + encodeURIComponent(p.id) + "/postular", a: { id: "btn-postular" } }) + "</div>", { id: "itinerario", cls: "kz-card" });
    const otras = card('<div class="kz-card-h"><h2>En otras entidades</h2>' + tag(p.consent.entidades ? "Autorizado" : "Sin permiso", p.consent.entidades ? "positive" : "neutral") + "</div>" +
      (!p.consent.entidades ? '<div class="bc-lock">' + ic("lock") + "<div><b>No autorizó compartir su itinerario.</b><p class=\"mut\" style=\"font-size:14px\">No ves si participa en otras entidades.</p></div></div>"
        : aj.length ? aj.map((s) => { const r = rec(s.recurso); return '<div class="kz-it"><div class="grow"><b>' + esc(ent(r.entidad).nombre) + "</b><span>" + esc(r.nombre) + " · " + esc(r.cat) + "</span></div>" + st(s.estado) + "</div>"; }).join("") + '<p class="kz-nota">Nunca ves su diagnóstico ni sus notas.</p>'
          : '<p class="kz-vacio">No participa en otras entidades.</p>'), { id: "otras", cls: "kz-card" });
    const accesos = '<details class="kz-acc" id="accesos" open><summary>' + ic("eye") + "<span>" + acc.length + (acc.length === 1 ? " consulta registrada" : " consultas registradas") + "</span>" + ic("chevron-right") + "</summary>" +
      acc.map((a) => '<div class="kz-it"><div class="grow"><b>' + esc(a.quien) + " · " + esc(ent(a.entidad).nombre) + "</b><span>" + cuando(a.cuando) + " · " + esc(a.para) + "</span></div></div>").join("") + '<p class="kz-nota">La persona puede ver esta lista.</p></details>';
    const perfil = '<details class="kz-card kz-perfil" open><summary><h2>Perfil y consentimientos</h2>' + ic("chevron-down") + '</summary><div class="bc-kv">' + [["Fecha de nacimiento", fecha(p.nac)], ["Documento nacional", p.docTipo + (p.doc ? " · " + p.doc : "")], ["Teléfono", p.tel], ["Email", p.email || "—"], ["Ubicación", p.municipio + " · " + p.cp], ["Idioma", p.idioma], ["Canal preferido", p.canal], ["Alta", fecha(p.alta) + " · " + ent(p.entidad).nombre]].map(([k, v]) => "<div><span>" + k + "</span><b>" + esc(v) + "</b></div>").join("") + "</div>" +
      CAT.consentimientos.map((c) => '<div class="kz-it">' + ic(p.consent[c.id] ? "check-circle" : "close-circle") + '<span class="grow">' + esc(c.txt) + "</span>" + tag(p.consent[c.id] ? "Sí" : "No", p.consent[c.id] ? "positive" : "neutral") + "</div>").join("") + "</details>";
    const gS = ROL === "entidad" ? spGrupo(p) : null, sols = gS && (gS.ab.length || gS.de.length) ? '<article class="sp-card' + (solCol.has(p.id) ? "" : " sp-card--abierta") + '" id="solicitudes" aria-label="Solicitudes a tu entidad"><div class="sp-row sp-row--fija"><button type="button" class="sp-row__tg" data-act="sol-plegar" data-p="' + esc(p.id) + '" aria-expanded="' + !solCol.has(p.id) + '" aria-controls="b-' + esc(p.id) + '"><span class="sp-row__n"><b>Solicitudes a tu entidad</b><small>' + (gS.ab.length ? gS.ab.length + " por decidir" : "Todo decidido") + '</small></span></button><button type="button" class="sp-row__ch" data-act="sol-plegar" data-p="' + esc(p.id) + '" aria-expanded="' + !solCol.has(p.id) + '" aria-label="' + (solCol.has(p.id) ? "Desplegar" : "Plegar") + '">' + ic("chevron-down") + '</button></div><div class="sp-card__b" id="b-' + esc(p.id) + '">' + spLinea(gS) + spSols(gS) + "</div></article>" : "";
    return '<div class="kz-ficha">' + hero + asig + sols + '<h2 class="kz-sec">Expediente</h2><div class="kz-body"><div class="kz-col"><div style="order:1">' + mapa + '</div><div style="order:5">' + perfil + '</div></div><div class="kz-col"><div style="order:2">' + itin + '</div><div style="order:2">' + famCard(p) + '</div><div style="order:2">' + notasCard(p) + comCard(p) + '</div><div style="order:3">' + otras + '</div><div style="order:4">' + accesos + "</div></div></div></div>";
  }

  /* Postular es una pantalla propia (no un modal): elegir el recurso y confirmar en la barra inferior. */
  let postSel = null, postDesde = null, postAcomp = [];
  /* Consumo de un beneficio recurrente (diario o semanal): cuánto lleva y cuándo lo usó. */
  const usosDe = (pid, rid) => (S.usos || []).filter((u) => u.persona === pid && u.recurso === rid && u.estado === "Usó").map((u) => u.fecha).sort();
  const usoBloque = (s) => {
    const r = rec(s.recurso), t = r.tiempo || {}; if (t.forma !== "recurrente" || !r.limite || s.estado !== "Aprobada") return "";
    const fr = { dia: "Diario", semana: "Semanal", mes: "Mensual" }[t.cada] || "Recurrente";
    const u = usosDe(s.persona, s.recurso), n = u.length, m = r.limite, un = t.cada === "dia" ? (n === 1 ? "día" : "días") : (n === 1 ? "vez" : "veces");
    return '<div class="uso"><div class="uso__h"><b>Usó ' + n + (m ? " de " + m : "") + " " + un + "</b><span>" + fr + (n ? " · Último: " + fecha(u[n - 1]) : " · Aún sin usos") + "</span></div>" +
      (m ? '<div class="uso__b" role="img" aria-label="' + n + " de " + m + ' usos"><i style="width:' + Math.min(100, Math.round(n / m * 100)) + '%"></i></div>' : "") +
      (s.acompanantes || []).map((a) => { const f = per(a); return f ? '<div class="uso__a"><span>' + esc(f.nombre) + "</span><b>" + usosDe(a, s.recurso).length + (m ? " de " + m : "") + "</b></div>" : ""; }).join("") +
      (n ? '<details class="uso__d"><summary>Ver usos</summary><ul>' + u.slice().reverse().map((x) => "<li>" + fecha(x) + "</li>").join("") + "</ul></details>" : "") + "</div>";
  };
  /* Postular · cuándo empieza: primera fecha (o entrada, en una estadía) y aviso si se cruza con otro recurso. */
  function kzCuando(p) {
    const r = rec(postSel); if (!r) return "";
    const est = (r.tiempo || {}).forma === "estadia", fechas = proximas(r, 4);
    if (!postDesde || (!est && !fechas.includes(postDesde))) postDesde = est ? hoy() : fechas[0] || null;
    const choque = solape(p.id, r, postDesde), fs = (r.config || {}).acompanantes ? famDe(p.id) : [], max = (r.config || {}).maxAcompanantes || 99;
    postAcomp = postAcomp.filter((id) => fs.some((f) => f.id === id && !motivoFam(f, r)));
    const conQuien = !fs.length ? "" : '<h2>Con quién</h2><div class="kz-fechas" role="group" aria-label="Acompañantes">' + fs.map((f) => { const mot = motivoFam(f, r), on = postAcomp.includes(f.id), dis = !!mot || (!on && postAcomp.length >= max); return '<button type="button" class="bc-chip" aria-pressed="' + on + '"' + (dis ? " disabled" : ' data-act="k-pos-fam" data-fid="' + f.id + '"') + ' title="' + esc(mot) + '">' + esc(f.nombre) + " · " + esc(f.vinculo) + "</button>"; }).join("") + "</div>" +
      (fs.some((f) => motivoFam(f, r)) ? '<p class="kz-sub">' + fs.filter((f) => motivoFam(f, r)).map((f) => esc(f.nombre) + ": " + esc(motivoFam(f, r).toLowerCase())).join(" · ") + "</p>" : "") +
      '<p class="kz-sub">Ocupa ' + (1 + postAcomp.length) + (postAcomp.length ? " plazas" : " plaza") + (r.cupo ? " · quedan " + usoRec(r).libres : "") + "</p>";
    return '<section class="kz-cuando" aria-label="Cuándo empieza"><h2>Cuándo empieza</h2>' +
      (est ? '<label class="kz-fecha"><span>Entrada</span><input type="date" data-pos-desde value="' + esc(postDesde) + '"></label>'
        : fechas.length > 1 && r.tiempo.forma !== "unico" ? '<div class="kz-fechas" role="group" aria-label="Primera fecha">' + fechas.map((f) => '<button type="button" class="bc-chip" aria-pressed="' + (f === postDesde) + '" data-act="k-pos-desde" data-v="' + f + '">' + fCorta(f) + "</button>").join("") + "</div>"
        : '<p class="kz-sub">' + esc(cuandoTxt(r)) + "</p>") +
      conQuien + (choque ? alerta("Ese día ya tiene <b>" + esc(choque.nombre) + "</b> a una hora que se cruza. Elige otra fecha o postula igualmente.", "warning") : "") + "</section>";
  }
  function kPostular(id) {
    const p = per(id);
    if (!p || p.entidad !== ENT) return kPersonas();
    const tiene = new Set(solsDe(p.id).filter((s) => s.estado !== "Rechazada").map((s) => s.recurso));
    /* Una necesidad a la vez: con algo en curso de esa categoría no se puede pedir otro. */
    const enCurso = (r) => !!enCursoDe(p.id, r);
    const libres = S.recursos.filter((r) => !tiene.has(r.id) && !r.pausado && !enCurso(r));
    if (!postSel || !libres.some((r) => r.id === postSel)) postSel = (libres.find((r) => r.entidad !== ENT) || libres[0] || {}).id || null;
    const fila = (r) => {
      const dis = tiene.has(r.id) || r.pausado || enCurso(r), on = r.id === postSel, mio = r.entidad === ENT;
      return '<div class="bc-opt kz-rec' + (on ? " on" : "") + (dis ? " kz-rec--off" : "") + '"' + (dis ? "" : ' data-act="k-pos-sel" data-r="' + r.id + '"') + '><div class="nwt-radio-button' + (on ? " nwt-radio-button--checked" : "") + '" role="radio" aria-checked="' + on + '" aria-disabled="' + dis + '" tabindex="' + (dis ? -1 : 0) + '">' +
        '<span class="kz-rec__ico' + (mio ? "" : " kz-rec__ico--der") + '">' + ic(KZ_ICO[r.cat] || "hands-heart") + '</span><span class="nwt-radio-button__label kz-rec__t">' + esc(r.nombre) + '<span class="kz-rec__m"><span class="kz-who' + (mio ? "" : " kz-who--der") + '">' + esc(ent(r.entidad).nombre) + "</span></span>" +
        '<span class="kz-rec__m">' + (tiene.has(r.id) ? "Ya asignado" : r.pausado ? "Pausado" : enCurso(r) ? "Ya tiene " + esc(r.cat) + " en curso" : esc(cuandoTxt(r)) + " · " + esc(r.modo) + " · " + (r.urg === "Urgente" ? "Urgente · 24 h" : r.modo === "Solicitud" ? "Plazo 5 días" : "Sin plazo")) + "</span></span>" +
        '<div class="nwt-radio-button__control"><div class="nwt-radio-button__dot"></div></div></div></div>' + (on ? kzCuando(p) : "");
    };
    return '<div class="kz-wizwrap kz-sugs kz-postular"><div class="kz-top"><a class="kz-round" href="#/persona/' + encodeURIComponent(p.id) + '" aria-label="Volver a la ficha">' + ic("chevron-left") + "</a></div>" +
      "<h1>Postular a un recurso</h1><p class=\"kz-sub\">Para " + esc(nom(p)) + ". Si es de otra entidad, le llega a su bandeja.</p>" +
      '<div class="kz-reclist" role="radiogroup" aria-label="Recurso">' + S.entidades.map((e) => S.recursos.filter((r) => r.entidad === e.id).map(fila).join("")).join("") + "</div>" +
      '<div class="kz-foot">' + btn("Cancelar", { v: "quiet", size: "large", href: "#/persona/" + encodeURIComponent(p.id) }) + btn("Postular", { size: "large", act: "postular", a: { "data-p": p.id, id: "btn-postular", ...(postSel ? {} : { disabled: "" }) } }) + "</div></div>";
  }

  /* ── armazón por rol: sidebar del SDK + pestañas en móvil ── */
  const MENU = {
    ciudadano: () => yoP() ? [["inicio", "Mi expediente", "home", "#/inicio"], ["recursos", "Mis recursos", "hands-heart", "#/recursos"], ["agenda", "Agenda", "calendar", "#/agenda"], ["buscar", "Buscar ayuda", "search", "#/buscar"], ["mapa", "Mi Mapa de Vida", "clipboard-list", "#/mapa"], ["privacidad", "Privacidad", "shield-check", "#/privacidad"]]
      : [["inicio", "Inicio", "home", "#/inicio"], ["registro", "Registrarme", "user-plus", "#/registro/1"]],
    conector: () => [["personas", "Mis personas", "users", "#/personas"], ["registrar", "Registrar persona", "user-plus", "#/registrar/1"], ["mis-recursos", "Recursos de mi entidad", "calendar", "#/mis-recursos"], ["red", "Recursos de entidades", "building", "#/red"]],
    entidad: () => { const mis = S.personas.filter((p) => p.entidad === ENT).length, asig = S.personas.filter((p) => p.entidad === ENT && !p.conector).length, sol = entrantesDe().length; return [["resumen", "Resumen", "home", "#/resumen"], ["recursos", "Mis recursos", "hands-heart", "#/recursos"], ["conectores", "Conectores", "handshake", "#/conectores"], ["comunicados", "Comunicados", "megaphone", "#/comunicados", (S.comunicados || []).filter((c) => c.estado === "Por aprobar" && c.firma.tipo === "entidad" && c.firma.id === ENT).length], ["personas", "Personas", "users", "#/personas", 0, [["personas", "Mis personas", "#/personas", mis, true], ["solicitudes", "Recursos solicitados", "#/personas/solicitudes", sol], ["asignar", "Asignar conector", "#/personas/asignar", asig], ["verificar", "Por verificar", "#/personas/verificar", porVerificar().length]]]]; }
  };
  const CORTO = { "Resumen de la red": "Red", "Recursos de mi entidad": "Mi entidad", "Agenda": "Agenda", "Mi expediente": "Inicio", "Mis recursos": "Recursos", "Mi Mapa de Vida": "Mapa", "Mis personas": "Personas", "Registrar persona": "Registrar", "Recursos de entidades": "Recursos", "Buscar ayuda": "Buscar" };
  const QUIEN = {
    ciudadano: () => { const p = yoP(); return p ? [nom(p), "Ciudadano", ini(nom(p)), "orange"] : ["Invitado", "Ciudadano", "?", "orange"]; },
    conector: () => [con(YO).nombre, "Conector · " + ent(ENT).nombre, "LR", "blue"],
    entidad: () => ["Coordinación", ent(ENT).nombre, "AP", "teal"]
  };
  /* Selector de entidad propio (no <select> nativo): nombre completo, zona y la activa marcada. */
  let entOp = false;
  const selEnt = (corto) => {
    if (MIS_ENT.length < 2) return "";
    const k = corto ? "c" : "s", ab = entOp === k;
    return '<div class="bc-ent' + (corto ? " bc-ent--c" : "") + '">' + (corto ? "" : '<span class="bc-ent__l">Trabajas en</span>') +
      '<button type="button" class="bc-ent__b" data-act="ent-pop" data-k="' + k + '" aria-haspopup="menu" aria-expanded="' + ab + '" aria-label="Entidad en la que trabajas: ' + esc(ent(ENT).nombre) + '">' + ic("building") + '<span class="bc-ent__n">' + esc(ent(ENT).nombre) + "</span>" + ic(ab ? "chevron-up" : "chevron-down") + "</button>" +
      (ab ? '<div class="bc-ent__m" role="menu" aria-label="Entidades">' + MIS_ENT.map((id) => '<button type="button" role="menuitemradio" aria-checked="' + (id === ENT) + '" data-act="ent-set" data-v="' + id + '"><span class="grow"><b>' + esc(ent(id).nombre) + "</b><small>" + esc(ent(id).zona) + "</small></span>" + (id === ENT ? ic("check") : "") + "</button>").join("") + "</div>" : "") + "</div>";
  };
  function shell(activo, body) {
    const m = MENU[ROL](), [n, sub, i, col] = QUIEN[ROL]();
    const badge = (c, neutro) => c ? '<span class="bc-badge' + (neutro ? " bc-badge--n" : "") + '" aria-label="' + c + (neutro ? " en total" : " pendientes") + '">' + c + "</span>" : "";
    /* Sin registro el flujo es autoasistido: sin panel lateral ni menú hasta que la persona tiene expediente. */
    const solo = ROL === "ciudadano" && !yoP();
    let side = '<aside class="nwt-sidebar nwt-sidebar--mode-fixed nwt-sidebar--open"><div class="nwt-sidebar__toolbar"><div class="nwt-sidebar__toolbar__logo"><a class="bc-brand" href="' + m[0][3] + '">' + MARCA + PALABRA + '</a></div></div><div class="nwt-sidebar__content"><nav class="nwt-sidebar__menu" aria-label="Menú principal"><ul class="nwt-sidebar__menu__list">' +
      m.map(([k, t, icn, h, c, subs]) => {
        const enGrupo = subs && subs.some(([sk]) => sk === activo);
        const li = '<li class="nwt-sidebar__menu__item' + (k === activo && !subs ? " nwt-sidebar__menu__item--active" : "") + (enGrupo ? " bc-grupo--on" : "") + '"><a class="nwt-sidebar__menu__link" href="' + h + '"' + (subs ? "" : ' data-nav="' + k + '"') + (k === activo && !subs ? ' aria-current="page"' : "") + '><div class="nwt-sidebar__menu__content">' + ic(icn, "nwt-sidebar__menu__icon") + '<span class="nwt-sidebar__menu__label">' + t + "</span>" + badge(c) + "</div></a>";
        return li + (subs ? '<ul class="bc-sub">' + subs.map(([sk, st2, sh, sc, sn]) => '<li><a class="bc-sub__a' + (sk === activo ? " bc-sub__a--on" : "") + '" href="' + sh + '" data-nav="' + sk + '"' + (sk === activo ? ' aria-current="page"' : "") + ">" + ({ personas: ic("users", "bc-sub__i"), asignar: '<i class="ti ti-arrows-exchange bc-sub__i"></i>', solicitudes: '<i class="ti ti-inbox bc-sub__i"></i>', verificar: ic("users-group", "bc-sub__i") }[sk] || "") + "<span>" + st2 + "</span>" + badge(sc, true) + "</a></li>").join("") + "</ul>" : "") + "</li>";
      }).join("") +
      '</ul></nav><div class="nwt-sidebar__footer"><div class="bc-yo">' + avatar(i, col, "small") + '<span class="grow"><b>' + esc(n) + "</b>" + esc(sub) + '</span></div>' + selEnt() + '<button class="nwt-sidebar__footer__logout" type="button" data-act="salir">' + ic("logout", "nwt-sidebar__menu__icon") + '<span class="nwt-sidebar__footer__logout__label">Salir de la demo</span></button></div></div></aside>';
    /* En móvil la navegación es una barra inferior, como en una app nativa. */
    let tabs = '<nav class="bc-tabbar" aria-label="Menú">' + m.map(([k, t, icn, h, c, subs]) => {
      /* En móvil el grupo Personas es un solo ítem; sus tres vistas son pestañas dentro de la pantalla. */
      const on = subs ? subs.some(([sk]) => sk === activo) : k === activo, n = subs ? subs.filter(([, , , , sn]) => !sn).reduce((x, [, , , sc]) => x + (sc || 0), 0) : c;
      return '<a href="' + h + '" data-nav="' + k + '"' + (on ? ' aria-current="page"' : "") + ">" + ic(icn) + "<span>" + esc(CORTO[t] || t) + "</span>" + badge(n) + "</a>";
    }).join("") + "</nav>";
    if (solo) { side = ""; tabs = ""; }
    const top = '<header class="bc-top"><a class="bc-brand" href="' + m[0][3] + '">' + MARCA + PALABRA + '</a>' + selEnt(true) + avatar(i, col, "small") + "</header>";
    return '<div class="bc-shell' + (solo ? ' bc-shell--solo' : '') + '">' + side + '<div class="bc-main">' + top + "<main>" + body + "</main>" + tabs + "</div></div>";
  }

  /* ── rutas por rol ── */
  const RUTAS = {
    ciudadano: [[/^#\/inicio$/, () => ["inicio", cInicio()]], [/^#\/agenda$/, () => ["agenda", cAgenda()]], [/^#\/registro\/(\d)(?:\/(\d))?$/, (m) => ["registro", cRegistro(+m[1], +(m[2] || 1))]], [/^#\/recursos$/, () => ["recursos", cRecursos()]], [/^#\/buscar(?:\/(.+))?$/, (m) => { if (m[1]) { czNec = decodeURIComponent(m[1]); czQ = ""; history.replaceState(null, "", "#/buscar"); } return ["buscar", cBuscar()]; }], [/^#\/mapa$/, () => ["mapa", cMapa()]], [/^#\/privacidad$/, () => ["privacidad", cPrivacidad()]]],
    conector: [[/^#\/personas$/, () => ["personas", kPersonas()]], [/^#\/registrar\/(\d)$/, (m) => ["registrar", kRegistrar(+m[1])]], [/^#\/listo\/(.+)$/, (m) => ["registrar", kListo(m[1])]], [/^#\/red$/, () => ["red", kRed()]], [/^#\/persona\/([^/]+)\/postular$/, (m) => ["personas", kPostular(decodeURIComponent(m[1]))]], [/^#\/persona\/(.+)$/, (m) => ["personas", ficha(decodeURIComponent(m[1]))]]],
    entidad: [[/^#\/resumen$/, () => ["resumen", eResumen()]], [/^#\/personas$/, () => ["personas", ePersonas()]], [/^#\/conectores$/, () => ["conectores", eConectores()]], [/^#\/personas\/(solicitudes|asignar)$/, (m) => [m[1], eBandeja(m[1])]], [/^#\/bandeja$/, () => { location.replace("#/personas/asignar"); return ["personas", ""]; }], [/^#\/recursos$/, () => ["recursos", eRecursos()]], [/^#\/recurso\/(.+)$/, (m) => ["recursos", eRecurso(m[1])]], [/^#\/persona\/([^/]+)\/postular$/, (m) => ["personas", kPostular(decodeURIComponent(m[1]))]], [/^#\/persona\/(.+)$/, (m) => ["personas", ficha(decodeURIComponent(m[1]))]]]
  };
  RUTAS.ciudadano.unshift([/^#\/familia$/, () => ["inicio", cFamilia()]], [/^#\/familia\/nuevo$/, () => ["inicio", famNuevo(S.ciudadano, "#/familia")]]);
  ["conector", "entidad"].forEach((r) => RUTAS[r].unshift([/^#\/persona\/([^/]+)\/familiar$/, (m) => ["personas", famNuevo(decodeURIComponent(m[1]), "#/persona/" + m[1])]]));
  RUTAS.ciudadano.unshift([/^#\/avisos$/, () => ["inicio", cAvisos()]]);
  RUTAS.entidad.unshift([/^#\/comunicados(?:\/([a-z]+))?$/, (m) => ["comunicados", eComunicados(m[1])]]);
  const PANEL = [/^#\/panel\/([^/]+)(?:\/([a-z]+))?(?:\/(\d{4}-\d{2}-\d{2}))?$/, (m) => [ROL === "entidad" ? "recursos" : "mis-recursos", pRecurso(m[1], m[2], m[3])]];
  RUTAS.conector.unshift(PANEL, [/^#\/mis-recursos$/, () => ["mis-recursos", kMisRecursos()]]);
  RUTAS.entidad.unshift(PANEL);
  RUTAS.entidad.unshift([/^#\/personas\/verificar$/, () => ["verificar", eVerificar()]]);
  const INICIO = { ciudadano: "#/inicio", conector: "#/personas", entidad: "#/resumen", red: "#/red" };
  MENU.red = () => [["red", "Resumen de la red", "building", "#/red"], ["comunicados", "Comunicados", "megaphone", "#/comunicados"]];
  QUIEN.red = () => { const g = gestor(); return [g.nombre, "Red · " + miRed().nombre, ini(g.nombre), "purple"]; };
  RUTAS.red = [[/^#\/red$/, () => ["red", rResumen()]], [/^#\/red\/(e\d+)$/, (m) => ["red", rEntidad(m[1])]], [/^#\/comunicados(?:\/([a-z]+))?$/, (m) => ["comunicados", rComunicados(m[1])]]];
  /* Las franjas bajo la barra de estado y la de gesto toman el color de la pantalla que queda justo detrás. */
  const colorEn = (y) => {
    for (let el = document.elementFromPoint(6, y); el; el = el.parentElement) {
      if (el.dataset && /^#[0-9a-f]{6}$/i.test(el.dataset.tint || "")) return el.dataset.tint.toLowerCase();
      const c = getComputedStyle(el).backgroundColor;
      if (c && !/^rgba\(.*, 0\)$/.test(c) && c !== "transparent") return "#" + (c.match(/\d+/g) || [255, 255, 255]).slice(0, 3).map((n) => (+n).toString(16).padStart(2, "0")).join("");
    }
    return null;
  };
  function tintSafe() {
    const cs = getComputedStyle(document.documentElement), t = parseFloat(cs.getPropertyValue("--bc-safe-top")) || 0, bt = parseFloat(cs.getPropertyValue("--bc-safe-bot")) || 0;
    let f = document.getElementById("bc-safe"); if (!f) { f = document.createElement("div"); f.id = "bc-safe"; f.setAttribute("aria-hidden", "true"); document.body.prepend(f); }
    if (!t) { f.style.display = "none"; return; }
    const top = colorEn(t + 4) || "#ffffff", bot = bt ? colorEn(innerHeight - bt - 4) || top : top;
    f.style.display = ""; f.style.background = top;
    const k = top + bot; if (k !== tintSafe.ult) { tintSafe.ult = k; try { parent.postMessage({ type: "demo-estatus", color: top, bot }, "*"); } catch (e) { /* sin marco */ } }
  }
  window.__tintSafe = tintSafe;
  let tintRaf = 0;
  addEventListener("scroll", () => { if (!tintRaf) tintRaf = requestAnimationFrame(() => { tintRaf = 0; tintSafe(); }); }, { passive: true, capture: true });
  /* Tarjeta de «mi conector» para la persona: quién es, de qué entidad y cómo contactarle. */
  function modalMiConector() {
    const p = yoP(), c = p && p.conector && con(p.conector); if (!c) return "";
    const tel = c.tel ? c.tel.replace(/\s/g, "") : "";
    return '<div class="ez-mb" data-act="cerrar-mi-con"></div><div class="ez-modal cz-con-m" role="dialog" aria-modal="true" aria-labelledby="cz-cm-t"><div class="cz-cm-h">' + (c.foto ? '<img class="ez-foto" src="' + esc(c.foto) + '" alt="" width="64" height="64">' : avatar(ini(c.nombre), "blue", "large")) +
      '<div><h2 id="cz-cm-t">' + esc(c.nombre) + "</h2><p class=\"mut\">" + esc(c.rol) + " · " + esc(ent(c.entidad).nombre) + "</p></div></div>" +
      '<p class="mut">Es la persona que te acompaña en tu proceso. Puedes escribirle o llamarle cuando lo necesites.</p>' +
      (c.ultima ? '<div class="cz-cm-u">' + ic("clock") + "Última actividad: " + esc(c.ultima) + "</div>" : "") +
      '<div class="ez-modal__f">' + btn("Cerrar", { v: "mute", act: "cerrar-mi-con" }) + (c.email ? btn("Escribir", { v: "quiet", href: "mailto:" + esc(c.email) }) : "") + (tel ? btn("Llamar", { href: "tel:" + tel }) : "") + "</div></div>";
  }
  /* Aprobar pide confirmar con un deslizador: un toque suelto no basta. */
  function modalAprobar() {
    const sl = S.solicitudes.find((x) => x.id === aprobando); if (!sl) return "";
    return '<div class="ez-mb" data-act="aprobar-no"></div><div class="ez-modal sp-conf" role="dialog" aria-modal="true" aria-labelledby="sp-ct"><h2 id="sp-ct">Aprobar solicitud</h2><p class="mut">' + esc(spNombre(per(sl.persona))) + " entra a «" + esc(rec(sl.recurso).nombre) + "». Se avisa a su conector.</p>" +
      ((sl.acompanantes || []).length ? '<div class="sp-conf__x">' + ic("users") + "<span>Va con " + esc(vaCon(sl)) + " · ocupa " + plazasDe(sl) + " plazas</span></div>" : "") + (sl.desde ? '<div class="sp-conf__x">' + ic("calendar") + "<span>Desde " + fCorta(sl.desde) + "</span></div>" : "") +
      '<div class="sp-sl" id="sp-sl"><span class="sp-sl__t">Desliza para aprobar</span><button type="button" class="sp-sl__h" data-act="aprobar-ok" aria-label="Aprobar. Desliza a la derecha o pulsa Intro">' + ic("arrow-right") + '</button></div><div class="ez-modal__f">' + btn("Cancelar", { v: "mute", act: "aprobar-no" }) + "</div></div>";
  }
  function render() {
    const h = location.hash, r = RUTAS[ROL].find(([re]) => re.test(h));
    if (!r) { location.replace(INICIO[ROL]); return; }
    const [activo, body] = r[1](h.match(r[0]));
    $("#app").innerHTML = shell(activo, body) + (aprobando ? modalAprobar() : "") + (verMiCon ? modalMiConector() : "") + (czPedir && ROL === "ciudadano" ? modalPedir() : "");
    if (aprobando) { const h = $(".sp-sl__h"); if (h) h.focus(); }
    tintSafe();
    try { parent.postMessage({ type: "demo-ruta", hash: h }, "*"); parent.postMessage({ type: "demo-pista", clave: h, texto: pista() }, "*"); } catch (e) { /* sin marco */ }
  }
  /* La pista del patrón de 3 clics va en el marco de la demo, fuera de la pantalla: no es parte del producto. */
  const CON_RELLENO = ["fam-guardar", "yo-1", "yo-2", "yo-3", "con-1", "con-2", "con-3", "con-mapa", "rec-guardar"];
  function pista() {
    const b = $("#btn-sig"); if (!b || !CON_RELLENO.includes(b.dataset.act)) return null;
    const t = "Toca «" + b.textContent.trim() + "» 2 veces";
    return b.dataset.act === "con-1" ? t + " y prueba otro número." : t + " y se rellena.";
  }
  document.addEventListener("click", (e) => { if ((popOp || conOp) && !e.target.closest(".ez-popw")) { popOp = false; conOp = false; render(); } if (entOp && !e.target.closest(".bc-ent")) { entOp = false; render(); } });
  document.addEventListener("change", (e) => { const id = e.target.dataset && e.target.dataset.fcon; if (!id) return; fCons = e.target.checked ? fCons.concat(id) : fCons.filter((x) => x !== id); render(); const n = document.querySelector('[data-fcon="' + id + '"]'); if (n) n.focus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && (asignando || popOp || conOp || entOp)) { asignando = null; popOp = false; conOp = false; entOp = false; render(); } });
  /* Navegar no es instantáneo en un servicio real: esqueleto breve y entrada escalonada, igual en todas las vistas. */
  const ESPERA_VISTA = 480, ESPERA_ACC = 800, ASIST = /^#\/regist\w+\//;
  let cargaT = 0, hashPrev = location.hash;
  const LISTAS = ":is(.cz-tiles,.cz-lista,.ez-lista,.kz-list,.kz-reclist,.kz-tiles,.sp-lista,.ez-cells,.bc-list)>*";
  function velo(conEsqueleto) {
    clearTimeout(cargaT);
    const m = $("main"); if (!m) return;
    const entra = () => { const mm = $("main"); if (!mm) return; const sk = mm.querySelector(".bc-skel"); if (sk) sk.remove(); mm.classList.remove("bc-carga", "bc-in"); mm.querySelectorAll(LISTAS).forEach((x) => x.style.setProperty("--k", Math.min([...x.parentElement.children].indexOf(x), 10))); void mm.offsetWidth; mm.classList.add("bc-in"); };
    if (!conEsqueleto) return entra();
    m.classList.add("bc-carga");
    m.insertAdjacentHTML("afterbegin", '<div class="bc-skel" role="status" aria-label="Cargando"><i class="sk sk-h"></i><i class="sk sk-s"></i><i class="sk sk-hero"></i><div class="sk-row"><i class="sk sk-c"></i><i class="sk sk-c"></i></div><i class="sk sk-l"></i><i class="sk sk-l"></i><i class="sk sk-l"></i></div>');
    cargaT = setTimeout(entra, ESPERA_VISTA);
  }
  window.addEventListener("hashchange", () => {
    const h = location.hash, mismoAsist = ASIST.test(h) && ASIST.test(hashPrev) && h.split("/")[1] === hashPrev.split("/")[1];
    hashPrev = h; render(); window.scrollTo(0, 0); velo(!mismoAsist);
  });

  /* ── acciones ── */
  function crearPersona(extra) {
    const p = Object.assign({ id: nuevoId(), alta: hoy(), consent: {}, mapa: Object.assign({}, D.mapa), notas: D.notas ? [{ texto: D.notas, autor: ROL === "conector" ? YO : "entidad", entidad: ENT, fecha: ahora() }] : [], email: "", doc: "" }, D.datos, extra);
    if (Array.isArray(p.idioma)) p.idioma = p.idioma.join(", ");
    CAT.consentimientos.forEach((c) => { p.consent[c.id] = !!D.consent[c.id]; });
    S.personas.push(p); return p;
  }
  const faltanMapa = (dims) => dims.filter((d) => !d.opcional && !D.mapa[d.id]).map((d) => d.n);
  /* Patrón de demo: 1.er Continuar marca lo que falta, el 2.º lo completa con ejemplo, el 3.º avanza. */
  function insistir(clave, valido, rellenar) {
    if (valido()) { D.fallo = null; return true; }
    if (D.fallo === clave) { rellenar(); D.err = {}; D.fallo = null; render(); return false; }
    D.fallo = clave; render(); return false;
  }
  const rellenarDatos = () => { const ej = EJEMPLO[D.tipo]; REQ.forEach((k) => { if (!String(D.datos[k] || "").trim() || (k === "cp" && !/^\d{5}$/.test(D.datos.cp))) D.datos[k] = k === "tel" && D.tipo === "con" && D.q ? D.q : ej[k]; }); };
  const rellenarMapa = (dims) => dims.forEach((d) => { if (!D.mapa[d.id]) D.mapa[d.id] = MAPA_EJ[d.id]; });
  const okConsent = () => { if (D.consent.privacidad && D.consent.tratamiento) return true; D.err = { consent: "Faltan los consentimientos obligatorios. Sin ellos no se crea el expediente." }; return false; };
  const okMapa = (dims) => { const f = faltanMapa(dims); if (!f.length) return true; D.err = { mapa: "Falta responder: " + f.join(", ") + "." }; return false; };
  const ACC = {
    salir,
    "empezar-yo": () => { D = nuevo("yo"); ir("#/registro/1"); },
    "empezar-con": () => { D = nuevo("con"); ir("#/registrar/1"); },
    "entrar-ejemplo": () => { S.ciudadano = "BC-2026-0141"; S.recienCreado = null; guardar(); ir("#/inicio"); },
    ejemplo: (b) => {
      const k = b.dataset.k; D.fallo = null;
      if (k === "datos") { D.datos = Object.assign({}, EJEMPLO[D.tipo], D.tipo === "con" && D.busqueda && !D.busqueda.p ? { tel: D.q } : {}); D.err = {}; }
      if (k === "mapa") {
        const paso = +(location.hash.match(/(\d)$/) || [])[1];
        if (D.tipo === "yo") { Object.assign(D.auto, AUTO_EJ); D.err = {}; return render(); }
        const dims = CAT.dimensiones.filter((d) => d.b === CAT.bloques[paso - 4].id);
        dims.forEach((d) => { D.mapa[d.id] = MAPA_EJ[d.id]; }); D.err = {};
      }
      if (k === "rec") { rellenarRec(); D.err = {}; }
      if (k === "recursos") D.recursos = sugeridos().filter((x, i, a) => a.findIndex((y) => y.r.cat === x.r.cat) === i).slice(0, 3).map((x) => x.r.id);
      render();
    },
    chk: (b) => {
      if (b.dataset.c) D.consent[b.dataset.c] = !D.consent[b.dataset.c];
      if (b.dataset.rec) {
        const id = b.dataset.rec, igual = !D.recursos.includes(id) && D.recursos.find((x) => rec(x).cat === rec(id).cat);
        if (igual) return toast("Ya eligió «" + rec(igual).nombre + "» de " + rec(id).cat + ": no se pide lo mismo en dos lugares.");
        D.recursos = D.recursos.includes(id) ? D.recursos.filter((x) => x !== id) : D.recursos.concat(id);
      }
      const on = b.dataset.c ? D.consent[b.dataset.c] : D.recursos.includes(b.dataset.rec);
      b.classList.toggle("on", on); const c = b.querySelector(".nwt-checkbox"); c.classList.toggle("nwt-checkbox--checked", on); c.setAttribute("aria-checked", String(on));
    },
    sem: (b) => {
      D.mapa[b.dataset.d] = b.dataset.v;
      b.parentElement.querySelectorAll(".bc-opt").forEach((x) => { const on = x === b; x.classList.toggle("on", on); const r = x.querySelector(".nwt-radio-button"); r.classList.toggle("nwt-radio-button--checked", on); r.setAttribute("aria-checked", String(on)); });
    },
    ent: (b) => { D.entidad = b.dataset.e; D.entTocada = true; render(); },
    "yo-1": () => { if (insistir("yo-1", okConsent, () => { D.consent.privacidad = D.consent.tratamiento = true; })) { D.err = {}; ir("#/registro/2"); } },
    "yo-2": () => { if (insistir("yo-2", validarDatos, rellenarDatos)) ir("#/registro/3"); },
    "yo-3": () => {
      const n = +((location.hash.match(/^#\/registro\/3\/(\d)$/) || [])[1] || 1), q = AUTO[n - 1];
      const ok = () => { if (D.auto[q.id]) return true; D.err = { auto: "Elige la respuesta que más se parece a tu situación." }; return false; };
      if (insistir("yo-3-" + n, ok, () => { D.auto[q.id] = AUTO_EJ[q.id]; })) { D.err = {}; ir(n < AUTO.length ? "#/registro/3/" + (n + 1) : "#/registro/4"); }
    },
    "c-auto": (b) => {
      D.auto[b.dataset.q] = b.dataset.v; D.err = {};
      const g = b.parentElement; g.querySelectorAll(".bc-opt").forEach((x) => { const on = x === b; x.classList.toggle("on", on); const r = x.querySelector(".nwt-radio-button"); r.classList.toggle("nwt-radio-button--checked", on); r.setAttribute("aria-checked", String(on)); });
      const e = g.closest(".cz-cuerpo") && g.closest(".cz-cuerpo").querySelector(".nwt-alert"); if (e) e.remove();
    },
    "yo-crear": () => {
      D.mapa = window.BC_DERIVAR(D.auto);
      const p = crearPersona({ origen: "autorregistro", entidad: D.entidad, conector: null, estado: "Abierto", mapaTipo: "corto" });
      S.accesos.push({ persona: p.id, quien: "Sistema", entidad: p.entidad, cuando: ahora(), para: "Alta por autorregistro" });
      S.ciudadano = p.id; S.recienCreado = p.id; guardar(); D = null; ir("#/inicio");
    },
    consent: (b) => { const p = yoP(), c = b.dataset.c; p.consent[c] = !p.consent[c]; guardar(); toast(c === "comunicaciones" ? (p.consent[c] ? "Recibirás los comunicados de tus entidades." : "Ya no recibirás comunicados. Los avisos de tus recursos te siguen llegando.") : p.consent[c] ? "Autorizado. Puedes retirarlo cuando quieras." : "Retirado. Las otras entidades ya no ven tu itinerario."); render(); },
    "c-set": (b) => {
      const k = b.dataset.k, g = b.closest('[role="radiogroup"]'); D.datos[k] = b.dataset.v; delete D.err[k];
      g.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      const m = g.parentElement.querySelector(".cz-err"); if (m) m.remove();
    },
    "c-multi": (b) => {
      const k = b.dataset.k, l = czLista(D.datos[k]), v = b.dataset.v; D.datos[k] = l.includes(v) ? l.filter((x) => x !== v) : l.concat(v); delete D.err[k];
      b.setAttribute("aria-checked", String(D.datos[k].includes(v)));
      const m = b.closest(".cz-grupo").querySelector(".cz-err"); if (m) m.remove();
    },
    "c-filtro": (b) => { czFiltro = b.dataset.v; render(); },
    "c-nec": (b) => { czNec = b.dataset.v; render(); },
    "c-pedir": (b) => {
      const p = yoP(), r = rec(b.dataset.r); if (!p || !r) return;
      if (solsDe(p.id).some((s) => s.recurso === r.id && s.estado !== "Rechazada")) return toast("Ya pediste " + r.nombre + ".");
      const otro = enCursoDe(p.id, r);
      if (otro) return toast("Ya pediste " + rec(otro.recurso).nombre + ": no se pide lo mismo en dos lugares.");
      if ((r.config || {}).acompanantes && famDe(p.id).length) { czPedir = { r: r.id, sel: [] }; return render(); }
      pedirCz(p, r, []);
    },
    "c-pedir-fam": (b) => { const id = b.dataset.fid, sl = czPedir.sel; czPedir.sel = sl.includes(id) ? sl.filter((x) => x !== id) : sl.concat(id); render(); const n = document.querySelector('[data-fid="' + id + '"] [role="checkbox"]'); if (n) n.focus(); },
    "c-pedir-no": () => { czPedir = null; render(); },
    "c-pedir-ok": () => { const p = yoP(), r = rec(czPedir.r); if (p && r) pedirCz(p, r, czPedir.sel.slice()); },
    "c-fam-ver": (b) => { const f = per(b.dataset.fid); f.verificacion = "Verificada"; f.verificada = hoy(); f.verificadaPor = ent(per(f.titular).entidad).nombre; guardar(); toast(f.nombre + " ya puede acompañarte."); render(); },
    "c-contacto": () => toast("En la demo no se envían mensajes ni llamadas."),
    probar: (b) => {
      /* «Nuevo» genera un teléfono que nadie tiene: los datos se comparten entre corridas y roles. */
      let v = b.dataset.v;
      if (v === "nuevo") { const usados = new Set(S.personas.map((x) => x.tel.replace(/\s/g, ""))); let n = 123456; while (usados.has("+34600" + n)) n++; v = "+34 600 " + String(n).slice(0, 3) + " " + String(n).slice(3); }
      D.q = v; ACC.buscar();
    },
    buscar: () => {
      const q = String(D.q || "").replace(/\s/g, "");
      if (!q) { D.busqueda = null; return render(); }
      const p = S.personas.find((x) => x.tel.replace(/\s/g, "") === q || (x.doc && x.doc.replace(/\s/g, "") === q));
      D.busqueda = { q, p }; if (!p) D.datos.tel = D.q; render();
    },
    "con-1": () => {
      if (D.busqueda && !D.busqueda.p) { D.fallo = null; return ir("#/registrar/2"); }
      if (D.fallo === "con-1") { D.fallo = null; return ACC.probar({ dataset: { v: "nuevo" } }); }
      D.fallo = "con-1"; toast(D.busqueda ? "Esta persona ya tiene expediente: no se duplica." : "Busca primero si la persona ya tiene expediente.");
    },
    "k-borrar": () => { D.q = ""; D.busqueda = null; D.fallo = null; render(); },
    "k-ir": (b) => { const n = document.getElementById(b.dataset.to); if (n) { n.scrollIntoView({ block: "center" }); n.focus({ preventScroll: true }); } },
    "no-acepta": () => { D = null; toast("Proceso terminado. No se registró ningún dato."); ir("#/personas"); },
    "con-2": () => { if (insistir("con-2", okConsent, () => { D.consent.privacidad = D.consent.tratamiento = true; })) { D.err = {}; ir("#/registrar/3"); } },
    "con-3": () => { if (insistir("con-3", validarDatos, rellenarDatos)) ir("#/registrar/4"); },
    "con-mapa": () => {
      const paso = +location.hash.match(/(\d)$/)[1], dims = CAT.dimensiones.filter((d) => d.b === CAT.bloques[paso - 4].id);
      if (insistir("con-mapa-" + paso, () => okMapa(dims), () => rellenarMapa(dims))) { D.err = {}; ir("#/registrar/" + (paso + 1)); }
    },
    "con-crear": () => {
      const p = crearPersona({ origen: "conector", entidad: ENT, conector: YO, estado: D.recursos.length ? "En seguimiento" : "Abierto", mapaTipo: "completo" });
      D.recursos.forEach((rid, i) => S.solicitudes.push({ id: "s" + Date.now() + i, persona: p.id, recurso: rid, por: ENT, estado: rec(rid).modo === "Solicitud" ? "Pendiente" : "Aprobada", fecha: hoy(), desde: desdeDe(rec(rid)) }));
      S.accesos.push({ persona: p.id, quien: con(YO).nombre, entidad: ENT, cuando: ahora(), para: "Alta y Mapa de Vida" });
      guardar(); D = null; ir("#/listo/" + p.id);
    },
    "rec-pausa": (b) => { const r = rec(b.dataset.r); r.pausado = !r.pausado; guardar(); toast(r.pausado ? r.nombre + " queda pausado: deja de proponerse en la red." : r.nombre + " vuelve a estar activo."); ezRe('[data-act="rec-pausa"][data-r="' + r.id + '"]'); },
    "rec-guardar": () => {
      if (!insistir("rec", validarRec, rellenarRec)) return;
      const x = D.datos, campos = { nombre: x.nombre.trim(), cat: x.cat, catalogo: x.catalogo, formato: x.formato, modo: x.modo, urg: x.urg, cupo: x.cupo ? +x.cupo : undefined, limite: x.forma === "recurrente" && x.limite ? +x.limite : undefined, tiempo: tiempoDe(x), config: { acompanantes: !!x.acomp, maxAcompanantes: x.acomp && x.maxAcomp ? +x.maxAcomp : undefined }, desc: (x.desc || "").trim(), requisitos: (x.requisitos || "").trim() };
      if (D.id === "nuevo") S.recursos.push(Object.assign({ id: "r" + Date.now(), entidad: ENT }, campos)); else Object.assign(rec(D.id), campos);
      guardar(); toast(D.id === "nuevo" ? "Recurso creado. Ya se propone a los conectores de la red." : "Cambios guardados."); D = null; ir("#/recursos");
    },
    filtro: (b) => { filtro = b.dataset.v; render(); },
    filtro2: (b) => { fL = b.dataset.v; render(); },
    "pop-dec": (b) => { const id = b.dataset.s; popOp = popOp === id ? false : id; ezRe(popOp ? '#pop-' + id + ' [role="menuitem"]' : "#btn-otras-" + id); },
    vcon: (b) => { vCon = b.dataset.v; render(); },
    vsol: (b) => { vSol = b.dataset.v; render(); },
    "sol-plegar": (b) => { const i = b.dataset.p; solCol.has(i) ? solCol.delete(i) : solCol.add(i); render(); },
    "sol-abrir": (b) => { const i = b.dataset.p; solAb.has(i) ? solAb.delete(i) : solAb.add(i); render(); },
    chat: (b) => { const c = con(b.dataset.c); toast("El chat con " + c.nombre + " se abrirá aquí."); },
    "ver-con": (b) => { fCons = [b.dataset.c]; filtro = "todas"; busca = ""; ir("#/personas"); },
    "quitar-con": () => { fCons = []; render(); },
    "pop-con": () => { conOp = !conOp; ezRe("#btn-fcon"); },
    "e-next": () => { const o = REC_TABS.map((x) => x[0]), k = o.indexOf(D.tab || "catalogo"); D.tab = o[Math.min(k + 1, o.length - 1)]; ezRe("#btn-sig"); },
    "e-prev": () => { const o = REC_TABS.map((x) => x[0]), k = o.indexOf(D.tab || "catalogo"); D.tab = o[Math.max(k - 1, 0)]; ezRe("#btn-sig"); },
    "e-tab": (b) => { D.tab = b.dataset.v; ezRe('[data-act="e-tab"][data-v="' + b.dataset.v + '"]'); },
    "e-sel": (b) => { ezSel = b.dataset.id; ezRe('[data-act="e-sel"][data-id="' + b.dataset.id + '"]'); },
    "e-ir": (b) => { ezSel = b.dataset.id; ir({ solicitudes: "#/personas/solicitudes", verificar: "#/personas/verificar", comunicados: "#/comunicados/aprobar" }[b.dataset.v] || "#/personas/asignar"); },
    "e-cat": (b) => { const x = D.datos, k = KAT(x.catalogo); x.cat = b.dataset.v; if (k && k.cat !== x.cat) x.catalogo = ""; delete D.err.cat; ezRe('[data-act="e-cat"][data-v="' + b.dataset.v + '"]'); },
    "e-kat": (b) => { const x = D.datos, k = KAT(b.dataset.v), previo = KAT(x.catalogo); x.catalogo = b.dataset.v; if (k) { if (!x.nombre || (previo && x.nombre === previo.n)) x.nombre = k.n; aplicarFmt(x, k.f); } delete D.err.catalogo; delete D.err.nombre; ezRe('[data-act="e-kat"][data-v="' + b.dataset.v + '"]'); },
    "e-fmt": (b) => { aplicarFmt(D.datos, b.dataset.v); delete D.err.formato; ezRe('[data-act="e-fmt"][data-v="' + b.dataset.v + '"]'); },
    "e-forma": (b) => { const x = D.datos; x.forma = b.dataset.v; if (x.forma === "recurrente" && !x.cada) x.cada = "semana"; delete D.err.forma; ezRe('[data-act="e-forma"][data-v="' + b.dataset.v + '"]'); },
    "e-dia": (b) => { const x = D.datos, d = b.dataset.v; x.dias = (x.dias || []).includes(d) ? x.dias.filter((y) => y !== d) : (x.dias || []).concat(d); delete D.err.dias; ezRe('[data-act="e-dia"][data-v="' + d + '"]'); },
    "e-acomp": () => { D.datos.acomp = !D.datos.acomp; ezRe('[data-act="e-acomp"]'); },
    "e-lim": (b) => { const n = +D.datos.limite || 0, d = +b.dataset.d; D.datos.limite = d > 0 ? String(n ? n + 1 : 4) : n > 1 ? String(n - 1) : ""; ezRe('[data-act="e-lim"][data-d="' + b.dataset.d + '"]'); },
    "e-maxac": (b) => { const n = +D.datos.maxAcomp || 0, d = +b.dataset.d; D.datos.maxAcomp = d > 0 ? String(n + 1) : n > 1 ? String(n - 1) : ""; ezRe('[data-act="e-maxac"][data-d="' + b.dataset.d + '"]'); },
    "e-cada": ezCampo("cada"), "e-modo": ezCampo("modo"), "e-urg": ezCampo("urg"),
    "e-cupo": (b) => { const n = +D.datos.cupo || 0, d = +b.dataset.d; D.datos.cupo = d > 0 ? String(n ? n + 1 : 10) : n > 1 ? String(n - 1) : ""; delete D.err.cupo; ezRe('[data-act="e-cupo"][data-d="' + b.dataset.d + '"]'); },
    "asignar-a": (b) => { const p = per(b.dataset.p); p.conector = b.dataset.c; guardar(); toast(p.nombre + " queda asignada a " + con(p.conector).nombre + "."); render(); },
    "asignar-ab": (b) => { asignando = b.dataset.p; conSel = (S.conectores.find((c) => (c.entidades || [c.entidad]).includes(ENT)) || {}).id; ezRe("#ez-mt"); },
    "asignar-sel": (b) => { conSel = b.dataset.c; ezRe('[data-act="asignar-sel"][data-c="' + b.dataset.c + '"]'); },
    "asignar-cancel": () => { asignando = null; ezRe("#btn-asignar-ab"); },
    asignar: (b) => { const p = per(b.dataset.p), sel = document.getElementById("sel-" + p.id); p.conector = sel ? sel.value : conSel; asignando = null; guardar(); toast(p.nombre + " queda asignada a " + con(p.conector).nombre + "."); render(); },
    "ver-mi-con": () => { verMiCon = true; render(); },
    "cerrar-mi-con": () => { verMiCon = false; render(); },
    "fam-ver": (b) => { const f = per(b.dataset.fid); f.verificacion = "Verificada"; f.verificada = hoy(); f.verificadaPor = ROL === "conector" ? con(YO).nombre : "Coordinación"; famRech = null; guardar(); toast(f.nombre + " queda verificada: ya puede acompañar a " + per(f.titular).nombre + "."); render(); },
    "fam-rech-ab": (b) => { famRech = b.dataset.fid; render(); },
    "fam-rech-no": () => { famRech = null; render(); },
    "fam-rech": (b) => { const f = per(b.dataset.fid), m = (document.getElementById("mot-" + f.id) || {}).value; if (!m) return toast("Elige el motivo del rechazo."); f.verificacion = "Rechazada"; f.motivo = m; f.verificada = hoy(); famRech = null; guardar(); toast("Ficha de " + f.nombre + " rechazada. La persona verá el motivo."); render(); },
    "fam-vin": (b) => { D.datos.vinculo = b.dataset.v; delete D.err.vinculo; ezRe('[data-act="fam-vin"][data-v="' + b.dataset.v + '"]'); },
    "fam-gru": (b) => { D.datos.grupo = b.dataset.v; ezRe('[data-act="fam-gru"][data-v="' + b.dataset.v + '"]'); },
    "fam-guardar": () => {
      const x = D.datos, tit = per(D.tit);
      const val = () => { D.err = {}; ["nombre", "apellidos"].forEach((k) => { if (!String(x[k] || "").trim()) D.err[k] = "Este dato es obligatorio."; }); if (!x.vinculo) D.err.vinculo = "Elige el vínculo."; return !Object.keys(D.err).length; };
      const rell = () => { const ej = { nombre: "Nadia", apellidos: (tit.apellidos || "").split(" ")[0], nac: "2016-05-14", vinculo: "Hija" }; Object.keys(ej).forEach((k) => { if (!String(x[k] || "").trim()) x[k] = ej[k]; }); };
      if (!insistir("fam", val, rell)) return;
      const equipo = ROL !== "ciudadano", f = { id: nuevoId(), nombre: x.nombre.trim(), apellidos: x.apellidos.trim(), nac: x.nac || "", vinculo: x.vinculo, titular: D.tit, verificacion: equipo ? "Verificada" : "Por verificar", creada: hoy(), creadaPor: equipo ? (ROL === "conector" ? YO : "entidad") : "persona" };
      if (equipo) { f.verificada = hoy(); f.verificadaPor = ROL === "conector" ? con(YO).nombre : "Coordinación"; }
      S.familiares.push(f);
      let g = S.familias.find((y) => y.id === x.grupo && y.titular === D.tit);
      if (!g) { g = { id: "f" + Date.now(), nombre: String(x.grupoNombre || "").trim() || "Mi familia", titular: D.tit, miembros: [] }; S.familias.push(g); }
      g.miembros.push(f.id);
      const volver = D.volver; guardar(); D = null; ir(volver);
      toast(equipo ? f.nombre + " queda en la familia de " + tit.nombre + ", verificada." : "Agregamos a " + f.nombre + ". " + ent(tit.entidad).nombre + " verificará su ficha.");
    },
    "aprobar-caben": (b) => {
      const s = S.solicitudes.find((x) => x.id === b.dataset.s), caben = usoRec(rec(s.recurso)).libres; if (caben < 1) return;
      s.acompanantes = (s.acompanantes || []).slice(0, caben - 1); s.estado = "Aprobada"; s.decidida = hoy(); s.parcial = true;
      S.accesos.push({ persona: s.persona, quien: "Coordinación", entidad: ENT, cuando: ahora(), para: "Decidir la solicitud a " + rec(s.recurso).nombre });
      guardar(); toast("Aprobada para " + caben + (caben === 1 ? " persona" : " personas") + ". La persona confirma quién va."); render();
    },
    "p-uso": (b) => {
      const { r, p, f, e } = b.dataset, x = usoEn(p, r, f), por = ROL === "conector" ? YO : "entidad";
      if (x && x.estado === e) S.usos.splice(S.usos.indexOf(x), 1); else if (x) Object.assign(x, { estado: e, por }); else S.usos.push({ id: "u" + Date.now(), recurso: r, persona: p, fecha: f, estado: e, por });
      guardar(); render(); const n = document.querySelector('[data-act="p-uso"][data-p="' + p + '"][data-e="' + e + '"]'); if (n) n.focus();
    },
    "c-voy": (b) => {
      const p = yoP(), r = rec(b.dataset.r), f = b.dataset.f, s = S.solicitudes.find((x) => x.persona === p.id && x.recurso === r.id && x.estado === "Aprobada") || {};
      let a = asisDe(p.id, r.id, f); if (!a) { a = { id: "a" + Date.now(), recurso: r.id, fecha: f, persona: p.id }; S.asistencias.push(a); }
      a.estado = b.dataset.e; a.acompanantes = a.estado === "Confirmada" ? (s.acompanantes || []).slice() : []; a.cuando = ahora();
      guardar(); toast(a.estado === "Confirmada" ? "Confirmado: vas el " + fCorta(f) + "." : "Avisado: no vas el " + fCorta(f) + ". Tu plaza de ese día queda para otra persona."); render();
    },
    "c-voy-lote": (b) => {
      const p = yoP(), r = rec(b.dataset.r), s = S.solicitudes.find((x) => x.persona === p.id && x.recurso === r.id && x.estado === "Aprobada") || {}; let n = 0;
      proximas(r, 4, s.desde && s.desde > hoy() ? s.desde : undefined).forEach((f) => { if (asisDe(p.id, r.id, f) || new Date() > limiteConf(r, f)) return; S.asistencias.push({ id: "a" + Date.now() + f, recurso: r.id, fecha: f, persona: p.id, estado: "Confirmada", acompanantes: (s.acompanantes || []).slice(), cuando: ahora() }); n++; });
      guardar(); toast(n ? "Confirmaste " + n + (n === 1 ? " fecha" : " fechas") + " de " + r.nombre + "." : "Ya tenías confirmadas las próximas fechas."); render();
    },
    "cm-clase": (b) => { cm.clase = b.dataset.v; if (cm.clase === "aviso") cmAuto(true); else if (cm.auto) { cm.asunto = ""; cm.cuerpo = ""; } render(); },
    "cm-ej": () => { const f = cm.firma.split(":"), quien = f[0] === "red" ? miRed().nombre : ent(f[1]).nombre; cm.asunto = "Cierre por festivo el 8 de diciembre"; cm.cuerpo = quien + " no abre el lunes 8. Los recursos de ese día pasan al martes 9 a la misma hora."; cm.auto = false; render(); },
    "cm-plant": (b) => { cm.plantilla = b.dataset.v; cmAuto(true); render(); },
    "cm-fecha": (b) => { cm.fecha = b.dataset.v; cmAuto(); render(); },
    "cm-filtro": (b) => { cm.filtro = b.dataset.v; render(); },
    "cm-firma": (b) => { cm.firma = b.dataset.v; render(); },
    "cm-canal": (b) => { const k = b.dataset.v; cm.canales = cm.canales.includes(k) ? cm.canales.filter((x) => x !== k) : cm.canales.concat(k); render(); },
    "cm-enviar": () => {
      const bs = cm.base, aviso = cm.clase === "aviso";
      if (!cm.asunto.trim() || !cm.cuerpo.trim()) return toast("Escribe el asunto y el mensaje.");
      if (!cm.canales.length) return toast("Elige al menos un canal.");
      const dest = destinatarios({ filtro: aviso ? "inscritos" : cm.filtro, recurso: bs.recurso, entidades: bs.entidades, clase: cm.clase }), [ft, fid] = cm.firma.split(":");
      const c = { id: "m" + Date.now(), clase: cm.clase, recurso: bs.recurso || null, fechaEvento: aviso ? cm.fecha : null, filtro: aviso ? "inscritos" : cm.filtro, autor: ROL === "conector" ? YO : ROL, autorNombre: QUIEN[ROL]()[0], firma: { tipo: ft, id: fid }, porRed: ROL === "red", destinatarios: dest.map((p) => p.id), canales: cm.canales.slice(), asunto: cm.asunto.trim(), cuerpo: cm.cuerpo.trim(), creado: ahora(), leidos: [] };
      if (ROL === "conector" && !aviso) c.estado = "Por aprobar"; else { c.estado = "Enviado"; c.enviado = ahora(); }
      S.comunicados.push(c); cm = null; guardar(); render();
      toast(c.estado === "Enviado" ? "Enviado a " + dest.length + (dest.length === 1 ? " persona" : " personas") + " por " + c.canales.join(" y ") + "." : "Queda por aprobar: la coordinación lo revisa antes de enviarlo.");
    },
    "cm-aprobar": (b) => {
      const c = S.comunicados.find((x) => x.id === b.dataset.id);
      if (!c.destinatarios.length) c.destinatarios = destinatarios({ filtro: c.filtro || "inscritos", recurso: c.recurso, entidades: [ENT], clase: c.clase }).map((p) => p.id);
      c.estado = "Enviado"; c.enviado = ahora(); c.aprobadoPor = "Coordinación"; guardar(); toast("Aprobado y enviado a " + c.destinatarios.length + (c.destinatarios.length === 1 ? " persona." : " personas.")); render();
    },
    "cm-dev-ab": (b) => { cmDev = b.dataset.id; render(); },
    "cm-dev-no": () => { cmDev = null; render(); },
    "cm-devolver": (b) => { const c = S.comunicados.find((x) => x.id === b.dataset.id), t = (document.getElementById("dev-" + c.id) || {}).value || ""; if (!t.trim()) return toast("Dile qué tiene que cambiar."); c.estado = "Devuelto"; c.comentario = t.trim(); cmDev = null; guardar(); toast("Devuelto a " + c.autorNombre + " con tu comentario."); render(); },
    "nota-add": (b) => { const p = per(b.dataset.p), t = (document.getElementById("f-nota-" + p.id) || {}).value || ""; if (!t.trim()) return toast("Escribe la nota."); p.notas = notasDe(p).concat({ texto: t.trim(), autor: ROL === "conector" ? YO : "entidad", entidad: ENT, fecha: ahora() }); guardar(); toast("Nota guardada. Solo la ve tu entidad."); render(); },
    "ent-pop": (b) => { entOp = entOp === b.dataset.k ? false : b.dataset.k; render(); const n = document.querySelector(entOp ? '.bc-ent__m [aria-checked="true"]' : '[data-act="ent-pop"][data-k="' + b.dataset.k + '"]'); if (n) n.focus(); },
    "ent-set": (b) => {
      entOp = false; if (b.dataset.v === ENT) return render();
      ENT = b.dataset.v; try { localStorage.setItem("brujula.ent." + ROL, ENT); } catch (x) { /* sin almacenamiento */ }
      D = null; cm = null; toast("Ahora trabajas en " + ent(ENT).nombre + ".");
      if (location.hash === INICIO[ROL]) render(); else location.hash = INICIO[ROL];
    },
    "r-firma": (b) => { cm = null; cmFirma0 = b.dataset.v; ir("#/comunicados/nuevo"); },
    "aprobar-ab": (b) => { popOp = false; aprobando = b.dataset.s; render(); },
    "aprobar-no": () => { aprobando = null; render(); },
    "aprobar-ok": (b, e) => {
      if (e && e.isTrusted && e.detail > 0) { const sl = $("#sp-sl"); if (sl) { sl.classList.add("sp-sl--pista"); setTimeout(() => sl.classList.remove("sp-sl--pista"), 700); } return; }
      const id = aprobando; aprobando = null; ACC.decidir({ dataset: { s: id, e: "Aprobada" } });
    },
    decidir: (b) => { popOp = false;
      const s = S.solicitudes.find((x) => x.id === b.dataset.s), bl = avisosSol(s).bloqueo;
      if (bl && (b.dataset.e === "Aprobada" || (bl.k === "cupo" && b.dataset.e !== "En lista de espera"))) { render(); return toast("No disponible: " + bl.t); }
      s.estado = b.dataset.e; s.decidida = hoy();
      S.accesos.push({ persona: s.persona, quien: "Coordinación", entidad: ENT, cuando: ahora(), para: "Decidir la solicitud a " + rec(s.recurso).nombre });
      guardar(); toast("Solicitud: " + s.estado + ". Se avisa al conector de la persona."); render();
    },
    "rechazar-ab": (b) => { popOp = false; rechazando = b.dataset.s; ezRe("#mot-" + b.dataset.s); },
    "rechazar-cancel": (b) => { const id = b.dataset.s; rechazando = null; ezRe("#btn-otras-" + id); },
    rechazar: (b) => {
      const m = document.getElementById("mot-" + b.dataset.s).value, txt = document.getElementById("txt-" + b.dataset.s);
      if (!m) return toast("El motivo del rechazo es obligatorio.");
      const s = S.solicitudes.find((x) => x.id === b.dataset.s);
      s.estado = "Rechazada"; s.motivo = m; s.decidida = hoy(); rechazando = null;
      if (txt && txt.value.trim()) s.mensaje = txt.value.trim();
      S.accesos.push({ persona: s.persona, quien: "Coordinación", entidad: ENT, cuando: ahora(), para: "Decidir la solicitud a " + rec(s.recurso).nombre });
      guardar(); toast("Solicitud rechazada. El conector puede reasignar o derivar."); render();
    },
    "k-pos-sel": (b) => { postSel = b.dataset.r; postDesde = null; postAcomp = []; render(); },
    "k-pos-fam": (b) => { const id = b.dataset.fid; postAcomp = postAcomp.includes(id) ? postAcomp.filter((x) => x !== id) : postAcomp.concat(id); render(); },
    "k-pos-desde": (b) => { postDesde = b.dataset.v; render(); },
    postular: (b) => {
      const p = per(b.dataset.p), r = rec(postSel);
      if (!r) return;
      if (solsDe(p.id).some((s) => s.recurso === r.id && s.estado !== "Rechazada")) return toast("Ya tiene una solicitud a " + r.nombre + ".");
      if (enCursoDe(p.id, r)) return toast("Ya tiene " + r.cat + " en curso: no se pide lo mismo en dos lugares.");
      const sinSitio = r.cupo && usoRec(r).libres < 1 + postAcomp.length;
      S.solicitudes.push({ id: "s" + Date.now(), persona: p.id, recurso: r.id, por: ENT, estado: sinSitio ? "En lista de espera" : r.modo === "Solicitud" ? "Pendiente" : "Aprobada", fecha: hoy(), desde: postDesde || desdeDe(r), acompanantes: postAcomp.slice() });
      if (p.estado === "Abierto") p.estado = "En seguimiento";
      guardar(); postSel = null; postDesde = null; postAcomp = []; ir("#/persona/" + encodeURIComponent(p.id));
      toast(r.entidad === ENT ? "Postulada a " + r.nombre + "." : "Derivada a " + ent(r.entidad).nombre + ": le llega a su bandeja.");
    }
  };

  /* Guardar, decidir o buscar tarda: el botón muestra que trabaja y no admite un segundo clic. */
  ["entrar-ejemplo", "yo-crear", "con-crear", "rec-guardar", "buscar", "probar", "asignar-a", "asignar", "aprobar-ok", "decidir", "rechazar", "postular", "c-pedir"].forEach((k) => {
    const f = ACC[k]; if (!f) return;
    ACC[k] = (b, e) => {
      if (!(b instanceof Element)) return f(b, e);
      if (document.body.classList.contains("bc-ocupado")) return;
      const el = b.closest(".sp-sl") || b; el.classList.add("bc-busy"); el.setAttribute("aria-busy", "true"); document.body.classList.add("bc-ocupado");
      setTimeout(() => { el.classList.remove("bc-busy"); el.removeAttribute("aria-busy"); f(b, e); setTimeout(() => document.body.classList.remove("bc-ocupado"), 60); }, ESPERA_ACC);
    };
  });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-act]"); if (b && ACC[b.dataset.act]) { e.preventDefault(); ACC[b.dataset.act](b, e); } });
  document.addEventListener("pointerdown", (e) => {
    const h = e.target.closest(".sp-sl__h"); if (!h) return;
    const sl = h.parentElement, max = sl.clientWidth - h.offsetWidth - 8, x0 = e.clientX, flecha = h.innerHTML; let x = 0, fin = false;
    h.setPointerCapture(e.pointerId); sl.classList.remove("sp-sl--vuelve"); sl.classList.add("sp-sl--drag");
    const mv = (m) => {
      x = Math.max(0, Math.min(max, m.clientX - x0)); sl.style.setProperty("--x", x + "px"); sl.style.setProperty("--p", (x / max).toFixed(3));
      const ahora = x >= max - 2;
      if (ahora !== fin) { fin = ahora; sl.classList.toggle("sp-sl--fin", fin); h.innerHTML = fin ? ic("check") : flecha; sl.querySelector(".sp-sl__t").textContent = fin ? "Suelta para aprobar" : "Desliza para aprobar"; }
    };
    const up = () => {
      h.removeEventListener("pointermove", mv); h.removeEventListener("pointerup", up); h.removeEventListener("pointercancel", up); sl.classList.remove("sp-sl--drag");
      if (fin) { sl.classList.add("sp-sl--ok"); setTimeout(() => ACC["aprobar-ok"](h, null), 380); return; }
      sl.classList.add("sp-sl--vuelve"); sl.style.setProperty("--x", "0px"); sl.style.setProperty("--p", "0");
    };
    h.addEventListener("pointermove", mv); h.addEventListener("pointerup", up); h.addEventListener("pointercancel", up);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && aprobando) ACC["aprobar-no"]();
    if (e.key === "Escape" && verMiCon) ACC["cerrar-mi-con"]();
    if ((e.key === " " || e.key === "Enter") && e.target.matches('[role="checkbox"],[role="radio"]')) { e.preventDefault(); e.target.closest("[data-act]").click(); }
    if (e.key === "Enter" && e.target.hasAttribute("data-q")) ACC.buscar();
  });
  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.f) { D.datos[t.dataset.f] = t.value; if (D.err[t.dataset.f]) { delete D.err[t.dataset.f]; const box = t.closest(".nwt-input-box"); box.classList.remove("nwt-input-box--error"); const m = box.querySelector(".nwt-input-box__message"); if (m) m.remove(); } }
    if (t.hasAttribute("data-q")) {
      D.q = t.value; clearTimeout(ACC.tq);
      /* Busca sola al escribir un número completo; el input se repinta, así que se devuelve el foco. */
      if (t.value.replace(/\D/g, "").length >= 9) ACC.tq = setTimeout(() => { ACC.buscar(); const n = $("#f-q"); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 400);
    }
    if (t.hasAttribute("data-notas")) D.notas = t.value;
    if (t.hasAttribute("data-busca2")) { qL = t.value; const pos = t.selectionStart; render(); const n = $("#f-busca2"); n.focus(); n.setSelectionRange(pos, pos); return; }
    if (t.hasAttribute("data-cm") && cm) { cm[t.dataset.cm] = t.value; cm.auto = false; return; }
    if (t.hasAttribute("data-pos-desde")) { postDesde = t.value; return; }
    if (t.hasAttribute("data-czq")) { czQ = t.value; const pos = t.selectionStart; render(); const n = $("#f-czq"); n.focus(); n.setSelectionRange(pos, pos); return; }
    if (t.hasAttribute("data-busca")) { busca = t.value; const pos = t.selectionStart; render(); const n = $("#f-busca"); n.focus(); n.setSelectionRange(pos, pos); }
  });
  document.addEventListener("change", (e) => {
    if (e.target.dataset.f) D.datos[e.target.dataset.f] = e.target.value; if (e.target.hasAttribute("data-ez-r")) ezRe("#" + e.target.id); });
  /* El rechazo no se confirma sin motivo: el botón se habilita al elegirlo. */
  document.addEventListener("change", (e) => { const id = e.target.dataset && e.target.dataset.mot; if (!id) return; const b = document.querySelector('[data-act="rechazar"][data-s="' + id + '"]'); if (b) b.disabled = !e.target.value; });

  /* Un borrador perdido por recarga vuelve al primer paso del asistente. */
  if (/^#\/(registro\/[2-4](\/\d)?|registrar\/[2-8])$/.test(location.hash)) location.replace(location.hash.replace(/^(#\/regist\w+)\/.*$/, "$1/1"));
  /* Mini splash de la brújula al abrir la app sin sesión: se va solo y no bloquea. */
  if (ROL === "ciudadano" && !yoP() && /^(#\/inicio)?$/.test(location.hash)) {
    const sp = document.createElement("div"); sp.id = "bc-splash"; sp.setAttribute("role", "presentation");
    sp.innerHTML = MARCA + PALABRA; document.body.appendChild(sp);
    setTimeout(() => { sp.classList.add("out"); setTimeout(() => { sp.remove(); tintSafe(); }, 350); }, 1300);
  }
  render(); velo(!document.getElementById("bc-splash"));
})();

/* Barra compacta solo cuando la ficha ya se desplazó (DC-145). */
document.addEventListener("scroll", () => {
  const s = document.querySelector(".kz-hero"), h = document.querySelector(".kz-pin");
  if (s && h) h.classList.toggle("kz-pin--on", s.getBoundingClientRect().bottom < 12);
}, true);
