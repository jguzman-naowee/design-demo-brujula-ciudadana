# 02 · Recurso como evento

## Objetivo

Que todos los recursos funcionen igual: cada uno es un **evento** con fecha o recurrencia, con
plazas, inscritos y uso. Talleres, cursos, comedor, albergue y asesorías se gestionan de una sola
forma, de manera transversal.

## Decisiones

- **Todo recurso es un evento.** Desaparece la distinción Grupo / Evento / Individual como tipo
  de recurso; lo que la reemplaza es **cómo ocurre en el tiempo** (ver Datos).
- Los recursos salen de un **catálogo estándar**: los 150 recursos del cliente, cada uno con un
  formato que trae sus valores por defecto. Ver [07](07-catalogo.md).
- Cada recurso tiene una **configuración interna** propia.
- La forma de acceso (`modo`: Libre, Inscripción, Solicitud) se mantiene.

## Datos

```js
recursos: [{
  id, entidad, nombre, cat, catalogo: "k110", formato: "taller",   // spec 07
  modo: "Inscripción",                 // Libre | Inscripción | Solicitud
  urg: "Normal",
  tiempo: {
    forma: "sesiones",                 // unico | recurrente | sesiones | estadia
    inicio: "2026-11-24", fin: "2027-01-30",
    cada: "semana",                    // recurrente: dia | semana | mes
    dias: ["lu", "mi"], hora: "17:00", duracion: 90   // minutos
  },
  plazas: 15,                          // por sesión o en total, según la forma
  config: { acompanantes: true, maxAcompanantes: 3, limite: 12 }   // limite = usos por persona
}]
```

| Forma | Ejemplo | Qué cuenta |
|---|---|---|
| `unico` | Feria de empleo | Plazas del día |
| `recurrente` | Comedor diario, despensa semanal | Plazas por ocurrencia y usos por persona |
| `sesiones` | Taller de 8 sesiones, curso | Plazas en el grupo y asistencia por sesión |
| `estadia` | Albergue, piso de acogida | Plazas ocupadas entre desde–hasta de cada persona |

Migración de la semilla: `tipo` desaparece. `frecuencia` (Diario/Semanal) pasa a
`tiempo.forma: "recurrente"`. `limite` y `cupo` pasan a `config.limite` y `plazas`.

## Reglas

- Las plazas ocupadas cuentan **titular + acompañantes** (ver [03](03-familia.md)).
- **Sin solapes por persona:** una persona no queda en dos eventos a la misma hora. Se aplica a
  cada familiar por separado.
- La regla de no pedir lo mismo en dos lugares se mantiene por categoría y por persona.
- Los estados de la solicitud de `MODELO.md` no cambian (Pendiente → Aprobada…).

## Pantallas afectadas

| Rol | Cambio |
|---|---|
| Ciudadano | Agenda: «Mis próximas fechas»; el recurso muestra cuándo ocurre |
| Conector | Recursos de la red muestra fecha, plazas libres y forma |
| Entidad | Crear/editar recurso: catálogo, tiempo, plazas y configuración |

## Supuestos

- El alojamiento es un evento de forma `estadia` (desde–hasta por persona), no algo aparte.
- La regla «nunca dos eventos a la misma hora» de `MODELO.md` se lee **por persona**.

## Abierto

- El catálogo y sus formatos están armados (spec 07); falta validarlos con el cliente.
