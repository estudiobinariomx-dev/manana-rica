# Historial de cambios

Todos los cambios importantes de [mananarica.com](https://mananarica.com) se anotan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el sitio usa
[versionado semántico](https://semver.org/lang/es/): `MAYOR.MENOR.PARCHE`.

- **PARCHE** (1.0.**1**): correcciones de errores, precios o textos.
- **MENOR** (1.**1**.0): funciones o secciones nuevas que no rompen nada.
- **MAYOR** (**2**.0.0): rediseños o cambios grandes.

Fotos y precios nuevos van como PARCHE, salvo que agreguen un paquete nuevo (MENOR).

## [Sin publicar]

<!-- Anota aquí los cambios mientras trabajas; al publicar, renombra esta sección con la versión y la fecha. -->

## [1.0.0] - 2026-11-04

Primera versión oficial del sitio en producción.

### Agregado
- Campo opcional **Ubicación en Google Maps** en el paso de entrega, con instrucciones para
  copiar el enlace. Se incluye en el mensaje de WhatsApp y en el resumen del pedido.
- Versión del sitio visible en el pie de página.
- Este historial de cambios.

### Cambiado
- Fotos de los paquetes actualizadas y nuevas imágenes.

### Corregido
- Los emojis del mensaje de WhatsApp llegaban como "�" en WhatsApp Web y de escritorio.
  Ahora el enlace usa `api.whatsapp.com` en lugar de `wa.me`.

## Antes de 1.0.0

Resumen del trabajo previo, tomado del historial de Git.

### Octubre 2026
- Catálogo actualizado con paquetes nuevos e imágenes sin precios.
- Nuevo horario de atención y nuevo formato del mensaje de WhatsApp.
- Temas de temporada automáticos (amor, niños, mamá, papá, patrias, Halloween, Día de Muertos,
  Navidad), modo claro/oscuro y tipografías Fraunces + Nunito Sans.
- SEO: dominio mananarica.com, sitemap, robots, metadatos, favicon, datos estructurados de
  negocio local y enlaces a redes sociales.
- Corrección de la carga de fuentes en producción.
- Ajustes de precios y contenido de los paquetes.

### Septiembre 2026
- Imágenes optimizadas en WebP responsivo (480/900) con carga diferida.
- Sección de ocasiones y personalización del desayuno.
- Paquetes, fotos y diseño de la página actualizados.
- Enlace a Estudio Binario Mx en el pie de página.

### Agosto 2026
- Primera versión de la página.

[Sin publicar]: https://github.com/estudiobinariomx-dev/manana-rica/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/estudiobinariomx-dev/manana-rica/releases/tag/v1.0.0
