# 02 · Plan Conector

Superficie: **móvil** (según `demo/apps/conector/app.json`; el README dice escritorio, corregir
uno de los dos). Menú hoy: Mis personas · Registrar persona · Recursos de entidades
(`MENU.conector`). Lenguaje visual `kz-*` (app nativa): `kz-card`, `kz-it`, `kz-rec`, `kz-foot`.

## Correcciones de flujo

| # | Dónde | Hoy | Problema | Cómo queda | Ola |
|---|---|---|---|---|---|
| K1 | Recursos de entidades (`kRed`) | Subtítulo «cat · **tipo** · cupo N» | `tipo` desaparece; el cupo total ya no dice nada en recurrentes | «cat · cuándo ocurre · plazas de la próxima fecha» | 1 |
| K2 | Registrar, último paso (`kzRecursos`, «Asignar itinerario») | Crea solicitudes sin fecha | En sesiones y estadías no se sabe desde cuándo | Cada recurso marcado muestra «Desde la próxima fecha (Lun 24)», editable; estadía pide desde–hasta | 1 |
| K3 | Postular (`kPostular`) | Elige recurso y envía | Sin fecha, sin acompañantes, sin solapes | Dos pasos: **Recurso** → **Cuándo y con quién**. Avisa si se solapa con otro evento de la persona o de un familiar | 1–2 |
| K4 | Bloqueo «Ya tiene X en curso» (`kPostular`) | Solo el titular | Los familiares pueden duplicar | Se evalúa por cada persona que va; el familiar bloqueado sale con el motivo | 2 |
| K5 | Nota interna en el registro (`kzRecursos`, «Añadir nota interna») | Se escribe en `persona.notas` | **No se muestra en ningún lado**: la ficha no tiene sección de notas | La nota del registro es la primera de la lista de notas; la ficha muestra **Notas internas** | 4 |
| K6 | ¿Ya tiene expediente? (`kzBuscar`) | Muestra «Entidad» y «Es de otra entidad: debe autorizar compartirlo» | Suena a que la persona es de la entidad | «**Le atiende:** Fundación Raíces» y el texto pasa a «Su caso lo lleva otra entidad» | 1 |
| K7 | Mis personas (`kPersonas`) | Filtra por `p.conector === YO` y `ENT` fijo | Con varias entidades la lista mezcla o se queda corta | Filtra por la **entidad activa** de la sesión | 5 |
| K8 | Uso de recursos | Nadie lo marca: `usos` vienen de la semilla | No hay forma de pasar lista | Panel del recurso (ola 3) | 3 |

## Ola 1 · Recurso como evento

| Pantalla | Cambio |
|---|---|
| Recursos de entidades (`kRed`) | K1; filtro por «Esta semana» |
| Registrar → recursos (`kzRecursos`) | K2 |
| Postular (`kPostular`) | Paso 2 «Cuándo» (K3) |
| ¿Ya tiene expediente? | K6 |

## Ola 2 · Familia

| Pantalla | Cambio |
|---|---|
| Ficha (`ficha`) | Sección **Familia** con estado de cada ficha |
| Registrar persona | Tras el Mapa: «¿Viene con familia?» → agregar familiares (Por verificar) |
| Postular | «Con quién» en el paso 2 (K3, K4) |

## Ola 3 · Panel del recurso

| Pantalla | Cambio |
|---|---|
| **Recursos de mi entidad** (menú, `#/mis-recursos`) | Lista de recursos de la entidad activa con la fecha de hoy primero |
| **Panel del recurso** (`#/panel/:id`) | Resumen · Inscritos · Fechas · Uso. Reutiliza la vista de la entidad (`eRecurso`) |
| **Pasar lista** (`#/panel/:id/:fecha`) | Lista de confirmados de la fecha; Usó / No vino por persona |

## Ola 4 · Comunicados y perfil

| Pantalla | Cambio |
|---|---|
| Panel → Comunicados | **Enviar aviso** directo; **Redactar comunicado** → Por aprobar |
| Ficha | **Notas internas** (K5) y comunicados que recibió la persona |

## Ola 5 · Red

Selector de entidad en la cabecera si su equipo está en varias (K7). Hoy `const ENT = "e1"` y
`YO = "c1"` están fijos en `app.js:8`: pasan a la sesión.

## Diseño por pantalla

| Pantalla | Estructura | Componentes | Estados |
|---|---|---|---|
| Postular, paso Cuándo y con quién | Recurso elegido arriba (resumen); fechas (chips o desde–hasta); familiares con casilla; resumen de plazas; `kz-foot` con Postular | `kz-wizwrap` + `kz-top` con 2 segmentos, `bc-chip`, `nwt-checkbox`, `nwt-alert` warning para solapes | Solape: alerta con el otro evento y opción de elegir otra fecha. Sin plazas: «Pasará a lista de espera» |
| Pasar lista | Cabecera con fecha y contador «12 de 15 vinieron»; filas persona + acompañantes; dos botones grandes por fila | `kz-it`, `nwt-avatar`, botones segmentados Usó / No vino, `kz-foot` «Cerrar lista» | Sin confirmados: «Nadie confirmó esta fecha» y opción de marcar a cualquiera inscrito. Lista cerrada: solo lectura, con quién la cerró |
| Notas internas (ficha) | Tarjeta con la nota más reciente, «Ver todas», campo para agregar | `kz-card`, `nwt-text-area`, autor + fecha en `kz-mut` | Vacío: «Sin notas. Lo que el formulario no pide va aquí». Etiqueta fija «Solo la ve tu entidad» |
| Familia (ficha) | Lista de miembros con vínculo y estado | `kz-it`, `nwt-badge` | Por verificar: «Lo verifica {entidad}» |
| Enviar aviso | Hoja: plantilla (cambio de hora, cancelación, recordatorio), fecha afectada, texto, canales | `nwt-radio-button` para plantilla, `nwt-checkbox` canales, `nwt-text-area` | Confirmación «Llegará a 14 personas» antes de enviar |

## Casos guiados nuevos

- **2.3 Pasar lista:** abrir el comedor de hoy, marcar quién vino, ver el contador de una persona.
- **2.4 Avisar un cambio:** el taller pasa a las 18:00 → aviso a los inscritos; un comunicado
  queda Por aprobar.
