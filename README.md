# Mañana Rica — tienda demo

Código completo de la demo de desayunos sorpresa de **Mañana Rica**.

Incluye catálogo, personalización de paquetes, extras, dedicatoria, datos de
entrega, cálculo del total, selección de pago simulada y confirmación con folio.

## Tecnologías

- HTML generado con React/TSX
- Tailwind CSS 4
- JavaScript con TypeScript
- Next.js/Vinext
- Vite

## Requisitos

- Node.js 22.13 o superior
- npm

## Instalación

1. Descomprime el archivo ZIP.
2. Abre una terminal dentro de la carpeta `MananaRica-Codigo`.
3. Instala las dependencias:

```bash
npm install
```

4. Inicia el proyecto:

```bash
npm run dev
```

5. Abre en el navegador la dirección que muestre la terminal.

## Archivos principales

| Archivo | Qué modifica |
| --- | --- |
| `app/page.tsx` | Contenido, paquetes, precios y funcionamiento de la compra |
| `app/globals.css` | Estilos generales, tipografías y animaciones |
| `app/layout.tsx` | Título, descripción, favicon y datos para compartir |
| `public/` | Logotipo, fotografías de productos e imagen social |
| `package.json` | Dependencias y comandos del proyecto |

## Cambiar paquetes y precios

En `app/page.tsx` busca el arreglo:

```ts
const packages = [
```

Cada producto contiene nombre, ocasión, precio, imagen, descripción y lista de
elementos incluidos.

Los complementos se encuentran en:

```ts
const extras = [
```

## Cambiar colores

La paleta principal aparece en las clases de Tailwind dentro de
`app/page.tsx` y en `app/globals.css`:

- Vino: `#780d0b`
- Vino oscuro: `#64100e`
- Crema: `#f8f2e9`
- Naranja: `#d96a28`
- Amarillo: `#f2c44c`

## Cambiar imágenes

Coloca las nuevas imágenes dentro de `public/` y actualiza su ruta en el arreglo
`packages`. Por ejemplo:

```ts
image: "/mi-nuevo-paquete.png"
```

## Datos que debes reemplazar

La versión incluida es una demostración. Antes de usarla como tienda real,
reemplaza:

- El número ficticio `443 123 4567` en los enlaces de WhatsApp.
- Precios, zonas y costos de envío.
- Horarios y políticas de entrega.
- Textos, nombres y contenido de los paquetes.
- El procesador de pago simulado por una integración real.
- La confirmación local por almacenamiento real de pedidos.

## Compilar para producción

```bash
npm run build
```

El proyecto no guarda pedidos ni realiza cobros reales. Es una demo funcional
del flujo de compra y requiere backend/base de datos y pasarela de pago para
operar como comercio electrónico.
