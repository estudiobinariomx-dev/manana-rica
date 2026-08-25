import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mañana Rica | Desayunos sorpresa en Morelia",
  description: "Desayunos sorpresa frescos y personalizables con entrega en Morelia, Michoacán.",
  openGraph: {
    title: "Mañana Rica | Sorpresas que despiertan",
    description: "Elige, personaliza y agenda un desayuno sorpresa en Morelia.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Mañana Rica, desayunos sorpresa" }],
  },
  twitter: { card: "summary_large_image", title: "Mañana Rica | Sorpresas que despiertan", description: "Desayunos sorpresa personalizados en Morelia.", images: ["/og.png"] },
  icons: { icon: "/manana-rica-logo.png", shortcut: "/manana-rica-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body className="antialiased">{children}</body></html>;
}
