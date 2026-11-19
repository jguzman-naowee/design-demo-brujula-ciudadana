# 01 · Red de entidades

## Objetivo

Agregar una capa por encima de la entidad que agrupe varias (un grupo, un ayuntamiento, una
federación) y permitir que una persona del equipo gestione más de una entidad desde la misma cuenta.

## Decisiones

- Existe una **Red**: agrupa entidades. Su tipo es libre (Grupo, Ayuntamiento, Federación…).
- Quien pertenece a varias entidades **las gestiona todas** con una sola cuenta y elige en cuál
  está trabajando (selector de entidad).
- El **gestor de red** es un rol nuevo: ve las entidades de su red y comunica a nombre de una de
  ellas o de la red (ver [05](05-comunicados.md)).
- El ciudadano no pertenece a la red ni a una entidad: se ata a cada beneficio, y puede tener
  beneficios de entidades distintas.

## Datos

```js
redes: [{ id: "red1", nombre: "Red Sur Madrid", tipo: "Ayuntamiento", entidades: ["e1", "e2", "e3"] }]
entidades: [{ id: "e1", red: "red1", … }]          // una entidad pertenece a 0 o 1 red
equipo: [{ id: "c1", nombre, entidades: ["e1", "e2"], rol: "Trabajadora social", … }]
gestoresRed: [{ id: "g1", nombre, red: "red1" }]
```

Hoy `conectores[].entidad` es un solo id: pasa a `entidades[]`. La entidad activa se guarda en la
sesión, no en el dato.

`personas[].entidad` se mantiene pero cambia de significado: es la **entidad que atiende** a la
persona (asigna conector, verifica a su familia, ve su caso completo). **No** es dueña de sus
beneficios: cada beneficio es de la entidad del recurso. Se renombra a `atiende` para que el
nombre no engañe.

## Reglas

- Lo que se ve y se hace siempre es **de la entidad activa**. Al cambiarla cambian las personas,
  los recursos, la bandeja y los comunicados.
- El gestor de red ve **agregados** de cada entidad (personas, recursos, ocupación). Ve el caso
  completo solo si además es parte del equipo de esa entidad (la visibilidad de `MODELO.md` no cambia).
- Una entidad sin red funciona igual que hoy.

## Pantallas afectadas

| Rol | Cambio |
|---|---|
| Conector / Entidad | Selector de entidad en la cabecera, si tiene más de una |
| Red (nuevo) | Resumen de la red, lista de entidades, comunicados |
| Alta de entidad | Campo opcional «Pertenece a la red» |

## Supuestos

- Una entidad pertenece a una sola red. Si el cliente necesita varias, el campo pasa a lista.

## Abierto

- ¿El gestor de red puede crear entidades o solo agruparlas?

## En la demo (ola 5)

- Rol **Red** (Marina Sáez, Red Sur Madrid, con las tres entidades): resumen con agregados,
  detalle por entidad y comunicados con firma de la red o de una entidad.
- Selector «Trabajas en»: Lucía (conector) está en Asociación Puentes y Fundación Raíces; la
  coordinación gestiona esas dos. La entidad activa se recuerda por rol en el navegador.
- `personas[].entidad` no se renombró a `atiende` en el código: hace ese papel (spec 03).
- La red escribe a ciudadanos; escribir a los equipos de las entidades queda pendiente.
