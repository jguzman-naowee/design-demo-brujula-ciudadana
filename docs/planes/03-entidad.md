# 03 · Plan Entidad

Superficie: **escritorio**. Menú hoy: Resumen · Mis recursos · Comunicados · Personas (Mis personas,
Solicitudes, Asignar, Por verificar, Conectores) (`MENU.entidad`). Conectores vive en `#/personas/conectores`. Lenguaje visual `ez-*`/`sp-*` sobre `nwt-sidebar`.

## Correcciones de flujo

| # | Dónde | Hoy | Problema | Cómo queda | Ola |
|---|---|---|---|---|---|
| E1 | Crear/editar recurso (`eRecurso`) | Pestañas Básico · Acceso · Detalles; «Formato» (`tipo`) en Detalles | `tipo` desaparece y no hay dónde decir cuándo ocurre | Pasos: **Catálogo → Básico → Cuándo → Acceso y plazas → Detalles**. «Formato» se elimina | 1 |
| E2 | Ocupación (`usoRec`) | `base + aprobadas` contra `cupo` del recurso | No cuenta acompañantes ni separa por fecha | Plazas = titulares + acompañantes, **por fecha** en recurrentes/sesiones, por noche en estadías | 1–2 |
| E3 | Aprobar (`avisosSol`, bloqueo «cupo») | Bloquea si `usoRec.lleno` | Una familia de 3 con 1 plaza libre no tiene salida clara | Aviso «Necesita 3 plazas, quedan 1» con dos opciones: **lista de espera para todos** o **aprobar a los que caben** (la persona confirma quién va) | 2 |
| E4 | Aprobar (bloqueo «necesidad» y «duplicada») | Solo el titular | Los familiares pueden duplicar | Se evalúa por cada acompañante; el bloqueado sale nombrado | 2 |
| E5 | Modal «Desliza para aprobar» (`modalAprobar`) | Recurso y persona | No muestra acompañantes ni fechas | Agrega «Va con: Ana (hija)» y «Desde Lun 24 · ocupa 2 plazas» | 2 |
| E6 | Ficha de persona de otra entidad (`ficha`, `fichaMinima`) | Decide por `p.entidad !== ENT`: «Esta persona es de {entidad}» | La persona no «es» de una entidad | Texto: «Le atiende {entidad}. Solo ves lo necesario para decidir» | 1 |
| E7 | Modo de acceso «Inscripción» (`MODO_D`) | Etiqueta «Confirma plaza», pero `c-pedir` la aprueba sola | **Contradicción**: la entidad no confirma nada | Etiqueta «Plaza directa si hay sitio». La confirmación real es la del ciudadano por fecha | 1 |
| E8 | Asignar conector (`asignar-ab`) | `S.conectores.filter(c.entidad === ENT)` | Con `entidades[]` deja de encontrar conectores | Filtra por la entidad activa dentro de `entidades[]` | 5 |
| E9 | Resumen (`eResumen`) | Cola: autorregistros y solicitudes | Faltan fichas por verificar y comunicados por aprobar | La cola suma esos dos tipos con su botón | 2, 4 |

## Ola 1 · Recurso como evento

| Pantalla | Cambio |
|---|---|
| Crear/editar recurso | E1, E7 |
| Mis recursos (`eRecursos`) | Tarjeta: próxima fecha y ocupación de esa fecha (E2) |
| Resumen | Indicador «Esta semana»: eventos y ocupación |
| Ficha mínima | E6 |

## Ola 2 · Familia

| Pantalla | Cambio |
|---|---|
| Personas → **Por verificar** (nueva pestaña junto a Solicitudes y Por asignar) | Fichas de familiares de las personas que atiende |
| Verificar ficha | Datos y vínculo → **Verificar** o **Rechazar (motivo)**. En la demo, un clic |
| Solicitudes y aprobar | E3, E4, E5 |

## Ola 3 · Panel del recurso

`eRecurso` se divide: **Panel** (`#/recurso/:id`: Resumen · Inscritos · Fechas · Uso ·
Comunicados) y **Configuración** (`#/recurso/:id/editar`, el editor de E1). La colección `usos`
reemplaza `solicitudes[].usos`; `asistencias` guarda lo confirmado por el ciudadano.

## Ola 4 · Comunicados y perfil

| Pantalla | Cambio |
|---|---|
| **Comunicados** (menú, contador de Por aprobar) | Historial con estado de entrega |
| Aprobar borrador | Ver, editar, aprobar o devolver con comentario |
| Redactar | Destinatarios filtrados (inscritos, lista de espera, no asistieron), canales |
| Ficha | Notas internas de su entidad |

Los casos protegidos nunca aparecen en las listas de destinatarios.

## Ola 5 · Red

Selector de entidad (E8). Alta de entidad: campo opcional «Pertenece a la red». Lo enviado por la
red aparece con «enviado por la red».

## Diseño por pantalla

| Pantalla | Estructura | Componentes | Estados |
|---|---|---|---|
| Editor de recurso, paso Catálogo | Elegir categoría (rejilla `ez-cats` actual) → buscador y lista de sus recursos del catálogo agrupados por subcategoría, con el formato como etiqueta; «No está en el catálogo» al final (recurso propio) | Patrón `ez-cats`, `nwt-badge` del formato | Al elegir, precarga nombre, categoría y los valores del formato (spec 07). Ocultos los marcados `fuera` y `fase2` |
| Editor, paso Cuándo | Selector de forma (único, recurrente, sesiones, estadía) y campos según forma; vista previa de las próximas 4 fechas | `ez-segm`, inputs de fecha y hora, `ez-prev` reutilizado como vista previa | Error si fin < inicio; sin días elegidos en recurrente |
| Editor, paso Acceso y plazas | Modo, plazo de respuesta, plazas, ¿admite acompañantes?, máximo, límite de usos, plazo de confirmación | `ez-modos`, `ez-cupo` (+/−), `nwt-switch`-like `ez-sw` | Acompañantes apagado oculta el máximo |
| Panel del recurso | Cabecera con nombre, próxima fecha y ocupación; pestañas; acciones «Enviar aviso» y «Editar» | `nwt-tabs` (`bc-subtabs`), `nwt-stat-card` en Resumen, tabla `bc-tr` en Inscritos y Fechas | Sin inscritos: vacío con «Compartir en la red». Fecha pasada sin lista: alerta «Falta pasar lista» |
| Por verificar | Tabla: familiar, titular, vínculo, creada, acciones | `bc-tr`, `nwt-button` Verificar / `quiet` Rechazar, modal de motivo como el de rechazo actual | Vacío: «No hay fichas por verificar» |
| Aprobar con plazas insuficientes | Dentro del modal actual: aviso + dos opciones | `nwt-alert` warning, `nwt-radio-button` | — |
| Comunicados | Lista con filtro Por aprobar · Enviados; detalle con entregas por persona | `filtrosBarra` actual, `nwt-badge` por estado | Borrador devuelto: muestra el comentario |

## Casos guiados nuevos

- **3.5 Publicar un taller por sesiones:** del catálogo a la agenda en pocos pasos.
- **3.6 Verificar a una familia:** ficha por verificar → verificar → la persona ya puede ir con ella.
- **3.7 Una familia y una plaza:** aprobar a los que caben o lista de espera para todos.
- **3.8 Aprobar un comunicado** del conector y ver su entrega.
