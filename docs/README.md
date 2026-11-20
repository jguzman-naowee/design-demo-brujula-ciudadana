# docs

| Carpeta | Qué guarda |
|---|---|
| `specs/` | Qué se construye: decisiones, datos, reglas, estados y pantallas afectadas |
| `planes/` | Cómo entra cada spec a la UI, rol por rol |
| `entregables/` | Material ya enviado (PDF de roles y sus capturas) |

## Specs

| # | Spec | Estado | Depende de |
|---|---|---|---|
| 01 | [Red de entidades](specs/01-red-de-entidades.md) | En la demo | — |
| 02 | [Recurso como evento](specs/02-recurso-como-evento.md) | En la demo | — |
| 03 | [Familia](specs/03-familia.md) | En la demo | 02 |
| 04 | [Panel del recurso](specs/04-panel-del-recurso.md) | En la demo | 02, 03 |
| 05 | [Comunicados](specs/05-comunicados.md) | En la demo | 01, 04 |
| 06 | [Perfil](specs/06-perfil.md) | En la demo | 03, 05 |
| 07 | [Catálogo estándar](specs/07-catalogo.md) | En la demo | 02 |
| 08 | [Landing](specs/08-landing.md) | En la demo | 02 |
| 09 | [Recorrido](specs/09-recorrido.md) | En la demo | 01–08 |
| 10 | [Registro único](specs/10-registro-unico.md) | Spec cerrada, pendiente de UI (ola 6) | 03, 06 |

**En la demo** = implementada en las olas 1–5 (19-nov-2026); las decisiones siguen sin validar con el cliente. Cada spec cierra con «En la demo» cuando la implementación simplificó algo.
Fuera de alcance: voluntariado y certificados (no se hacen), empleo (fase 2).

## Planes

| Plan | Qué |
|---|---|
| [00 Orden](planes/00-orden.md) | Las olas de entrada a la UI (5 en la demo, la 6 pendiente) y qué cierra cada una |
| [01 Ciudadano](planes/01-ciudadano.md) | Agenda, Mi familia, inscribirse con familia, avisos |
| [02 Conector](planes/02-conector.md) | Postular con fecha y familia, pasar lista, avisos, notas |
| [03 Entidad](planes/03-entidad.md) | Crear recurso por catálogo, verificar fichas, panel, aprobar comunicados |
| [04 Red](planes/04-red.md) | Rol nuevo: resumen de la red y comunicados con firma |
| [05 Landing y recorrido](planes/05-landing-y-recorrido.md) | La portada como landing con mapa y el recorrido de 19 escenas |
