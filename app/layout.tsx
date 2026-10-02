import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { themeInitScript } from "./theme/seasons";

// Dominio público del sitio. "mañanarica.com" se escribe así en formato punycode.
// Cámbialo si el sitio vive en otra dirección: de aquí salen las URLs absolutas
// que usan WhatsApp, Facebook e Instagram para mostrar la vista previa del enlace.
const SITE_URL = "https://xn--maanarica-m6a.com";

const title = "Mañana Rica | Desayunos sorpresa en Morelia";
const description =
  "Desayunos sorpresa frescos y personalizables con entrega en Morelia, Michoacán.";
const shareTitle = "Mañana Rica | Sorpresas que despiertan";
const shareDescription = "Elige, personaliza y agenda un desayuno sorpresa en Morelia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: "/",
    siteName: "Mañana Rica",
    locale: "es_MX",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Mañana Rica, desayunos sorpresa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // Evita que iOS convierta precios o números en enlaces de llamada
  formatDetection: { telephone: false },
};

// Color de la barra del navegador en celular (el vino de la marca)
export const viewport: Viewport = {
  themeColor: "#780d0b",
};

// Datos estructurados para que Google entienda que es un negocio local en Morelia
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Mañana Rica",
  description,
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  logo: `${SITE_URL}/icon.png`,
  telephone: "+52 33 3458 3049",
  priceRange: "$359 – $599 MXN",
  servesCuisine: "Desayunos",
  areaServed: { "@type": "City", name: "Morelia" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Morelia",
    addressRegion: "Michoacán",
    addressCountry: "MX",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // suppressHydrationWarning: el script de abajo agrega data-season y data-mode
    // a <html> antes de que React cargue; sin esto React avisaría de la diferencia.
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        {/* Elige temporada y modo claro/oscuro antes de pintar, para que no parpadee */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
        />
      </body>
    </html>
  );
}