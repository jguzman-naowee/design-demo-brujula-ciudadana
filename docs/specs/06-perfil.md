# 06 · Perfil

## Objetivo

Que el perfil de la persona reúna lo que el formulario no pide, su familia y lo que se le ha
comunicado, sin pedir dos veces el mismo dato.

## Decisiones

- **Notas internas**: texto libre del equipo para datos fuera del formulario. **El ciudadano no
  las ve.**
- **Mi familia**: los grupos familiares y el estado de verificación de cada miembro (ver [03](03-familia.md)).
- **Avisos y comunicados recibidos**: historial de la persona (ver [05](05-comunicados.md)).

## Datos

Hoy `personas[].notas` es un solo texto. Pasa a una lista con autor y fecha:

```js
notas: [{ texto, autor: "c1", entidad: "e1", fecha: "2026-11-19 10:30" }]
```

## Reglas

- Una nota la ve solo el equipo de la **entidad que la escribió** y el conector asignado. No
  viaja a otras entidades, igual que el resto de la visibilidad de `MODELO.md`.
- Una nota no se edita: se agrega otra. Queda trazado quién dijo qué.
- Las notas no reemplazan campos: si un dato se repite en muchas notas, es candidato a campo del
  formulario.
- Nada sensible (salud, violencia) en notas sin la autorización expresa campo por campo.

## Pantallas afectadas

| Rol | Cambio |
|---|---|
| Ciudadano | Perfil: Mi familia y avisos recibidos. No ve las notas |
| Conector | Ficha: notas internas (agregar y ver), familia, comunicados |
| Entidad | Ficha mínima: notas de su propia entidad |

## En la demo (ola 4)

Notas internas y comunicados recibidos en la ficha completa (conector y coordinación). La nota del
registro del conector entra como primera nota, con su autor.
