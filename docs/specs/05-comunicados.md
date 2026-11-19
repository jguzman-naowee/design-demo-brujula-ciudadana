# 05 · Comunicados

## Objetivo

Avisar a las personas sobre los recursos y comunicar novedades por **correo y app**, con permisos
claros por rol y un registro de todo lo enviado.

## Decisiones

- Dos clases de mensaje:
  - **Aviso**: atado a un evento (recordatorio, cambio de hora, cancelación). Operativo y urgente.
  - **Comunicado**: información general de una entidad o de la red.
- Canales: **correo y app**. Se respeta el canal preferido de la persona y su consentimiento de
  comunicaciones (`consent.comunicaciones`).
- El **gestor de red** escribe a ciudadanos de sus entidades **a nombre de una entidad o a nombre
  propio** (la red).

## Quién envía qué

| Quién | Qué | A quién | Aprobación | Firma |
|---|---|---|---|---|
| Sistema | Confirmación, recordatorio, cancelación | Inscritos del evento | — | Entidad del recurso |
| Conector | Avisos | Inscritos de sus recursos o de una fecha | No | Entidad |
| Conector | Comunicados | Participantes de sus recursos | **Borrador → aprueba el responsable** | Entidad |
| Responsable de entidad | Avisos y comunicados; aprueba borradores | Participantes, filtrados por estado | — | Entidad |
| Gestor de red | Comunicados | Equipos y ciudadanos de sus entidades | — | A elegir: una entidad o la red |
| Ciudadano | Solo responde «voy» / «no voy» | — | — | — |

## Datos

```js
comunicados: [{
  id, clase: "aviso",                  // aviso | comunicado
  recurso: "r4", fechaEvento: "2026-11-24",   // solo avisos
  autor: "c1", aprobadoPor: null, firma: { tipo: "entidad", id: "e1" },   // o { tipo: "red", id: "red1" }
  destinatarios: { filtro: "inscritos", personas: ["BC-…"] },
  canales: ["app", "correo"], asunto, cuerpo,
  estado: "Enviado",                   // Borrador | Por aprobar | Enviado | Rechazado
  enviado: "2026-11-19 10:30",
  entregas: [{ persona: "BC-…", canal: "correo", estado: "Entregado", leido: null }]
}]
```

## Reglas

- **Caso protegido** (`MODELO.md`): esas personas no reciben comunicados masivos y nunca salen en
  una lista de destinatarios visible para otros.
- Sin consentimiento de comunicaciones, la persona solo recibe avisos de los eventos a los que se
  inscribió. Hoy el interruptor de Privacidad dice «Recibir avisos sobre mi expediente» y apaga
  todo: pasa a **«Recibir comunicados»**; los avisos de sus eventos llegan siempre.
- Un comunicado enviado no se edita ni se borra: se corrige con otro.
- El registro guarda quién escribió, quién aprobó, a nombre de quién, cuándo, a quién, por qué
  canal, y si se entregó o se leyó en la app.

## Pantallas afectadas

| Rol | Cambio |
|---|---|
| Ciudadano | Bandeja de avisos; responder voy / no voy |
| Conector | Enviar aviso desde el panel; redactar comunicado (queda Por aprobar) |
| Entidad | Aprobar borradores; enviar; historial con estado de entrega |
| Red | Redactar con selector de firma; historial de la red |

## Abierto

- ¿El gestor de red necesita aprobación del responsable para escribir a nombre de una entidad?
  Propuesta: no, pero la entidad lo ve en su historial con «enviado por la red».

## En la demo (ola 4)

- El editor es uno solo: pestaña Comunicados del panel del recurso (aviso de una fecha o
  comunicado a inscritos, lista de espera o quienes no vinieron) y Comunicados de la entidad
  (comunicado a todas sus personas). La red lo usa con selector de firma (ola 5).
- El ciudadano los ve en Avisos (campana del inicio, con los no leídos); abrirlos los marca como
  leídos, y un aviso de fecha trae «Voy / No voy».
