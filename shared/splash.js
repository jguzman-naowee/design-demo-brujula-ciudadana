/* Splash de la landing: se carga en el <head>, tapa la página desde el primer cuadro y se va
   a los ~4 s, o antes con un clic, Esc, Intro o espacio. Con movimiento reducido dura menos. */
(function () {
  "use strict";
  var html = document.documentElement, yo = document.currentScript || {};
  html.classList.add("sp-on");
  /* data-dur (ms) y data-pres en la etiqueta <script>; las imágenes se buscan junto a este archivo. */
  var cfg = yo.dataset || {}, IMG = (yo.src || "shared/splash.js").replace(/splash\.js.*$/, "img/");
  var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = quieto ? 1200 : (+cfg.dur || 3800);
  if (DUR < 2500) html.classList.add("sp-rapido");

  function montar() {
    var sp = document.createElement("div");
    sp.className = "sp"; sp.setAttribute("role", "dialog"); sp.setAttribute("aria-label", "Brújula Ciudadana");
    sp.style.setProperty("--sp-dur", DUR + "ms");
    sp.innerHTML =
      '<span class="sp-ondas" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<div class="sp-in">' +
      '<svg class="sp-marca" viewBox="0 0 200 200" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path class="sp-arco" d="M110.6 24.8A76 76 0 0 1 110.6 175.2" stroke="#f49a2d" stroke-width="14"/>' +
      '<path class="sp-arco sp-arco--2" d="M89.4 175.2A76 76 0 0 1 89.4 24.8" stroke="#ed722e" stroke-width="14"/>' +
      '<g transform="rotate(40 100 100)"><g class="sp-aguja"><path d="M100 156L82 100H118Z" stroke="#f49a2d" stroke-width="11"/><path d="M100 44L118 100H82Z" stroke="#ed722e" stroke-width="11"/></g></g></svg>' +
      '<img class="sp-palabra" src="' + IMG + 'palabra-brujula-oscuro.svg" alt="Brújula Ciudadana">' +
      '<p class="sp-lema">Ayuda y actividades <b>cerca de cada persona</b></p>' +
      (cfg.pres === "" ? "" : '<span class="sp-pres">' + (cfg.pres || "Presentación del concepto") + "</span>") + '</div>' +
      '<span class="sp-barra" aria-hidden="true"><i></i></span>' +
      '<button type="button" class="sp-saltar">Entrar</button>';
    document.body.insertBefore(sp, document.body.firstChild);

    var hecho = false, t = setTimeout(cerrar, DUR);
    function cerrar() {
      if (hecho) return; hecho = true; clearTimeout(t);
      sp.classList.add("sp-fuera");
      html.classList.remove("sp-on");
      document.removeEventListener("keydown", tecla);
      try { window.dispatchEvent(new Event("splash-fin")); } catch (e) { /* sin eventos */ }
      setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 750);
    }
    function tecla(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); cerrar(); } }
    sp.addEventListener("click", cerrar);
    document.addEventListener("keydown", tecla);
    sp.querySelector(".sp-saltar").focus({ preventScroll: true });
  }
  if (document.body) montar(); else document.addEventListener("DOMContentLoaded", montar);
})();
