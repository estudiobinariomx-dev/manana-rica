import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

// Genera /robots.txt: permite que los buscadores lean todo el sitio
// y les indica dónde está el sitemap.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}