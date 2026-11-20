/* Datos de ejemplo del mapa de la landing. La zona es cerrada (sur de Madrid): no se sale de ella.
   Las tres entidades de la semilla (datos.js) son reales en la demo; el resto es de ejemplo. */
window.BC_MAPA = {
  /* Límites de la zona: suroeste y noreste. */
  zona: { nombre: "Sur de Madrid", so: [40.275, -3.815], ne: [40.425, -3.635] },
  /* Dónde está cada entidad de la semilla. */
  entidades: {
    e1: { lat: 40.3853, lng: -3.7068, barrio: "Usera" },
    e2: { lat: 40.3832, lng: -3.7412, barrio: "Carabanchel" },
    e3: { lat: 40.3057, lng: -3.7327, barrio: "Getafe" }
  },
  /* Entidades de ejemplo que pueblan la zona, con cuántos recursos publica cada una. */
  vecinas: [
    { nombre: "Centro Vecinal Orcasitas", barrio: "Usera", lat: 40.3690, lng: -3.7120, n: 5 },
    { nombre: "Casa de Acogida San Fermín", barrio: "Usera", lat: 40.3745, lng: -3.6915, n: 4 },
    { nombre: "Asociación Vecinal Aluche", barrio: "Latina", lat: 40.3925, lng: -3.7610, n: 5 },
    { nombre: "Fundación Camino Abierto", barrio: "Latina", lat: 40.4040, lng: -3.7445, n: 4 },
    { nombre: "Centro de Mayores Vista Alegre", barrio: "Carabanchel", lat: 40.3880, lng: -3.7290, n: 4 },
    { nombre: "Red de Apoyo Opañel", barrio: "Carabanchel", lat: 40.3930, lng: -3.7180, n: 3 },
    { nombre: "Asociación La Unión de Villaverde", barrio: "Villaverde", lat: 40.3460, lng: -3.7090, n: 5 },
    { nombre: "Espacio Joven San Cristóbal", barrio: "Villaverde", lat: 40.3410, lng: -3.6880, n: 4 },
    { nombre: "Servicios Sociales Arganzuela", barrio: "Arganzuela", lat: 40.4000, lng: -3.6990, n: 4 },
    { nombre: "Comunidad Entrevías", barrio: "Puente de Vallecas", lat: 40.3795, lng: -3.6690, n: 5 },
    { nombre: "Fundación Vallecas Acoge", barrio: "Puente de Vallecas", lat: 40.3930, lng: -3.6600, n: 4 },
    { nombre: "Asociación Zarzaquemada", barrio: "Leganés", lat: 40.3320, lng: -3.7560, n: 5 },
    { nombre: "Centro Cívico San Nicasio", barrio: "Leganés", lat: 40.3280, lng: -3.7720, n: 3 },
    { nombre: "Red Solidaria Las Margaritas", barrio: "Getafe", lat: 40.3120, lng: -3.7200, n: 4 },
    { nombre: "Asociación El Bercial", barrio: "Getafe", lat: 40.3220, lng: -3.7380, n: 3 },
    { nombre: "Fundación Alcorcón Convive", barrio: "Alcorcón", lat: 40.3470, lng: -3.8000, n: 4 }
  ],
  /* Nombres de recurso verosímiles por necesidad, para los datos de ejemplo. */
  nombres: {
    "Vivienda": ["Mediación en alquiler", "Habitación compartida", "Ayuda para suministros"],
    "Alimentación": ["Despensa de barrio", "Comedor vecinal", "Cesta semanal"],
    "Salud y Bienestar": ["Grupo de bienestar emocional", "Escucha psicológica", "Paseos saludables"],
    "Documentación y Trámites": ["Ayuda con el empadronamiento", "Cita previa acompañada", "Asesoría de extranjería"],
    "Red de Apoyo": ["Café de vecinos", "Grupo de apoyo mutuo", "Acompañamiento en soledad"],
    "Formación": ["Clases de español", "Alfabetización de adultos", "Taller de cocina"],
    "Empleo": ["Orientación laboral", "Taller de currículum", "Bolsa de empleo local"],
    "Competencias Digitales": ["Aula digital para mayores", "Trámites por internet", "Móvil sin miedo"],
    "Infancia y Menores": ["Apoyo escolar", "Ludoteca de tarde", "Campamento urbano"],
    "Autonomía Personal y Cuidados": ["Gimnasia para mayores", "Respiro para cuidadores", "Taller de memoria"],
    "Movilidad": ["Acompañamiento a citas médicas", "Abono transporte: te ayudamos"],
    "Participación y Comunidad": ["Huerto comunitario", "Asamblea de barrio", "Coro vecinal"],
    "Familia": ["Escuela de familias", "Mediación familiar"],
    "Mujer y Cuidados": ["Espacio de mujeres", "Asesoría de igualdad"],
    "Ingresos": ["Ayuda con prestaciones", "Educación financiera"]
  },
  /* Foto por necesidad para las tarjetas (shared/img/landing). */
  fotos: {
    "Vivienda": "p7641904", "Alimentación": "p6995221", "Salud y Bienestar": "p5711170", "Documentación y Trámites": "p7821682",
    "Red de Apoyo": "p33714886", "Formación": "p5427868", "Empleo": "p34692635", "Competencias Digitales": "p5427998",
    "Infancia y Menores": "p5427998", "Autonomía Personal y Cuidados": "p11674389", "Movilidad": "p12085633",
    "Participación y Comunidad": "p18429308", "Familia": "p33714873", "Mujer y Cuidados": "p33714886", "Ingresos": "p7821682"
  },
  fotoBase: "p33714873",
  /* Líneas de participación de la landing: cada una filtra el mapa por estas necesidades. */
  lineas: [
    { id: "mayores", titulo: "Personas mayores", texto: "Acompañamiento, autonomía en casa y actividades para no estar solo.", foto: "p11674389", cats: ["Autonomía Personal y Cuidados", "Movilidad", "Competencias Digitales"] },
    { id: "bienestar", titulo: "Vecinos y salud mental", texto: "Grupos de apoyo y atención psicológica cerca, entre vecinos.", foto: "p5711375", cats: ["Salud y Bienestar", "Red de Apoyo"] },
    { id: "acogida", titulo: "Nueva ciudadanía y acogida", texto: "Trámites, idioma y primeros pasos para quien acaba de llegar.", foto: "p5427998", cats: ["Documentación y Trámites", "Formación", "Vivienda"] }
  ]
};
