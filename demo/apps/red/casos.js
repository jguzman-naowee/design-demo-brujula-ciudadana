/* Casos guiados del rol (sirven en móvil y escritorio). Los datos se comparten entre roles; «Restablecer datos» vuelve a la semilla. */
(() => {
const APP = "../../../app/brujula/";
const SI = (sel, body) => ({ t: "click", sel, body });
const VE = (sel, body) => ({ t: "note", sel, body });
window.CASOS = [
  {
    id: "5.1", titulo: "Ver la red",
    steps: [
      { t: "goto", url: APP + "index.html?rol=red#/red", body: "La capa de arriba: un ayuntamiento que agrupa a las entidades de la zona." },
      VE(".pn-kpis", "Ve la red entera en cifras: personas, recursos, fechas de la semana y lo que espera decisión."),
      VE(".rd-grid", "Y cada entidad con su ocupación. Solo agregados: nunca datos de personas."),
      SI('[data-entidad="e2"]', "Entra a una entidad."),
      VE(".pn-tbl", "Sus recursos, cuándo ocurren y cuántas plazas tienen ocupadas.")
    ]
  },
  {
    id: "5.2", titulo: "Comunicar a nombre de una entidad",
    steps: [
      { t: "goto", url: APP + "index.html?rol=red#/red/e1", body: "Un festivo afecta a una entidad de la red." },
      SI("#btn-r-firma", "La red escribe a nombre de esa entidad."),
      VE("#cm-nuevo", "Elige la firma (la red o una entidad) y a quién llega; los casos protegidos y quien no autorizó comunicados quedan fuera."),
      SI("#btn-cm", "Sin mensaje, pide escribirlo."),
      SI("#btn-cm", "Al insistir se completa con un ejemplo."),
      SI("#btn-cm", "Y lo envía por app y correo."),
      SI('a[href="#/comunicados/enviados"]', "Queda registrado; la entidad lo ve en su historial como «enviado por la red».")
    ]
  }
];
})();
