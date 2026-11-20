# 10 · Registro único

## Objetivo

Que dar de alta a una persona sea **un solo formulario**, lo llene ella misma (autorregistro) o
lo llene un conector en la entrevista (registro asistido). Mismos pasos, mismos campos y misma
estructura visual. Cambia solo lo que depende de quién lo llena: el tono, el paso de entrada, el
cierre y el alcance del Mapa de Vida.

Hoy son dos asistentes distintos (`cRegistro` y `kRegistrar` en `app/brujula/app.js`), con el
mismo dato pedido en orden, componente y texto distintos, y campos que solo existen en uno.

## Decisiones (20-nov-2026)

- **Un formulario, dos voces.** El ciudadano lee «tú»; el conector lee «la persona». Lo que la
  persona responde o firma (las preguntas del Mapa y los permisos) se escribe igual en los dos
  roles, porque es su declaración: el conector lo lee en voz alta.
- **Mapa de Vida por rol, con el mismo componente.** El ciudadano responde las **8 preguntas**
  del modo persona; el conector valora las **16 áreas** del modo profesional. Las dos usan la
  misma tarjeta de pregunta con caritas (😊 estable · 😐 en proceso · 😔 necesita apoyo). Los dos
  modos vienen del doc 04 del cliente.
- **Duplicados también en el autorregistro.** Al pasar sus datos, el ciudadano comprueba por
  teléfono si ya tiene expediente. Si existe, ve un aviso de **mínima revelación** y no se crea
  nada.
- **Consentimiento asistido:** lo marca el conector, como hoy. Que la persona lo confirme por un
  enlace queda **pendiente legal** (ver Abierto).
- **Lo propio de cada rol se queda en su rol.** «¿Quién te acompaña?» solo para el ciudadano;
  recursos sugeridos y nota interna solo para el conector.

## Pasos

| # | Paso | Ciudadano | Conector |
|---|---|---|---|
| 0 | ¿Ya tiene expediente? | — | Busca por teléfono o documento (como hoy, plan 02 K6) |
| 1 | Permisos | ● | ● + «Cancelar» (termina sin registrar nada) |
| 2 | Datos | ● + comprobación de duplicado por teléfono | ● (el teléfono llega de la búsqueda) |
| 3 | Mapa de Vida | 8 preguntas, una por pantalla | 16 áreas, en 4 pantallas (una por bloque) |
| 4 | Cierre | «¿Quién te acompaña?» + plazo de llamada | Recursos sugeridos + nota interna |
| — | Al terminar | Su expediente (`#/inicio`) | «Expediente creado» (`#/listo/:id`) |

Pantallas por rol: ciudadano 11 (permisos, datos, 8 preguntas, quién te acompaña); conector 8
(búsqueda, permisos, datos, 4 bloques, recursos).

### Paso 2 · Datos: los mismos campos, en el mismo orden

| Campo | Obligatorio | Componente | Nota |
|---|---|---|---|
| Nombre · Apellidos | Sí | Texto, en dos columnas | |
| Teléfono | Sí | Texto `tel` | Es el canal principal y la clave de la comprobación de duplicado |
| Fecha de nacimiento | Sí | Fecha | |
| Código postal | Sí | Texto numérico, 5 dígitos | Ayudas: «En el mapa» (los dos roles) y «Mi ubicación» (solo ciudadano: usa la ubicación del teléfono, que en la entrevista sería la del conector) |
| Municipio | Sí | Texto | Se rellena al elegir zona |
| Email | Sí | Texto `email` | Igual que hoy (ver Abierto) |
| ¿Documento nacional? | Sí | Segmentado: Sí · En trámite · No | |
| Número de documento | No | Texto | Hoy solo lo pide el conector. «No es necesario para empezar» |
| Canal preferido | Sí | Fichas con ícono: WhatsApp · Teléfono · Email | |
| Idiomas | Sí | Chips, **varios** | Hoy el conector elige uno solo |

Sin dirección exacta, en los dos roles.

### Paso 1 · Permisos

Los cuatro de `CAT.consentimientos`, con la misma etiqueta corta en los dos roles («Política de
privacidad», «Tratar mis datos», «Compartir mi itinerario», «Recibir comunicados»), su marca
Necesario u Opcional y su ayuda. Los dos obligatorios bloquean: sin ellos no se crea expediente.

## Textos por rol

| Dónde | Ciudadano | Conector |
|---|---|---|
| Título, paso 1 | Tus permisos | Sus permisos |
| Ayuda, paso 1 | Puedes retirar tu consentimiento cuando quieras. Cada vez que alguien vea tus datos, queda registrado. | Léelos con la persona y marca lo que autoriza. Sin los dos necesarios no se crea el expediente. |
| Título, paso 2 | Sobre ti | Sobre la persona |
| Documento | ¿Tienes documento nacional? | ¿Tiene documento nacional? |
| Código postal | No pedimos tu dirección exacta. | No se pide la dirección exacta. |
| Canal | ¿Cómo te contactamos? | ¿Cómo prefiere que la contacten? |
| Idiomas | Idiomas que hablas | Idiomas que habla |
| Eyebrow, paso 3 | ¿Cómo estás hoy? · {sistema} | Mapa de Vida · {bloque} |
| Instrucción, paso 3 | — | Lee la pregunta y marca la respuesta de la persona. |
| Falta una respuesta | Elige la respuesta que más se parece a tu situación. | Falta marcar: {áreas}. |
| Falta un permiso | Faltan los permisos necesarios. Sin ellos no podemos crear tu expediente. | Faltan los consentimientos necesarios. Sin ellos no se crea el expediente. |
| Duplicado | Ya hay un expediente con este teléfono. Tu entidad te contactará. | Ya existe · no se duplica (con «Le atiende» y conector, como hoy) |
| Botón final | Crear mi expediente | Asignar itinerario |
| Primera pantalla, salir | Atrás → inicio | Cerrar → Mis personas |

Las preguntas del Mapa (`CAT.autoevaluacion`, `CAT.dimensiones`) y los permisos no cambian de
voz.

## Datos

Sin campos nuevos en `personas`. El borrador sigue siendo `D = nuevo(tipo)` con `tipo` `"yo"` o
`"con"`:

```js
D = { tipo, consent, datos, auto /* solo yo */, mapa /* solo con */, entidad, recursos, notas, … }
```

- Ciudadano: `D.auto` (8 respuestas) → `BC_DERIVAR` → 7 áreas; `mapaTipo: "corto"`.
- Conector: `D.mapa` (16 áreas, 2 opcionales: `cuidados` y `autonomia`); `mapaTipo: "completo"`.
- `idioma` se guarda como texto «A, B» en los dos roles (`crearPersona` ya une la lista).

## Reglas

- **Un expediente por teléfono.** Antes de crear, se compara el teléfono sin espacios con los de
  `S.personas` (la misma comparación que la búsqueda del conector).
- **Mínima revelación al ciudadano.** Si el teléfono ya existe, el aviso no muestra nombre,
  número de expediente, entidad ni conector. Ofrece corregir el teléfono o salir; el botón
  «Continuar» no avanza.
- **El intento bloqueado se anota** (MODELO, «Registro único y no duplicidad»): en la demo, como
  acceso «Sistema · intento de autorregistro con su teléfono» en la persona existente, visible en
  su Privacidad.
- **El conector ve más que el ciudadano** al encontrar un duplicado (le atiende, conector),
  porque es gestor; si es de otra entidad, se mantiene «Su caso lo lleva otra entidad».
- Si el conector cambia el teléfono en el paso 2 por uno que ya existe, se aplica la misma
  comprobación y vuelve al resultado de la búsqueda.
- **Consentimiento asistido:** lo marca el conector; el acceso de alta queda a su nombre («Alta y
  Mapa de Vida»), como hoy.
- **Opcionales del Mapa:** el conector puede dejar sin marcar `cuidados` y `autonomia`; el
  ciudadano responde las 8.
- **Mapa corto:** el autorregistro sigue creando `mapaTipo: "corto"`; las 9 áreas que faltan se
  completan con el conector (ver Abierto).
- La regla de «no se pide lo mismo en dos lugares» del cierre del conector no cambia.
- Ninguna validación cambia: los obligatorios y formatos son los de hoy (`REQ`, `validarDatos`).

## Pantallas afectadas

| Rol | Cambio |
|---|---|
| Ciudadano | Registro: campo de número de documento, comprobación de duplicado, misma plantilla que el conector |
| Conector | Registrar persona: datos como el ciudadano (fichas, chips, idiomas varios), Mapa con caritas en 4 bloques, misma plantilla y cabecera |
| Entidad | Nada en pantalla; recibe personas con idiomas varios desde los dos orígenes |

## Fuera de alcance

- Que la persona confirme el consentimiento asistido por un enlace (pendiente legal).
- Que el ciudadano compruebe duplicados por documento (solo teléfono).
- Agregar familiares dentro del registro: sigue siendo después (spec [03](03-familia.md)).
- Un flujo para que el conector complete el Mapa corto de un autorregistro (ver Abierto).

## Criterios de aceptación

1. Los dos registros pintan el paso 2 con los mismos campos, en el mismo orden y con los mismos
   componentes (tabla «Paso 2»); solo cambian los textos de «Textos por rol».
2. El conector puede elegir **varios idiomas** y escribir un número de documento opcional; la
   ficha muestra «A, B».
3. El ciudadano ve un campo opcional de número de documento.
4. Las 8 preguntas del ciudadano y las 16 áreas del conector usan la misma tarjeta con caritas;
   el conector las ve en 4 pantallas de 4.
5. Un ciudadano que escribe un teléfono que ya existe (p. ej. `+34 688 219 774`) ve «Ya hay un
   expediente con este teléfono. Tu entidad te contactará.», sin ningún dato de la otra persona,
   y no puede avanzar. No se crea persona.
6. Ese intento aparece en la Privacidad de la persona existente.
7. En el conector, «Cancelar» del paso 1 termina sin registrar nada; en el ciudadano no hay
   «Cancelar».
8. El ciudadano no ve recursos ni nota interna; el conector no ve «¿Quién te acompaña?».
9. Las rutas `#/registro/1..4(/n)`, `#/registrar/1..8` y `#/listo/:id` siguen funcionando.
10. Los casos guiados 1.1 y 2.1 y la escena «Cuenta cómo está hoy» corren de punta a punta; el
    2.1 ya no se detiene en `#btn-registrar`.
11. A 390 px, ningún paso tiene desplazamiento horizontal y el botón principal queda visible.
12. `grep -rni "avivla\|AV-" app demo tour index.html` no encuentra nada nuevo.

## Supuestos

- «Tu entidad te contactará»: la entidad que atiende el expediente existente. En la demo no se
  envía nada; el aviso queda en el registro de accesos.
- El conector ve el Mapa por bloques y no una pregunta por pantalla porque en la entrevista se
  avanza más rápido y se conservan los 4 bloques del Mapa.

## Abierto

- **Pendiente legal:** confirmación del consentimiento asistido por la persona, por enlace.
- **Completar el Mapa corto:** la app promete «En la entrevista con tu conector completas las
  áreas que faltan», pero no existe la pantalla. Este mismo paso 3, abierto por el conector con
  las 7 áreas ya cargadas, lo resolvería; queda por decidir si entra en esta spec.
- **Email obligatorio:** hoy lo es en los dos roles; para personas sin correo puede ser una
  barrera.
- **Anotar el intento bloqueado en la Privacidad** de la persona existente es transparente, pero
  también le revela que alguien usó su teléfono. Validar con el cliente.
