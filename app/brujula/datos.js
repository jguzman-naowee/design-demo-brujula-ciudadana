/* Datos de ejemplo de la demo. Campos y dimensiones del doc 03; recursos del catálogo 11. */
window.BC_CATALOGO = {
  idiomas: ["Español", "Catalán", "Inglés", "Árabe", "Francés", "Otro"],
  canales: ["WhatsApp", "Teléfono", "Email"],
  documento: ["Sí", "No", "En trámite"],
  consentimientos: [
    { id: "privacidad", txt: "Acepto la política de privacidad", obligatorio: true },
    { id: "tratamiento", txt: "Autorizo el tratamiento de mis datos personales", obligatorio: true },
    { id: "entidades", txt: "Autorizo compartir mi itinerario con otras entidades colaboradoras", obligatorio: false, ayuda: "Así cada entidad donde participas ve en qué recursos estás y su estado, nunca tu diagnóstico." },
    { id: "comunicaciones", txt: "Deseo recibir comunicaciones sobre mi expediente", obligatorio: false }
  ],
  bloques: [
    { id: "b1", nombre: "Necesidades básicas" },
    { id: "b2", nombre: "Entorno familiar" },
    { id: "b3", nombre: "Autonomía" },
    { id: "b4", nombre: "Participación" }
  ],
  dimensiones: [
    { id: "vivienda", b: "b1", n: "Vivienda", cat: "Vivienda", q: "¿Cuál es tu situación actual de vivienda?", o: ["Tengo una vivienda estable", "Mi situación es temporal o inestable", "Necesito buscar vivienda inmediatamente"] },
    { id: "ingresos", b: "b1", n: "Ingresos", cat: "Ingresos", q: "¿Cuál es tu situación económica actual?", o: ["Tengo una fuente de ingresos estable", "Mis ingresos son insuficientes o inestables", "No tengo ninguna fuente de ingresos"] },
    { id: "alimentacion", b: "b1", n: "Alimentación", cat: "Alimentación", q: "Respecto a tu alimentación…", o: ["Cubro mis necesidades alimentarias", "Necesito apoyo en la cesta o banco de alimentos", "Necesito un comedor social"] },
    { id: "salud", b: "b1", n: "Salud y bienestar", cat: "Salud y Bienestar", q: "¿Cómo te encuentras actualmente?", o: ["Me encuentro bien", "Hay aspectos que me gustaría mejorar", "Necesito apoyo sanitario o psicológico"] },
    { id: "documentacion", b: "b1", n: "Documentación", cat: "Documentación y Trámites", q: "Respecto a tus documentos y gestiones…", o: ["Todo está al día", "Tengo trámites administrativos pendientes", "Necesito ayuda legal"] },
    { id: "red", b: "b2", n: "Red de apoyo", cat: "Red de Apoyo", q: "Cuando necesito ayuda…", o: ["Tengo una red de apoyo sólida", "Tengo una red de apoyo inestable", "Me ayudaría tener una red de apoyo estable"] },
    { id: "familia", b: "b2", n: "Familia", cat: "Familia", q: "¿Cuál es tu situación familiar actual?", o: ["Vivo con familiares o personas cercanas", "Tengo familia pero no convivimos", "Me encuentro solo/a y sin apoyo familiar"] },
    { id: "menores", b: "b2", n: "Infancia y menores", cat: "Infancia y Menores", q: "¿Tienes menores a cargo?", o: ["No tengo menores a cargo", "Tengo menores y cubro adecuadamente sus necesidades", "Tengo menores y necesito apoyo para atenderlos"] },
    { id: "cuidados", b: "b2", n: "Mujer y cuidados", cat: "Mujer y Cuidados", opcional: true, q: "¿Cuál de estas situaciones describe mejor tu realidad?", o: ["No tengo responsabilidades de cuidado que limiten mi autonomía", "Soy madre o cuidadora principal y necesito más apoyo", "Estoy viviendo una situación de violencia o riesgo familiar"] },
    { id: "empleo", b: "b3", n: "Empleo", cat: "Empleo", q: "¿Cuál es tu situación laboral?", o: ["Tengo una situación laboral estable", "Quiero orientación laboral", "Quiero buscar empleo activamente"] },
    { id: "formacion", b: "b3", n: "Formación", cat: "Formación", q: "Respecto a tu formación…", o: ["Tengo la formación que necesito actualmente", "Me gustaría adquirir nuevas habilidades", "Necesito formación para acceder a oportunidades"] },
    { id: "movilidad", b: "b3", n: "Movilidad", cat: "Movilidad", q: "Respecto a tus desplazamientos…", o: ["Me desplazo sin dificultad", "Tengo limitaciones económicas para desplazarme", "Tengo limitaciones físicas para desplazarme"] },
    { id: "digital", b: "b3", n: "Competencias digitales", cat: "Competencias Digitales", q: "Respecto al uso de tecnología…", o: ["Manejo internet y herramientas digitales con facilidad", "Quiero mejorar mis habilidades digitales", "Necesito ayuda para realizar gestiones digitales"] },
    { id: "autonomia", b: "b3", n: "Autonomía personal", cat: "Autonomía Personal y Cuidados", opcional: true, q: "Respecto a tu autonomía en el día a día…", o: ["Soy autónomo/a para gestionar mi vida diaria", "Algunas tareas me resultan difíciles, necesito apoyo puntual", "Necesito ayuda frecuente para mi cuidado diario"] },
    { id: "direccion", b: "b4", n: "Organización y dirección", cat: "Organización y Dirección", q: "Respecto a tus próximos pasos…", o: ["Tengo objetivos claros y sé cómo avanzar", "Tengo objetivos claros pero necesito apoyo para alcanzarlos", "No sé cuál debería ser mi siguiente paso"] },
    { id: "comunidad", b: "b4", n: "Participación y comunidad", cat: "Participación y Comunidad", q: "Respecto a tu entorno social…", o: ["Participo activamente en alguna comunidad", "Me gustaría conectar más con otras personas", "Me siento aislado/a"] }
  ]
};

/* Catálogo estándar (spec 07): el formato trae los valores por defecto del evento; los 150
   recursos son los del doc 11 del cliente. e: «fuera» no se hace, «fase2» queda para después. */
window.BC_CATALOGO.formatos = [
  { id: "taller", n: "Taller o curso", d: "Un grupo con varias sesiones", forma: "sesiones", modo: "Inscripción", plazas: 15, acompanantes: false },
  { id: "grupo", n: "Grupo o actividad periódica", d: "Se reúne cada semana", forma: "recurrente", cada: "semana", modo: "Inscripción", plazas: 20, acompanantes: true },
  { id: "atencion", n: "Atención o asesoría", d: "Citas dentro de un horario de atención", forma: "recurrente", cada: "semana", modo: "Solicitud", plazas: 8, acompanantes: true, maxAcompanantes: 1 },
  { id: "entrega", n: "Entrega de alimentos o bienes", d: "Se recoge cada día o cada semana, con límite de usos", forma: "recurrente", cada: "dia", modo: "Libre", plazas: 30, limite: 30, acompanantes: true },
  { id: "alojamiento", n: "Alojamiento", d: "Una estadía desde–hasta", forma: "estadia", modo: "Solicitud", plazas: 10, acompanantes: true },
  { id: "ayuda", n: "Ayuda económica o prestación", d: "Se resuelve una vez y se cobra cada mes", forma: "recurrente", cada: "mes", modo: "Solicitud", acompanantes: false },
  { id: "evento", n: "Evento o jornada", d: "Un día concreto", forma: "unico", modo: "Inscripción", plazas: 40, acompanantes: true },
  { id: "domicilio", n: "Servicio a domicilio o transporte", d: "Visitas o traslados programados", forma: "recurrente", cada: "semana", modo: "Solicitud", plazas: 10, acompanantes: false }
];
window.BC_CATALOGO.recursos = [
  { id: "k001", cat: "Vivienda", sub: "Emergencia habitacional", n: "Mesa de emergencia habitacional", f: "atencion" },
  { id: "k002", cat: "Vivienda", sub: "Emergencia habitacional", n: "Albergue", f: "alojamiento" },
  { id: "k003", cat: "Vivienda", sub: "Emergencia habitacional", n: "Vivienda temporal", f: "alojamiento" },
  { id: "k004", cat: "Vivienda", sub: "Emergencia habitacional", n: "Piso de inclusión", f: "alojamiento" },
  { id: "k005", cat: "Vivienda", sub: "Emergencia habitacional", n: "Piso tutelado", f: "alojamiento" },
  { id: "k006", cat: "Vivienda", sub: "Acceso vivienda", n: "Vivienda social", f: "alojamiento" },
  { id: "k007", cat: "Vivienda", sub: "Acceso vivienda", n: "Bolsa de alquiler social", f: "atencion" },
  { id: "k008", cat: "Vivienda", sub: "Acceso vivienda", n: "Mediación con propietarios", f: "atencion" },
  { id: "k009", cat: "Vivienda", sub: "Acceso vivienda", n: "Acompañamiento residencial", f: "atencion" },
  { id: "k010", cat: "Vivienda", sub: "Acceso vivienda", n: "Mediación hipotecaria", f: "atencion" },
  { id: "k011", cat: "Vivienda", sub: "Ayudas vivienda", n: "Ayuda al alquiler", f: "ayuda" },
  { id: "k012", cat: "Vivienda", sub: "Ayudas vivienda", n: "Ayuda a suministros", f: "ayuda" },
  { id: "k013", cat: "Ingresos", sub: "Prestaciones", n: "Renta Garantizada", f: "ayuda" },
  { id: "k014", cat: "Ingresos", sub: "Prestaciones", n: "Ingreso Mínimo Vital", f: "ayuda" },
  { id: "k015", cat: "Ingresos", sub: "Prestaciones", n: "Prestaciones municipales", f: "ayuda" },
  { id: "k016", cat: "Ingresos", sub: "Ayudas y Becas", n: "Ayudas económicas de emergencia", f: "ayuda" },
  { id: "k017", cat: "Ingresos", sub: "Ayudas y Becas", n: "Becas", f: "ayuda" },
  { id: "k018", cat: "Ingresos", sub: "Ayudas y Becas", n: "Ayudas extraordinarias", f: "ayuda" },
  { id: "k019", cat: "Ingresos", sub: "Formación Financiera", n: "Asesoramiento económico", f: "atencion" },
  { id: "k020", cat: "Ingresos", sub: "Formación Financiera", n: "Educación financiera", f: "taller" },
  { id: "k021", cat: "Ingresos", sub: "Financiación", n: "Microcréditos sociales", f: "ayuda" },
  { id: "k022", cat: "Ingresos", sub: "Financiación", n: "Programas de inserción laboral remunerada", f: "ayuda", e: "fase2" },
  { id: "k023", cat: "Alimentación", sub: "Comedor social", n: "Comedor social", f: "entrega" },
  { id: "k024", cat: "Alimentación", sub: "Comedor social", n: "Comedor escolar", f: "entrega" },
  { id: "k025", cat: "Alimentación", sub: "Banco de alimentos", n: "Banco de alimentos", f: "entrega" },
  { id: "k026", cat: "Alimentación", sub: "Banco de alimentos", n: "Entrega de lotes", f: "entrega" },
  { id: "k027", cat: "Alimentación", sub: "Banco de alimentos", n: "Nevera solidaria", f: "entrega" },
  { id: "k028", cat: "Alimentación", sub: "Ayuda supermercado", n: "Cheque alimentación", f: "ayuda" },
  { id: "k029", cat: "Alimentación", sub: "Ayuda supermercado", n: "Tarjeta monedero", f: "ayuda" },
  { id: "k030", cat: "Alimentación", sub: "Ayuda supermercado", n: "Supermercado social", f: "entrega" },
  { id: "k031", cat: "Alimentación", sub: "Nutrición", n: "Programas de nutrición", f: "taller" },
  { id: "k032", cat: "Alimentación", sub: "Alimentación infantil", n: "Ayudas infantiles de alimentación", f: "ayuda" },
  { id: "k033", cat: "Salud y Bienestar", sub: "Salud física", n: "Atención primaria", f: "atencion" },
  { id: "k034", cat: "Salud y Bienestar", sub: "Salud física", n: "Actividad física adaptada", f: "grupo" },
  { id: "k035", cat: "Salud y Bienestar", sub: "Salud física", n: "Programas de prevención", f: "taller" },
  { id: "k036", cat: "Salud y Bienestar", sub: "Salud mental", n: "Salud mental", f: "atencion" },
  { id: "k037", cat: "Salud y Bienestar", sub: "Salud mental", n: "Psicología social", f: "atencion" },
  { id: "k038", cat: "Salud y Bienestar", sub: "Salud mental", n: "Bienestar emocional", f: "atencion" },
  { id: "k039", cat: "Salud y Bienestar", sub: "Salud mental", n: "Atención familiar", f: "atencion" },
  { id: "k040", cat: "Salud y Bienestar", sub: "Salud infantil", n: "Atención psicológica infantil", f: "atencion" },
  { id: "k041", cat: "Salud y Bienestar", sub: "Adicciones", n: "Adicciones", f: "atencion" },
  { id: "k042", cat: "Salud y Bienestar", sub: "Grupos terapéuticos", n: "Grupos terapéuticos", f: "grupo" },
  { id: "k043", cat: "Salud y Bienestar", sub: "Dependencia", n: "Dependencia", f: "domicilio" },
  { id: "k044", cat: "Documentación y Trámites", sub: "Identificación", n: "Empadronamiento", f: "atencion" },
  { id: "k045", cat: "Documentación y Trámites", sub: "Identificación", n: "Certificados digitales", f: "atencion" },
  { id: "k046", cat: "Documentación y Trámites", sub: "Extranjería", n: "Extranjería", f: "atencion" },
  { id: "k047", cat: "Documentación y Trámites", sub: "Extranjería", n: "Nacionalidad", f: "atencion" },
  { id: "k048", cat: "Documentación y Trámites", sub: "Prestaciones", n: "Prestaciones", f: "atencion" },
  { id: "k049", cat: "Documentación y Trámites", sub: "Prestaciones", n: "Tramitación administrativa", f: "atencion" },
  { id: "k050", cat: "Documentación y Trámites", sub: "Asesoría jurídica", n: "Orientación jurídica", f: "atencion" },
  { id: "k051", cat: "Documentación y Trámites", sub: "Asesoría jurídica", n: "Asesoría legal", f: "atencion" },
  { id: "k052", cat: "Documentación y Trámites", sub: "Asesoría jurídica", n: "Defensa jurídica", f: "atencion" },
  { id: "k053", cat: "Documentación y Trámites", sub: "Mediación", n: "Mediación", f: "atencion" },
  { id: "k054", cat: "Red de Apoyo", sub: "Acompañamiento", n: "Voluntariado acompañante", f: "atencion", e: "fuera" },
  { id: "k055", cat: "Red de Apoyo", sub: "Acompañamiento", n: "Mentor social", f: "atencion" },
  { id: "k056", cat: "Red de Apoyo", sub: "Acompañamiento", n: "Acompañamiento emocional", f: "atencion" },
  { id: "k057", cat: "Red de Apoyo", sub: "Grupos", n: "Grupos de apoyo", f: "grupo" },
  { id: "k058", cat: "Red de Apoyo", sub: "Grupos", n: "Grupos de ayuda mutua", f: "grupo" },
  { id: "k059", cat: "Red de Apoyo", sub: "Grupos", n: "Comunidad vecinal", f: "grupo" },
  { id: "k060", cat: "Red de Apoyo", sub: "Grupos", n: "Asociaciones", f: "grupo" },
  { id: "k061", cat: "Red de Apoyo", sub: "Deporte y Actividades", n: "Espacios comunitarios", f: "grupo" },
  { id: "k062", cat: "Red de Apoyo", sub: "Deporte y Actividades", n: "Actividades grupales", f: "grupo" },
  { id: "k063", cat: "Red de Apoyo", sub: "Eventos", n: "Eventos", f: "evento" },
  { id: "k064", cat: "Familia", sub: "Conciliación", n: "Conciliación", f: "grupo" },
  { id: "k065", cat: "Familia", sub: "Conciliación", n: "Programas familiares", f: "taller" },
  { id: "k066", cat: "Familia", sub: "Conciliación", n: "Respiro familiar", f: "domicilio" },
  { id: "k067", cat: "Familia", sub: "Mediación familiar", n: "Mediación familiar", f: "atencion" },
  { id: "k068", cat: "Familia", sub: "Mediación familiar", n: "Terapia familiar", f: "atencion" },
  { id: "k069", cat: "Familia", sub: "Atención familiar", n: "Escuela de familias", f: "taller" },
  { id: "k070", cat: "Familia", sub: "Atención familiar", n: "Orientación parental", f: "taller" },
  { id: "k071", cat: "Familia", sub: "Atención familiar", n: "Apoyo a la crianza", f: "taller" },
  { id: "k072", cat: "Familia", sub: "Atención familiar", n: "Atención domiciliaria", f: "domicilio" },
  { id: "k073", cat: "Infancia y Menores", sub: "Educación", n: "Material escolar", f: "entrega" },
  { id: "k074", cat: "Infancia y Menores", sub: "Educación", n: "Refuerzo educativo", f: "grupo" },
  { id: "k075", cat: "Infancia y Menores", sub: "Educación", n: "Apoyo educativo", f: "grupo" },
  { id: "k076", cat: "Infancia y Menores", sub: "Alimentación infantil", n: "Beca comedor", f: "ayuda" },
  { id: "k077", cat: "Infancia y Menores", sub: "Ocio y tiempo libre", n: "Casal", f: "grupo" },
  { id: "k078", cat: "Infancia y Menores", sub: "Ocio y tiempo libre", n: "Colonias", f: "evento" },
  { id: "k079", cat: "Infancia y Menores", sub: "Ocio y tiempo libre", n: "Actividades deportivas", f: "grupo" },
  { id: "k080", cat: "Infancia y Menores", sub: "Ocio y tiempo libre", n: "Ocio educativo", f: "grupo" },
  { id: "k081", cat: "Infancia y Menores", sub: "Apoyo jóvenes", n: "Atención psicológica infantil", f: "atencion" },
  { id: "k082", cat: "Infancia y Menores", sub: "Apoyo jóvenes", n: "Canguro social", f: "domicilio" },
  { id: "k083", cat: "Infancia y Menores", sub: "Conciliación", n: "Conciliación", f: "grupo" },
  { id: "k084", cat: "Mujer y Cuidados", sub: "Violencia de género", n: "Atención a violencia de género", f: "atencion" },
  { id: "k085", cat: "Mujer y Cuidados", sub: "Violencia de género", n: "Piso protegido", f: "alojamiento" },
  { id: "k086", cat: "Mujer y Cuidados", sub: "Violencia de género", n: "Atención psicológica especializada", f: "atencion" },
  { id: "k087", cat: "Mujer y Cuidados", sub: "Atención jurídica", n: "Asesoramiento jurídico", f: "atencion" },
  { id: "k088", cat: "Mujer y Cuidados", sub: "Inserción laboral", n: "Inserción laboral para mujeres", f: "taller" },
  { id: "k089", cat: "Mujer y Cuidados", sub: "Inserción laboral", n: "Apoyo a cuidadoras", f: "grupo" },
  { id: "k090", cat: "Mujer y Cuidados", sub: "Inserción laboral", n: "Conciliación", f: "taller" },
  { id: "k091", cat: "Mujer y Cuidados", sub: "Comunidad de mujeres", n: "Grupos de mujeres", f: "grupo" },
  { id: "k092", cat: "Mujer y Cuidados", sub: "Comunidad de mujeres", n: "Ayudas específicas", f: "ayuda" },
  { id: "k093", cat: "Empleo", sub: "Bolsa empleo", n: "Bolsa de empleo", f: "atencion", e: "fase2" },
  { id: "k094", cat: "Empleo", sub: "Bolsa empleo", n: "Prácticas laborales", f: "atencion", e: "fase2" },
  { id: "k095", cat: "Empleo", sub: "Bolsa empleo", n: "Programas de empleo protegido", f: "atencion", e: "fase2" },
  { id: "k096", cat: "Empleo", sub: "Bolsa empleo", n: "Empleo con apoyo", f: "atencion", e: "fase2" },
  { id: "k097", cat: "Empleo", sub: "Orientación laboral", n: "Orientación laboral", f: "atencion" },
  { id: "k098", cat: "Empleo", sub: "Orientación laboral", n: "Mentoring laboral", f: "atencion" },
  { id: "k099", cat: "Empleo", sub: "Inserción laboral", n: "Itinerarios de inserción", f: "taller" },
  { id: "k100", cat: "Empleo", sub: "Inserción laboral", n: "Formación ocupacional", f: "taller" },
  { id: "k101", cat: "Empleo", sub: "Inserción laboral", n: "Certificados profesionales", f: "taller" },
  { id: "k102", cat: "Formación", sub: "Idiomas", n: "Idiomas", f: "taller" },
  { id: "k103", cat: "Formación", sub: "Idiomas", n: "Alfabetización", f: "taller" },
  { id: "k104", cat: "Formación", sub: "Idiomas", n: "ESO para adultos", f: "taller" },
  { id: "k105", cat: "Formación", sub: "Formación digital", n: "Competencias digitales", f: "taller" },
  { id: "k106", cat: "Formación", sub: "Formación digital", n: "Formación online", f: "taller" },
  { id: "k107", cat: "Formación", sub: "Formación para el empleo", n: "Formación profesional", f: "taller" },
  { id: "k108", cat: "Formación", sub: "Formación para el empleo", n: "Certificados profesionales", f: "taller" },
  { id: "k109", cat: "Formación", sub: "Formación para el empleo", n: "Universidad para adultos", f: "taller" },
  { id: "k110", cat: "Formación", sub: "Formación para el empleo", n: "Talleres específicos", f: "taller" },
  { id: "k111", cat: "Movilidad", sub: "Transporte adaptado", n: "Transporte adaptado", f: "domicilio" },
  { id: "k112", cat: "Movilidad", sub: "Transporte adaptado", n: "Servicio puerta a puerta", f: "domicilio" },
  { id: "k113", cat: "Movilidad", sub: "Transporte adaptado", n: "Acompañamiento desplazamientos", f: "domicilio" },
  { id: "k114", cat: "Movilidad", sub: "Transporte sanitario", n: "Transporte sanitario", f: "domicilio" },
  { id: "k115", cat: "Movilidad", sub: "Ayudas de movilidad", n: "Bonificación transporte", f: "ayuda" },
  { id: "k116", cat: "Movilidad", sub: "Ayudas de movilidad", n: "Tarjeta social transporte", f: "ayuda" },
  { id: "k117", cat: "Movilidad", sub: "Ayudas de movilidad", n: "Ayuda combustible", f: "ayuda" },
  { id: "k118", cat: "Competencias Digitales", sub: "Alfabetización digital", n: "Alfabetización digital", f: "taller" },
  { id: "k119", cat: "Competencias Digitales", sub: "Alfabetización digital", n: "Cursos TIC", f: "taller" },
  { id: "k120", cat: "Competencias Digitales", sub: "Alfabetización digital", n: "Acceso a ordenadores", f: "grupo" },
  { id: "k121", cat: "Competencias Digitales", sub: "Alfabetización digital", n: "Acceso a internet", f: "grupo" },
  { id: "k122", cat: "Competencias Digitales", sub: "Acompañamiento digital", n: "Certificado digital", f: "atencion" },
  { id: "k123", cat: "Competencias Digitales", sub: "Acompañamiento digital", n: "Uso de banca online", f: "atencion" },
  { id: "k124", cat: "Competencias Digitales", sub: "Acompañamiento digital", n: "Uso de administración electrónica", f: "atencion" },
  { id: "k125", cat: "Competencias Digitales", sub: "Acompañamiento digital", n: "Mentor digital", f: "atencion" },
  { id: "k126", cat: "Autonomía Personal y Cuidados", sub: "Dependencia", n: "Dependencia", f: "domicilio" },
  { id: "k127", cat: "Autonomía Personal y Cuidados", sub: "Dependencia", n: "Teleasistencia", f: "domicilio" },
  { id: "k128", cat: "Autonomía Personal y Cuidados", sub: "Dependencia", n: "Productos de apoyo", f: "entrega" },
  { id: "k129", cat: "Autonomía Personal y Cuidados", sub: "Atención domiciliaria", n: "Ayuda a domicilio", f: "domicilio" },
  { id: "k130", cat: "Autonomía Personal y Cuidados", sub: "Atención domiciliaria", n: "Atención domiciliaria", f: "domicilio" },
  { id: "k131", cat: "Autonomía Personal y Cuidados", sub: "Atención domiciliaria", n: "Asistente personal", f: "domicilio" },
  { id: "k132", cat: "Autonomía Personal y Cuidados", sub: "Cuidados", n: "Centro de día", f: "grupo" },
  { id: "k133", cat: "Autonomía Personal y Cuidados", sub: "Cuidados", n: "Adaptación vivienda", f: "ayuda" },
  { id: "k134", cat: "Autonomía Personal y Cuidados", sub: "Cuidados", n: "Respiro familiar", f: "domicilio" },
  { id: "k135", cat: "Organización y Dirección", sub: "Orientación y mentoring", n: "Mentoría", f: "atencion" },
  { id: "k136", cat: "Organización y Dirección", sub: "Orientación y mentoring", n: "Coaching social", f: "atencion" },
  { id: "k137", cat: "Organización y Dirección", sub: "Orientación y mentoring", n: "Orientación vital", f: "atencion" },
  { id: "k138", cat: "Organización y Dirección", sub: "Orientación y mentoring", n: "Planificación de objetivos", f: "atencion" },
  { id: "k139", cat: "Organización y Dirección", sub: "Orientación y mentoring", n: "Itinerarios personalizados", f: "atencion" },
  { id: "k140", cat: "Organización y Dirección", sub: "Orientación y mentoring", n: "Acompañamiento profesional", f: "atencion" },
  { id: "k141", cat: "Organización y Dirección", sub: "Orientación y mentoring", n: "Desarrollo personal", f: "taller" },
  { id: "k142", cat: "Participación y Comunidad", sub: "Voluntariado", n: "Voluntariado", f: "grupo", e: "fuera" },
  { id: "k143", cat: "Participación y Comunidad", sub: "Cultura", n: "Espacios culturales", f: "grupo" },
  { id: "k144", cat: "Participación y Comunidad", sub: "Cultura", n: "Actividades comunitarias", f: "evento" },
  { id: "k145", cat: "Participación y Comunidad", sub: "Deporte", n: "Clubes deportivos", f: "grupo" },
  { id: "k146", cat: "Participación y Comunidad", sub: "Deporte", n: "Huertos urbanos", f: "grupo" },
  { id: "k147", cat: "Participación y Comunidad", sub: "Comunidad", n: "Asociaciones", f: "grupo" },
  { id: "k148", cat: "Participación y Comunidad", sub: "Comunidad", n: "Redes vecinales", f: "grupo" },
  { id: "k149", cat: "Participación y Comunidad", sub: "Comunidad", n: "Participación ciudadana", f: "evento" },
  { id: "k150", cat: "Participación y Comunidad", sub: "Activismo", n: "Eventos sociales", f: "evento" }
];

/* «¿Cómo estás hoy?»: cuestionario modo persona del doc 04 (8 preguntas, 4 sistemas).
   Cada respuesta alimenta dimensiones del Mapa de Vida del doc 03; si dos caen en la misma, manda la peor. */
window.BC_CATALOGO.autoevaluacion = [
  { id: "a1", sistema: "Económico", icono: "banknote", d: ["ingresos"], q: "¿Tienes trabajo o alguna fuente de ingresos?", o: ["Sí, tengo ingresos estables", "Algo ocasional o irregular", "No tengo ingresos"] },
  { id: "a2", sistema: "Económico", icono: "basket", d: ["alimentacion"], q: "¿Puedes cubrir tus necesidades básicas (comida, luz, ropa)?", o: ["Sí, puedo cubrirlas", "Con mucha dificultad", "No puedo, necesito apoyo"] },
  { id: "a3", sistema: "Social", icono: "home", d: ["vivienda"], q: "¿Tienes un lugar seguro y estable donde vivir?", o: ["Sí, tengo vivienda estable", "Temporal o muy inestable", "No o está en riesgo"] },
  { id: "a4", sistema: "Social", icono: "favorite", d: ["salud"], q: "¿Puedes ir al médico o al centro de salud cuando lo necesitas?", o: ["Sí, sin problema", "Con dificultad", "No tengo acceso"] },
  { id: "a5", sistema: "Relacional", icono: "users", d: ["red"], q: "¿Tienes personas cercanas con quienes contar?", o: ["Sí, tengo apoyo cercano", "Tengo alguna persona pero poca ayuda", "Estoy solo/a"] },
  { id: "a6", sistema: "Relacional", icono: "handshake", d: ["comunidad"], q: "¿Te sientes parte de algún grupo, entidad o comunidad?", o: ["Sí, me siento parte", "Poco o de forma irregular", "No, estoy aislado/a"] },
  { id: "a7", sistema: "Legal", icono: "file-text", d: ["documentacion"], q: "¿Cuál es tu situación con la documentación personal?", o: ["Todo en regla (DNI, NIE, nacionalidad…)", "Documentación parcial o temporal", "Sin documentos o en trámite inicial"] },
  { id: "a8", sistema: "Legal", icono: "shield-check", d: ["documentacion"], q: "¿Sientes que conoces tus derechos y puedes ejercerlos?", o: ["Sí, conozco mis derechos", "Conozco algunos pero no sé cómo usarlos", "No, me siento desprotegido/a"] }
];
window.BC_DERIVAR = (resp) => {
  const peso = { v: 0, a: 1, r: 2 }, m = {};
  window.BC_CATALOGO.autoevaluacion.forEach((q) => { const v = resp[q.id]; if (v) q.d.forEach((d) => { if (!m[d] || peso[v] > peso[m[d]]) m[d] = v; }); });
  return m;
};

/* Foto inicial de la red: tres entidades ficticias; el panel se ve desde la e1. */
window.BC_SEMILLA = () => {
  const M = (s) => Object.fromEntries(window.BC_CATALOGO.dimensiones.map((d, i) => [d.id, "var"[+s[i]] || "v"]));
  const B1 = (s) => window.BC_DERIVAR(Object.fromEntries(window.BC_CATALOGO.autoevaluacion.map((q, i) => [q.id, "var"[+s[i]]])));
  const C = (e, c) => ({ privacidad: true, tratamiento: true, entidades: e, comunicaciones: c });
  const F = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const P = (o) => Object.assign({ email: "", docTipo: "En trámite", doc: "", idioma: "Español", canal: "WhatsApp", municipio: "Madrid", estado: "En seguimiento", mapaTipo: "completo", notas: "" }, o);
  const S0 = {
    entidades: [
      { id: "e1", cp: "28026", nombre: "Asociación Puentes", zona: "Usera · Madrid", tipo: "Asociación" },
      { id: "e2", cp: "28025", nombre: "Fundación Raíces", zona: "Carabanchel · Madrid", tipo: "Fundación" },
      { id: "e3", cp: "28901", nombre: "Red Vecinal Sur", zona: "Getafe", tipo: "Asociación vecinal" }
    ],
    conectores: [
      { id: "c1", nombre: "Lucía Romero", entidad: "e1", rol: "Trabajadora social", ultima: "Hoy, 10:42", foto: "../../shared/img/conectores/lucia.jpg", doc: "DNI 12345678Z", tel: "+34 600 111 201", email: "lucia.romero@puentes.example" },
      { id: "c2", nombre: "Samir El Idrissi", entidad: "e1", rol: "Mediador intercultural", ultima: "Hoy, 09:15", foto: "../../shared/img/conectores/samir.jpg", doc: "NIE X1234567L", tel: "+34 600 111 202", email: "samir.elidrissi@puentes.example" },
      { id: "c3", nombre: "Marta Gil", entidad: "e1", rol: "Voluntaria", ultima: "Ayer, 18:03", doc: "DNI 87654321X", tel: "+34 600 111 203", email: "marta.gil@puentes.example" },
      { id: "c4", nombre: "Daniel Ortega", entidad: "e2", rol: "Educador social", ultima: "Hoy, 11:20" },
      { id: "c5", nombre: "Ana Belén Ruiz", entidad: "e3", rol: "Trabajadora social", ultima: "Hoy, 08:50" }
    ],
    recursos: [
      { id: "r1", entidad: "e1", nombre: "Bolsa de alquiler social", catalogo: "k007", formato: "atencion", cat: "Vivienda", modo: "Solicitud", urg: "Normal", cupo: 12, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["ma"], hora: "10:00", duracion: 60 } },
      { id: "r2", entidad: "e1", nombre: "Orientación jurídica", catalogo: "k050", formato: "atencion", cat: "Documentación y Trámites", modo: "Inscripción", urg: "Normal", cupo: 20, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["ju"], hora: "16:00", duracion: 90 } },
      { id: "r3", entidad: "e1", nombre: "Banco de alimentos", catalogo: "k025", formato: "entrega", cat: "Alimentación", modo: "Libre", urg: "Urgente", limite: 30, tiempo: { forma: "recurrente", cada: "dia", inicio: "2026-09-01", dias: ["lu", "ma", "mi", "ju", "vi"], hora: "11:00", duracion: 60 } },
      { id: "r4", entidad: "e1", nombre: "Taller de competencias digitales", catalogo: "k119", formato: "taller", cat: "Competencias Digitales", modo: "Inscripción", urg: "Normal", cupo: 15, tiempo: { forma: "sesiones", inicio: F(-14), fin: F(28), dias: ["lu", "mi"], hora: "17:00", duracion: 90 } },
      { id: "r5", entidad: "e2", nombre: "Albergue", catalogo: "k002", formato: "alojamiento", cat: "Vivienda", modo: "Solicitud", urg: "Urgente", cupo: 30, tiempo: { forma: "estadia", inicio: "2026-01-01" } },
      { id: "r6", entidad: "e2", nombre: "Orientación laboral", catalogo: "k097", formato: "atencion", cat: "Empleo", modo: "Inscripción", urg: "Normal", cupo: 25, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["mi"], hora: "10:00", duracion: 60 } },
      { id: "r7", entidad: "e2", nombre: "Grupos de apoyo", catalogo: "k057", formato: "grupo", cat: "Red de Apoyo", modo: "Libre", urg: "Normal", tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["vi"], hora: "18:00", duracion: 90 } },
      { id: "r8", entidad: "e3", nombre: "Comedor social", catalogo: "k023", formato: "entrega", cat: "Alimentación", modo: "Libre", urg: "Urgente", limite: 30, tiempo: { forma: "recurrente", cada: "dia", inicio: "2026-09-01", dias: ["lu", "ma", "mi", "ju", "vi", "sa", "do"], hora: "13:30", duracion: 90 } },
      { id: "r9", entidad: "e3", nombre: "Atención psicológica", catalogo: "k037", formato: "atencion", cat: "Salud y Bienestar", modo: "Solicitud", urg: "Normal", cupo: 8, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["ma", "ju"], hora: "09:30", duracion: 50 } },
      { id: "r10", entidad: "e3", nombre: "Clases de español", catalogo: "k102", formato: "taller", cat: "Formación", modo: "Inscripción", urg: "Normal", cupo: 18, tiempo: { forma: "sesiones", inicio: F(-30), fin: F(60), dias: ["ma", "ju"], hora: "18:00", duracion: 90 } },
      { id: "r11", entidad: "e2", nombre: "Asesoría legal en extranjería", catalogo: "k046", formato: "atencion", cat: "Documentación y Trámites", modo: "Solicitud", urg: "Urgente", cupo: 6, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["lu"], hora: "11:00", duracion: 60 } },
      { id: "r12", entidad: "e3", nombre: "Mentor social", catalogo: "k055", formato: "atencion", cat: "Red de Apoyo", modo: "Inscripción", urg: "Normal", cupo: 10, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["mi"], hora: "17:00", duracion: 60 } },
      { id: "r13", entidad: "e1", nombre: "Piso de acogida temporal", catalogo: "k004", formato: "alojamiento", cat: "Vivienda", modo: "Solicitud", urg: "Normal", cupo: 2, tiempo: { forma: "estadia", inicio: "2026-01-01" } },
      { id: "r14", entidad: "e1", nombre: "Taller de cocina intercultural", catalogo: "k110", formato: "taller", cat: "Formación", modo: "Inscripción", urg: "Normal", cupo: 12, base: 12, tiempo: { forma: "sesiones", inicio: F(5), fin: F(33), dias: ["sa"], hora: "11:00", duracion: 120 } },
      { id: "r15", entidad: "e1", nombre: "Cupo de emergencia habitacional", catalogo: "k003", formato: "alojamiento", cat: "Vivienda", modo: "Solicitud", urg: "Urgente", cupo: 4, base: 3, tiempo: { forma: "estadia", inicio: "2026-01-01" } },
      { id: "r16", entidad: "e1", nombre: "Apoyo escolar", catalogo: "k075", formato: "grupo", cat: "Infancia y Menores", modo: "Inscripción", urg: "Normal", cupo: 20, base: 6, limite: 12, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["lu", "mi"], hora: "16:30", duracion: 90 } },
      { id: "r17", entidad: "e1", nombre: "Acompañamiento psicosocial", catalogo: "k038", formato: "atencion", cat: "Salud y Bienestar", modo: "Solicitud", urg: "Normal", cupo: 8, base: 8, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["vi"], hora: "10:00", duracion: 60 } },
      { id: "r18", entidad: "e1", nombre: "Despensa solidaria", catalogo: "k026", formato: "entrega", cat: "Alimentación", modo: "Libre", urg: "Normal", limite: 12, tiempo: { forma: "recurrente", cada: "semana", inicio: "2026-09-01", dias: ["sa"], hora: "10:00", duracion: 120 } },
      { id: "r19", entidad: "e1", nombre: "Feria de empleo", catalogo: "propio", formato: "evento", cat: "Empleo", modo: "Inscripción", urg: "Normal", cupo: 40, base: 38, tiempo: { forma: "unico", inicio: F(9), hora: "10:00", duracion: 240 } }
    ],
    personas: [
      P({ id: "BC-2026-0141", nombre: "Yasmina", apellidos: "Haddad", nac: "1991-04-12", tel: "+34 611 204 118", cp: "28026", idioma: "Árabe", origen: "conector", entidad: "e1", conector: "c1", alta: "2026-10-02", consent: C(true, true), mapa: M("2101120010110011") }),
      P({ id: "BC-2026-0152", nombre: "Carlos", apellidos: "Mendoza Ríos", nac: "1987-09-30", tel: "+34 622 918 330", cp: "28041", origen: "conector", entidad: "e1", conector: "c1", alta: "2026-10-09", consent: C(false, true), mapa: M("1210100021101000") }),
      P({ id: "BC-2026-0167", nombre: "Fatou", apellidos: "Diallo", nac: "1996-01-21", tel: "+34 633 552 907", cp: "28026", idioma: "Francés", canal: "Teléfono", origen: "conector", entidad: "e1", conector: "c2", alta: "2026-10-15", consent: C(true, false), mapa: M("1121011100120001") }),
      P({ id: "BC-2026-0170", nombre: "Andrés", apellidos: "Villalba", nac: "1979-06-03", tel: "+34 644 801 225", cp: "28019", docTipo: "Sí", origen: "conector", entidad: "e1", conector: "c3", alta: "2026-08-28", estado: "Cerrado", consent: C(true, true), mapa: M("0000000000000000") }),
      P({ id: "BC-2026-0188", nombre: "Mariana", apellidos: "Quispe", nac: "1993-11-17", tel: "+34 655 340 019", cp: "28026", origen: "conector", entidad: "e1", conector: "c2", alta: "2026-10-28", consent: C(true, true), mapa: M("1100101001021101") }),
      P({ id: "BC-2026-0203", nombre: "Olena", apellidos: "Kovalenko", nac: "1989-02-08", tel: "+34 666 712 448", email: "olena.k@correo.es", cp: "28026", idioma: "Inglés", canal: "Email", origen: "autorregistro", entidad: "e1", conector: null, alta: "2026-11-10", estado: "Abierto", mapaTipo: "corto", consent: C(true, true), mapa: B1("21201120") }),
      P({ id: "BC-2026-0207", nombre: "Ibrahim", apellidos: "Sow", nac: "2001-07-25", tel: "+34 677 093 512", cp: "28041", idioma: "Francés", origen: "autorregistro", entidad: "e1", conector: null, alta: "2026-11-11", estado: "Abierto", mapaTipo: "corto", consent: C(false, true), mapa: B1("12112022") }),
      P({ id: "BC-2026-0119", nombre: "Kwame", apellidos: "Mensah", nac: "1985-12-02", tel: "+34 688 219 774", cp: "28025", idioma: "Inglés", origen: "conector", entidad: "e2", conector: "c4", alta: "2026-09-21", consent: C(true, true), mapa: M("2111001010100010") }),
      P({ id: "BC-2026-0125", nombre: "Leila", apellidos: "Benali", nac: "1998-03-14", tel: "+34 699 451 803", cp: "28901", idioma: "Árabe", origen: "conector", entidad: "e3", conector: "c5", alta: "2026-10-11", consent: C(true, false), mapa: M("1002100110001000") })
    ],
    /* por = entidad que hizo la postulación. */
    solicitudes: [
      { id: "s1", persona: "BC-2026-0141", recurso: "r1", por: "e1", estado: "Pendiente", fecha: "2026-11-04" },
      { id: "s2", persona: "BC-2026-0141", recurso: "r6", por: "e2", estado: "Aprobada", fecha: "2026-10-20" },
      { id: "s3", persona: "BC-2026-0141", recurso: "r10", por: "e3", estado: "En lista de espera", fecha: "2026-10-24" },
      { id: "s4", persona: "BC-2026-0152", recurso: "r6", por: "e2", estado: "Aprobada", fecha: "2026-10-18" },
      { id: "s5", persona: "BC-2026-0152", recurso: "r2", por: "e1", estado: "Aprobada", fecha: "2026-10-10" },
      { id: "s6", persona: "BC-2026-0167", recurso: "r3", por: "e1", estado: "Aprobada", fecha: "2026-10-16", usos: ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-30", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-09", "2026-11-10", "2026-11-11"] },
      { id: "s7", persona: "BC-2026-0167", recurso: "r9", por: "e3", estado: "Pendiente", fecha: "2026-11-06" },
      { id: "s8", persona: "BC-2026-0188", recurso: "r4", por: "e1", estado: "Aprobada", fecha: "2026-10-30" },
      { id: "s9", persona: "BC-2026-0188", recurso: "r7", por: "e2", estado: "Aprobada", fecha: "2026-11-02" },
      { id: "s10", persona: "BC-2026-0119", recurso: "r1", por: "e2", estado: "Pendiente", fecha: "2026-11-08" },
      { id: "s11", persona: "BC-2026-0125", recurso: "r2", por: "e3", estado: "Pendiente", fecha: "2026-11-09" },
      { id: "s12", persona: "BC-2026-0170", recurso: "r1", por: "e1", estado: "Aprobada", fecha: "2026-09-01" },
      /* r13 queda con una plaza: Leila y Fatou compiten por la última. Nadie pide la misma necesidad en dos sitios. */
      { id: "s13", persona: "BC-2026-0188", recurso: "r13", por: "e1", estado: "Aprobada", fecha: "2026-10-29" },
      { id: "s14", persona: "BC-2026-0125", recurso: "r13", por: "e3", estado: "Pendiente", fecha: "2026-11-10" },
      { id: "s15", persona: "BC-2026-0167", recurso: "r13", por: "e1", estado: "Pendiente", fecha: "2026-11-11" },
      { id: "s16", persona: "BC-2026-0188", recurso: "r8", por: "e3", estado: "Aprobada", fecha: "2026-11-02", usos: ["2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-09", "2026-11-10", "2026-11-11"] },
      { id: "s18", persona: "BC-2026-0141", recurso: "r3", por: "e1", estado: "Aprobada", fecha: "2026-10-26", acompanantes: ["BC-2026-0142"], usos: ["2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-09", "2026-11-10", "2026-11-11"] },
      { id: "s17", persona: "BC-2026-0152", recurso: "r18", por: "e1", estado: "Aprobada", fecha: "2026-10-20", usos: ["2026-10-22", "2026-10-29", "2026-11-05"] }
    ],
    /* Familiares (spec 03): ficha propia, verificada por la entidad que atiende al titular. */
    familiares: [
      { id: "BC-2026-0142", nombre: "Amira", apellidos: "Haddad", nac: "2015-03-08", vinculo: "Hija", titular: "BC-2026-0141", verificacion: "Verificada", creada: "2026-10-05", creadaPor: "c1" },
      { id: "BC-2026-0143", nombre: "Omar", apellidos: "Haddad", nac: "2018-09-21", vinculo: "Hijo", titular: "BC-2026-0141", verificacion: "Por verificar", creada: F(-1), creadaPor: "persona" },
      { id: "BC-2026-0168", nombre: "Awa", apellidos: "Diallo", nac: "2020-06-02", vinculo: "Hija", titular: "BC-2026-0167", verificacion: "Por verificar", creada: F(-2), creadaPor: "persona" }
    ],
    familias: [
      { id: "f1", nombre: "Mis hijos", titular: "BC-2026-0141", miembros: ["BC-2026-0142", "BC-2026-0143"] },
      { id: "f2", nombre: "Familia Diallo", titular: "BC-2026-0167", miembros: ["BC-2026-0168"] }
    ],
    accesos: [
      { persona: "BC-2026-0141", quien: "Lucía Romero", entidad: "e1", cuando: "2026-11-10 16:20", para: "Seguimiento del caso" },
      { persona: "BC-2026-0141", quien: "Daniel Ortega", entidad: "e2", cuando: "2026-10-20 12:05", para: "Decidir la solicitud a Albergue" },
      { persona: "BC-2026-0152", quien: "Lucía Romero", entidad: "e1", cuando: "2026-11-07 09:40", para: "Seguimiento del caso" }
    ]
  };
  /* Cada recurso hereda de su formato si admite acompañantes (spec 07); la entidad lo cambia en el editor. */
  S0.recursos.forEach((r) => { const f = window.BC_CATALOGO.formatos.find((x) => x.id === r.formato) || {}; if (!r.config) r.config = { acompanantes: !!f.acompanantes, maxAcompanantes: f.maxAcompanantes || (f.acompanantes ? 3 : undefined) }; });
  return S0;
};
