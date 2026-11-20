# design-demo-brujula-ciudadana

Showroom del concepto de **Brújula Ciudadana** (Naowee). Estático: HTML, CSS y JS planos, sin build. Los datos son de ejemplo. Funciona en GitHub Pages.

La portada (`index.html`) es la **landing**: mapa de recursos (Leaflet, abre en Madrid con la semilla y grupos de ejemplo en otras ciudades), seguridad, participación y alta de entidades. Su última sección, `#demo`, pide el **rol**. Cada rol abre su propia demo, con su sesión, su menú y solo sus casos guiados: no se cambia de usuario ni se mezclan casos. Dentro de la demo se elige la **superficie**: Móvil (teléfono) o Escritorio (ventana de navegador).

| Rol | Puede | Casos | Superficie por defecto |
|---|---|---|---|
| Red | Resumen de la red (solo agregados), entidad por entidad, Comunicados con firma de la red o de una entidad | 5.1 · 5.2 | Escritorio |
| Ciudadano · *decisión nueva* | Registrarse, Mi expediente, Mis recursos, Agenda, Buscar ayuda, Mi familia, Avisos, Mi Mapa de Vida, Privacidad | 1.1 – 1.5 | Móvil |
| Conector | Mis personas, Registrar persona, ficha (familia, notas, comunicados) y derivación, Recursos de mi entidad (panel y pasar lista), Recursos de la red | 2.1 – 2.5 | Móvil |
| Entidad | Resumen, Mis recursos (editor por catálogo y panel), Comunicados, Personas (solicitudes, asignar, por verificar), Conectores | 3.1 – 3.7 | Escritorio |
| Registro de entidad | Formulario de alta con diseño mínimo | 4.1 | Escritorio |

Los datos se comparten entre roles (mismo `localStorage`): lo que registra el Ciudadano o el Conector aparece en la bandeja de la Entidad. «Restablecer datos», en el panel de casos, vuelve a la semilla.

**Formularios:** el 1.er «Continuar» marca lo que falta, el 2.º lo completa con datos de ejemplo (respeta lo ya escrito) y el 3.º avanza.

## Recorrido guiado

Presentación de menos de tres minutos (19 escenas) que empieza en el mapa de la landing y recorre las vistas reales de la app. Se entra desde la franja oscura «Ver el recorrido» de la portada o en `tour/index.html` (`#5` abre la escena 5). Vive en `tour/`: `escenas.js` es el guion y `tour.js` el motor.

- Agregar o editar una escena: cambiar un objeto de `window.ESCENAS` en `tour/escenas.js`.
- Campos: `tipo` (`vista`, `grafico` o `hero`), `url`, `grafico`, `titulo`, `texto`, `acciones`, `resalta`, `duracion`.
- Gráficos animados: `tour/graficos.js` (una función por id) y `tour/graficos.css`. Cuentan los conceptos; las vistas reales quedan para lo que hay que ver funcionando.
- Cada escena de vista carga con `semilla=1`: **restablece los datos de ejemplo**, así que el recorrido pisa lo que hayas registrado.

## Cómo está armado

- `demo/`: el marco, tomado de `design-demo-metodologos/mobile` (cabecera, zoom, vista plana, panel de casos) con un selector de superficie. `demo/apps/<rol>/` tiene `app.json` (nombre, `inicio`, `superficie`) y `casos.js`.
- `app/brujula/`: **la app, una sola copia**. `index.html?rol=ciudadano|conector|entidad`, `alta-entidad.html`, `datos.js` (catálogo y semilla), `app.js` (rutas por hash y marcado `nwt-*`), `app.css` (solo distribución).
- Estilos: SDK Naowee (`sdk-frontend-foundations`) en `app/brujula/_sdk/`, con los íconos de `design-demo-digitacion`.
- Fuente de campos y reglas: `design-avivla-research` (docs 01, 03, 09 y 11).
- Landing: `index.html` con `shared/landing.css`, `shared/landing.js` y los datos del mapa en `shared/mapa-ejemplo.js`.
- Specs, planes de UI y entregables: `docs/` (índice en `docs/README.md`).

```bash
npm run dev   # http://localhost:8781   (?dev=1 en la demo para el modo dev)
```
