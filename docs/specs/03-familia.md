# 03 · Familia

## Objetivo

Que una persona pueda ir a un recurso con su familia: registra sus grupos familiares, elige quién
la acompaña, cada acompañante ocupa plaza y cada uno lleva su propio consumo.

## Decisiones

- La persona arma **uno o varios grupos familiares** en su perfil.
- Al inscribirse elige qué familiares van. **Cada uno ocupa una plaza.**
- El **consumo se cuenta por persona**: cada familiar tiene su contador «usó N de M», aunque los
  traiga o los recoja el titular.
- Todo familiar tiene **ficha propia**. Si la crea el titular, nace **Por verificar**.
- Verifica la **entidad que atiende al titular**. En la demo la verificación es rápida, pero
  siempre se hace: una ficha sin verificar no participa.

## Datos

```js
personas: [{ id: "BC-2026-0210", …, verificacion: "Por verificar", creadaPor: "BC-2026-0141" }]
familias: [{ id: "f1", nombre: "Familia Haddad", titular: "BC-2026-0141",
             miembros: [{ persona: "BC-2026-0210", vinculo: "Hija" }] }]
solicitudes: [{ …, persona: "BC-2026-0141", acompanantes: ["BC-2026-0210"] }]
```

Cada acompañante también genera su propio registro de uso (`usos`) en el recurso.

## Estados de la ficha

`Por verificar` → `Verificada` · `Rechazada (motivo obligatorio)`

## Reglas

- Solo pueden acompañar fichas **Verificadas**. Una ficha Por verificar aparece en el selector
  como no disponible, con el motivo.
- Plazas ocupadas = titular + acompañantes. Si no alcanzan, la inscripción no sale; no se parte
  la familia sin preguntar. Al aprobar con plazas insuficientes, la entidad elige: **lista de
  espera para todos** o **aprobar a los que caben**, y la persona confirma quién va.
- El recurso decide si admite acompañantes y cuántos (`config.acompanantes`,
  `config.maxAcompanantes`, ver [02](02-recurso-como-evento.md)).
- La regla de duplicidad y los solapes de horario se aplican **a cada familiar**.
- Un familiar puede estar en más de un grupo (p. ej. hijo en el grupo de cada progenitor).

## Pantallas afectadas

| Rol | Cambio |
|---|---|
| Ciudadano | Perfil → «Mi familia»; inscribirse → «¿Quién viene contigo?» |
| Conector | Ficha de la persona: su familia y el estado de cada miembro |
| Entidad | Bandeja: fichas por verificar de las personas que atiende |

## Supuestos

- «La entidad que atiende al titular» es la entidad activa del conector asignado a la persona.
  Si no tiene conector (autorregistro), la entidad donde se registró.

## En la demo (ola 2)

- Los familiares viven en `S.familiares` (no en `personas`), para no mezclarse con las listas de
  personas atendidas; `per(id)` busca en las dos. Los grupos, en `S.familias`.
- `persona.entidad` hace de «entidad que atiende» (spec 01). Verifica su equipo: el conector desde
  la ficha (sección Familia) y la coordinación desde Personas → Por verificar.
- Si el familiar lo agrega el equipo que atiende, nace **Verificada**; si lo agrega la persona,
  **Por verificar**. En el rol Ciudadano hay un botón de demo «Simular que … la verifica».
