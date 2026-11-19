/* Casos guiados del rol (sirven en móvil y escritorio). Los datos se comparten entre roles; «Restablecer datos» vuelve a la semilla. */
(() => {
const APP = "../../../app/brujula/";
const SI = (sel, body) => ({ t: "click", sel, body });
const VE = (sel, body) => ({ t: "note", sel, body });
const NAV = (k) => "[data-nav=\"" + k + "\"]";
window.CASOS = [
  {
    id: "3.1", titulo: "Solicitudes y por asignar",
    falta: "Los avisos al conector no se envían; solo se registran.",
    steps: [
      { t: "goto", url: APP + "index.html?rol=entidad#/resumen", body: "El panel interno de Asociación Puentes. Solo ella lo ve." },
      VE(".kpis", "Personas, autorregistros por asignar, solicitudes por decidir y conectores."),
      SI(NAV("asignar"), "Abre Personas › Asignar conector."),
      VE("[data-asignar]", "Un autorregistro que espera conector."),
      VE(".ez-con", "Los conectores de la entidad, ahí mismo y sin ventana aparte."),
      SI('[data-act="asignar-a"]', "Un clic asigna el conector y la persona sale de la lista."),
      SI(NAV("solicitudes"), "Pasa a Personas › Solicitudes de recursos."),
      VE('[data-persona="BC-2026-0125"]', "Leila es de Red Vecinal Sur: la entidad ve solo la ficha mínima, no el diagnóstico."),
      SI('[data-persona="BC-2026-0125"] [data-act="aprobar-ab"]', "Aprobar pide confirmación."),
      SI(".sp-sl__h", "Desliza a la derecha para confirmar. Queda en el historial de la tarjeta y en el registro de accesos de la persona.")
    ]
  },
  {
    id: "3.4", titulo: "Una última plaza y una necesidad a la vez",
    falta: "Si ya se recorrió, «Restablecer datos» devuelve las plazas a la semilla.",
    steps: [
      { t: "goto", url: APP + "index.html?rol=entidad#/resumen", body: "Las solicitudes se deciden por persona, con su situación delante." },
      SI(NAV("solicitudes"), "Abre Personas › Recursos solicitados."),
      VE('[data-persona="BC-2026-0125"]', "Leila es de Red Vecinal Sur: ficha mínima, con candado, y lo que pide a tu entidad."),
      VE('[data-sol="s14"] [data-plazas]', "Al Piso de acogida temporal le queda una plaza."),
      SI('[data-sol="s14"] [data-act="aprobar-ab"]', "Aprobar pide confirmación."),
      SI(".sp-sl__h", "Confirma deslizando: ocupa la última plaza."),
      VE('[data-persona="BC-2026-0125"] [data-dec="s14"]', "Queda en el historial de la tarjeta."),
      VE('[data-sol="s15"] [data-bloqueo="cupo"]', "Fatou pedía el mismo piso: queda «No disponible» por cupo."),
      SI('[data-sol="s15"] [data-e="En lista de espera"]', "Su única salida es la lista de espera."),
      { t: "goto", url: APP + "index.html?rol=entidad#/persona/BC-2026-0141/postular", body: "Yasmina ya tiene una solicitud de Vivienda en curso." },
      VE(".kz-rec--off", "No se puede pedir lo mismo en dos lugares a la vez: las demás opciones de Vivienda quedan bloqueadas.")
    ]
  },
  {
    id: "3.2", titulo: "Personas y otras entidades",
    steps: [
      { t: "goto", url: APP + "index.html?rol=entidad#/personas", body: "Las personas con expediente en la entidad." },
      VE(".bc-tbl", "Origen, conector, Mapa de Vida y su uso en otras entidades."),
      SI('a.bc-tr[data-p="BC-2026-0141"]', "Yasmina autorizó compartir su itinerario."),
      VE("#otras", "Se ve en qué otras entidades está y el estado, sin su diagnóstico."),
      VE("#accesos", "Cada consulta queda registrada; la persona puede verla."),
      SI(NAV("personas"), "Vuelve a la lista."),
      SI('a.bc-tr[data-p="BC-2026-0152"]', "Carlos no lo autorizó."),
      VE("#otras", "La entidad no ve ni si participa en otras entidades."),
      SI(NAV("conectores"), "Conectores: quién acompaña a quién y con cuánta carga."),
      VE('[data-con="c1"]', "Lucía Romero y sus personas.")
    ]
  },
  {
    id: "3.3", titulo: "Mis recursos",
    steps: [
      { t: "goto", url: APP + "index.html?rol=entidad#/recursos", body: "Lo que la entidad ofrece a la red: lo registró al darse de alta y lo gestiona aquí." },
      VE('[data-recurso="r1"]', "Cada recurso con cuándo ocurre, su próxima fecha, plazas ocupadas y solicitudes por decidir."),
      SI('[data-recurso="r4"] [data-act="rec-pausa"]', "Pausar: deja de proponerse a los conectores, pero conserva a sus personas."),
      SI('[data-recurso="r4"] [data-act="rec-pausa"]', "Y se reactiva igual."),
      SI("#btn-nuevo-rec", "Añade un recurso nuevo."),
      SI('[data-act="e-cat"][data-v="Formación"]', "Primero, la necesidad que atiende."),
      SI('[data-act="e-kat"][data-v="k110"]', "Y el recurso del catálogo común: precarga su formato, cuándo ocurre y las plazas."),
      SI("#btn-sig", "Básico: el nombre y el formato, ya elegidos."),
      SI("#btn-sig", "Cuándo: por sesiones, con las próximas fechas a la vista."),
      SI("#btn-sig", "Acceso y plazas: cómo se entra, cuántos caben y si admite acompañantes."),
      SI("#btn-sig", "Detalles y vista previa: así lo verán los conectores."),
      SI("#btn-sig", "Publicar: desde ya se propone en toda la red, con su calendario."),
      VE(".cols", "El nuevo recurso aparece en la lista, activo.")
    ]
  }
,
  {
    id: "3.5", titulo: "Verificar a una familia",
    steps: [
      { t: "goto", url: APP + "index.html?rol=entidad#/personas/verificar", body: "Familiares que agregaron las personas que atiende la entidad." },
      VE(".ez-vf", "Hasta verificarlos no pueden acompañar a nadie a un recurso."),
      SI('[data-act="fam-ver"]', "Verifica la ficha; también puede rechazarla con un motivo.")
    ]
  },
  {
    id: "3.6", titulo: "Panel de un recurso",
    steps: [
      { t: "goto", url: APP + "index.html?rol=entidad#/panel/r4", body: "El panel del taller de competencias digitales." },
      VE(".pn-kpis", "Plazas, inscritos, lista de espera y confirmados de la próxima fecha."),
      SI('a[href="#/panel/r4/fechas"]', "Cada fecha: quién confirmó, quién no va y quién no respondió."),
      SI('a[href="#/panel/r4/lista"]', "Y la lista del día para marcar quién vino.")
    ]
  },
  {
    id: "3.7", titulo: "Aprobar un comunicado",
    steps: [
      { t: "goto", url: APP + "index.html?rol=entidad#/comunicados/aprobar", body: "Un conector escribió a los inscritos del taller de cocina." },
      SI('[data-act="cm-aprobar"]', "La coordinación lo aprueba y sale por app y correo."),
      SI('a[href="#/comunicados/enviados"]', "Queda registrado quién lo escribió, quién lo aprobó, a quién llegó y quién lo leyó.")
    ]
  }
];
})();
