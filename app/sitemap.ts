import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

// Genera /sitemap.xml: la lista de páginas que Google debe conocer.
// Si algún día agregas páginas (por ejemplo /dia-de-las-madres), súmalas aquí.
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
    ];
}