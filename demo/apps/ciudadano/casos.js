/* Casos guiados del rol (sirven en móvil y escritorio). Los datos se comparten entre roles; «Restablecer datos» vuelve a la semilla. */
(() => {
const APP = "../../../app/brujula/";
const SI = (sel, body) => ({ t: "click", sel, body });
const VE = (sel, body) => ({ t: "note", sel, body });
const NAV = (k) => "[data-nav=\"" + k + "\"]";
window.CASOS = [
  {
    id: "1.1", titulo: "Registrarme",
    falta: "El marco no escribe en los campos: se completan con datos de ejemplo al insistir en «Continuar». El aviso por WhatsApp no se envía.",
    steps: [
      { t: "goto", url: APP + "index.html?rol=ciudadano&sinsesion=1#/inicio", body: "El ciudadano entra a Brújula Ciudadana." },
      VE(".bc-hero", "Se registra una sola vez; registrarse solo es una decisión nueva frente a los docs del MVP."),
      SI("#btn-registrarme", "Empieza el registro."),
      SI('[data-c="privacidad"]', "Acepta la política de privacidad (obligatorio)."),
      SI('[data-c="tratamiento"]', "Autoriza el tratamiento de datos (obligatorio)."),
      SI('[data-c="entidades"]', "Opcional: permite que otras entidades vean su itinerario, nunca su diagnóstico."),
      SI("#btn-sig", "Continúa."),
      SI("#btn-sig", "Sus datos: el perfil básico del doc 03, sin dirección exacta. Sin completar, marca lo que falta."),
      SI("#btn-sig", "Al insistir se completa con datos de ejemplo."),
      SI("#btn-sig", "Continúa."),
      SI("#btn-sig", "¿Cómo estás hoy?: las 8 preguntas del Mapa de Vida en modo persona (doc 04), una por pantalla."),
      SI("#btn-sig", "Al insistir se responden todas con datos de ejemplo."),
      VE('[data-q="a1"]', "Cada respuesta es un semáforo: estable, en proceso o necesita apoyo."),
      SI("#btn-sig", "Económico: necesidades básicas."),
      SI("#btn-sig", "Social: vivienda."),
      SI("#btn-sig", "Social: salud."),
      SI("#btn-sig", "Relacional: personas cercanas."),
      SI("#btn-sig", "Relacional: comunidad."),
      SI("#btn-sig", "Legal: documentación."),
      SI("#btn-sig", "Legal: derechos."),
      SI("#btn-sig", "Las respuestas alimentan 7 de las 16 áreas del Mapa de Vida; el resto lo completa el conector."),
      VE('[data-e="e1"]', "Elige la entidad que lo atenderá."),
      SI("#btn-sig", "Crea su expediente."),
      VE("#mi-conector", "Ya tiene expediente. La entidad lo ve como «Por asignar a un conector».")
    ]
  },
  {
    id: "1.2", titulo: "Mi expediente",
    falta: "Mi expediente es una etapa posterior al MVP según los docs.",
    steps: [
      { t: "goto", url: APP + "index.html?rol=ciudadano&sinsesion=1#/inicio", body: "Una persona que ya tiene expediente." },
      SI("#btn-ejemplo", "Entra con su expediente."),
      VE("#mi-conector", "Ve quién la acompaña y sus próximos pasos."),
      SI(NAV("recursos"), "Sus recursos en cualquier entidad de la red."),
      VE("#mis-recursos", "Cada uno con su estado."),
      SI(NAV("perfil"), "Su perfil."),
      SI('a[href="#/privacidad"]', "Privacidad."),
      VE("#accesos", "Quién vio sus datos, cuándo y para qué."),
      SI('[data-act="consent"][data-c="entidades"]', "Puede retirar el permiso de compartir con otras entidades."),
      VE("#consentimientos", "Desde ese momento, las otras entidades dejan de ver su itinerario.")
    ]
  },
  {
    id: "1.3", titulo: "Mi agenda",
    steps: [
      { t: "goto", url: APP + "index.html?rol=ciudadano&sinsesion=1#/inicio", body: "Cada recurso es un evento con fecha: la persona sabe cuándo le toca." },
      SI("#btn-ejemplo", "Entra con su expediente."),
      VE("#proximas", "En su inicio, sus próximas fechas."),
      SI(NAV("recursos"), "Sus recursos, en cualquier entidad de la red."),
      SI('[data-vt="agenda"]', "La agenda junta las dos próximas semanas de todos sus recursos, de cualquier entidad."),
      SI('[data-vt="lista"]', "Y cada recurso dice cuándo ocurre y cuál es la próxima fecha."),
      SI(NAV("buscar"), "Al buscar ayuda también ve cuándo ocurre cada recurso y cuántas plazas quedan para la próxima fecha.")
    ]
  },
  {
    id: "1.4", titulo: "Ir con mi familia",
    steps: [
      { t: "goto", url: APP + "index.html?rol=ciudadano&sinsesion=1#/inicio", body: "Yasmina quiere llevar a sus hijos al apoyo escolar." },
      SI("#btn-ejemplo", "Entra con su expediente."),
      SI("#mi-familia", "Su familia: cada hijo tiene su propia ficha."),
      VE(".cz-fms", "Amira ya está verificada; Omar, por verificar: lo revisa la entidad que la atiende."),
      SI('[data-act="c-fam-ver"]', "En la demo simulamos que la entidad lo verifica."),
      { t: "goto", url: APP + "index.html?rol=ciudadano#/buscar/Infancia%20y%20Menores", body: "Busca el apoyo escolar." },
      SI('[data-act="c-pedir"][data-r="r16"]', "Al apuntarse le pregunta quién va con ella."),
      SI('[data-act="c-pedir-fam"]', "Elige a quién lleva: cada uno ocupa una plaza y lleva su propio consumo."),
      SI("#btn-pedir-ok", "Y se apunta."),
      VE("#mis-recursos", "En Mis recursos dice con quién va.")
    ]
  },
  {
    id: "1.5", titulo: "Mis avisos",
    steps: [
      { t: "goto", url: APP + "index.html?rol=ciudadano&sinsesion=1#/inicio", body: "Las entidades le avisan de cambios y novedades." },
      SI("#btn-ejemplo", "Entra con su expediente."),
      SI("#mis-avisos", "La campana dice cuántos avisos no leyó."),
      VE(".cz-avisos", "Cada aviso con quién lo firma. Los de sus recursos le llegan siempre; los comunicados, solo si los autorizó.")
    ]
  }
];
})();
