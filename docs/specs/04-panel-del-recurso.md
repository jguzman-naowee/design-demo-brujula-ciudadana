# 04 · Panel del recurso

## Objetivo

Que la entidad administre cada recurso de punta a punta: quién lo va a usar, la entrega, si de
verdad lo usó y qué se le comunicó.

## Decisiones

- Cada recurso tiene su **panel**, con las mismas partes para todas las formas de evento.
- El uso se registra **por persona y por fecha**, también el de cada acompañante.
- Los avisos y comunicados se envían desde el panel y quedan registrados (ver [05](05-comunicados.md)).

## Confirmar asistencia (lo hace el ciudadano)

Decisión del 19-nov: la asistencia es **mixta**. El ciudadano avisa antes, el equipo confirma el día.

- El ciudadano dice **«Voy»** a una fecha y **con quiénes** (solo familiares verificados, si el
  recurso admite acompañantes).
- En los recurrentes y por sesiones marca **con tiempo** a qué fechas va. Plazo:
  `config.confirmarAntes` (horas antes de cada fecha; default 24).
- Pasado el plazo sin confirmar, **la plaza de esa fecha se ofrece a la lista de espera**; la
  inscripción al recurso no se pierde. *(Propuesta: validar con el cliente.)*
- El día del evento el equipo marca el **uso real**. El panel compara lo confirmado con lo que pasó.

```js
asistencias: [{ recurso: "r16", fecha: "2026-11-24", persona: "BC-2026-0141",
                acompanantes: ["BC-2026-0210"], estado: "Confirmada", cuando: "2026-11-22 18:10" }]
// estado: Confirmada | No va | Sin confirmar (implícito)
```

## Partes del panel

| Parte | Qué muestra |
|---|---|
| Resumen | Próxima fecha, plazas ocupadas / totales, lista de espera |
| Inscritos | Titulares con sus acompañantes, estado de la solicitud y ficha verificada |
| Fechas | Una fila por ocurrencia o sesión: confirmados, sin confirmar, plazas liberadas |
| Uso | Pasar lista sobre los confirmados: Usó / No vino; contador «usó N de M» por persona |
| Comunicados | Historial del recurso y botón para enviar un aviso o comunicado |
| Configuración | Tiempo, plazas, acompañantes, límite de usos |

## Datos

```js
usos: [{ recurso: "r3", persona: "BC-2026-0167", fecha: "2026-11-19", estado: "Usó", por: "c1" }]
// estado: Usó | No vino | Entregado
```

Hoy `solicitudes[].usos` es una lista de fechas: pasa a la colección `usos`, que además guarda
quién lo marcó.

## Reglas

- Solo el equipo de la entidad dueña del recurso marca uso.
- «No vino» repetido no da de baja solo: queda visible para que el conector decida.
- Al llegar al límite, el contador lo muestra y la persona no se puede inscribir a más usos.

## Pantallas afectadas

| Rol | Cambio |
|---|---|
| Conector | Panel completo de los recursos de su entidad activa |
| Entidad | Panel completo y configuración |
| Ciudadano | Sin panel. Confirma «Voy» por fecha y con quiénes; ve su uso en «Mis recursos» (`usoBloque`) |

## En la demo (ola 3)

- Panel en `#/panel/:id[/:pestaña][/:fecha]`, igual para el conector («Recursos de mi entidad») y
  la coordinación (nombre del recurso en Mis recursos). Editar sigue en `#/recurso/:id`.
- Se confirma asistencia solo en recursos con plazas (`cupo`) y que no son estadía: donde no hay
  plazas que liberar, confirmar no aporta.
- «Voy» lleva a los mismos acompañantes de la solicitud; elegir otros por fecha queda para después.
- `S.usos` reemplaza `solicitudes[].usos`; el consumo de cada acompañante se cuenta aparte.
