# 00 · Orden de entrada a la UI

Las specs entran en **olas**. Cada ola toca todos los roles a la vez, para que la demo quede
coherente entre roles (comparten `localStorage`) y cada ola sea un commit que se puede mostrar.

| Ola | Spec | Qué se ve al terminar | Ciudadano | Conector | Entidad | Red |
|---|---|---|---|---|---|---|
| 1 | [02 Recurso como evento](../specs/02-recurso-como-evento.md) | Todo recurso tiene fecha; agenda del ciudadano | ● | ● | ● | |
| 2 | [03 Familia](../specs/03-familia.md) | Inscribirse con familia; fichas por verificar | ● | ● | ● | |
| 3 | [04 Panel del recurso](../specs/04-panel-del-recurso.md) | El ciudadano confirma «Voy» y con quiénes; el equipo pasa lista | ● | ● | ● | |
| 4 | [05 Comunicados](../specs/05-comunicados.md) + [06 Perfil](../specs/06-perfil.md) | Avisos con aprobación; notas internas | ● | ● | ● | |
| 5 | [01 Red de entidades](../specs/01-red-de-entidades.md) | Rol Red nuevo; selector de entidad | | ● | ● | ● |

● cambia

Cada plan por rol trae tres partes: **Correcciones de flujo** (lo que hoy hace la demo y el modelo
nuevo rompe, con su id: C, K, E, R), **cambios por ola** y **Diseño por pantalla** (estructura,
componentes y estados).

**Por qué este orden:** la ola 1 cambia la forma de los datos de todos los recursos y las demás se
apoyan en ella. La red va al final porque es un rol nuevo que reutiliza el panel y los comunicados.

## Cada ola cierra con

1. `datos.js`: semilla nueva y **subir la versión de la clave de `localStorage`**, para que nadie
   lea datos con la forma vieja.
2. Pantallas de cada rol según su plan.
3. Casos guiados (`demo/apps/<rol>/casos.js`) y escenas del recorrido (`tour/escenas.js`).
4. Revisión: `grep -rni "avivla\|AV-"` en lo visible, móvil y escritorio en cada rol.
5. Una línea en el `CHANGELOG` o el cuerpo del commit, y commit propuesto a Jorge.

## Planes por rol

- [Ciudadano](01-ciudadano.md)
- [Conector](02-conector.md)
- [Entidad](03-entidad.md)
- [Red](04-red.md)
