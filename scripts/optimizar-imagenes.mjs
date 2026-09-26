// Optimiza fotos nuevas para la página.
// Uso: node scripts/optimizar-imagenes.mjs ruta/a/foto.png [otra.jpg ...]
// Crea en public/img/ dos versiones WebP: <nombre>-480.webp y <nombre>-900.webp.
// En el código usa la de 900, por ejemplo: image: "/img/mi-foto-900.webp"
import sharp from "sharp";
import path from "node:path";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.log("Uso: node scripts/optimizar-imagenes.mjs foto1.png [foto2.jpg ...]");
  process.exit(1);
}

for (const file of files) {
  const name = path
    .basename(file, path.extname(file))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-");

  for (const width of [480, 900]) {
    const out = `public/img/${name}-${width}.webp`;
    const info = await sharp(file)
      .rotate() // respeta la orientación de fotos de celular
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(out);
    console.log(`${out}  ${Math.round(info.size / 1024)} KB`);
  }
}
