// Guion del recorrido guiado: un showroom del proyecto. Los conceptos se cuentan con gráficos
// animados (tipo "grafico", tour/graficos.js) y las vistas reales aparecen donde hay que ver la app.
// Los asistentes validan con insistir(): 1.er Continuar marca, 2.º rellena, 3.º avanza.
var SIG = { t: "click", sel: "#btn-sig", espera: 250 };
// Ritmo pausado para que se lea cada estado del asistente (marcado, relleno, siguiente).
var SIGL = { t: "click", sel: "#btn-sig", espera: 1000 };
var EJEMPLO = [ { t: "esperar", sel: "#btn-ejemplo" }, { t: "click", sel: "#btn-ejemplo", espera: 600 } ];

window.ESCENAS = [
  /* ── 1 · Por qué ── */
  { id: "inicio", tipo: "hero", rol: "Inicio", duracion: 7000,
    titulo: "Una sola puerta para llegar a la ayuda que necesitas",
    texto: "Presentación del concepto, con datos de ejemplo." },
  { id: "problema", tipo: "grafico", grafico: "problema", rol: "El problema", duracion: 9000,
    titulo: "La ayuda existe, pero está repartida",
    texto: "Cada entidad pide los mismos datos y ninguna ve lo que hacen las demás. La persona da vueltas." },
  { id: "puerta", tipo: "grafico", grafico: "puerta", rol: "La propuesta", duracion: 9000,
    titulo: "Una sola puerta",
    texto: "La persona se registra una vez y Brújula Ciudadana la conecta con las entidades de su barrio." },
  { id: "mapa", tipo: "vista", rol: "Ciudadanía", sup: "escritorio", duracion: 9000,
    url: "mapa.html",
    titulo: "Todo lo que hay cerca, en un mapa",
    texto: "Cada punto es un recurso que una entidad ofrece hoy. Se filtra por necesidad y se ve qué hay esta semana.",
    acciones: [] },
  { id: "tiempo", tipo: "grafico", grafico: "tiempo", rol: "Los recursos", duracion: 9000,
    titulo: "Cada recurso es una actividad con fecha",
    texto: "Un día, cada semana, por sesiones o como estancia. Todos se gestionan de la misma forma." },

  /* ── 2 · Ciudadano ── */
  { id: "permisos", tipo: "grafico", grafico: "permisos", rol: "Ciudadano", duracion: 9000,
    titulo: "Decide qué comparte",
    texto: "Antes de contar nada elige sus permisos, y después ve quién consultó sus datos y para qué." },
  { id: "ciudadano-hoy", tipo: "vista", rol: "Ciudadano", sup: "movil", duracion: 13000,
    url: "app/brujula/index.html?rol=ciudadano&sinsesion=1#/inicio",
    titulo: "Cuenta cómo está hoy",
    texto: "Desde su teléfono, con unas pocas preguntas sencillas.",
    acciones: [ { t: "esperar", sel: "#btn-registrarme" }, { t: "click", sel: "#btn-registrarme", espera: 1200 },
      SIGL, SIGL, SIGL, SIGL, SIGL, SIGL, SIGL, SIGL, SIGL ] },
  { id: "mapavida", tipo: "grafico", grafico: "mapavida", rol: "Ciudadano", duracion: 9000,
    titulo: "Su Mapa de Vida",
    texto: "Dieciséis áreas de su vida en un vistazo, con lo que más pesa primero." },

  /* ── 3 · Conector ── */
  { id: "conector-ficha", tipo: "vista", rol: "Conector", sup: "movil", duracion: 8000,
    url: "app/brujula/index.html?rol=conector#/persona/BC-2026-0141",
    titulo: "Alguien la acompaña",
    texto: "Su conector tiene la historia completa: contacto, Mapa de Vida, familia y recursos.",
    acciones: [] },
  { id: "plazas", tipo: "grafico", grafico: "plazas", rol: "Conector", duracion: 9000,
    titulo: "La postula, también con su familia",
    texto: "Cada persona ocupa su plaza y lleva su propio consumo. Y no se pide lo mismo en dos sitios." },

  /* ── 4 · Entidad ── */
  { id: "entidad-resumen", tipo: "vista", rol: "Entidad", sup: "escritorio", duracion: 8000,
    url: "app/brujula/index.html?rol=entidad#/resumen",
    titulo: "La entidad ve qué necesita atención",
    texto: "Solicitudes, personas por asignar y recursos de la semana, desde el primer momento.",
    acciones: [] },
  { id: "entidad-nuevo", tipo: "vista", rol: "Entidad", sup: "escritorio", duracion: 8000,
    url: "app/brujula/index.html?rol=entidad#/recurso/nuevo",
    titulo: "Publica un recurso en pocos pasos",
    texto: "Elige del catálogo común de la red: el recurso nace con su formato, su calendario y sus plazas.",
    acciones: [ { t: "click", sel: "[data-act=\"e-cat\"][data-v=\"Formación\"]", espera: 400 }, { t: "click", sel: "[data-act=\"e-kat\"][data-v=\"k110\"]", espera: 400 } ] },
  { id: "fichamin", tipo: "grafico", grafico: "fichamin", rol: "Entidad", duracion: 9000,
    titulo: "Ve lo justo para decidir",
    texto: "Si la solicitud viene de otra entidad, recibe la ficha mínima. El resto, solo con permiso." },
  { id: "verificar", tipo: "grafico", grafico: "verificar", rol: "Entidad", duracion: 8000,
    titulo: "Verifica a la familia",
    texto: "Cada familiar tiene su ficha, y la confirma la entidad que atiende a la persona." },

  /* ── 5 · El día del recurso ── */
  { id: "ciudadano-agenda", tipo: "vista", rol: "Ciudadano", sup: "movil", duracion: 8000,
    url: "app/brujula/index.html?rol=ciudadano&sinsesion=1#/inicio",
    titulo: "Sabe cuándo le toca y avisa que va",
    texto: "Su agenda junta lo de todas las entidades. Si no confirma a tiempo, su plaza sirve a otra persona.",
    acciones: EJEMPLO.concat([ { t: "click", sel: ".bc-tabbar [data-nav=\"recursos\"]", espera: 600 }, { t: "click", sel: ".cz-seg [data-vt=\"agenda\"]", espera: 600 } ]) },
  { id: "lista", tipo: "grafico", grafico: "lista", rol: "Equipo", duracion: 9000,
    titulo: "El equipo pasa lista",
    texto: "Así se ve el uso real de cada persona. «No vino» queda a la vista, pero no da de baja a nadie." },
  { id: "aviso", tipo: "grafico", grafico: "aviso", rol: "Equipo", duracion: 9000,
    titulo: "Y avisa si algo cambia",
    texto: "El aviso llega a quienes van, por la aplicación y por correo. Las personas protegidas no reciben envíos masivos." },

  /* ── 6 · La red ── */
  { id: "red", tipo: "grafico", grafico: "red", rol: "Red", duracion: 9000,
    titulo: "Por encima, la red",
    texto: "Un ayuntamiento ve cómo trabaja cada entidad, sin datos de personas." },
  { id: "alta", tipo: "grafico", grafico: "alta", rol: "Red", duracion: 8000,
    titulo: "Cada entidad nueva suma al mapa",
    texto: "Se da de alta con un formulario sencillo y sus recursos aparecen para toda la ciudad." },

  /* ── 7 · Cierre ── */
  { id: "cierre", tipo: "hero", rol: "Brújula Ciudadana", cta: true, duracion: 9000,
    titulo: "La ayuda de tu ciudad, en un solo lugar",
    texto: "Esto es lo que proponemos. Pruébalo tú mismo en la demostración." }
];
