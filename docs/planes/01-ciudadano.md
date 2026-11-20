# 01 · Plan Ciudadano

Superficie: **móvil**. Menú hoy: Mi expediente · Mis recursos · Buscar ayuda · Mi Mapa de Vida ·
Privacidad (`MENU.ciudadano`, `app/brujula/app.js`). El ciudadano usa su propio lenguaje visual
(`cz-*`: `cz-card`, `cz-rec`, `cz-tabs`, `cz-chips`, `cz-dark`); lo nuevo lo reutiliza, no mezcla
con el layout de escritorio.

## Correcciones de flujo

Lo que hoy hace la demo y que el modelo nuevo rompe o contradice.

| # | Dónde | Hoy | Problema | Cómo queda | Ola |
|---|---|---|---|---|---|
| C1 | Registro, último paso (`cRegistro` paso 4, «Elige dónde te atienden») | Elige una entidad y queda en `persona.entidad` | Parece que la persona «pertenece» a esa entidad | Mismo paso, nuevo sentido: **«¿Quién te acompaña?»**. Texto: esa entidad te asigna conector y verifica a tu familia; los recursos pueden ser de cualquier entidad | 1 |
| C2 | Privacidad, «Compartir mi itinerario» | «Sin esto, solo accedes a recursos de tu entidad» | **Falso hoy**: Buscar muestra y deja pedir recursos de toda la red sin mirar ese permiso | El permiso controla **quién ve tu itinerario**, no a qué accedes. Texto: «Sin esto, cada entidad solo ve lo que tienes con ella» | 1 |
| C3 | Privacidad, «Recibir avisos» | Un interruptor apaga todo | Con eventos, apagarlo deja sin cambio de hora ni cancelación | Pasa a **«Recibir comunicados»**; los avisos de tus eventos llegan siempre (spec 05) | 4 |
| C4 | Buscar → «Apuntarme» (`c-pedir`) | Inscripción y Libre quedan **Aprobada** al instante, sin fecha ni acompañantes | No sabe a qué fecha va ni con quién; plazas mal contadas | «Apuntarme» abre la hoja **Elegir fechas y quién viene** (ver Diseño). Solo después crea la solicitud | 1–2 |
| C5 | Buscar, «X plazas libres» | `cupo − aprobadas` del recurso entero | En recurrentes y sesiones las plazas son **por fecha** | Muestra plazas de la **próxima fecha** («Lunes 24 · 3 plazas») | 1 |
| C6 | Mis recursos, etapas Solicitado → Revisión → Resultado | Termina en «Aprobada» | Para un evento lo importante empieza ahí: la próxima fecha y si confirmó | Tras aprobada, la tarjeta pasa a **Próxima fecha + Voy / No voy** | 1, 3 |
| C7 | Regla «no pedir lo mismo en dos lugares» (`c-pedir`, `cBuscar`) | Solo mira al titular | Un familiar podría pedir lo mismo dos veces vía distintos titulares | Se aplica a **cada persona** que va; el familiar bloqueado sale en la hoja con el motivo | 2 |
| C8 | Inicio, pasos («Espera la llamada…») | Dice la entidad de `p.entidad` | Se mantiene, pero con familia aparece un paso nuevo | Paso «**Ana está por verificar**: tu entidad lo revisa» mientras haya fichas pendientes | 2 |

## Ola 1 · Recurso como evento

| Pantalla | Cambio |
|---|---|
| Mi expediente (`cInicio`) | Bloque **«Próximas fechas»** (3 siguientes) debajo del conector |
| Mis recursos (`cRecursos`) | Cada recurso dice **cuándo ocurre**; aprobados muestran próxima fecha |
| Buscar ayuda (`cBuscar`) | Fecha y plazas de la próxima fecha en cada tarjeta (C5) |
| **Agenda** (`#/agenda`) | Vista de Mis recursos, con el conmutador Lista / Agenda (ya no es pestaña del menú) |
| **Perfil** (nueva, `#/perfil`) | Cuarta pestaña: agrupa Mi Mapa de Vida, Privacidad y Mi familia. Menú: Inicio · Mis recursos · Buscar · Perfil |
| Registro y Privacidad | Textos C1 y C2 |

## Ola 2 · Familia

| Pantalla | Cambio |
|---|---|
| **Mi familia** (nueva, `#/familia`, desde el avatar de Inicio) | Grupos y miembros con su estado |
| Agregar familiar (`#/familia/nuevo`) | Ficha mínima: nombre, apellidos, nacimiento, vínculo, documento si tiene |
| Hoja **Elegir fechas y quién viene** | Paso «¿Quién viene contigo?» (C4, C7) |
| Mis recursos | Quién va y el uso de cada uno («Amira: usó 3 de 12») |

## Ola 3 · Confirmar asistencia

| Pantalla | Cambio |
|---|---|
| Agenda y Mis recursos | **Voy / No voy** por fecha, con quiénes; plazo visible («Confirma antes del domingo 18:00») |
| Recurrentes | «Marcar las próximas» en lote: elige varias fechas de una vez |

## Ola 4 · Comunicados y perfil

| Pantalla | Cambio |
|---|---|
| **Avisos** (nueva, `#/avisos`, contador en el menú) | Avisos y comunicados, con quién firma |
| Privacidad | C3 |

No ve las notas internas.

## Diseño por pantalla

| Pantalla | Estructura | Componentes | Estados |
|---|---|---|---|
| Agenda | Lista agrupada por día («Hoy», «Mañana», «Lun 24»); cada fila: hora, recurso, entidad, quién va, Voy/No voy | `cz-card` por día, fila tipo `cz-rec` compacta, `nwt-badge` del estado de confirmación | Vacío: «No tienes fechas próximas» + botón a Buscar. Fecha pasada: gris y con «Usó / No vino» |
| Hoja Elegir fechas y quién viene | Hoja inferior en 2 pasos: **Fechas** (única: confirmación; recurrente: chips de las próximas 4; estadía: desde–hasta) → **Quién viene** (lista de familiares con casilla) → resumen «Ocupas 3 plazas» + botón | Patrón `cz-wiz` (cabecera, cuerpo, `cz-pie` fijo), `cz-chips` para fechas, `nwt-checkbox` por familiar | Sin plazas suficientes: alerta y opción «Lista de espera para todos». Familiar por verificar o bloqueado: casilla deshabilitada con motivo debajo. Recurso sin acompañantes: se salta el paso 2 |
| Mi familia | Tarjeta por grupo con avatar, nombre, vínculo y estado; botón «Agregar familiar» | `cz-card`, `nwt-avatar`, `nwt-badge` (Por verificar = warning, Verificada = positive, Rechazada = negative con motivo) | Vacío: explicación de para qué sirve + botón |
| Agregar familiar | Formulario corto en un paso | Patrón `cz-wiz` + `fld()` existentes; «Completar con datos de ejemplo» | Al guardar: confirmación «Le pedimos a {entidad} que verifique a Ana» |
| Tarjeta de recurso aprobado | Encabezado actual + franja «Próxima: Lun 24, 17:00» + Voy/No voy + `usoBloque` | `cz-rec`, botones `nwt-button` small | Confirmado: franja positiva. Plazo vencido sin confirmar: «Tu plaza de esta fecha pasó a la lista de espera» |
| Avisos | Lista cronológica; cada aviso: firma (entidad o red), asunto, recurso, fecha | `cz-card`, punto de no leído | Aviso con fecha: botones Voy/No voy en línea |

## Casos guiados nuevos

- **1.3 Ir con mi familia:** agregar a la hija (Por verificar) → la entidad la verifica (en la
  demo, al instante) → apuntarse al taller con ella → ocupa 2 plazas.
- **1.4 Mi agenda:** ver la próxima fecha, confirmar «Voy» a las dos próximas del apoyo escolar,
  recibir un cambio de hora.

## Recorrido

Escenas nuevas tras «Y la persona llega a sus recursos»: agenda, ir con la familia, aviso.

## Ola 6 · Registro único ([spec 10](../specs/10-registro-unico.md))

El registro del ciudadano y el del conector pasan a ser un solo formulario. Del lado del
ciudadano casi todo se ve igual: lo que cambia es que el conector adopta su forma.

| # | Dónde | Hoy | Cómo queda |
|---|---|---|---|
| C9 | Registro, paso 2 «Sobre ti» (`czDatos`) | Sin número de documento | Campo opcional «Número de documento» bajo «¿Tienes documento nacional?» |
| C10 | Registro, al continuar el paso 2 (`yo-2`) | Crea expediente aunque el teléfono ya exista | Comprueba el teléfono. Si existe: alerta «Ya hay un expediente con este teléfono. Tu entidad te contactará.», sin datos de la otra persona; no avanza; el intento queda en la Privacidad de esa persona |
| C11 | Registro, toda la plantilla (`czWiz`) | Plantilla propia del rol | La misma plantilla que el conector, con textos de `T.yo` |

| Pantalla | Estructura | Componentes | Estados |
|---|---|---|---|
| Paso 2 | Como hoy + número de documento (opcional) | `fld()` | Duplicado: `nwt-alert` warning arriba del pie con el texto de mínima revelación y el foco en el teléfono |
| Paso 3 | Una pregunta por pantalla, como hoy | Tarjeta de pregunta con caritas (componente común) | Sin cambios |

Rutas sin cambios: `#/registro/1..4` y `#/registro/3/1..8`. Caso 1.1: se agrega una nota en el
paso 2 sobre la comprobación de duplicado.
