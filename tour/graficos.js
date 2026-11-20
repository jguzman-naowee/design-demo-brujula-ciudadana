/* Gráficos del recorrido: una función por id que devuelve el HTML del lienzo de 780×540.
   Datos de ejemplo de la demo; solo reglas ya decididas (ver docs/specs). */
(function () {
  "use strict";
  var d = function (s) { return ' style="--d:' + s + 's"'; };
  var st = function (css, s) { return ' style="' + css + (s != null ? ";--d:" + s + "s" : "") + '"'; };
  var av = function (t, c) { return '<span class="gf-av" style="background:' + c + '">' + t + "</span>"; };

  /* Entidades alrededor de la persona: [x, y, nombre, detalle] */
  var ENTS = [[40, 50, "Comedor social", "Red Vecinal Sur", "p6995221"], [590, 50, "Vivienda", "Fundación Raíces", "p7641904"], [30, 240, "Trámites", "Servicios sociales", "p7821682"],
    [600, 240, "Empleo", "Orientación laboral", "p34692635"], [60, 410, "Salud mental", "Grupo de apoyo", "p5711170"], [570, 410, "Formación", "Clases de español", "p5427868"]];
  /* Mini tarjeta de recurso: foto, título y entidad, como en la app. */
  var mini = function (e) { return '<em class="gf-ph" style="background-image:url(../shared/img/landing/' + e[4] + '.jpg)"></em><b>' + e[2] + '</b><span>' + e[3] + "</span>"; };
  var centro = function (e) { return [e[0] + 75, e[1] + 50]; };

  /* Mapa real (Leaflet) de la escena «alta»: la entidad nueva y sus recursos aparecen sobre el mapa de la zona. */
  window.GRAFICOS_POST = {
    alta: function () {
      var L = window.L, M = window.BC_MAPA, el = document.getElementById("gfLeaf"), ts = [];
      if (!L || !M || !el) return function () {};
      var lim = L.latLngBounds(M.zona.so, M.zona.ne);
      var mapa = L.map(el, { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false, keyboard: false, boxZoom: false });
      mapa.fitBounds(lim);
      ts.push(setTimeout(function () { mapa.invalidateSize(); mapa.fitBounds(lim); }, 60));
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, className: "gf-fondo" }).addTo(mapa);
      var pin = function (ll, cls) { return L.marker(ll, { interactive: false, icon: L.divIcon({ className: "gf-pin " + (cls || ""), iconSize: [20, 20] }) }).addTo(mapa); };
      var base = M.vecinas.slice(1).map(function (v) { return [v.lat, v.lng]; }).concat(Object.keys(M.entidades).map(function (k) { return [M.entidades[k].lat, M.entidades[k].lng]; }));
      base.forEach(function (ll, k) { ts.push(setTimeout(function () { pin(ll); }, 300 + k * 80)); });
      var nueva = [M.vecinas[0].lat, M.vecinas[0].lng];
      ts.push(setTimeout(function () { pin(nueva, "gf-pin--n"); }, 2200));
      [[0.004, 0.006], [-0.003, 0.009], [0.006, -0.004], [-0.005, -0.005]].forEach(function (o, k) {
        ts.push(setTimeout(function () { pin([nueva[0] + o[0], nueva[1] + o[1]], "gf-pin--r"); }, 3000 + k * 200));
      });
      return function () { ts.forEach(clearTimeout); mapa.remove(); };
    }
  };

  window.GRAFICOS = {
    /* La ayuda existe, pero está repartida: un camino de ventanilla en ventanilla */
    problema: function () {
      var O = [["Comedor social", "Red Vecinal Sur"], ["Vivienda", "Fundación Raíces"], ["Trámites", "Servicios sociales"], ["Empleo", "Orientación laboral"], ["Salud mental", "Grupo de apoyo"]];
      var camino = "M 30 300 L 80 150 L 157 300 L 235 150 L 312 300 L 390 150 L 467 300 L 545 150 L 622 300 L 700 150";
      var llega = [0.75, 1.65, 2.55, 3.45, 4.35];
      var hojas = [[-8, 0, 0], [6, -14, 10], [-4, -28, -6], [9, -42, 8], [-6, -56, 2]];
      return '<div class="gf"><svg><path class="gf-ln gf-ln--g" d="' + camino + '"/><path class="gf-ln gf-ln--camino a-draw" d="' + camino + '"' + st("--len:1450", 0.3) + "/></svg>" +
        O.map(function (o, i) {
          return '<div class="gf-ofi a-in"' + st("left:" + (20 + i * 155) + "px;top:40px", i * 0.12) + "><b>" + o[0] + "</b><span>" + o[1] + '</span><i class="a-pop"' + d(llega[i]) + ">Formulario</i></div>";
        }).join("") +
        [157, 312, 467, 622].map(function (x, i) { return '<span class="gf-corte a-pop"' + st("left:" + (x - 13) + "px;top:55px", 4.7 + i * 0.12) + ">✕</span>"; }).join("") +
        '<span class="gf-anda"' + st("offset-path:path('" + camino + "')", 0.3) + ">YH</span>" +
        '<div class="gf-pila">' + hojas.map(function (h, i) { return '<span class="gf-hoja a-baja"' + st("transform:rotate(" + h[0] + "deg);top:" + (70 + h[1]) + "px;left:" + (10 + h[2]) + "px", llega[i] + 0.15) + "></span>"; }).join("") + "</div>" +
        '<div class="gf-lbl a-in"' + st("left:30px;top:370px;width:470px;text-align:left", 4.9) + '><span class="gf-big" style="position:static;color:#F97066">5 ventanillas</span><br>los mismos datos, una y otra vez<small>y ninguna entidad sabe lo que hacen las demás</small></div></div>';
    },

    /* Una sola puerta */
    puerta: function () {
      var lineas = ENTS.map(function (e, i) { var c = centro(e); return '<line class="gf-ln a-draw" x1="390" y1="270" x2="' + c[0] + '" y2="' + c[1] + '"' + st("--len:330", 1 + i * 0.15) + "/>"; }).join("");
      return '<div class="gf"><svg>' + lineas + "</svg>" +
        '<span class="gf-onda a-onda"' + d(1.6) + '></span><div class="gf-hub a-pop"' + d(0.2) + '><img src="../shared/img/marca-brujula.svg" alt=""></div>' +
        ENTS.map(function (e, i) { return '<div class="gf-ent a-fade"' + st("left:" + e[0] + "px;top:" + e[1] + "px;border-color:#FF9A5C66", 1.3 + i * 0.15) + ">" + mini(e) + "</div>"; }).join("") +
        '<div class="gf-lbl a-in"' + st("left:250px;top:450px;width:280px", 2.8) + ">Un registro · un expediente<small>cada entidad ve solo lo que necesita para decidir</small></div></div>";
    },

    /* Las cuatro formas de un recurso en el tiempo */
    tiempo: function () {
      var dias = ["Lun 2", "Lun 9", "Lun 16", "Lun 23", "Lun 30"];
      var fila = function (y, t, s, evs, base) {
        return '<div class="gf-fila a-in"' + st("top:" + y + "px", base) + "><h4>" + t + "<small>" + s + '</small></h4><div class="gf-pista">' +
          evs.map(function (e, i) { return '<span class="gf-ev a-pop' + (e[2] ? " gf-ev--s" : "") + '"' + st("left:" + e[0] + "%;width:" + e[1] + "%", base + 0.3 + i * 0.12) + "></span>"; }).join("") + "</div></div>";
      };
      var semana = [], ses = [];
      for (var i = 0; i < 5; i++) semana.push([2 + i * 20, 3]);
      for (var j = 0; j < 4; j++) ses.push([8 + j * 20, 3]);
      return '<div class="gf"><div class="gf-eje a-fade"' + d(0) + ">" + dias.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>" +
        fila(130, "Un día", "Feria de empleo", [[44, 4]], 0.2) +
        fila(214, "Cada semana", "Comedor, despensa", semana, 1) +
        fila(298, "Por sesiones", "Taller de 4 sábados", ses, 1.9) +
        fila(382, "Estancia", "Albergue: desde – hasta", [[12, 62, 1]], 2.8) +
        '<div class="gf-lbl a-in"' + st("left:190px;top:476px;width:560px", 3.6) + ">Cada recurso tiene cuándo, plazas y quién va<small>talleres, comedores y asesorías se gestionan igual</small></div></div>";
    },

    /* Permisos y quién vio los datos */
    permisos: function () {
      var sw = function (t, s, k) { return '<div class="gf-sw"><span><b>' + t + "</b><small>" + s + '</small></span><span class="gf-tg"' + d(0.5 + k * 0.45) + "></span></div>"; };
      var log = function (t, c, q, p, f, k) { return '<div class="gf-log a-in"' + d(3 + k * 0.4) + ">" + av(t, c) + '<span style="flex:1"><b style="font-size:14px">' + q + '</b><br><span class="gf-s">' + p + '</span></span><span class="gf-s">' + f + "</span></div>"; };
      return '<div class="gf">' +
        '<div class="gf-card a-in"' + st("left:30px;top:50px;width:340px", 0) + '><div class="gf-t">Sus permisos</div>' +
        sw("Política de privacidad", "Necesario", 0) + sw("Tratar sus datos", "Necesario", 1) + sw("Compartir su itinerario", "Opcional: lo puede retirar", 2) + sw("Recibir comunicados", "Opcional", 3) + "</div>" +
        '<div class="gf-card a-in"' + st("left:410px;top:120px;width:340px", 2.6) + '><div class="gf-t">Quién vio sus datos</div>' +
        log("LR", "#2E90FA", "Lucía Romero", "Seguimiento del caso", "Hoy", 0) + log("DO", "#0E7C7B", "Daniel Ortega", "Decidir una solicitud", "20 oct", 1) + log("SI", "#7A5AF8", "Sistema", "Alta por autorregistro", "2 oct", 2) + "</div>" +
        '<div class="gf-lbl a-in"' + st("left:410px;top:400px;width:340px", 4.4) + ">Ella decide qué comparte<small>y ve cada consulta, con nombre, fecha y motivo</small></div></div>";
    },

    /* Mapa de Vida: 16 áreas en semáforo */
    mapavida: function () {
      var B = [["Básico", [["Vivienda", "r"], ["Ingresos", "a"], ["Comida", "v"], ["Salud", "a"]]], ["Entorno", [["Trámites", "r"], ["Red", "a"], ["Familia", "v"], ["Infancia", "v"]]],
        ["Autonomía", [["Cuidados", "v"], ["Empleo", "a"], ["Formación", "a"], ["Movilidad", "v"]]], ["Participación", [["Digital", "a"], ["Autonomía", "v"], ["Gestión", "v"], ["Comunidad", "a"]]]];
      var k = 0;
      return '<div class="gf">' + B.map(function (b, i) {
        return '<div class="gf-bloque a-in"' + st("left:" + (20 + i * 190) + "px;top:40px", i * 0.2) + "><h4>" + b[0] + '</h4><div class="gf-tiles">' +
          b[1].map(function (t) { k++; return '<div class="gf-tile' + (t[1] === "r" ? " a-late" : "") + '"' + (t[1] === "r" ? d(4.2) : "") + '><i class="gf-' + t[1] + '"' + d(1 + k * 0.14) + "></i><span>" + t[0] + "</span></div>"; }).join("") + "</div></div>";
      }).join("") +
        '<div class="gf-card a-in"' + st("left:180px;top:250px;width:420px", 3.6) + '><div class="gf-t">Empieza por aquí</div><div class="gf-b" style="margin-top:4px">Vivienda y Trámites necesitan apoyo</div><div class="gf-s" style="margin-top:4px">Su conector le propone recursos de esas dos áreas primero</div></div>' +
        '<div class="gf-lbl a-in"' + st("left:120px;top:400px;width:540px", 4.4) + ">16 áreas de su vida, en un vistazo<small>rojo necesita apoyo · ámbar en proceso · verde estable</small></div></div>";
    },

    /* Plazas: cada persona ocupa la suya */
    plazas: function () {
      var as = [];
      for (var i = 0; i < 12; i++) {
        var cls = i === 9 ? " gf-as--yo" : i === 10 ? " gf-as--am" : "";
        as.push('<span class="gf-as' + cls + '">' + (i < 9 ? '<i class="a-pop"' + d(0.6 + i * 0.12) + "></i>" : i < 11 ? '<i class="a-baja"' + d(2.8 + (i - 9) * 0.35) + "></i>" : "") + "</span>");
      }
      return '<div class="gf">' +
        '<div class="gf-card a-in"' + st("left:40px;top:60px;width:380px", 0) + '><div class="gf-t">Taller de cocina intercultural</div><div class="gf-b">Sábados · 11:00 · 12 plazas</div><div class="gf-asientos">' + as.join("") + "</div>" +
        '<div class="gf-s a-in" style="margin-top:12px;--d:3.6s"><b style="color:#16172B">11 de 12 ocupadas</b> · queda una</div></div>' +
        '<div class="gf-card a-in"' + st("left:460px;top:80px;width:280px", 2.2) + '><div class="gf-t">Va con su familia</div><div style="display:flex;gap:10px;margin-top:10px;align-items:center">' + av("YH", "#D74009") + "<span><b>Yasmina</b><br><span class='gf-s'>titular</span></span></div>" +
        '<div style="display:flex;gap:10px;margin-top:10px;align-items:center">' + av("AH", "#0E7C7B") + "<span><b>Amira</b><br><span class='gf-s'>hija · verificada</span></span></div></div>" +
        '<div class="gf-card a-in"' + st("left:460px;top:300px;width:280px", 4.2) + '><span class="gf-tag gf-tag--no">No se pide dos veces</span><div class="gf-s" style="margin-top:8px">Si Amira ya tiene Formación en otra entidad, aquí no se le puede pedir lo mismo</div></div>' +
        '<div class="gf-lbl a-in"' + st("left:40px;top:330px;width:380px", 3.8) + ">Cada persona ocupa su plaza<small>y lleva su propio consumo, también cada familiar</small></div></div>";
    },

    /* Ficha mínima: lo que ve la entidad que recibe una solicitud */
    fichamin: function () {
      var F = [["Nombre", "Yasmina Haddad", "Yasmina H.", 0], ["Teléfono", "+34 611 204 118", "", 1], ["Documento", "En trámite", "", 1], ["Mapa de Vida", "16 áreas", "Vivienda: necesita apoyo", 0],
        ["Notas internas", "3 notas", "", 1], ["Otras entidades", "2 recursos", "", 1], ["Solicita", "Bolsa de alquiler social", "Bolsa de alquiler social", 0]];
      var fila = function (f, k, oculta) {
        var v = oculta && f[3] ? '<b class="a-borra"' + d(2.4 + k * 0.18) + ">" + f[1] + '</b><span class="gf-cand a-pop"' + d(2.6 + k * 0.18) + ">🔒</span>" : "<b>" + (oculta ? f[2] : f[1]) + "</b>";
        return '<div class="gf-fila2"><span>' + f[0] + "</span><span>" + v + "</span></div>";
      };
      return '<div class="gf">' +
        '<div class="gf-card a-in"' + st("left:30px;top:50px;width:340px", 0) + '><span class="gf-tag gf-tag--ok">La entidad que la atiende</span><div class="gf-b" style="margin:8px 0 4px">Ve su caso completo</div>' + F.map(function (f, k) { return fila(f, k, false); }).join("") + "</div>" +
        '<div class="gf-card a-in"' + st("left:410px;top:50px;width:340px", 1.2) + '><span class="gf-tag gf-tag--or">Otra entidad que recibe la solicitud</span><div class="gf-b" style="margin:8px 0 4px">Ve lo justo para decidir</div>' + F.map(function (f, k) { return fila(f, k, true); }).join("") + "</div>" +
        '<div class="gf-lbl a-in"' + st("left:200px;top:470px;width:380px", 4.4) + ">Lo demás, solo con su permiso<small>y cada consulta queda registrada</small></div></div>";
    },

    /* Verificar a un familiar */
    verificar: function () {
      return '<div class="gf">' +
        '<div class="gf-card a-in"' + st("left:60px;top:90px;width:300px", 0) + '><div class="gf-t">Mi familia · lo agrega Yasmina</div><div style="display:flex;gap:12px;margin-top:12px;align-items:center">' + av("AH", "#0E7C7B") +
        '<span><b style="font-size:17px">Amira Haddad</b><br><span class="gf-s">Hija · 12 años</span></span></div><div style="margin-top:14px;position:relative;height:26px">' +
        '<span class="gf-tag gf-tag--wa a-va" style="position:absolute;--d:2.9s">Por verificar</span><span class="gf-tag gf-tag--ok a-fade" style="position:absolute;--d:3s">Verificada</span></div></div>' +
        '<svg><path class="gf-ln a-draw" d="M370 170 C 430 170 440 170 500 170"' + st("--len:140", 0.9) + "/></svg>" +
        '<div class="gf-card a-in"' + st("left:500px;top:100px;width:230px", 1.2) + '><div class="gf-t">La entidad que la atiende</div><div class="gf-b" style="margin-top:6px">Asociación Puentes</div><div class="gf-s" style="margin-top:4px">Revisa la ficha y la confirma</div></div>' +
        '<div class="a-sello"' + st("position:absolute;left:250px;top:250px;border:4px solid #17B26A;color:#17B26A;border-radius:14px;padding:8px 18px;font-size:26px;font-weight:800;letter-spacing:.06em;background:#16172B", 2.8) + ">VERIFICADA</div>" +
        '<div class="gf-lbl a-in"' + st("left:160px;top:370px;width:460px", 3.8) + ">Sin verificar no acompaña a nadie<small>en la demo la verificación es inmediata; en la realidad la hace la entidad</small></div></div>";
    },

    /* Pasar lista y uso real */
    lista: function () {
      var P = [["Fatou Diallo", 1], ["Yasmina Haddad", 1], ["Amira Haddad", 1], ["Carlos Mendoza", 0], ["Mariana Quispe", 1]];
      return '<div class="gf">' +
        '<div class="gf-card a-in"' + st("left:40px;top:40px;width:380px", 0) + '><div class="gf-t">Banco de alimentos · hoy 11:00</div>' +
        P.map(function (p, k) {
          return '<div class="gf-pl"><b>' + p[0] + '</b><span class="gf-mk"><span class="si">Usó' + (p[1] ? '<i class="a-pop"' + d(0.8 + k * 0.45) + ">✓ Usó</i>" : "") + '</span><span class="no">No vino' + (p[1] ? "" : '<i class="a-pop"' + d(0.8 + k * 0.45) + ">No vino</i>") + "</span></span></div>";
        }).join("") +
        '<div class="gf-b a-in" style="margin-top:10px;--d:3.2s">4 de 5 vinieron</div></div>' +
        '<div class="gf-card a-in"' + st("left:460px;top:80px;width:280px", 3.4) + '><div class="gf-t">Lo que ve Yasmina</div><div class="gf-b" style="margin-top:6px">Usó 9 de 30 días</div><div class="gf-barra"><i class="a-ancho"' + st("--w:30%", 3.8) + "></i></div><div class='gf-s' style='margin-top:8px'>Último: hoy</div></div>" +
        '<div class="gf-card a-in"' + st("left:460px;top:270px;width:280px", 4.4) + '><span class="gf-tag">«No vino» no da de baja</span><div class="gf-s" style="margin-top:8px">Queda a la vista para que el conector decida</div></div></div>';
    },

    /* Un aviso llega a quienes van */
    aviso: function () {
      var D = [["FD", "#D74009", -250, -130], ["YH", "#2E90FA", -85, -175], ["AH", "#0E7C7B", 85, -175], ["CM", "#7A5AF8", 250, -130], ["MQ", "#F79009", -300, 20], ["OK", "#17B26A", 300, 20], ["IS", "#EE46BC", -170, 140], ["KM", "#0B2A5B", 170, 140]];
      return '<div class="gf">' +
        D.map(function (p, k) {
          return '<div class="gf-dest a-sale"' + st("left:368px;top:240px;--x:" + p[2] + "px;--y:" + p[3] + "px", 1.6 + k * 0.12) + ">" + av(p[0], p[1]) + '<span class="gf-ok a-pop"' + d(3 + k * 0.1) + ">✓</span><small>" + (k % 2 ? "App" : "App · correo") + "</small></div>";
        }).join("") +
        '<div class="gf-dest a-sale"' + st("left:368px;top:240px;--x:0px;--y:170px", 2.6) + '><span class="gf-av" style="background:#3a3c5e">🛡</span><small>Caso protegido: no recibe envíos masivos</small></div>' +
        '<div class="gf-card a-pop"' + st("left:250px;top:200px;width:280px;text-align:center", 0) + '><span class="gf-tag gf-tag--or">Aviso</span><div class="gf-b" style="margin-top:6px">Cambio de hora · Sáb 21</div><div class="gf-s">Taller de cocina · empieza a las 12:00</div></div>' +
        '<div class="gf-lbl a-in"' + st("left:20px;top:440px;width:200px;text-align:left", 3.8) + '><span class="gf-big" style="position:static">8</span><br>lo recibieron<small>queda registrado quién lo envió, cuándo y por qué canal</small></div></div>';
    },

    /* La red ve agregados, nunca personas */
    red: function () {
      var E = [[40, "Asociación Puentes", 41, 14], [290, "Fundación Raíces", 23, 6], [540, "Red Vecinal Sur", 19, 5]];
      return '<div class="gf"><svg>' + E.map(function (e, i) { return '<path class="gf-ln a-draw" d="M390 130 L' + (e[0] + 100) + ' 250"' + st("--len:300", 0.6 + i * 0.2) + "/>"; }).join("") + "</svg>" +
        '<div class="gf-card a-pop"' + st("left:270px;top:40px;width:240px;text-align:center", 0) + '><div class="gf-t">Red Sur Madrid</div><div class="gf-b">Ayuntamiento</div></div>' +
        E.map(function (e, i) {
          return '<div class="gf-card a-in"' + st("left:" + e[0] + "px;top:250px;width:200px", 1 + i * 0.25) + '><div class="gf-b" style="font-size:15px">' + e[1] + '</div><div style="display:flex;gap:18px;margin-top:10px"><span><span class="gf-num">' + e[2] + '</span><br><span class="gf-s">personas</span></span><span><span class="gf-num">' + e[3] + '</span><br><span class="gf-s">recursos</span></span></div><div class="gf-barra"><i class="a-ancho"' + st("--w:" + (55 + i * 12) + "%;background:#FF9A5C", 2 + i * 0.2) + "></i></div></div>";
        }).join("") +
        '<div class="gf-lbl a-in"' + st("left:180px;top:420px;width:420px", 3.4) + "><span class='gf-tag' style='background:#ffffff1a;color:#F4F4F9'>🔒 Sin datos personales</span><br><br>Ve cómo trabaja cada entidad y comunica a nombre de la red o de una de ellas</div></div>";
    },

    /* Una entidad nueva suma al mapa */
    alta: function () {
      return '<div class="gf"><div class="gf-mapa a-fade"' + d(0) + '><div class="gf-leaf" id="gfLeaf"></div></div>' +
        '<div class="gf-card a-in"' + st("left:70px;top:330px;width:270px", 1) + '><div class="gf-t">Alta de entidad</div><div class="gf-b" style="margin-top:4px">Centro Vecinal Orcasitas</div><div class="gf-s">Usera · 5 recursos del catálogo común</div><span class="gf-tag gf-tag--ok a-pop" style="margin-top:8px;--d:2s">En la red</span></div>' +
        '<div class="gf-lbl a-in"' + st("left:40px;top:478px;width:700px", 3.8) + ">Y sus recursos aparecen para toda la ciudad</div></div>";
    }
  };
})();
