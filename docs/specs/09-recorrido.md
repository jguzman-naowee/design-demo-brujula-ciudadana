# 09 · Recorrido

## Objetivo

Que el recorrido cuente la plataforma como quedó tras las cinco olas, empezando por la landing y
en menos de tres minutos.

## Guion: 20 escenas, 2 min 51 s (showroom, 20-nov-2026)

El recorrido cuenta el proyecto, no la interfaz: los conceptos van con **gráficos animados**
(tipo `grafico`) y las vistas reales aparecen donde hay que ver que la app existe y funciona.

| Acto | Escenas (G = gráfico, V = vista real, H = portada) |
|---|---|
| 1 · Por qué | H Inicio · G La ayuda está repartida · G Una sola puerta · V Mapa (`mapa.html`) · G Las cuatro formas en el tiempo |
| 2 · Ciudadano | G Permisos y quién vio sus datos · V Cuenta cómo está hoy · G Mapa de Vida |
| 3 · Conector | V Ficha · G Plazas con la familia y «no se pide dos veces» |
| 4 · Entidad | V Resumen · V Publicar por catálogo · G Ficha mínima · G Verificar a la familia |
| 5 · El día del recurso | V Agenda · G Pasar lista y uso · G Aviso a quienes van |
| 6 · La red | G Agregados sin datos personales · G Una entidad nueva suma al mapa |
| 7 · Cierre | H «La ayuda de tu ciudad, en un solo lugar» · Probar la demo |

## Cómo está hecho

- `tour/graficos.js`: una función por gráfico que devuelve el HTML de un lienzo de 780×540.
  `tour/graficos.css`: piezas y movimientos. El motor lo escala como al teléfono (`--gk`).
- Escena: `{ tipo: "grafico", grafico: "<id>", rol, titulo, texto, duracion }`.
- Todo se anima con CSS: la pausa del recorrido congela, volver a una escena la repite, y con
  «reducir movimiento» se ve el estado final.
- Solo reglas ya decididas: consumo y duplicidad por persona, protegidos fuera de envíos
  masivos, «No vino» no da de baja, la red sin datos personales.

## Reglas

- Cada escena de vista carga con la semilla; el recorrido pisa lo registrado.
- «Pasar lista» usa el Banco de alimentos (`r3`), que ocurre de lunes a viernes: en fin de semana
  la escena abre en la última fecha.
