# Cómo aplicar la optimización de imágenes

Desde la raíz del repo `manana-rica`:

```bash
git checkout -b optimiza-imagenes

# 1. Borra las imágenes pesadas que ya no se usan
git rm public/*.png public/frutaconyoguth.jpeg

# 2. Copia el contenido de este zip encima del proyecto (reemplaza archivos)

# 3. Instala sharp (lo usa el script para optimizar fotos nuevas)
npm install

# 4. Revisa y sube
npm run build
git add -A
git commit -m "Optimiza imágenes: WebP responsivo y lazy loading"
git push -u origin optimiza-imagenes
```
