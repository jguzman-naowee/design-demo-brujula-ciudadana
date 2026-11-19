# 07 · Catálogo estándar de recursos

## Objetivo

Que una entidad publique un recurso **eligiéndolo de un catálogo común** y no escribiéndolo de
cero: así todas las entidades nombran igual lo mismo, la red puede comparar y el recurso nace con
una configuración de evento razonable.

## Decisiones

- El catálogo tiene **dos capas**:
  - **Qué se ofrece:** los 150 recursos del cliente, en 16 categorías y 59 subcategorías
    (`design-avivla-research/docs/11-definicion-categorias-subcategorias-recursos.md`). Las
    categorías son las mismas del Mapa de Vida.
  - **Cómo ocurre:** un **formato** por recurso, que trae los valores por defecto del evento
    (spec [02](02-recurso-como-evento.md)): forma en el tiempo, modo de acceso, plazas y acompañantes.
- La entidad elige del catálogo y **puede cambiar** cualquier valor por defecto.
- Si lo que ofrece no está en el catálogo, publica un **recurso propio**: elige categoría y formato
  a mano (`catalogo: "propio"`). En la semilla: Feria de empleo.
- Datos: `BC_CATALOGO.formatos` y `BC_CATALOGO.recursos` en `app/brujula/datos.js`. Cada recurso
  publicado guarda `catalogo` (id `k001`…`k150` o `propio`) y `formato`.

## Formatos

| Formato | Para qué | Forma | Modo | Plazas | Acompañantes |
|---|---|---|---|---|---|
| Taller o curso | Grupo con varias sesiones | Sesiones | Inscripción | 15 | No |
| Grupo o actividad periódica | Se reúne cada semana | Recurrente semanal | Inscripción | 20 | Sí |
| Atención o asesoría | Citas en un horario de atención | Recurrente semanal | Solicitud | 8 por franja | 1 |
| Entrega de alimentos o bienes | Se recoge con límite de usos | Recurrente diaria | Libre | 30 · límite 30 usos | Sí |
| Alojamiento | Estadía desde–hasta | Estadía | Solicitud | 10 | Sí |
| Ayuda económica o prestación | Se resuelve y se cobra cada mes | Recurrente mensual | Solicitud | — | No |
| Evento o jornada | Un día concreto | Único | Inscripción | 40 | Sí |
| Servicio a domicilio o transporte | Visitas o traslados programados | Recurrente semanal | Solicitud | 10 | No |

La recurrencia mensual es nueva respecto de la spec 02: `tiempo.cada` acepta `dia`, `semana` o `mes`.

## Asignación por categoría

Por defecto, el formato sale de la **subcategoría**; 23 recursos tienen excepción propia (p. ej.
«Mesa de emergencia habitacional» es Atención aunque su subcategoría sea de alojamiento).

| Categoría | Recursos | Formatos |
|---|---|---|
| Vivienda | 12 | Atención 5 · Alojamiento 5 · Ayuda 2 |
| Ingresos | 10 | Ayuda 8 · Atención 1 · Taller 1 |
| Alimentación | 10 | Entrega 6 · Ayuda 3 · Taller 1 |
| Salud y Bienestar | 11 | Atención 7 · Grupo 2 · Taller 1 · Domicilio 1 |
| Documentación y Trámites | 10 | Atención 10 |
| Red de Apoyo | 10 | Grupo 6 · Atención 3 · Evento 1 |
| Familia | 9 | Taller 4 · Domicilio 2 · Atención 2 · Grupo 1 |
| Infancia y Menores | 11 | Grupo 6 · Entrega 1 · Ayuda 1 · Evento 1 · Atención 1 · Domicilio 1 |
| Mujer y Cuidados | 9 | Atención 3 · Taller 2 · Grupo 2 · Alojamiento 1 · Ayuda 1 |
| Empleo | 9 | Atención 6 · Taller 3 |
| Formación | 9 | Taller 9 |
| Movilidad | 7 | Domicilio 4 · Ayuda 3 |
| Competencias Digitales | 8 | Atención 4 · Taller 2 · Grupo 2 |
| Autonomía Personal y Cuidados | 9 | Domicilio 6 · Entrega 1 · Grupo 1 · Ayuda 1 |
| Organización y Dirección | 7 | Atención 6 · Taller 1 |
| Participación y Comunidad | 9 | Grupo 6 · Evento 3 |
| **Total** | **150** | Atención 48 · Grupo 26 · Taller 24 · Ayuda 19 · Domicilio 14 · Entrega 8 · Alojamiento 6 · Evento 5 |

## Alcance

| Marca | Recursos | Qué pasa en la demo |
|---|---|---|
| `e: "fuera"` | Voluntariado acompañante, Voluntariado | No aparecen al publicar (voluntariado no se hace) |
| `e: "fase2"` | Bolsa de empleo, Prácticas laborales, Programas de empleo protegido, Empleo con apoyo, Programas de inserción laboral remunerada | No aparecen al publicar (empleo es fase 2). Orientación laboral e itinerarios de inserción **sí** entran: son acompañamiento, no tablero de empleo |

## Semilla alineada

Los 19 recursos de ejemplo apuntan a su entrada del catálogo. Un cambio: **Apoyo escolar** pasa de
Formación a **Infancia y Menores**, que es donde el cliente tiene «Apoyo educativo».

## Abierto

- Validar con el cliente el formato asignado a cada subcategoría y las 23 excepciones.
- «Ayuda económica» como recurrente mensual: ¿el consumo de una ayuda se cuenta por persona o por
  hogar? Hoy la regla es por persona (spec 03).
