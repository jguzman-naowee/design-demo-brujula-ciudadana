/* Capa de animación de la landing: aparición al entrar en pantalla, conteo de cifras y sombra
   de cabecera. Va después de landing.js para contar los números que este ya calculó. */
(function () {
  "use strict";
  var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (quieto || !("IntersectionObserver" in window)) return;
  var html = document.documentElement;
  html.classList.add("anim");

  /* Qué aparece y cómo. Los hermanos de un mismo grupo entran escalonados. */
  var REGLAS = [
    [".lp-sec .lp-kick, .lp-sec > .lp-w > h2, .lp-sec .lp-mapa-h .lp-sub, .lp-sec > .lp-w > .lp-sub", ""],
    [".lp-franja .lp-w > div", "", 0.12],
    [".lp-abrir, .lp-chips, .lp-cuenta", ""],
    [".lp-mapa", "zoom"],
    [".lp-leyenda", ""],
    ["#como .lp-paso", "", 0.12],
    [".lr-pasos li", "izq", 0.1],
    [".lr-tel", "der"],
    ["#comunicados .lp-kick, #comunicados h2, #comunicados .lp-sub", ""],
    [".lc-lista li", "izq", 0.12],
    [".lc-escena", "der"],
    [".lp-tel", "izq"],
    [".lp-seg > div:last-child > .lp-kick, .lp-seg h2, .lp-seg .lp-sub, .lp-dni", ""],
    [".lp-gar > div", "", 0.1],
    ["#lineas .lp-linea", "", 0.14],
    [".lp-ent__f", "izq"],
    [".lp-ent .lp-kick, .lp-ent h2, .lp-ent .lp-sub, .lp-ent .lp-cta", "der"],
    [".lp-lista-ok li", "der", 0.08],
    [".lp-vision .lp-kick, .lp-vision h2, .lp-vision p", "", 0.12],
    [".lp-roles .lp-rol", "", 0.08],
    [".lp-tour", ""]
  ];
  var vistos = new Set();
  REGLAS.forEach(function (r) {
    var ns = document.querySelectorAll(r[0]);
    ns.forEach(function (n, i) {
      if (vistos.has(n)) return; vistos.add(n);
      n.setAttribute("data-an", r[1]);
      if (r[2]) n.style.setProperty("--an-d", Math.min(i * r[2], 0.6) + "s");
    });
  });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("an-in"); io.unobserve(e.target);
      if (e.target.matches(".lp-mapa") && window.dispatchEvent) setTimeout(function () { window.dispatchEvent(new Event("resize")); }, 850);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  vistos.forEach(function (n) { io.observe(n); });

  /* Las tarjetas que pinta el mapa después también entran escalonadas. */
  var tarjetas = document.getElementById("tarjetas");
  if (tarjetas) new MutationObserver(function () {
    tarjetas.querySelectorAll(".lp-rc:not([data-an])").forEach(function (n, i) {
      n.setAttribute("data-an", "zoom"); n.style.setProperty("--an-d", Math.min(i % 9 * 0.06, 0.5) + "s");
      requestAnimationFrame(function () { requestAnimationFrame(function () { n.classList.add("an-in"); }); });
    });
  }).observe(tarjetas, { childList: true });

  /* Cifras: cuentan desde 0 cuando se ven. */
  function contar(n) {
    var fin = parseInt(n.textContent, 10); if (!(fin > 0)) return;
    var t0 = null, dur = 1400;
    (function paso(t) {
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      n.textContent = Math.round(fin * e);
      if (k < 1) requestAnimationFrame(paso); else n.textContent = fin;
    })(performance.now());
  }
  var ioC = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { ioC.unobserve(e.target); contar(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-cifra]").forEach(function (n) { ioC.observe(n); });

  /* Cabecera con sombra al bajar. */
  var baja = function () { html.classList.toggle("an-baja", window.scrollY > 8); };
  window.addEventListener("scroll", baja, { passive: true }); baja();
})();
