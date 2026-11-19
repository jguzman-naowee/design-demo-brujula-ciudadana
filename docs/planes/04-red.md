# 04 · Plan Red (rol nuevo)

Superficie: **escritorio**. Entra solo en la ola 5, cuando ya existen el panel y los comunicados.
Usa el mismo armazón que Entidad (`nwt-sidebar`, `ez-*`).

## Correcciones de flujo

| # | Dónde | Hoy | Problema | Cómo queda |
|---|---|---|---|---|
| R1 | Rol fijo (`app.js:5`) | `ROL` solo acepta ciudadano, conector, entidad | No hay rol red | Agregar `red` a `ROL`, `MENU`, `QUIEN` |
| R2 | Entidad activa (`app.js:8`) | `ENT = "e1"` fijo | La red mira varias | La red no tiene entidad activa; elige al redactar y al entrar a una entidad |
| R3 | Portada (`index.html`) | Roles de la entidad al ciudadano | Falta el nivel de arriba | Tarjeta Red **primera** |
| R4 | Visibilidad | La red no existe en `MODELO.md` | Riesgo de que vea casos | Solo agregados, salvo que también sea equipo de esa entidad (spec 01) |

## Montaje

- `demo/apps/red/app.json` + `casos.js`, luego `npm run registrar`.
- Semilla: `redes` con e1, e2 y e3; un `gestoresRed`.

## Pantallas

| Pantalla | Ruta | Qué muestra |
|---|---|---|
| Resumen de la red | `#/red` | Entidades con personas atendidas, recursos activos y ocupación de la semana |
| Entidad | `#/red/:id` | Agregados y recursos con fechas; sin datos de personas |
| Comunicados | `#/comunicados` | Historial de la red; redactar con **selector de firma** |

## Diseño por pantalla

| Pantalla | Estructura | Componentes | Estados |
|---|---|---|---|
| Resumen de la red | Fila de KPIs de la red; tarjeta por entidad con 3 cifras y barra de ocupación | `nwt-stat-card`, `ez-rec`-like card, `bc-bar` | Entidad sin recursos: «Aún no publica» |
| Entidad | Cabecera con nombre y zona; KPIs; lista de recursos con próxima fecha | `nwt-stat-card`, tabla `bc-tr` | Candado `ez-solo` «Solo agregados» siempre visible |
| Redactar comunicado | Firma (la red o una entidad), destinatarios (equipos, ciudadanos de qué entidades), canales, texto | `nwt-radio-button` firma, `nwt-checkbox` entidades y canales, `nwt-text-area` | Vista previa de cómo lo ve el ciudadano con la firma elegida; conteo «Llegará a N personas» |

## Casos guiados

- **5.1 Ver la red:** qué entidades tiene y cómo se ocupan sus recursos.
- **5.2 Comunicar a nombre de una entidad:** cierre por festivo, firmado por Asociación Puentes; la
  entidad lo ve en su historial como «enviado por la red».

## Recorrido

Escena de apertura nueva antes de «Así entra una entidad a la red»: la red que agrupa entidades.
