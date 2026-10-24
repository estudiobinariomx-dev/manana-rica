# Mañana Rica

Sitio web de **Mañana Rica**, desayunos sorpresa a domicilio en Morelia, Michoacán.

🌐 **<https://mananarica.com>**

El cliente elige un paquete, lo personaliza (extras, ocasión, dedicatoria),
agenda la entrega y envía su solicitud por WhatsApp con el pedido ya armado.
Nosotros confirmamos disponibilidad, cotizamos el envío y el pedido queda
confirmado al recibir el 50% de anticipo.

> El sitio no cobra ni guarda pedidos: todo llega por WhatsApp.

## Tecnologías

- React + TypeScript (API de Next.js App Router con **Vinext** sobre **Vite**)
- Tailwind CSS 4
- Tipografías Fraunces (títulos) y Nunito Sans (texto), servidas desde el propio sitio
- Desplegado en **Cloudflare Workers**, conectado a este repositorio

## Requisitos

- Node.js 22.13 o superior
- npm

## Instalación

```bash
git clone https://github.com/estudiobinariomx-dev/manana-rica.git
cd manana-rica
npm install
npm run dev
```

Abre en el navegador la dirección que muestre la terminal.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor local para desarrollar |
| `npm run build` | Compila para producción |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Compila y prueba el HTML generado |

## Publicar cambios

Cada `push` a `main` se publica solo en Cloudflare. Para trabajar algo grande
sin afectar el sitio, usa una rama:

```bash
git switch -c mi-cambio
# ...cambios...
git push -u origin mi-cambio
```

Cloudflare genera una URL de vista previa para cada rama, para revisarla
(incluso en el celular) antes de fusionarla a `main`.

## Archivos principales

| Archivo | Qué contiene |
| --- | --- |
| `app/page.tsx` | Contenido de la página: paquetes, extras, ocasiones, reglas, preguntas frecuentes, personalizador y mensaje de WhatsApp |
| `app/site.ts` | Dominio y links de redes sociales |
| `app/layout.tsx` | Título, descripción, vista previa para redes, datos de negocio para Google y fuentes |
| `app/globals.css` | Colores, modo oscuro, temporadas y estilos generales |
| `app/theme/seasons.ts` | Fechas y textos de cada temporada |
| `app/theme/theme-client.tsx` | Botón de modo claro/oscuro y decoraciones de temporada |
| `app/sitemap.ts` / `app/robots.ts` | Generan `/sitemap.xml` y `/robots.txt` para buscadores |
| `public/img/` | Fotografías optimizadas (WebP) |
| `scripts/optimizar-imagenes.mjs` | Convierte fotos nuevas a WebP |

## Datos del negocio

Casi todo lo que cambia seguido está en constantes al inicio de `app/page.tsx`:

| Constante | Qué es |
| --- | --- |
| `packages` | Paquetes: nombre, precio, imagen, descripción y lo que incluye |
| `extras` | Complementos. Los del mismo `group` (pastel, flores) se excluyen entre sí |
| `whatsappNumber` | Número de WhatsApp con código de país, sin espacios (ej. `523334583049`). Vacío oculta los botones |
| `ADVANCE_NOTICE` | Anticipación con que se piden los desayunos |
| `BUSINESS_HOURS` | Horario de atención (se muestra en el footer) |
| `scheduleOptions` | Horarios de entrega que puede elegir el cliente |
| `orderRules` | Condiciones del pedido |
| `faqs` | Preguntas frecuentes |
| `occasions` | Tarjetas del carrusel de ocasiones |
| `occasionOptions` | Ocasiones que se eligen en el personalizador |

Las redes sociales y el dominio están en `app/site.ts`:

```ts
export const SITE_URL = "https://mananarica.com";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/manana_rica",
  facebook: "https://www.facebook.com/profile.php?id=61594480418377",
  tiktok: "https://www.tiktok.com/@manana_rica",
};
```

Si una red se deja vacía (`""`), su ícono no aparece en el footer.

## Imágenes

Las fotos viven en `public/img/` en formato WebP y en dos tamaños (480 px para
celular y 900 px para pantallas grandes). **No subas PNG o JPG pesados directo
a `public/`**: primero optimízalos con el script.

```bash
node scripts/optimizar-imagenes.mjs ~/Descargas/mi-nuevo-paquete.png
```

Eso crea `public/img/mi-nuevo-paquete-480.webp` y
`public/img/mi-nuevo-paquete-900.webp`. En el código usa siempre la de 900; la
de 480 se carga sola en celulares:

```ts
image: "/img/mi-nuevo-paquete-900.webp",
```

Las dos versiones deben existir con esos sufijos exactos (`-480` y `-900`).
El script acepta varias fotos a la vez y limpia el nombre (sin acentos, en
minúsculas y con guiones).

## Colores y modo oscuro

La página no usa colores escritos a mano: usa nombres como `bg-brand`,
`text-heading` o `border-line`, que toman su valor de `app/globals.css` según
el modo (claro u oscuro) y la temporada.

Para cambiar un color, edita su variable en `:root` (modo claro) o en
`:root[data-mode="dark"]` (modo oscuro):

| Variable | Uso | Valor (claro) |
| --- | --- | --- |
| `--c-brand` | Color de marca (botones, header) | `#780d0b` |
| `--c-brand-deep` | Vino oscuro | `#64100e` |
| `--c-bg` | Fondo | `#f8f2e9` |
| `--c-accent` | Naranja de acento | `#d96a28` |
| `--c-gold` | Amarillo dorado | `#f2c44c` |

El botón de luna/sol del header cambia el modo. La primera visita respeta el
modo del dispositivo y después se recuerda la elección del visitante.

## Temporadas

El sitio cambia solo de colores, decoraciones y algunos textos según la fecha
(hora de Morelia):

| Temporada | Fechas |
| --- | --- |
| `amor` | 1 al 14 de febrero |
| `ninos` | 20 al 30 de abril |
| `mama` | 1 al 10 de mayo |
| `papa` | 1 de junio al Día del Padre (se calcula cada año) |
| `patrias` | 1 al 16 de septiembre |
| `halloween` | 1 al 27 de octubre |
| `muertos` | 28 de octubre al 3 de noviembre |
| `navidad` | 1 de diciembre al 6 de enero |

Fuera de esas fechas se usa el tema `normal`.

- **Fechas:** en `SEASON_DATES`, dentro de `app/theme/seasons.ts`, en formato
  `MMDD` (`1001` = 1 de octubre).
- **Textos** (etiqueta del hero, círculo amarillo, franja deslizante y ocasión
  destacada): en `seasonContent`, en el mismo archivo.
- **Colores:** en los bloques `:root[data-season="..."]` de `app/globals.css`.

Para ver una temporada sin esperar su fecha, agrega `?tema=` a la URL:

```
https://mananarica.com/?tema=navidad
```

## Pedido por WhatsApp

Al terminar el personalizador, el sitio arma un mensaje con el paquete, los
extras con su precio, la entrega, los datos de contacto, la dedicatoria y el
resumen (subtotal y anticipo del 50%). El cliente lo envía desde su WhatsApp.

- El mensaje se arma en `whatsappMessage`, dentro de `app/page.tsx`.
- El envío **no** está incluido en el total: se cotiza por WhatsApp.
- Los teléfonos se validan a 10 dígitos y se formatean solos
  (`443 123 4567`).

WhatsApp siempre pide que el cliente presione **Enviar**; una página no puede
mandar el mensaje por él.

## SEO

- Título, descripción y vista previa para redes: `app/layout.tsx`.
- Datos de negocio local para Google (incluye las redes sociales): bloque
  `localBusiness` en `app/layout.tsx`.
- `https://mananarica.com/sitemap.xml` y `https://mananarica.com/robots.txt` se
  generan solos desde `app/sitemap.ts` y `app/robots.ts`.
- El sitio está dado de alta en Google Search Console.

## Dominios

- **`mananarica.com`** es el dominio principal.
- `www.mananarica.com` y `mañanarica.com` redirigen a él con reglas 301 en
  Cloudflare.
- La URL de producción de `workers.dev` está apagada para que Google no
  indexe el sitio en dos direcciones; las vistas previas por rama siguen
  activas.

Si se cambia el dominio principal, actualiza `SITE_URL` en `app/site.ts`.

## VS Code

Para que el editor entienda las reglas de Tailwind en los `.css` (como
`@custom-variant` o `@theme`), instala la extensión **Tailwind CSS
IntelliSense** y crea `.vscode/settings.json`:

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

Hecho por [Estudio Binario Mx](https://estudiobinariomx.com/) en Morelia, Mich.
