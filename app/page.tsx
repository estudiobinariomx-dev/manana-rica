"use client";

import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SOCIAL_LINKS } from "./site";
import { seasonContent } from "./theme/seasons";
import { ModeToggle, SeasonFloaters, SeasonGarland, useSeason } from "./theme/theme-client";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Package = {
  id: number;
  name: string;
  occasion: string;
  price: number;
  image: string;
  description: string;
  includes: string[];
  badge?: string;
};

type Extra = {
  id: string;
  name: string;
  price: number;
  icon: string;
  group?: "cake" | "flowers";
};

type DeliveryZone = "" | "centro" | "extendida";

/* ------------------------------------------------------------------ */
/* Contenido editable                                                  */
/* ------------------------------------------------------------------ */

const packages: Package[] = [
  {
    id: 1,
    name: "Rayito de Sol",
    occasion: "Un lindo detalle",
    price: 359,
    image: "/img/rayito_de_sol-900.webp",
    description: "Pequeño en precio, grande en intención.",
    includes: [
      "🥪 Sándwich de jamón y queso",
      "🧇 2 mini waffles",
      "🍯 Miel maple o mermelada",
      "🍓 Fruta fresca de temporada",
      "🍊 Jugo individual de naranja",
      "💌 Tarjeta personalizada de ocasión",
      "🎏 Banderín básico",
      "🍴 Cubiertos",
    ],
    badge: "Desde $359",
  },
  {
    id: 2,
    name: "Buenos días",
    occasion: "El más completo",
    price: 419,
    image: "/img/buenos_dias-900.webp",
    description: "Todo lo necesario para empezar sonriendo.",
    includes: [
      "🥐 Croissant de jamón y queso",
      "🧇 2 mini waffles",
      "🍯 Miel maple o mermelada",
      "🥣 Yogurt con fruta y granola",
      "🍪 2 galletas integrales",
      "🍊 Jugo de naranja",
      "☕ Café frío o leche de sabor",
      "💌 Tarjeta personalizada de ocasión",
      "🎏 Banderín básico",
      "🍴 Cubiertos",
    ],
    badge: "Más elegido",
  },
  {
    id: 3,
    name: "Pensé en ti",
    occasion: "Para celebrar",
    price: 489,
    image: "/img/pense_en_ti-900.webp",
    description: "Una sorpresa hecha especialmente para esa persona.",
    includes: [
      "🥐 Croissant de jamón y queso",
      "🧇 3 mini waffles",
      "🍓 Fruta para acompañar los waffles",
      "🍯 Miel maple o mermelada",
      "🥣 Yogurt con fruta y granola",
      "🍪 3 galletas integrales",
      "🍊 Jugo de naranja grande",
      "☕ Café frío o leche de sabor",
      "💌 Tarjeta personalizada de ocasión",
      "📷 Foto tipo polaroid",
      "🎏 Banderín básico",
      "🍴 Cubiertos",
    ],
    badge: "Favorito",
  },
  {
    id: 4,
    name: "Apapacho",
    occasion: "La gran sorpresa",
    price: 599, //
    image: "/img/apapacho-900.webp",
    description: "Desayuno, pastel y recuerdos en una sola charola.",
    includes: [
      "🥐 Croissant especial de pollo y queso",
      "🧇 3 mini waffles",
      "🍓 Fruta para acompañar los waffles",
      "🍯 Miel maple o mermelada",
      "🥣 Yogurt con fruta y granola",
      "🍪 3 galletas integrales",
      "🍊 Jugo de naranja grande",
      "🍫 Muffin de chocolate o mini pastel",
      "☕ Café frío o leche de sabor",
      "📷 3 fotos tipo polaroid",
      "💌 Tarjeta personalizada de ocasión",
      "🎏 Banderín personalizado",
      "🍴 Cubiertos",
    ],
    badge: "Especial",
  },
];

const extras: Extra[] = [
  { id: "photos", name: "Tira de 4 fotos", price: 49, icon: "▣" },
  { id: "cake-slice", name: "Rebanada de pastel", price: 69, icon: "◢", group: "cake" },
  { id: "mini-cake", name: "Mini pastel para 1–2 personas", price: 160, icon: "⌒", group: "cake" },
  { id: "sunflower", name: "Un girasol", price: 69, icon: "✹", group: "flowers" },
  { id: "gerberas", name: "Mini ramo de 2–3 gerberas", price: 69, icon: "✿", group: "flowers" },
];

// Número de WhatsApp con código de país, sin espacios ni signos. Ej. 521234567890.
// Si lo dejas vacío, los botones de WhatsApp se ocultan.
const whatsappNumber = "523334583049";

// Textos que se repiten en varias partes de la página.
// ⚠️ Revisa que coincidan con tus reglas reales (la regla 01 dice 48 h).
const ADVANCE_NOTICE = "24 h";
const BUSINESS_HOURS = "Lunes a sábado · 8:00–18:00";

const navLinks = [
  { href: "#paquetes", label: "PAQUETES" },
  { href: "#ocasiones", label: "OCASIONES" },
  { href: "#como-funciona", label: "CÓMO FUNCIONA" },
  { href: "#faq", label: "PREGUNTAS" },
] as const;

const processSteps = [
  {
    number: "01",
    title: "Elige",
    description:
      "Encuentra el desayuno que más se parece a esa persona y a la ocasión que quieres celebrar.",
  },
  {
    number: "02",
    title: "Personaliza tu desayuno",
    description:
      "Personaliza el mensaje, los sabores, las fotografías y todos los detalles especiales.",
  },
  {
    number: "03",
    title: "Agenda",
    description:
      "Selecciona la fecha, el horario y la zona de entrega. Nosotros preparamos la sorpresa.",
  },
] as const;

const PROCESS_STEP_INTERVAL = 4500;

const orderRules = [
  {
    number: "01",
    title: "Anticipación",
    description:
      "Realiza tu solicitud con al menos 48 horas de anticipación. Los pedidos urgentes están sujetos a disponibilidad.",
  },
  {
    number: "02",
    title: "Anticipo del 50%",
    description:
      "El pedido queda confirmado al recibir el 50% del total y validar el comprobante de pago.",
  },
  {
    number: "03",
    title: "Confirmación",
    description:
      "Enviar la solicitud no aparta la fecha. Primero revisaremos disponibilidad y te responderemos por WhatsApp.",
  },
  {
    number: "04",
    title: "Entrega",
    description:
      "El envío se cobra por separado según la zona. Los horarios se manejan mediante ventanas aproximadas de entrega.",
  },
  {
    number: "05",
    title: "Disponibilidad",
    description:
      "La fruta, las flores y algunos detalles pueden variar según la temporada. Te avisaremos cualquier cambio importante.",
  },
  {
    number: "06",
    title: "Alergias",
    description:
      "Informa cualquier alergia antes de confirmar. Trabajamos en un espacio donde puede haber leche, huevo, gluten y nueces.",
  },
  {
    number: "07",
    title: "Cambios",
    description:
      "Solicita cambios o cancelaciones con al menos 24 horas de anticipación. Revisaremos los materiales ya preparados.",
  },
  {
    number: "08",
    title: "Fotografías",
    description:
      "Las fotografías se usan únicamente para personalizar el pedido y no se publican sin autorización.",
  },
] as const;

const occasions = [
  { name: "Cumpleaños", phrase: "Haz que su día comience todavía más especial.", image: "/img/ocasion-cumpleanos-900.webp", accent: "#d96a28" },
  { name: "Amor y aniversario", phrase: "Detalles para decir todo eso que a veces no cabe en palabras.", image: "/img/ocasion-amor-900.webp", accent: "#a92c35" },
  { name: "Día de las Madres", phrase: "Una mañana bonita para quien siempre está para ti.", image: "/img/ocasion-mama-900.webp", accent: "#c75d7a" },
  { name: "Día del Padre", phrase: "Una forma diferente de decir: gracias, papá.", image: "/img/ocasion-papa-900.webp", accent: "#395875" },
  { name: "Día del Maestro", phrase: "Un detalle para agradecer a quien deja huella.", image: "/img/ocasion-maestro-900.webp", accent: "#8b5d42" },
  { name: "Día del Estudiante", phrase: "Para celebrar su esfuerzo, sus sueños y todo lo que viene.", image: "/img/ocasion-estudiante-900.webp", accent: "#ca7848" },
  { name: "Día de Enfermería", phrase: "Un pequeño gracias para quienes cuidan de los demás.", image: "/img/ocasion-enfermeria-900.webp", accent: "#5386a6" },
  { name: "Día del Arquitecto", phrase: "Para quienes convierten ideas en espacios e historias.", image: "/img/ocasion-arquitecto-900.webp", accent: "#79a8c2" },
] as const;

// Opciones del paso 1 del personalizador
const occasionOptions = [
  { name: "Cumpleaños", description: "Para celebrar su día" },
  { name: "Amor y aniversario", description: "Pareja y enamorados" },
  { name: "Agradecimiento", description: "Para decir gracias" },
  { name: "Mejórate pronto", description: "Un detalle que acompaña" },
  { name: "Familia", description: "Mamá, papá y abuelos" },
  { name: "Logros y graduación", description: "Graduación, ascenso o meta" },
  { name: "Fechas especiales", description: "Niñez, estudiantes, docentes…" },
  { name: "Porque sí u otra ocasión", description: "Cuéntanos el motivo" },
] as const;

const scheduleOptions = ["8:00 – 9:30", "9:30 – 11:00", "11:00 – 12:30"] as const;

const deliveryZoneLabels: Record<Exclude<DeliveryZone, "">, string> = {
  centro: "Dentro de Morelia",
  extendida: "Alrededores de Morelia",
};

const faqs = [
  [
    "¿Con cuánto tiempo debo pedir?",
    `Recomendamos al menos ${ADVANCE_NOTICE} de anticipación. Para pedidos del mismo día, consulta disponibilidad por WhatsApp.`,
  ],
  [
    "¿Entregan en todo Morelia?",
    "Sí, cubrimos Morelia y zonas cercanas. El costo de envío se cotiza según la dirección.",
  ],
  [
    "¿Puedo cambiar alimentos?",
    "Claro. Puedes indicarnos alergias o preferencias; confirmaremos contigo cualquier ajuste especial.",
  ],
] as const;

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

// Imágenes optimizadas en /public/img: cada una existe en 480 px y 900 px.
// Recibe la ruta de la versión grande (-900.webp) y arma el srcSet.
const smallVersion = (src: string) => src.replace("-900.webp", "-480.webp");
const srcSetFor = (src: string) => `${smallVersion(src)} 480w, ${src} 900w`;

const moneyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});
const money = (value: number) => moneyFormatter.format(value);

const longDateFormatter = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const todayInMorelia = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const whatsappLink = (text: string) =>
  whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
    : null;

const scrollToPackages = () =>
  document.getElementById("paquetes")?.scrollIntoView({ behavior: "smooth" });

/* ------------------------------------------------------------------ */
/* Íconos                                                              */
/* ------------------------------------------------------------------ */

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

/* Íconos de redes (24×24, usan currentColor) */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
      <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3.1c-1.4.1-2.7-.3-3.9-1.1v6.1c0 3.3-2.4 5.6-5.6 5.6S5.4 18.1 5.4 15c0-3.3 2.7-5.8 6.3-5.4v3.2c-1.6-.4-3.1.6-3.1 2.2 0 1.3 1 2.3 2.3 2.3 1.4 0 2.4-.9 2.4-2.8V3h3.3Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3a8.5 8.5 0 1 1 15.6-4.5Z" />
      <path
        fill="currentColor"
        stroke="none"
        d="M9.3 7.6c.2-.3.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2.1.4 0 .6l-.5.6c-.1.2-.2.3 0 .6.5.9 1.6 2 2.6 2.5.3.1.5.1.6 0l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .4-.1 1.2-.6 1.6-.5.5-1.4.8-2.2.6-1.1-.2-2.7-.9-4-2.2-1.4-1.4-2.2-3-2.4-4-.2-.9.2-1.6.6-2Z"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function Home() {
  // Personalizador
  const [selected, setSelected] = useState<Package>(packages[0]!);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [occasion, setOccasion] = useState("Cumpleaños");

  // Datos del pedido
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [phone, setPhone] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [message, setMessage] = useState("¡Que hoy te pasen cosas bonitas!");
  const [notes, setNotes] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("");
  const [deliveryPreference, setDeliveryPreference] = useState("surprise");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [schedule, setSchedule] = useState<string>(scheduleOptions[0]);

  // Interfaz
  const [revealedPackage, setRevealedPackage] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  // Temporada activa (Halloween, Día de Muertos, Navidad o normal)
  const season = useSeason();
  const seasonText = seasonContent[season];
  const marqueeItems = seasonText.marquee;

  // En temporadas como Día de las Madres, su ocasión aparece primero en el carrusel
  const orderedOccasions = useMemo(() => {
    const featured = seasonText.featuredOccasion;
    if (!featured) return occasions;
    return [
      ...occasions.filter((item) => item.name === featured),
      ...occasions.filter((item) => item.name !== featured),
    ];
  }, [seasonText.featuredOccasion]);

  // Foto del banner "pensé en ti": en temporadas con ocasión destacada (Madres, Padre,
  // Amor y amistad) usa la foto de esa ocasión; el resto del año, la foto del producto.
  const bannerPhoto = useMemo(() => {
    const featured = occasions.find((item) => item.name === seasonText.featuredOccasion);
    if (featured) {
      return {
        src: featured.image,
        srcSet: srcSetFor(featured.image),
        alt: `Desayuno sorpresa para ${featured.name}`,
        position: "object-center",
      };
    }
    return {
      src: "/img/hero-porquesi-1086.webp",
      srcSet: "/img/hero-porquesi-600.webp 600w, /img/hero-porquesi-1086.webp 1086w",
      alt: "Desayuno sorpresa con tarjeta de Mañana Rica: pequeños detalles, grandes historias",
      position: "object-[center_72%]",
    };
  }, [seasonText.featuredOccasion]);

  // Avanza el paso de "Cómo funciona". Se reinicia cada vez que cambia,
  // así un clic del usuario no es reemplazado de inmediato.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setActiveProcessStep((current) => (current + 1) % processSteps.length);
    }, PROCESS_STEP_INTERVAL);

    return () => window.clearTimeout(timeout);
  }, [activeProcessStep]);

  // Cambia el estilo del header y muestra el botón de volver arriba al bajar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      // El botón de "volver arriba" aparece después de bajar más o menos una pantalla
      setShowBackToTop(window.scrollY > window.innerHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Oculta el botón flotante cuando el footer está a la vista
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry?.isIntersecting ?? false),
      { threshold: 0.1 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Con el personalizador abierto: bloquea el scroll de fondo y cierra con Esc
  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [drawerOpen]);

  const chosenExtras = useMemo(
    () => extras.filter((extra) => selectedExtras.includes(extra.id)),
    [selectedExtras],
  );
  const extrasTotal = chosenExtras.reduce((sum, extra) => sum + extra.price, 0);
  const total = selected.price + extrasTotal;

  const deliverySummary = deliveryZone ? deliveryZoneLabels[deliveryZone] : "Por definir";
  const formattedDate = date
    ? longDateFormatter.format(new Date(`${date}T00:00:00Z`))
    : "Por definir";
  const surpriseSummary =
    deliveryPreference === "surprise"
      ? "Contactar primero a quien solicita"
      : "Pueden llamar a quien recibe";

  const whatsappMessage = [
    "*NUEVA SOLICITUD - MAÑANA RICA*",
    "",
    "Hola, quiero solicitar un desayuno sorpresa.",
    "",
    "*DETALLES DEL DESAYUNO*",
    `*Paquete:* ${selected.name}`,
    `*Ocasión:* ${occasion}`,
    `*Temática:* ${selectedTheme || "Sin temática especial"}`,
    "",
    "*EXTRAS*",
    chosenExtras.map((extra) => `- ${extra.name} (+${money(extra.price)})`).join("\n") ||
    "- Sin extras",
    "",
    "*DATOS DE ENTREGA*",
    `*Fecha:* ${formattedDate}`,
    `*Horario:* ${schedule}`,
    `*Zona:* ${deliverySummary}`,
    `*Dirección:* ${address || "Por definir"}`,
    "*Envío:* Por cotizar",
    `*Manejo de la sorpresa:* ${surpriseSummary}`,
    "",
    "*DATOS DEL PEDIDO*",
    `*Recibe:* ${recipient || "Por definir"}`,
    `*Teléfono de quien recibe:* ${recipientPhone || "Por definir"}`,
    `*Solicita:* ${sender || "Por definir"}`,
    `*Teléfono de quien solicita:* ${phone || "Por definir"}`,
    "",
    "*MENSAJE PARA LA TARJETA*",
    `_${message || "Sin mensaje personalizado"}_`,
    "",
    "*ALERGIAS O INDICACIONES*",
    notes || "Ninguna",
    "",
    "*RESUMEN DE PAGO*",
    `*Subtotal sin envío:* ${money(total)}`,
    "*Total final:* Se confirma al cotizar el envío",
    "Esta solicitud todavía no está confirmada.",
    "El pedido se confirma después de revisar disponibilidad y recibir el *50% de anticipo*.",
    "",
    "Quedo pendiente de su confirmación. Gracias.",
  ].join("\n");

  const whatsappInfoUrl = whatsappLink(
    "Hola Mañana Rica, quiero información sobre sus desayunos sorpresa.",
  );
  const whatsappOrderUrl = whatsappLink(whatsappMessage);

  // Redes que se muestran en el footer (solo las que tienen link; se editan en app/site.ts)
  const socialNetworks = [
    { name: "Instagram", url: SOCIAL_LINKS.instagram, Icon: InstagramIcon },
    { name: "Facebook", url: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
    { name: "TikTok", url: SOCIAL_LINKS.tiktok, Icon: TikTokIcon },
    { name: "WhatsApp", url: whatsappInfoUrl ?? "", Icon: WhatsAppIcon },
  ].filter((network) => network.url);

  // El botón flotante aparece al bajar, y se oculta en el footer
  // y mientras el personalizador está abierto.
  const showFloatingButton = isScrolled && !footerVisible && !drawerOpen;

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // Lleva el foco al inicio para quien navega con teclado o lector de pantalla
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  };
  const currentProcessStep = processSteps[activeProcessStep]!;

  // Abre el personalizador. La temática se reemplaza siempre:
  // vacía si se abre desde un paquete, o la de la ocasión elegida.
  const openBuilder = (pkg: Package, theme = "") => {
    setSelected(pkg);
    setSelectedTheme(theme);
    setSelectedExtras([]);
    setDeliveryZone("");
    setRevealedPackage(null);
    setStep(1);
    setConfirmed(false);
    setDrawerOpen(true);
  };

  // Los extras del mismo grupo (pastel, flores) se excluyen entre sí
  const toggleExtra = (id: string) => {
    const group = extras.find((extra) => extra.id === id)?.group;

    setSelectedExtras((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);

      const withoutSameGroup = group
        ? current.filter((itemId) => extras.find((extra) => extra.id === itemId)?.group !== group)
        : current;

      return [...withoutSameGroup, id];
    });
  };

  const nextStep = (event?: FormEvent) => {
    event?.preventDefault();
    setStep((current) => Math.min(current + 1, 4));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-ink">
      {/* ============================ HEADER ============================ */}
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl transition-all duration-500 ${isScrolled
          ? "border-brand-ink bg-brand/95 shadow-[0_8px_30px_rgba(70,10,10,0.18)]"
          : "border-edge/10 bg-bg/90"
          }`}
      >
        <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Mañana Rica, inicio">
            <img
              src="/img/logo-160.webp"
              width={160}
              height={160}
              decoding="async"
              alt=""
              className="h-14 w-14 object-contain"
            />
            <div className="leading-none">
              <span
                className={`block font-serif text-xl font-semibold tracking-tight transition-colors duration-500 ${isScrolled ? "text-white" : "text-brand-ink"
                  }`}
              >
                Mañana Rica
              </span>
              <span
                className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ${isScrolled ? "text-gold" : "text-accent-deep"
                  }`}
              >
                Sorpresas que despiertan
              </span>
            </div>
          </a>

          <nav
            className={`hidden items-center gap-8 text-base font-medium transition-colors duration-500 md:flex ${isScrolled ? "text-white" : "text-ink"
              }`}
            aria-label="Navegación principal"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition ${isScrolled ? "hover:text-gold" : "hover:text-brand-ink"}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ModeToggle
              className={
                isScrolled
                  ? "border-white/40 text-white hover:bg-white hover:text-brand"
                  : "border-edge/20 text-brand-ink hover:bg-brand hover:text-white"
              }
            />
            <button
              type="button"
              onClick={() => openBuilder(selected)}
              aria-label="Arma tu sorpresa"
              className={`group flex items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition duration-300 ${isScrolled
                ? "border-white text-white hover:bg-white hover:text-brand"
                : "border-brand-ink text-brand-ink hover:bg-brand hover:text-white"
                }`}
            >
              <BagIcon />
              <span className="hidden sm:inline">ARMA TU SORPRESA</span>
            </button>
          </div>
        </div>
      </header>

      {/* Guirnalda de temporada (papel picado, luces, banderines) */}
      <SeasonGarland season={season} />

      {/* ============================= HERO ============================= */}
      <section
        id="inicio"
        className="relative mx-auto grid min-h-[760px] max-w-[1440px] items-center gap-8 px-5 pb-16 pt-36 md:px-10 lg:grid-cols-[0.86fr_1.14fr] lg:pt-32"
      >
        <div className="relative z-10 py-10 lg:py-24">
          <p className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-ink">
            <span className="h-px w-10 bg-brand-ink" /> {seasonText.eyebrow}
          </p>
          <h1 className="max-w-2xl font-serif text-[clamp(3.6rem,6.6vw,7rem)] leading-[0.9] tracking-[-0.03em] text-heading">
            Que su día
            <br />
            empiece <em className="font-normal text-accent">rico.</em>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-muted md:text-lg">
            Desayunos sorpresa a domicilio en Morelia, Michoacán, tan únicos como esa persona.
            Elige, personaliza y agenda tu regalo en unos minutos.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={scrollToPackages}
              className="group flex items-center gap-3 bg-brand px-6 py-4 text-sm font-bold text-white transition hover:bg-brand-hover"
            >
              Ver desayunos <ArrowIcon />
            </button>
            <span className="text-xs leading-5 text-muted">
              Agenda con {ADVANCE_NOTICE} de anticipación
              <br />
              Pago por transferencia · Confirmación por WhatsApp
            </span>
          </div>
        </div>

        <div className="relative min-h-[460px] lg:min-h-[660px]">
          <SeasonFloaters season={season} />
          <div className="absolute inset-0 overflow-hidden rounded-[48%_48%_8%_48%/38%_40%_8%_38%] bg-surface-2">
            <img
              src="/img/hero-porquesi-1086.webp"
              srcSet="/img/hero-porquesi-600.webp 600w, /img/hero-porquesi-1086.webp 1086w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              width={1086}
              height={1448}
              fetchPriority="high"
              decoding="async"
              alt="Desayuno sorpresa a domicilio en Morelia con croissant, fruta fresca, waffles y jugo de naranja"
              className="hero-image-motion h-full w-full object-cover"
            />
          </div>
          <div className="hero-float absolute -bottom-5 left-2 bg-surface p-4 shadow-[0_18px_50px_rgba(74,31,20,.15)] md:left-[-28px] md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-accent-deep">
              Hecho esta mañana
            </p>
            <p className="mt-1 font-serif text-2xl text-heading">fresco, bonito, para ti.</p>
          </div>
          <div className="hero-float absolute right-4 top-8 grid h-24 w-24 rotate-6 place-items-center rounded-full bg-gold text-center text-[10px] font-bold uppercase leading-4 tracking-[0.13em] text-on-gold shadow-lg md:h-28 md:w-28">
            <span>
              {seasonText.badge[0]}
              <br />
              {seasonText.badge[1]}
              <br />♡
            </span>
          </div>
        </div>
      </section>

      {/* ============================ MARQUEE =========================== */}
      <section className="border-y border-edge/10 bg-brand py-4 text-on-brand">
        <div className="marquee-track flex min-w-max items-center gap-12 text-xs font-semibold uppercase tracking-[0.22em]">
          {/* La lista va dos veces para que el bucle no se note */}
          {[...marqueeItems, ...marqueeItems].map((text, i) => (
            <span
              key={i}
              aria-hidden={i >= marqueeItems.length || undefined}
              className="flex items-center gap-12"
            >
              {text}
              <b className="text-gold">✦</b>
            </span>
          ))}
        </div>
      </section>

      {/* =========================== PAQUETES =========================== */}
      <section id="paquetes" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">La carta de la mañana</p>
            <h2 className="section-title">
              Elige el antojo.
              <br />
              <em>Nosotros ponemos la magia.</em>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Cada paquete incluye presentación especial y una dedicatoria. Puedes cambiar alimentos y
            sumar extras durante tu pedido.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg) => {
            const revealed = revealedPackage === pkg.id;

            return (
              <article key={pkg.id} className="product-card group">
                {/* Cuadrado, igual que los flyers (900×900), para que no se recorten */}
                <div className="relative aspect-square overflow-hidden bg-surface-2">
                  <img
                    src={pkg.image}
                    srcSet={srcSetFor(pkg.image)}
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    width={900}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    alt={`Paquete ${pkg.name}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                  />

                  {pkg.badge && (
                    <span className="absolute left-4 top-4 z-10 bg-bg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink">
                      {pkg.badge}
                    </span>
                  )}

                  {/* Contenido del paquete: en celular con el botón, en escritorio al pasar el cursor */}
                  <div
                    className={`absolute inset-0 z-20 flex flex-col bg-brand-deep/95 p-5 text-on-brand transition duration-500 ${revealed
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-8 opacity-0"
                      } md:pointer-events-none md:translate-y-8 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-gold">
                      Esto incluye
                    </p>

                    <div className="package-scroll mt-3 min-h-0 flex-1 overflow-y-auto pr-2">
                      <ul className="space-y-2">
                        {pkg.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs leading-4">
                            <span className="mt-0.5 shrink-0 text-gold">
                              <CheckIcon />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openBuilder(pkg);
                      }}
                      className="relative z-30 mt-4 flex w-full shrink-0 touch-manipulation items-center justify-center gap-2 bg-gold px-4 py-3 text-xs font-bold text-on-gold transition hover:bg-white"
                    >
                      Personalizar paquete <ArrowIcon />
                    </button>
                  </div>
                </div>

                <div className="border-x border-b border-edge/15 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-accent-deep">
                        {pkg.occasion}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl leading-none text-heading">
                        {pkg.name}
                      </h3>
                    </div>
                    <p className="whitespace-nowrap font-serif text-xl text-brand-ink">
                      {money(pkg.price)}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted">{pkg.description}</p>

                  {/* Solo en celulares */}
                  <button
                    type="button"
                    onClick={() => setRevealedPackage(revealed ? null : pkg.id)}
                    aria-expanded={revealed}
                    className="mt-4 flex w-full items-center justify-between border-t border-edge/15 pt-4 text-xs font-bold text-brand-ink md:hidden"
                  >
                    {revealed ? "Ocultar contenido" : "Ver qué incluye"}
                    <span className={`text-lg transition ${revealed ? "rotate-45" : ""}`}>+</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================== OCASIONES ========================== */}
      <section id="ocasiones" className="overflow-hidden bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid gap-6 md:grid-cols-[1fr_.7fr] md:items-end">
            <div>
              <p className="eyebrow">Hecho para ese momento</p>
              <h2 className="mt-4 max-w-3xl font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.045em] text-heading">
                Una sorpresa para
                <br />
                <em className="font-normal text-accent">cada ocasión.</em>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted md:text-base">
              Cumpleaños, aniversarios, logros o simplemente porque sí. Personalizamos los pequeños
              detalles para que cada sorpresa tenga su propia historia.
            </p>
          </div>
        </div>

        {/* Carrusel: la lista va duplicada para el bucle; la copia se oculta a lectores de pantalla */}
        <div className="occasion-slider mt-12">
          <div className="occasion-track">
            {[...orderedOccasions, ...orderedOccasions].map((theme, index) => {
              const isCopy = index >= orderedOccasions.length;

              return (
                <article
                  key={`${theme.name}-${index}`}
                  aria-hidden={isCopy || undefined}
                  className="occasion-card group"
                  style={{ "--occasion-accent": theme.accent } as CSSProperties}
                >
                  <div className="relative h-[390px] overflow-hidden md:h-[440px]">
                    <img
                      src={theme.image}
                      srcSet={srcSetFor(theme.image)}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      width={900}
                      height={1200}
                      loading="lazy"
                      decoding="async"
                      alt={isCopy ? "" : `Desayuno sorpresa para ${theme.name}`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.07]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#321c19]/75 via-transparent to-transparent transition duration-500 group-hover:from-[#321c19]/90" />

                    <span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-[10px] font-bold text-brand-ink backdrop-blur">
                      {String((index % occasions.length) + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-6 text-white transition duration-500 group-hover:translate-y-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                        Mañana Rica
                      </p>
                      <h3 className="mt-2 font-serif text-3xl leading-none">{theme.name}</h3>
                      <p className="mt-3 max-h-0 overflow-hidden text-sm leading-5 text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
                        {theme.phrase}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    tabIndex={isCopy ? -1 : undefined}
                    onClick={() => openBuilder(packages[2]!, theme.name)}
                    className="flex w-full items-center justify-between border border-t-0 border-edge/10 bg-surface px-5 py-4 text-left text-heading transition duration-500 group-hover:bg-[var(--occasion-accent)] group-hover:text-white"
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.13em]">
                      Personalizar paquete
                    </span>
                    <span className="text-xl transition duration-500 group-hover:translate-x-1">→</span>
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-[1440px] px-5 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 border-t border-edge/15 pt-8 md:flex-row md:items-center">
            <div>
              <p className="font-serif text-2xl text-heading">¿No encuentras tu ocasión?</p>
              <p className="mt-1 text-sm text-muted">
                Cuéntanos tu idea y hacemos la sorpresa más tuya.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBuilder(selected)}
              className="group flex shrink-0 items-center gap-3 border border-brand-ink px-6 py-3.5 text-sm font-bold text-brand-ink transition duration-300 hover:bg-brand hover:text-white"
            >
              Personalizar paquete
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================= INGREDIENTES ========================= */}
      <section className="bg-brand px-5 py-16 text-on-brand md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-t-[120px]">
            <img
              src="/img/frutaconyoguth-960.webp"
              srcSet="/img/frutaconyoguth-480.webp 480w, /img/frutaconyoguth-960.webp 960w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              width={960}
              height={1280}
              loading="lazy"
              decoding="async"
              alt="Fruta fresca con yogurt de Mañana Rica"
              className="h-[420px] w-full object-cover md:h-[520px]"
            />
            <div className="absolute bottom-5 left-5 bg-gold px-5 py-3 text-sm font-bold text-on-gold">
              Preparado con cuidado ♥
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Nuestra forma de hacerlo
            </p>
            <h2 className="mt-5 font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.04em]">
              Lo que va dentro
              <br />
              <em className="font-normal text-gold">también importa.</em>
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-on-brand/80">
              No buscamos llenar nuestras cajas con mil cosas. Preferimos cuidar lo que ponemos en
              ellas: ingredientes seleccionados, preparación cuidada y alimentos que realmente
              disfrutes.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {[
                ["🍓", "Fruta fresca", "Lavada y desinfectada."],
                ["🥣", "Yogurt griego", "Con fruta y granola."],
                ["🥪", "Jamón de pavo", "En nuestros sándwiches y croissants."],
                ["🌾", "Opciones integrales", "En productos seleccionados."],
              ].map(([icon, title, text]) => (
                <div key={title} className="border-t border-white/20 pt-4">
                  <span className="text-xl" aria-hidden="true">{icon}</span>
                  <h3 className="mt-2 font-serif text-xl">{title}</h3>
                  <p className="mt-1 text-sm text-white/65">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-l-2 border-gold pl-5">
              <p className="font-serif text-2xl italic text-gold">
                Bonito por fuera. Cuidado por dentro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= CÓMO FUNCIONA ======================== */}
      <section id="como-funciona" className="overflow-hidden bg-surface-2 px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">Así de sencillo</p>
            <h2 className="mt-4 font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[0.95] tracking-[-0.04em] text-heading">
              De tu idea <em className="font-normal text-accent">a su puerta.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted md:text-base">
              Elige tu desayuno, personalízalo y agenda. Nosotros hacemos el resto.
            </p>
          </div>

          <div className="relative mt-12">
            <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-brand/20 md:block" />

            <div className="relative grid gap-4 md:grid-cols-3">
              {processSteps.map((processStep, index) => {
                const isActive = activeProcessStep === index;

                return (
                  <button
                    key={processStep.number}
                    type="button"
                    onClick={() => setActiveProcessStep(index)}
                    aria-current={isActive ? "step" : undefined}
                    className={`group relative flex flex-col items-center px-5 py-5 text-center transition-all duration-500 ${isActive ? "md:-translate-y-1" : "md:hover:-translate-y-1"
                      }`}
                  >
                    <span
                      className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border font-serif text-lg transition-all duration-500 ${isActive
                        ? "border-brand-ink bg-brand text-gold shadow-[0_8px_25px_rgba(120,13,11,0.18)]"
                        : "border-edge/25 bg-surface-2 text-brand-ink group-hover:border-brand-ink"
                        }`}
                    >
                      {processStep.number}
                    </span>
                    <h3
                      className={`mt-5 font-serif text-2xl transition-colors duration-300 ${isActive ? "text-brand-ink" : "text-heading"
                        }`}
                    >
                      {processStep.title}
                    </h3>
                    <p className="mt-2 max-w-[280px] text-sm leading-6 text-muted">
                      {processStep.description}
                    </p>
                    <span
                      className={`mt-5 h-[3px] rounded-full transition-all duration-500 ${isActive ? "w-16 bg-accent" : "w-6 bg-brand/15"
                        }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div
            key={activeProcessStep}
            aria-live="polite"
            className="process-step-animation mx-auto mt-7 max-w-2xl border border-edge/10 bg-bg px-6 py-5 text-center shadow-[0_12px_35px_rgba(75,30,20,0.06)] md:px-8"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Paso {currentProcessStep.number}
            </p>
            <p className="mt-2 font-serif text-xl text-heading md:text-2xl">
              {currentProcessStep.title}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={scrollToPackages}
              className="group flex items-center gap-3 bg-brand px-6 py-3.5 text-sm font-bold text-white transition duration-300 hover:bg-brand-hover"
            >
              Ver paquetes
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================== BANNER CTA ========================== */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid overflow-hidden bg-brand-deep text-on-brand lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-8 md:p-14 lg:p-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.23em] text-gold">
              Un detalle importante
            </p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.04] md:text-6xl">
              No enviamos solo desayuno. Enviamos ese “pensé en ti”.
            </h2>
            <button
              type="button"
              onClick={() => openBuilder(packages[0]!)}
              className="mt-9 flex items-center gap-3 bg-gold px-6 py-4 text-sm font-bold text-on-gold transition hover:bg-white"
            >
              Armar una sorpresa <ArrowIcon />
            </button>
          </div>
          <div className="relative min-h-80">
            <img
              src={bannerPhoto.src}
              srcSet={bannerPhoto.srcSet}
              sizes="(min-width: 1024px) 45vw, 100vw"
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              alt={bannerPhoto.alt}
              className={`absolute inset-0 h-full w-full object-cover ${bannerPhoto.position}`}
            />
          </div>
        </div>
      </section>

      {/* ========================== CONDICIONES ========================= */}
      <section id="condiciones" className="bg-bg px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">Antes de realizar tu pedido</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-heading md:text-5xl">
              Detalles importantes
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-muted md:text-base">
              Queremos preparar cada sorpresa con tiempo y mucho cuidado. Revisa estas condiciones
              antes de enviar tu solicitud.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {orderRules.map((rule) => (
              <article
                key={rule.number}
                className="border border-edge/15 bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-edge/35 hover:shadow-[0_16px_35px_rgba(75,30,20,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    Regla {rule.number}
                  </span>
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold" />
                </div>
                <h3 className="mt-4 font-serif text-2xl leading-tight text-heading">{rule.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{rule.description}</p>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-muted">
            Al enviar tu solicitud confirmas que leíste estas condiciones. El pedido se considera
            confirmado únicamente después de validar el anticipo.
          </p>
        </div>
      </section>

      {/* ============================== FAQ ============================= */}
      <section
        id="faq"
        className="mx-auto grid max-w-[1160px] gap-10 px-5 pb-28 md:grid-cols-[.7fr_1.3fr] md:px-10"
      >
        <div>
          <p className="eyebrow">Antes de ordenar</p>
          <h2 className="mt-3 font-serif text-4xl text-heading md:text-5xl">Lo bueno se planea.</h2>
        </div>
        <div className="divide-y divide-edge/15 border-y border-edge/15">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-heading">
                {question}
                <span aria-hidden="true" className="text-2xl font-light transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-xl pt-4 text-sm leading-6 text-muted">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <footer className="bg-footer px-5 py-12 text-center text-footer-ink md:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/img/logo-160.webp"
              width={160}
              height={160}
              decoding="async"
              loading="lazy"
              alt=""
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="font-serif text-2xl">Mañana Rica</p>
              <p className="text-xs text-footer-muted">Desayunos sorpresa · Morelia, Mich.</p>
            </div>
          </div>

          <div className="text-sm leading-7 text-footer-muted">
            <p>{BUSINESS_HOURS}</p>
            <p>Pedidos con {ADVANCE_NOTICE} de anticipación</p>
          </div>

          {whatsappInfoUrl && (
            <a
              href={whatsappInfoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-gold"
            >
              Hablar por WhatsApp <ArrowIcon />
            </a>
          )}

          {socialNetworks.length > 0 && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-footer-muted">
                Síguenos
              </p>
              <ul className="flex items-center gap-3">
                {socialNetworks.map(({ name, url, Icon }) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Mañana Rica en ${name}`}
                      title={name}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-footer-ink transition duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-on-gold"
                    >
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-[1440px] flex-col items-center justify-center gap-2 border-t border-white/10 pt-5 text-center text-[11px] text-footer-muted md:flex-row md:gap-6">
          <span>
            © {new Date().getFullYear()}{" "}
            <a href="https://estudiobinariomx.com/" target="_blank" rel="noopener noreferrer">
              Estudio Binario Mx
            </a>
          </span>
          <span>Hecho con amor en Morelia, Mich.</span>
        </div>
      </footer>

      {/* ======================== VOLVER ARRIBA ======================== */}
      {/* Va encima del botón de WhatsApp; cuando ese se oculta (en el footer) baja a su lugar */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Volver arriba"
        title="Volver arriba"
        tabIndex={showBackToTop && !drawerOpen ? 0 : -1}
        aria-hidden={!showBackToTop || drawerOpen}
        className={`fixed z-40 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-brand text-on-brand shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover md:h-12 md:w-12 ${showFloatingButton
            ? "bottom-[84px] right-[22px] md:bottom-[138px] md:right-[54px]"
            : "bottom-5 right-5 md:bottom-8 md:right-8"
          } ${showBackToTop && !drawerOpen ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <ArrowUpIcon />
      </button>

      {/* ===================== BOTÓN FLOTANTE WHATSAPP ==================== */}
      {whatsappInfoUrl && (
        <a
          href={whatsappInfoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Contactar a Mañana Rica por WhatsApp"
          aria-hidden={!showFloatingButton}
          tabIndex={showFloatingButton ? 0 : -1}
          className={`group fixed bottom-4 right-4 z-40 rounded-full bg-surface p-1 shadow-[0_12px_35px_rgba(74,31,20,0.28)] transition duration-300 hover:scale-110 md:bottom-8 md:right-8 md:p-1.5 ${showFloatingButton
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
            }`}
        >
          <img
            src="/img/logo-160.webp"
            width={160}
            height={160}
            decoding="async"
            loading="lazy"
            alt=""
            className="manana-floating-logo h-12 w-12 object-contain md:h-20 md:w-20"
          />
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap bg-brand px-4 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 md:block">
            Pedir por WhatsApp
          </span>
        </a>
      )}

      {/* ========================= PERSONALIZADOR ======================== */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#2b1410]/55 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Personalizar pedido"
        >
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-0 cursor-default"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar personalizador"
          />

          <aside className="relative h-full w-full overflow-y-auto overscroll-contain bg-surface shadow-2xl md:w-[min(760px,92vw)]">
            <div className="sticky top-0 z-10 border-b border-edge/10 bg-surface/95 px-5 py-5 backdrop-blur md:px-9">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-accent-deep">
                    Tu sorpresa
                  </p>
                  <h2 className="mt-1 font-serif text-2xl text-heading">
                    {confirmed ? "Solicitud preparada" : selected.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-edge/15 text-xl text-heading"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              {!confirmed && (
                <div
                  className="mt-5 grid grid-cols-4 gap-2"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={4}
                  aria-valuenow={step}
                  aria-label={`Paso ${step} de 4`}
                >
                  {[1, 2, 3, 4].map((item) => (
                    <span key={item} className={`h-1 ${item <= step ? "bg-accent" : "bg-line"}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 py-7 md:px-9 md:py-9">
              {/* ---------- Paso 1: extras y ocasión ---------- */}
              {step === 1 && (
                <div>
                  <p className="step-label">Paso 1 · Personaliza</p>
                  <h3 className="step-title">Hazlo muy de esa persona.</h3>

                  {selectedTheme && (
                    <div className="mt-5 flex items-center justify-between border border-edge/15 bg-surface-3 px-4 py-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-deep">
                          Temática seleccionada
                        </p>
                        <p className="mt-1 font-serif text-xl text-heading">{selectedTheme}</p>
                      </div>
                      <span className="text-2xl" aria-hidden="true">♥</span>
                    </div>
                  )}

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {extras.map((extra) => {
                      const active = selectedExtras.includes(extra.id);

                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra(extra.id)}
                          aria-pressed={active}
                          className={`flex items-center gap-4 border p-4 text-left transition ${active ? "border-brand-ink bg-surface-3" : "border-line hover:border-accent-deep"
                            }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`grid h-11 w-11 place-items-center rounded-full text-xl ${active ? "bg-brand text-white" : "bg-surface-2 text-brand-ink"
                              }`}
                          >
                            {active ? <CheckIcon /> : extra.icon}
                          </span>
                          <span className="flex-1">
                            <b className="block text-sm">{extra.name}</b>
                            <small className="text-muted">+ {money(extra.price)}</small>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <fieldset className="mt-7">
                    <legend className="text-xs font-bold uppercase tracking-[.13em] text-muted">
                      ¿Cuál es la ocasión?
                    </legend>
                    <p className="mt-2 text-sm text-muted">Selecciona el motivo de la sorpresa.</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                      {occasionOptions.map((item) => {
                        const isSelected = occasion === item.name;

                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setOccasion(item.name)}
                            aria-pressed={isSelected}
                            className={`min-h-[76px] border px-3 py-3 text-left transition duration-300 ${isSelected
                              ? "border-brand-ink bg-brand text-white shadow-md"
                              : "border-line bg-surface text-heading hover:-translate-y-0.5 hover:border-edge/50"
                              }`}
                          >
                            <span className="block text-sm font-semibold leading-tight">{item.name}</span>
                            <span
                              className={`mt-1 block text-[11px] leading-4 ${isSelected ? "text-white/75" : "text-muted"
                                }`}
                            >
                              {item.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="mt-8 border-t border-edge/10 pt-6">
                    <p className="summary-label">Este paquete incluye</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {selected.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted">
                          <CheckIcon />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ---------- Paso 2: dedicatoria ---------- */}
              {step === 2 && (
                <form id="recipient-form" onSubmit={nextStep}>
                  <p className="step-label">Paso 2 · Dedicatoria</p>
                  <h3 className="step-title">¿Quién recibirá el apapacho?</h3>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="field">
                      Nombre de quien recibe
                      <input
                        required
                        value={recipient}
                        onChange={(event) => setRecipient(event.target.value)}
                        placeholder="Ej. Sofía"
                      />
                    </label>
                    <label className="field">
                      Tu nombre
                      <input
                        required
                        autoComplete="name"
                        value={sender}
                        onChange={(event) => setSender(event.target.value)}
                        placeholder="Ej. Brenda"
                      />
                    </label>
                  </div>

                  <label className="field mt-5">
                    Mensaje para la tarjeta
                    <textarea
                      required
                      maxLength={180}
                      rows={4}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                    <small>{message.length}/180</small>
                  </label>

                  <label className="field mt-5">
                    Alergias o indicaciones especiales <span>(opcional)</span>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Sin nueces, leche deslactosada…"
                    />
                  </label>
                </form>
              )}

              {/* ---------- Paso 3: entrega ---------- */}
              {step === 3 && (
                <form id="delivery-form" onSubmit={nextStep}>
                  <p className="step-label">Paso 3 · Entrega</p>
                  <h3 className="step-title">Dinos dónde y cuándo.</h3>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="field">
                      Fecha
                      <input
                        required
                        type="date"
                        min={todayInMorelia()}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </label>

                    <label className="field">
                      Horario
                      <select value={schedule} onChange={(event) => setSchedule(event.target.value)}>
                        {scheduleOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>

                    <label className="field sm:col-span-2">
                      Dirección de entrega
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Calle, número, colonia, código postal y referencias"
                      />
                    </label>

                    <label className="field">
                      Teléfono de quien solicita
                      <input
                        required
                        type="tel"
                        autoComplete="tel"
                        pattern="[0-9 +()-]{10,}"
                        title="Escribe un teléfono de al menos 10 dígitos"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="443 000 0000"
                      />
                    </label>

                    <label className="field">
                      Teléfono de quien recibe
                      <input
                        required
                        type="tel"
                        pattern="[0-9 +()-]{10,}"
                        title="Escribe un teléfono de al menos 10 dígitos"
                        value={recipientPhone}
                        onChange={(event) => setRecipientPhone(event.target.value)}
                        placeholder="443 000 0000"
                      />
                    </label>

                    <label className="field">
                      Zona de entrega
                      <select
                        required
                        value={deliveryZone}
                        onChange={(event) => setDeliveryZone(event.target.value as DeliveryZone)}
                      >
                        <option value="" disabled>
                          Selecciona una zona
                        </option>
                        <option value="centro">Dentro de Morelia · por cotizar</option>
                        <option value="extendida">Alrededores · sujeto a cobertura</option>
                      </select>
                    </label>

                    <label className="field">
                      ¿Debemos conservar la sorpresa?
                      <select
                        required
                        value={deliveryPreference}
                        onChange={(event) => setDeliveryPreference(event.target.value)}
                      >
                        <option value="surprise">Sí, contacten primero a quien solicita</option>
                        <option value="recipient">No, pueden llamar a quien recibe</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-6 border-l-2 border-accent bg-surface-3 p-4 text-xs leading-5 text-muted">
                    La hora corresponde a una ventana aproximada. El costo de envío se cotizará según
                    la dirección y se confirmará por WhatsApp. En entregas con mensajería externa, la
                    persona destinataria podría necesitar salir a recibir el paquete.
                  </div>
                </form>
              )}

              {/* ---------- Paso 4: resumen ---------- */}
              {step === 4 && (
                <div>
                  <p className="step-label">Paso 4 · Revisa tu solicitud</p>
                  <h3 className="step-title">Todo listo para alegrar su mañana.</h3>

                  <div className="mt-7 flex gap-4 border-b border-edge/10 pb-6">
                    <img
                      src={smallVersion(selected.image)}
                      width={96}
                      height={96}
                      decoding="async"
                      alt=""
                      className="h-24 w-24 object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-serif text-xl text-heading">{selected.name}</h4>
                      <p className="mt-1 text-xs text-muted">
                        {occasion} · {recipient || "Destinatario"}
                      </p>
                      <p className="mt-3 text-sm font-bold">{money(selected.price)}</p>
                    </div>
                  </div>

                  {chosenExtras.length > 0 && (
                    <div className="border-b border-edge/10 py-5">
                      <p className="summary-label">Extras</p>
                      {chosenExtras.map((extra) => (
                        <div key={extra.id} className="mt-2 flex justify-between text-sm">
                          <span>{extra.name}</span>
                          <span>{money(extra.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-4 border-b border-edge/10 py-5 text-sm sm:grid-cols-2">
                    <div>
                      <p className="summary-label">Entrega</p>
                      <p className="mt-2 first-letter:uppercase">
                        {formattedDate}
                        <br />
                        {schedule}
                        <br />
                        {deliverySummary}
                        <br />
                        <span className="text-accent">Envío por cotizar</span>
                      </p>
                    </div>
                    <div>
                      <p className="summary-label">Dirección</p>
                      <p className="mt-2 line-clamp-2">{address || "Por definir"}</p>
                    </div>
                  </div>

                  <p className="summary-label mt-6">Forma de pago</p>
                  <div className="mt-3 border border-brand-ink bg-surface-3 p-4 text-sm">
                    <b className="block text-heading">Transferencia bancaria</b>
                    <small className="mt-1 block leading-5 text-muted">
                      Te enviaremos los datos por WhatsApp después de revisar la disponibilidad. El
                      pedido se confirma al recibir el comprobante del anticipo.
                    </small>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-y border-edge/15 py-5">
                    <div>
                      <span className="block font-serif text-xl">Subtotal</span>
                      <small className="text-xs text-muted">Envío no incluido</small>
                    </div>
                    <strong className="font-serif text-3xl text-brand-ink">{money(total)}</strong>
                  </div>
                </div>
              )}

              {/* ---------- Confirmación ---------- */}
              {confirmed && (
                <div className="py-5 text-center">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold text-on-gold">
                    <CheckIcon />
                  </div>
                  <p className="step-label mt-7">Resumen preparado</p>
                  <h3 className="mt-3 font-serif text-4xl text-heading">¡Tu solicitud está lista!</h3>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
                    Envíala por WhatsApp para revisar disponibilidad y recibir los datos de
                    transferencia. Tu pedido quedará confirmado cuando recibamos el comprobante del
                    anticipo.
                  </p>

                  <div className="mx-auto mt-8 max-w-md border border-line p-5 text-left text-sm">
                    <div className="flex justify-between">
                      <span>{selected.name}</span>
                      <b>{money(total)}</b>
                    </div>
                    <div className="mt-3 flex justify-between gap-4 text-muted">
                      <span className="first-letter:uppercase">{formattedDate}</span>
                      <span className="whitespace-nowrap">{schedule}</span>
                    </div>
                  </div>

                  {whatsappOrderUrl ? (
                    <a
                      href={whatsappOrderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mx-auto mt-6 flex w-fit items-center gap-3 bg-brand px-6 py-4 text-sm font-bold text-white"
                    >
                      Enviar solicitud por WhatsApp <ArrowIcon />
                    </a>
                  ) : (
                    <div className="mx-auto mt-6 w-fit border border-line bg-surface-3 px-6 py-4 text-sm font-semibold text-muted">
                      Pedidos por WhatsApp disponibles próximamente
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="mt-5 block w-full text-sm font-semibold text-brand-ink underline underline-offset-4"
                  >
                    Volver a la tienda
                  </button>
                </div>
              )}
            </div>

            {/* ---------- Barra inferior ---------- */}
            {!confirmed && (
              <div className="sticky bottom-0 border-t border-edge/10 bg-surface px-5 py-5 shadow-[0_-12px_35px_rgba(74,31,20,.08)] md:px-9">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal (sin envío)</span>
                  <strong className="font-serif text-2xl text-heading">{money(total)}</strong>
                </div>

                <div className="flex gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="border border-edge/25 px-5 py-3.5 text-sm font-bold text-heading"
                    >
                      Atrás
                    </button>
                  )}

                  {step === 1 && (
                    <button
                      type="button"
                      onClick={() => nextStep()}
                      className="flex flex-1 items-center justify-center gap-3 bg-brand px-6 py-3.5 text-sm font-bold text-white"
                    >
                      Continuar <ArrowIcon />
                    </button>
                  )}

                  {(step === 2 || step === 3) && (
                    <button
                      type="submit"
                      form={step === 2 ? "recipient-form" : "delivery-form"}
                      className="flex flex-1 items-center justify-center gap-3 bg-brand px-6 py-3.5 text-sm font-bold text-white"
                    >
                      Continuar <ArrowIcon />
                    </button>
                  )}

                  {step === 4 && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmed(true);
                        setStep(5);
                      }}
                      className="flex flex-1 items-center justify-center gap-3 bg-accent px-6 py-3.5 text-sm font-bold text-white"
                    >
                      Preparar solicitud <ArrowIcon />
                    </button>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}