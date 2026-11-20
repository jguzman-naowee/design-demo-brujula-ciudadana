# 08 · Landing

## Objetivo

Que la portada (`index.html`) deje de ser un selector de roles y sea la landing para el ciudadano,
presentable a un ayuntamiento local: un mapa de recursos al día, seguridad de los datos y una
invitación a que las entidades se sumen.

## Decisiones (20-nov-2026)

- Enfoque **ciudadano**; tono sobrio e institucional, de lectura fácil (letra base de 18 px).
- **Mapa real de una zona cerrada** (sur de Madrid): no se puede salir de ella. Los recursos de
  la semilla más 16 entidades **de ejemplo** que la pueblan, marcadas como tales.
- **Vista de tarjetas** complementaria al mapa: mismos recursos y mismo filtro, con foto,
  entidad, barrio, cuándo, acceso y plazas. Cada tarjeta lleva a su punto en el mapa.
- **Gráfica**: fotos reales (Pexels) en inicio, pasos, participación, entidades y visión, y la
  pantalla real de Privacidad en la sección de seguridad.
- La landing invita solo a **entidades**. Sin voluntariado.
- «DAFO», «smart city» y «participativo» son mensaje, no funciones.
- El selector de roles no desaparece: es la última sección (`#demo`).

## Secciones

| # | Ancla | Contenido |
|---|---|---|
| 1 | `#inicio` | Titular, Ver el mapa · Registrarme, y tres cifras calculadas |
| 2 | `#mapa` | Conmutador Mapa / Tarjetas, filtro por necesidad y lista por barrio |
| 3 | `#como` | Tres pasos del ciudadano |
| 4 | `#seguridad` | Cuatro garantías y la nota sobre el documento de identidad |
| 5 | `#participacion` | Personas mayores · Vecinos y salud mental · Nueva ciudadanía y acogida; cada una filtra el mapa |
| 6 | `#entidades` | Por qué sumarse y acceso al alta de entidad |
| 7 | `#vision` | Ciudadanía, entidades y ayuntamiento, conectados |
| 8 | `#demo` | Los cinco roles y el recorrido |

## Datos

- `BC_SEMILLA()` de `app/brujula/datos.js` da los recursos reales de la demo. La zona, las
  entidades de ejemplo, los nombres de recurso, la foto de cada necesidad y las líneas de
  participación están en `shared/mapa-ejemplo.js`. Las fotos, en `shared/img/landing/`.
- `?vista=tarjetas` abre directo en tarjetas.
- Cifras: recursos visibles, actividades de los próximos 7 días (según `tiempo` de cada recurso) y
  entidades. Cambian con el filtro; nada está escrito a mano.

## Reglas

- Las tarjetas muestran lo mismo que el mapa: son su alternativa accesible y el respaldo si la
  librería o el fondo no cargan.
- Las garantías de seguridad solo afirman lo que la demo hace (permisos, registro de accesos,
  ficha mínima, casos protegidos). No se afirma cumplimiento legal.
- «Salir de la demo» y el botón de volver llevan a `index.html#demo`.

## En la demo

- Leaflet 1.9.4 y markercluster 1.5.3 desde cdnjs. Fondo de OpenStreetMap atenuado por CSS: el de
  CARTO pide clave. Para producción hay que contratar un servicio de teselas; el servidor público
  de OpenStreetMap no admite tráfico alto.
- Sin conexión no hay fondo: aparece un aviso y quedan los puntos y la lista.

## Abierto

- Textos por validar con el cliente. Buscador por dirección, geolocalización e idiomas, fuera.
