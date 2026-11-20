/* «Cómo funciona un recurso»: cada punto de la explicación resalta su parte en el teléfono.
   Recorre los puntos solo mientras nadie los toca, para que se lea como una presentación. */
(function () {
  "use strict";
  var pasos = document.querySelectorAll(".lr-paso"), sec = document.getElementById("recursos");
  if (!pasos.length || !sec) return;
  var i = 0, timer = 0, tocado = false, pant = sec.querySelector(".lr-pant");
  var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function marcar(n) {
    i = n;
    pasos.forEach(function (p, k) { p.setAttribute("aria-pressed", String(k === n)); });
    var bl = pasos[n].dataset.bl;
    sec.querySelectorAll(".lr-bl").forEach(function (b) { b.classList.toggle("on", b.dataset.bl === bl); });
    var on = sec.querySelector(".lr-bl.on");
    if (pant && on) pant.scrollTo({ top: n === 0 ? 0 : Math.max(on.offsetTop - 70, 0), behavior: quieto ? "auto" : "smooth" });
  }
  function seguir() { clearInterval(timer); if (tocado || quieto) return; timer = setInterval(function () { marcar((i + 1) % pasos.length); }, 3800); }
  pasos.forEach(function (p, k) { p.addEventListener("click", function () { tocado = true; clearInterval(timer); marcar(k); }); });

  if (pant) ["wheel", "touchstart"].forEach(function (ev) { pant.addEventListener(ev, function () { tocado = true; clearInterval(timer); }, { passive: true }); });

  marcar(0);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) seguir(); else clearInterval(timer); });
  }, { threshold: 0.35 }).observe(sec);
})();
