"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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

const packages: Package[] = [
  {
    id: 1,
    name: "Rayito de Sol",
    occasion: "Un lindo detalle",
    price: 289,
    image: "/rayito_de_sol.png",
    description: "Pequeño en precio, grande en intención.",
    includes: [
      "🥪Sándwich de jamón y queso",
      "🧇2 Mini Waffles",
      "🍯Miel Mapple o Mermelada",
      "🍓Fruta fresca de temporada",
      "🍊Jugo individual de naranja",
      "💌Tarjeta personalizada de ocasión",
      "🎏Banderín basico",
      "🍴Cubiertos"
    ],
    badge: "Desde $289",
  },
  {
    id: 2,
    name: "Buenos dias",
    occasion: "El más completo",
    price: 349,
    image: "/buenos_dias.png",
    description: "Todo lo necesario para empezar sonriendo.",
    includes: [
      "🥐Croissant de jamón y queso",
      "🧇2 Mini Waffles",
      "🍯Miel Mapple o Mermelada",
      "🥣Yogurt con fruta y granola",
      "🍪2 Galletas integrales",
      "🍊Jugo de naranja",
      "☕Café frio o Leche de sabor",
      "💌Tarjeta personalizada de ocasión",
      "🎏Banderín basico",
      "🍴Cubiertos"
    ],
    badge: "Más elegido",
  },
  {
    id: 3,
    name: "Pense en ti",
    occasion: "Para celebrar",
    price: 419,
    image: "/pense_en_ti.png",
    description: "Una sorpresa hecha especialmente para esa persona.",
    includes: [
      "🥐Croissant de jamón y queso",
      "🧇3 Mini Waffles",
      "🍓Fruta para acompañar los waffles",
      "🍯Miel Mapple o Mermelada",
      "🥣Yogurt con fruta y granola",
      "🍪3 Galletas integrales",
      "🍊Jugo de naranja grande",
      "☕Café frio o Leche de sabor",
      "💌Tarjeta personalizada de ocasión",
      "📷Foto tipo polaroid",
      "🎏Banderín basico",
      "🍴Cubiertos"
    ],
    badge: "Favorito",
  },
  {
    id: 4,
    name: "Apapacho",
    occasion: "La gran sorpresa",
    price: 519,
    image: "/apapacho.png",
    description: "Desayuno, pastel y recuerdos en una sola charola.",
    includes: [
      "🥐Croissant especial de pollo y queso",
      "🧇3 Mini Waffles",
      "🍓Fruta para acompañar los waffles",
      "🍯Miel Mapple o Mermelada",
      "🥣Yogurt con fruta y granola",
      "🍪3 Galletas integrales",
      "🍊Jugo de naranja grande",
      "🍫Muffin de chocolate o Mini pastel",
      "☕Café frio o Leche de sabor",
      "📷3 Fotos tipo polaroid",
      "💌Tarjeta personalizada de ocasión",
      "🎏Banderín personalizado",
      "🍴Cubiertos"
    ],
    badge: "Especial",
  },
];

const extras: Extra[] = [
  {
    id: "photos",
    name: "Tira de 4 fotos",
    price: 49,
    icon: "▣",
  },
  {
    id: "cake-slice",
    name: "Rebanada de pastel",
    price: 69,
    icon: "◢",
    group: "cake",
  },
  {
    id: "mini-cake",
    name: "Mini pastel para 1–2 personas",
    price: 160,
    icon: "⌒",
    group: "cake",
  },
  {
    id: "sunflower",
    name: "Un girasol",
    price: 69,
    icon: "✹",
    group: "flowers",
  },
  {
    id: "gerberas",
    name: "Mini ramo de 2–3 gerberas",
    price: 69,
    icon: "✿",
    group: "flowers",
  },
];

// Escribe aquí el nuevo número de Mañana Rica cuando esté listo.
// Debe incluir el código de país, sin espacios ni signos. Ejemplo: 521234567890.
const whatsappNumber: string = "523334583049";

const money = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

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
  {
    name: "Cumpleaños",
    phrase: "Haz que su día comience todavía más especial.",
    image: "/ocasion-cumpleanos.png",
    accent: "#d96a28",
  },
  {
    name: "Amor y aniversario",
    phrase: "Detalles para decir todo eso que a veces no cabe en palabras.",
    image: "/ocasion-amor.png",
    accent: "#a92c35",
  },
  {
    name: "Día de las Madres",
    phrase: "Una mañana bonita para quien siempre está para ti.",
    image: "/ocasion-mama.png",
    accent: "#c75d7a",
  },
  {
    name: "Día del Padre",
    phrase: "Una forma diferente de decir: gracias, papá.",
    image: "/ocasion-papa.png",
    accent: "#395875",
  },
  {
    name: "Día del Maestro",
    phrase: "Un detalle para agradecer a quien deja huella.",
    image: "/ocasion-maestro.png",
    accent: "#8b5d42",
  },
  {
    name: "Día del Estudiante",
    phrase: "Para celebrar su esfuerzo, sus sueños y todo lo que viene.",
    image: "/ocasion-estudiante.png",
    accent: "#ca7848",
  },
  {
    name: "Día de Enfermería",
    phrase: "Un pequeño gracias para quienes cuidan de los demás.",
    image: "/ocasion-enfermeria.png",
    accent: "#5386a6",
  },
  {
    name: "Día del Arquitecto",
    phrase: "Para quienes convierten ideas en espacios e historias.",
    image: "/ocasion-arquitecto.png",
    accent: "#79a8c2",
  },
];

export default function Home() {
  const [selected, setSelected] = useState<Package>(packages[0]!);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [deliveryZone, setDeliveryZone] = useState("");
  const [occasion, setOccasion] = useState("Cumpleaños");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [phone, setPhone] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState("surprise");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [schedule, setSchedule] = useState("8:00 – 9:30");
  const [message, setMessage] = useState("¡Que hoy te pasen cosas bonitas!");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [revealedPackage, setRevealedPackage] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveProcessStep(
        (currentStep) => (currentStep + 1) % processSteps.length,
      );
    }, 4500);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const previousProcessStep = () => {
    setActiveProcessStep((currentStep) =>
      currentStep === 0 ? processSteps.length - 1 : currentStep - 1,
    );
  };

  const nextProcessStep = () => {
    setActiveProcessStep(
      (currentStep) => (currentStep + 1) % processSteps.length,
    );
  };

  const currentProcessStep = processSteps[activeProcessStep]!;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Detecta cuando el footer está a la vista para ocultar el botón flotante
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

  const extrasTotal = useMemo(
    () =>
      extras
        .filter((e) => selectedExtras.includes(e.id))
        .reduce((sum, e) => sum + e.price, 0),
    [selectedExtras],
  );
  const total = selected.price + extrasTotal;
  const minDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const selectedExtrasForWhatsApp = extras
    .filter((extra) => selectedExtras.includes(extra.id))
    .map((extra) => `- ${extra.name} (+${money(extra.price)})`)
    .join("\n");

  const deliverySummary =
    deliveryZone === "centro"
      ? "Dentro de Morelia"
      : deliveryZone === "extendida"
        ? "Alrededores de Morelia"
        : "Por definir";

  const surpriseSummary =
    deliveryPreference === "surprise"
      ? "Contactar primero a quien solicita"
      : "Pueden llamar a quien recibe";

  const formattedDate = date
    ? new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`))
    : "Por definir";

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
    selectedExtrasForWhatsApp || "- Sin extras",
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

  const whatsappInfoUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      "Hola Mañana Rica, quiero información sobre sus desayunos sorpresa.",
    )}`
    : null;

  const whatsappOrderUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  // El botón flotante solo se muestra después de bajar un poco,
  // se oculta al llegar al footer y mientras el personalizador está abierto.
  const showFloatingButton = isScrolled && !footerVisible && !drawerOpen;

  const openBuilder = (pkg: Package) => {
    setSelected(pkg);
    setSelectedExtras([]);
    setDeliveryZone("");
    setRevealedPackage(null);
    setStep(1);
    setConfirmed(false);
    setDrawerOpen(true);
  };

const openBuilderWithoutTheme = (pkg: Package) => {
  setSelectedTheme("");
  openBuilder(pkg);
};

  const toggleExtra = (id: string) => {
    const selectedExtra = extras.find((extra) => extra.id === id);

    setSelectedExtras((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      const extrasWithoutSameGroup = selectedExtra?.group
        ? current.filter((itemId) => {
          const currentExtra = extras.find((extra) => extra.id === itemId);

          return currentExtra?.group !== selectedExtra.group;
        })
        : current;

      return [...extrasWithoutSameGroup, id];
    });
  };

  const nextStep = (event?: FormEvent) => {
    event?.preventDefault();
    setStep((current) => Math.min(current + 1, 4));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f2e9] text-[#321c19]">
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl transition-all duration-500 ${isScrolled
            ? "border-[#780d0b] bg-[#780d0b]/95 shadow-[0_8px_30px_rgba(70,10,10,0.18)]"
            : "border-[#6f0b0b]/10 bg-[#f8f2e9]/90"
          }`}
      >
        <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a
            href="#inicio"
            className="flex items-center gap-3"
            aria-label="Mañana Rica, inicio"
          >
            <img
              src="/manana-rica-logo.png"
              alt="Mañana Rica"
              className="h-14 w-14 object-contain"
            />

            <div className="leading-none">
              <span
                className={`block font-serif text-xl font-semibold tracking-tight transition-colors duration-500 ${isScrolled ? "text-white" : "text-[#780d0b]"
                  }`}
              >
                Mañana Rica
              </span>

              <span
                className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ${isScrolled ? "text-[#f2c44c]" : "text-[#8f5f43]"
                  }`}
              >
                Sorpresas que despiertan
              </span>
            </div>
          </a>

          <nav
            className={`hidden items-center gap-8 text-base font-medium transition-colors duration-500 md:flex ${isScrolled ? "text-white" : "text-[#321c19]"}`}
            aria-label="Navegación principal"
          >
            <a
              href="#paquetes"
              className={`transition ${isScrolled ? "hover:text-[#f2c44c]" : "hover:text-[#8a0f0d]"}`}
            >
              PAQUETES
            </a>
            <a
  href="#ocasiones"
  className={`transition ${
    isScrolled
      ? "hover:text-[#f2c44c]"
      : "hover:text-[#8a0f0d]"
  }`}
>
  OCASIONES
</a>

            <a
              href="#como-funciona"
              className={`transition ${isScrolled ? "hover:text-[#f2c44c]" : "hover:text-[#8a0f0d]"
                }`}
            >
              CÓMO FUNCIONA
            </a>

            <a
              href="#faq"
              className={`transition ${isScrolled ? "hover:text-[#f2c44c]" : "hover:text-[#8a0f0d]"}`}
            >
              PREGUNTAS
            </a>
          </nav>

          <button
            type="button"
            onClick={() => openBuilder(selected)}
            className={`group flex items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition duration-300 ${isScrolled
                ? "border-white text-white hover:bg-white hover:text-[#780d0b]"
                : "border-[#780d0b] text-[#780d0b] hover:bg-[#780d0b] hover:text-white"
              }`}
          >
            <BagIcon />

            <span className="hidden sm:inline">ARMA TU SORPRESA</span>
          </button>
        </div>
      </header>

      <section
        id="inicio"
        className="relative mx-auto grid min-h-[760px] max-w-[1440px] items-center gap-8 px-5 pb-16 pt-32 md:px-10 lg:grid-cols-[0.86fr_1.14fr] lg:pt-24"
      >
        <div className="relative z-10 py-10 lg:py-24">
          <p className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#8a0f0d]">
            <span className="h-px w-10 bg-[#8a0f0d]" /> Entregas en Morelia
          </p>
          <h1 className="max-w-2xl font-serif text-[clamp(3.8rem,7vw,7.4rem)] leading-[0.84] tracking-[-0.055em] text-[#64100e]">
            Que su día
            <br />
            empiece <em className="font-normal text-[#d96a28]">rico.</em>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-[#70534b] md:text-lg">
            Desayunos sorpresa que puedes hacer tan únicos como esa persona.
            Elige, personaliza y agenda en unos minutos.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() =>
                document
                  .getElementById("paquetes")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group flex items-center gap-3 bg-[#780d0b] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#951a16]"
            >
              Ver desayunos <ArrowIcon />
            </button>
            <span className="text-xs leading-5 text-[#8f7268]">
              Agenda con 24 h de anticipación
              <br />
              Pago por transferencia · Confirmación por WhatsApp
            </span>
          </div>
        </div>
        <div className="relative min-h-[460px] lg:min-h-[660px]">
          <div className="absolute inset-0 overflow-hidden rounded-[48%_48%_8%_48%/38%_40%_8%_38%] bg-[#e4c6a1]">
            <img
              src="/hero-porquesi.png"
               alt="Desayuno sorpresa Mañana Rica"
    className="hero-image-motion h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-2 bg-[#fffaf3] p-4 shadow-[0_18px_50px_rgba(74,31,20,.15)] md:left-[-28px] md:p-5 hero-float">
            <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#b25b2b]">
              Hecho esta mañana
            </p>
            <p className="mt-1 font-serif text-2xl text-[#64100e]">
              fresco, bonito, para ti.
            </p>
          </div>
          <div className="absolute right-4 top-8 grid h-24 w-24 rotate-6 place-items-center rounded-full bg-[#f2c44c] text-center text-[10px] font-bold uppercase leading-4 tracking-[0.13em] text-[#64100e] shadow-lg md:h-28 md:w-28 hero-float">
            
            <span>
              Ingredientes
              <br />
              frescos y saludables.
              <br />♡
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-[#780d0b]/10 bg-[#780d0b] py-4 text-[#fff4e6]">
        <div className="marquee-track flex min-w-max items-center gap-12 text-xs font-semibold uppercase tracking-[0.22em]">
          {[
            "Ingredientes frescos",
            "Personalizable",
            "Entrega local",
            "Hecho en Morelia",
            "Ingredientes frescos",
            "Personalizable",
            "Entrega local",
            "Hecho en Morelia",
          ].map((text, i) => (
            <span key={i} className="flex items-center gap-12">
              {text}
              <b className="text-[#f2c44c]">✦</b>
            </span>
          ))}
        </div>
      </section>

      <section
        id="paquetes"
        className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32"
      >
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">La carta de la mañana</p>
            <h2 className="section-title">
              Elige el antojo.
              <br />
              <em>Nosotros ponemos la magia.</em>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#785c53]">
            Cada paquete incluye presentación especial y una dedicatoria. Puedes
            cambiar alimentos y sumar extras durante tu pedido.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg) => {
            const revealed = revealedPackage === pkg.id;

            return (
              <article key={pkg.id} className="product-card group">
                <div className="relative h-[430px] overflow-hidden bg-[#e7d7c4]">
                  <img
                    src={pkg.image}
                    alt={`Paquete ${pkg.name}`}
                    className="
              h-full w-full object-cover
              transition duration-700
              group-hover:scale-[1.06]"/>

                  {pkg.badge && (
                    <span
                      className="
                absolute left-4 top-4 z-10
                bg-[#f8f2e9] px-3 py-2
                text-[10px] font-bold uppercase
                tracking-[0.16em] text-[#780d0b]
              "
                    >
                      {pkg.badge}
                    </span>
                  )}

                  {/* Contenido que aparece al pasar el cursor o tocar en celular */}
{/* Contenido del paquete */}
<div
  className={`
    absolute inset-0 z-20
    flex flex-col
    bg-[#64100e]/95
    p-5 text-[#fff8ef]
    transition duration-500

    md:pointer-events-none
    md:translate-y-8
    md:opacity-0
    md:group-hover:pointer-events-auto
    md:group-hover:translate-y-0
    md:group-hover:opacity-100

    ${
      revealed
        ? "pointer-events-auto translate-y-0 opacity-100"
        : "pointer-events-none translate-y-8 opacity-0"
    }

    md:[&]:pointer-events-none
    md:[&]:translate-y-8
    md:[&]:opacity-0
    md:group-hover:[&]:pointer-events-auto
    md:group-hover:[&]:translate-y-0
    md:group-hover:[&]:opacity-100
  `}
>
  <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#f2c44c]">
    Esto incluye
  </p>

  <div className="package-scroll mt-3 min-h-0 flex-1 overflow-y-auto pr-2">
    <ul className="space-y-2">
      {pkg.includes.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-xs leading-4"
        >
          <span className="mt-0.5 shrink-0 text-[#f2c44c]">
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
  event.preventDefault();
  event.stopPropagation();
  openBuilderWithoutTheme(pkg);
}}
    className="
      relative z-30
      mt-4 flex w-full shrink-0
      touch-manipulation
      items-center justify-center gap-2
      bg-[#f2c44c] px-4 py-3
      text-xs font-bold text-[#64100e]
      transition hover:bg-white
    "
  >
    Personalizar paquete
    <ArrowIcon />
  </button>
</div>
                </div>

                <div className="border-x border-b border-[#780d0b]/15 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className="
                  text-[10px] font-bold uppercase
                  tracking-[0.17em] text-[#b25b2b]
                "
                      >
                        {pkg.occasion}
                      </p>

                      <h3 className="mt-2 font-serif text-2xl leading-none text-[#55100e]">
                        {pkg.name}
                      </h3>
                    </div>

                    <p className="whitespace-nowrap font-serif text-xl text-[#780d0b]">
                      {money(pkg.price)}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#785c53]">
                    {pkg.description}
                  </p>

                  {/* Este botón aparece únicamente en celulares */}
                  <button
                    type="button"
                    onClick={() => setRevealedPackage(revealed ? null : pkg.id)}
                    aria-expanded={revealed}
                    className="
              mt-4 flex w-full items-center justify-between
              border-t border-[#780d0b]/15 pt-4
              text-xs font-bold text-[#780d0b]
              md:hidden
            "
                  >
                    {revealed ? "Ocultar contenido" : "Ver qué incluye"}

                    <span
                      className={`
                text-lg transition
                ${revealed ? "rotate-45" : ""}
              `}
                    >
                      +
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>


<section
  id="ocasiones"
  className="overflow-hidden bg-[#fffaf3] py-20 md:py-28"
>
  {/* ENCABEZADO */}
  <div className="mx-auto max-w-[1440px] px-5 md:px-10">
    <div className="grid gap-6 md:grid-cols-[1fr_.7fr] md:items-end">
      <div>
        <p className="eyebrow">
          Hecho para ese momento
        </p>

        <h2 className="mt-4 max-w-3xl font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.045em] text-[#64100e]">
          Una sorpresa para
          <br />
          <em className="font-normal text-[#d96a28]">
            cada ocasión.
          </em>
        </h2>
      </div>

      <p className="max-w-md text-sm leading-7 text-[#785c53] md:text-base">
        Cumpleaños, aniversarios, logros o simplemente porque sí.
        Personalizamos los pequeños detalles para que cada sorpresa
        tenga su propia historia.
      </p>
    </div>
  </div>

  {/* CARRUSEL ANIMADO */}
  <div className="occasion-slider mt-12">
    <div className="occasion-track">
      {[...occasions, ...occasions].map((theme, index) => (
        <article
          key={`${theme.name}-${index}`}
          className="occasion-card group"
          style={
            {
              "--occasion-accent": theme.accent,
            } as React.CSSProperties
          }
        >
          {/* IMAGEN */}
          <div className="relative h-[390px] overflow-hidden md:h-[440px]">
            <img
              src={theme.image}
              alt={`Desayuno sorpresa para ${theme.name}`}
              className="
                h-full w-full object-cover
                transition duration-700
                group-hover:scale-[1.07]
              "
            />

            {/* Overlay */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-[#321c19]/75
                via-transparent
                to-transparent
                transition duration-500
                group-hover:from-[#321c19]/90
              "
            />

            {/* Número */}
            <span
              className="
                absolute right-5 top-5
                grid h-10 w-10 place-items-center
                rounded-full
                bg-[#fffaf3]/90
                text-[10px] font-bold
                text-[#780d0b]
                backdrop-blur
              "
            >
              {String((index % occasions.length) + 1).padStart(2, "0")}
            </span>

            {/* TEXTO SOBRE IMAGEN */}
            <div
              className="
                absolute bottom-0 left-0 right-0
                translate-y-2 p-6 text-white
                transition duration-500
                group-hover:translate-y-0
              "
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2c44c]">
                Mañana Rica
              </p>

              <h3 className="mt-2 font-serif text-3xl leading-none">
                {theme.name}
              </h3>

              <p
                className="
                  mt-3 max-h-0 overflow-hidden
                  text-sm leading-5 text-white/80
                  opacity-0
                  transition-all duration-500
                  group-hover:max-h-20
                  group-hover:opacity-100
                "
              >
                {theme.phrase}
              </p>
            </div>
          </div>

          {/* PARTE INFERIOR */}
<button
  type="button"
  onClick={() => {
    setSelectedTheme(theme.name);
    openBuilder(packages[2]!);
  }}
  className="
    flex w-full items-center justify-between
    border border-t-0 border-[#780d0b]/10
    bg-[#fffaf3]
    px-5 py-4
    text-left
    text-[#64100e]
    transition duration-500
    group-hover:bg-[var(--occasion-accent)]
    group-hover:text-white
  "
>
  <span className="text-xs font-bold uppercase tracking-[0.13em]">
    Personalizar paquete
  </span>

  <span className="text-xl transition duration-500 group-hover:translate-x-1">
    →
  </span>
</button>
        </article>
      ))}
    </div>
  </div>

  {/* CTA FINAL */}
  <div className="mx-auto mt-12 max-w-[1440px] px-5 md:px-10">
    <div
      className="
        flex flex-col items-start justify-between gap-6
        border-t border-[#780d0b]/15 pt-8
        md:flex-row md:items-center
      "
    >
      <div>
        <p className="font-serif text-2xl text-[#64100e]">
          ¿No encuentras tu ocasión?
        </p>

        <p className="mt-1 text-sm text-[#785c53]">
          Cuéntanos tu idea y hacemos la sorpresa más tuya.
        </p>
      </div>

      <button
  type="button"
 onClick={() => {
  setSelectedTheme("");
  openBuilder(selected);
}}
  className="
    flex w-full items-center justify-between
    border border-t-0 border-[#780d0b]/10
    bg-[#fffaf3]
    px-5 py-4
    text-left
    text-[#64100e]
    transition duration-500
    group-hover:bg-[var(--occasion-accent)]
    group-hover:text-white
  "
>
  <span className="text-xs font-bold uppercase tracking-[0.13em]">
    Personalizar paquete
  </span>

  <span className="text-xl transition duration-500 group-hover:translate-x-1">
    →
  </span>
</button>
    </div>
  </div>
</section>

<section className="bg-[#780d0b] px-5 py-16 text-[#fff8ef] md:px-10 md:py-20">
  <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-16">

    {/* FOTO */}
    <div className="relative overflow-hidden rounded-t-[120px]">
      <img
        src="/frutaconyoguth.jpeg"
        alt="Ingredientes frescos de Mañana Rica"
        className="h-[420px] w-full object-cover md:h-[520px]"
      />

      <div className="absolute bottom-5 left-5 bg-[#f2c44c] px-5 py-3 text-sm font-bold text-[#64100e]">
        Preparado con cuidado ♥
      </div>
    </div>

    {/* CONTENIDO */}
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f2c44c]">
        Nuestra forma de hacerlo
      </p>

      <h2 className="mt-5 font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.04em]">
        Lo que va dentro
        <br />
        <em className="font-normal text-[#f2c44c]">
          también importa.
        </em>
      </h2>

      <p className="mt-7 max-w-xl text-lg leading-8 text-[#fff8ef]/80">
        No buscamos llenar nuestras cajas con mil cosas.
        Preferimos cuidar lo que ponemos en ellas: ingredientes
        seleccionados, preparación cuidada y alimentos que realmente
        disfrutes.
      </p>

      {/* INGREDIENTES */}
      <div className="mt-9 grid gap-4 sm:grid-cols-2">

        <div className="border-t border-white/20 pt-4">
          <span className="text-xl">🍓</span>
          <h3 className="mt-2 font-serif text-xl">
            Fruta fresca
          </h3>
          <p className="mt-1 text-sm text-white/65">
            Lavada y desinfectada.
          </p>
        </div>

        <div className="border-t border-white/20 pt-4">
          <span className="text-xl">🥣</span>
          <h3 className="mt-2 font-serif text-xl">
            Yogurt griego
          </h3>
          <p className="mt-1 text-sm text-white/65">
            Con fruta y granola.
          </p>
        </div>

        <div className="border-t border-white/20 pt-4">
          <span className="text-xl">🥪</span>
          <h3 className="mt-2 font-serif text-xl">
            Jamón de pavo
          </h3>
          <p className="mt-1 text-sm text-white/65">
            En nuestros sándwiches y croissants.
          </p>
        </div>

        <div className="border-t border-white/20 pt-4">
          <span className="text-xl">🌾</span>
          <h3 className="mt-2 font-serif text-xl">
            Opciones integrales
          </h3>
          <p className="mt-1 text-sm text-white/65">
            En productos seleccionados.
          </p>
        </div>

      </div>

      {/* FRASE FINAL */}
      <div className="mt-10 border-l-2 border-[#f2c44c] pl-5">
        <p className="font-serif text-2xl italic text-[#f2c44c]">
          Bonito por fuera. Cuidado por dentro.
        </p>
      </div>

    </div>
  </div>
</section>
      <section
  id="como-funciona"
  className="overflow-hidden bg-[#eadac7] px-5 py-16 md:px-10 md:py-20"
>
  <div className="mx-auto max-w-[1200px]">

    {/* Encabezado */}
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">Así de sencillo</p>

      <h2 className="mt-4 font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[0.95] tracking-[-0.04em] text-[#64100e]">
        De tu idea{" "}
        <em className="font-normal text-[#d96a28]">
          a su puerta.
        </em>
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#785c53] md:text-base">
        Elige tu desayuno, personalízalo y agenda.
        Nosotros hacemos el resto.
      </p>
    </div>

    {/* Pasos */}
    <div className="relative mt-12">

      {/* Línea que conecta los pasos - escritorio */}
      <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-[#780d0b]/20 md:block" />

      <div className="relative grid gap-4 md:grid-cols-3">
        {processSteps.map((processStep, index) => {
          const isActive = activeProcessStep === index;

          return (
            <button
              key={processStep.number}
              type="button"
              onClick={() => setActiveProcessStep(index)}
              className={`
                group relative flex flex-col items-center
                px-5 py-5 text-center
                transition-all duration-500
                ${
                  isActive
                    ? "md:-translate-y-1"
                    : "hover:md:-translate-y-1"
                }
              `}
            >
              {/* Número */}
              <span
                className={`
                  relative z-10 grid h-14 w-14 place-items-center
                  rounded-full border
                  font-serif text-lg
                  transition-all duration-500
                  ${
                    isActive
                      ? "border-[#780d0b] bg-[#780d0b] text-[#f2c44c] shadow-[0_8px_25px_rgba(120,13,11,0.18)]"
                      : "border-[#780d0b]/25 bg-[#eadac7] text-[#780d0b] group-hover:border-[#780d0b]"
                  }
                `}
              >
                {processStep.number}
              </span>

              {/* Nombre */}
              <h3
                className={`
                  mt-5 font-serif text-2xl
                  transition-colors duration-300
                  ${
                    isActive
                      ? "text-[#780d0b]"
                      : "text-[#64100e]"
                  }
                `}
              >
                {processStep.title}
              </h3>

              {/* Descripción */}
              <p className="mt-2 max-w-[280px] text-sm leading-6 text-[#785c53]">
                {processStep.description}
              </p>

              {/* Indicador */}
              <span
                className={`
                  mt-5 h-[3px] rounded-full
                  transition-all duration-500
                  ${
                    isActive
                      ? "w-16 bg-[#d96a28]"
                      : "w-6 bg-[#780d0b]/15"
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </div>

    {/* Mensaje del paso activo */}
    <div
      key={activeProcessStep}
      className="
        process-step-animation
        mx-auto mt-7 max-w-2xl
        border border-[#780d0b]/10
        bg-[#f8f2e9]
        px-6 py-5 text-center
        shadow-[0_12px_35px_rgba(75,30,20,0.06)]
        md:px-8
      "
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d96a28]">
        Paso {currentProcessStep.number}
      </p>

      <p className="mt-2 font-serif text-xl text-[#64100e] md:text-2xl">
        {currentProcessStep.title}
      </p>
    </div>

    {/* CTA */}
    <div className="mt-8 flex justify-center">
      <button
        type="button"
        onClick={() =>
          document
            .getElementById("paquetes")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="
          group flex items-center gap-3
          bg-[#780d0b] px-6 py-3.5
          text-sm font-bold text-white
          transition duration-300
          hover:bg-[#951a16]
        "
      >
        Ver paquetes
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>
    </div>

  </div>
</section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid overflow-hidden bg-[#64100e] text-[#fff8ef] lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-8 md:p-14 lg:p-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.23em] text-[#f2c44c]">
              Un detalle importante
            </p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.04] md:text-6xl">
              No enviamos solo desayuno. Enviamos ese “pensé en ti”.
            </h2>
            <button
              onClick={() => openBuilder(packages[0]!)}
              className="mt-9 flex items-center gap-3 bg-[#f2c44c] px-6 py-4 text-sm font-bold text-[#64100e] transition hover:bg-white"
            >
              Armar una sorpresa <ArrowIcon />
            </button>
          </div>
          <div className="relative min-h-80">
            <img
              src="/rayito_de_sol.png"
              alt="Paquete Día Bonito personalizado con fotografías"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section
        id="condiciones"
        className="bg-[#f8f2e9] px-5 py-20 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Antes de realizar tu pedido</p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#64100e] md:text-5xl">
              Detalles importantes
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#785c53] md:text-base">
              Queremos preparar cada sorpresa con tiempo y mucho cuidado. Revisa
              estas condiciones antes de enviar tu solicitud.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {orderRules.map((rule) => (
              <article
                key={rule.number}
                className="group border border-[#780d0b]/15 bg-[#fffaf3] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#780d0b]/35 hover:shadow-[0_16px_35px_rgba(75,30,20,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d96a28]">
                    Regla {rule.number}
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[#f2c44c]"
                  />
                </div>

                <h3 className="mt-4 font-serif text-2xl leading-tight text-[#64100e]">
                  {rule.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#785c53]">
                  {rule.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-[#8f6c60]">
            Al enviar tu solicitud confirmas que leíste estas condiciones. El
            pedido se considera confirmado únicamente después de validar el
            anticipo.
          </p>
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto grid max-w-[1160px] gap-10 px-5 pb-28 md:grid-cols-[.7fr_1.3fr] md:px-10"
      >
        <div>
          <p className="eyebrow">Antes de ordenar</p>
          <h2 className="mt-3 font-serif text-4xl text-[#64100e] md:text-5xl">
            Lo bueno se planea.
          </h2>
        </div>
        <div className="divide-y divide-[#780d0b]/15 border-y border-[#780d0b]/15">
          {[
            [
              "¿Con cuánto tiempo debo pedir?",
              "Recomendamos al menos 24 horas de anticipación. Para pedidos del mismo día, consulta disponibilidad por WhatsApp.",
            ],
            [
              "¿Entregan en todo Morelia?",
              "Sí, cubrimos Morelia y zonas cercanas. El costo se calcula según la zona elegida al comprar.",
            ],
            [
              "¿Puedo cambiar alimentos?",
              "Claro. Puedes indicarnos alergias o preferencias; confirmaremos contigo cualquier ajuste especial.",
            ],
          ].map(([question, answer]) => (
            <details key={question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-[#64100e]">
                {question}
                <span className="text-2xl font-light transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-xl pt-4 text-sm leading-6 text-[#785c53]">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <footer className="bg-[#2f1714] px-5 py-12 text-center text-[#f8f2e9] md:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/manana-rica-logo.png"
              alt=""
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="font-serif text-2xl">Mañana Rica</p>
              <p className="text-xs text-[#d9bca9]">
                Desayunos sorpresa · Morelia, Mich.
              </p>
            </div>
          </div>

          <div className="text-sm leading-7 text-[#d9bca9]">
            <p>Lunes a sábado · 8:00–18:00</p>
            <p>Pedidos con 24 h de anticipación</p>
          </div>

          {whatsappInfoUrl && (
            <a href={whatsappInfoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-[#f2c44c]">
              Hablar por WhatsApp <ArrowIcon />
            </a>
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-[1440px] flex-col items-center justify-center gap-2 border-t border-white/10 pt-5 text-center text-[11px] text-[#a88d82] md:flex-row md:gap-6">
          <span>
            © 2026{" "}
            <a href="https://estudiobinariomx.com/" target="_blank" rel="noopener noreferrer">
              Estudio Binario Mx
            </a>
          </span>
          <span>Hechos con amor en Morelia Mich</span>
        </div>
      </footer>

      {whatsappInfoUrl && (
        <a
          href={whatsappInfoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Contactar a Mañana Rica por WhatsApp"
          aria-hidden={!showFloatingButton}
          tabIndex={showFloatingButton ? 0 : -1}
          className={`group fixed bottom-4 right-4 z-40 rounded-full bg-[#fffaf3] p-1 shadow-[0_12px_35px_rgba(74,31,20,0.28)] transition duration-300 hover:scale-110 md:bottom-8 md:right-8 md:p-1.5 ${showFloatingButton
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
            }`}
        >
          <img
            src="/manana-rica-logo.png"
            alt=""
            className="manana-floating-logo h-12 w-12 object-contain md:h-20 md:w-20"
          />

          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap bg-[#780d0b] px-4 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 md:block">
            Pedir por WhatsApp
          </span>
        </a>
      )}

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#2b1410]/55 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Personalizar pedido"
        >
          <button
            className="absolute inset-0 cursor-default"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar personalizador"
          />
          <aside className="relative h-full w-full overflow-y-auto bg-[#fffaf3] shadow-2xl md:w-[min(760px,92vw)]">
            <div className="sticky top-0 z-10 border-b border-[#780d0b]/10 bg-[#fffaf3]/95 px-5 py-5 backdrop-blur md:px-9">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b25b2b]">
                    Tu sorpresa
                  </p>
                  <h2 className="mt-1 font-serif text-2xl text-[#64100e]">
                    {confirmed ? "Solicitud preparada" : selected.name}
                  </h2>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#780d0b]/15 text-xl text-[#64100e]"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              {!confirmed && (
                <div
                  className="mt-5 grid grid-cols-4 gap-2"
                  aria-label={`Paso ${step} de 4`}
                >
                  {[1, 2, 3, 4].map((item) => (
                    <span
                      key={item}
                      className={`h-1 ${item <= step ? "bg-[#d96a28]" : "bg-[#e8d9ca]"}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="px-5 py-7 md:px-9 md:py-9">
              {step === 1 && (
                <div>
                  <p className="step-label">Paso 1 · Personaliza</p>
                  <h3 className="step-title">Hazlo muy de esa persona.</h3>
                  {selectedTheme && (
  <div className="mt-5 flex items-center justify-between border border-[#780d0b]/15 bg-[#f8eee1] px-4 py-3">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b25b2b]">
        Temática seleccionada
      </p>

      <p className="mt-1 font-serif text-xl text-[#64100e]">
        {selectedTheme}
      </p>
    </div>

    <span className="text-2xl">♥</span>
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
                          className={`flex items-center gap-4 border p-4 text-left transition ${active ? "border-[#780d0b] bg-[#f8eee1]" : "border-[#d8c7b7] hover:border-[#b9896e]"}`}
                          aria-pressed={active}
                        >
                          <span
                            className={`grid h-11 w-11 place-items-center rounded-full text-xl ${active ? "bg-[#780d0b] text-white" : "bg-[#eadac7] text-[#780d0b]"}`}
                          >
                            {active ? <CheckIcon /> : extra.icon}
                          </span>
                          <span className="flex-1">
                            <b className="block text-sm">{extra.name}</b>
                            <small className="text-[#8a6b60]">
                              + {money(extra.price)}
                            </small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <label className="mt-7 block text-xs font-bold uppercase tracking-[.13em] text-[#79564c]">
                    ¿Cuál es la ocasión?
                  </label>

                  <p className="mt-2 text-sm text-[#8f6c60]">
                    Selecciona el motivo de la sorpresa.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {[
                      {
                        name: "Cumpleaños",
                        description: "Para celebrar su día",
                      },
                      {
                        name: "Amor y aniversario",
                        description: "Pareja y enamorados",
                      },
                      {
                        name: "Agradecimiento",
                        description: "Para decir gracias",
                      },
                      {
                        name: "Mejórate pronto",
                        description: "Un detalle que acompaña",
                      },
                      {
                        name: "Familia",
                        description: "Mamá, papá y abuelos",
                      },
                      {
                        name: "Logros y graduación",
                        description: "Graduación, ascenso o meta",
                      },
                      {
                        name: "Fechas especiales",
                        description: "Niñez, estudiantes, docentes…",
                      },
                      {
                        name: "Porque sí u otra ocasión",
                        description: "Cuéntanos el motivo",
                      },
                    ].map((item) => {
                      const isSelected = occasion === item.name;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setOccasion(item.name)}
                          aria-pressed={isSelected}
                          className={`min-h-[76px] border px-3 py-3 text-left transition duration-300 ${isSelected
                              ? "border-[#780d0b] bg-[#780d0b] text-white shadow-md"
                              : "border-[#d8c7b7] bg-[#fffaf3] text-[#64100e] hover:-translate-y-0.5 hover:border-[#780d0b]/50"
                            }`}
                        >
                          <span className="block text-sm font-semibold leading-tight">
                            {item.name}
                          </span>

                          <span
                            className={`mt-1 block text-[11px] leading-4 ${isSelected ? "text-white/75" : "text-[#8f6c60]"
                              }`}
                          >
                            {item.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-8 border-t border-[#780d0b]/10 pt-6">
                    <p className="summary-label">Este paquete incluye</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {selected.includes.map((item) => (
                        <span
                          key={item}
                          className="flex items-center gap-2 text-sm text-[#68483f]"
                        >
                          <CheckIcon />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <small>{message.length}/180</small>
                  </label>
                  <label className="field mt-5">
                    Alergias o indicaciones especiales <span>(opcional)</span>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Sin nueces, leche deslactosada…"
                    />
                  </label>
                </form>
              )}
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
                        min={minDate}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </label>
                    <label className="field">
                      Horario
                      <select
                        value={schedule}
                        onChange={(event) => setSchedule(event.target.value)}
                      >
                        <option>8:00 – 9:30</option>
                        <option>9:30 – 11:00</option>
                        <option>11:00 – 12:30</option>
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
                        inputMode="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="443 000 0000"
                      />
                    </label>

                    <label className="field">
                      Teléfono de quien recibe
                      <input
                        required
                        inputMode="tel"
                        value={recipientPhone}
                        onChange={(event) =>
                          setRecipientPhone(event.target.value)
                        }
                        placeholder="443 000 0000"
                      />
                    </label>

                    <label className="field">
                      Zona de entrega
                      <select
                        required
                        value={deliveryZone}
                        onChange={(event) =>
                          setDeliveryZone(event.target.value)
                        }
                      >
                        <option value="" disabled>
                          Selecciona una zona
                        </option>

                        <option value="centro">
                          Dentro de Morelia · por cotizar
                        </option>

                        <option value="extendida">
                          Alrededores · sujeto a cobertura
                        </option>
                      </select>
                    </label>

                    <label className="field">
                      ¿Debemos conservar la sorpresa?
                      <select
                        required
                        value={deliveryPreference}
                        onChange={(event) =>
                          setDeliveryPreference(event.target.value)
                        }
                      >
                        <option value="surprise">
                          Sí, contacten primero a quien solicita
                        </option>

                        <option value="recipient">
                          No, pueden llamar a quien recibe
                        </option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-6 border-l-2 border-[#d96a28] bg-[#f8eee1] p-4 text-xs leading-5 text-[#785c53]">
                    La hora corresponde a una ventana aproximada. El costo de
                    envío se cotizará según la dirección y se confirmará por
                    WhatsApp. En entregas con mensajería externa, la persona
                    destinataria podría necesitar salir a recibir el paquete.
                  </div>
                </form>
              )}
              {step === 4 && (
                <div>
                  <p className="step-label">Paso 4 · Revisa tu solicitud</p>
                  <h3 className="step-title">
                    Todo listo para alegrar su mañana.
                  </h3>
                  <div className="mt-7 flex gap-4 border-b border-[#780d0b]/10 pb-6">
                    <img
                      src={selected.image}
                      alt=""
                      className="h-24 w-24 object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-serif text-xl text-[#64100e]">
                        {selected.name}
                      </h4>
                      <p className="mt-1 text-xs text-[#785c53]">
                        {occasion} · {recipient || "Destinatario"}
                      </p>
                      <p className="mt-3 text-sm font-bold">
                        {money(selected.price)}
                      </p>
                    </div>
                  </div>
                  {selectedExtras.length > 0 && (
                    <div className="border-b border-[#780d0b]/10 py-5">
                      <p className="summary-label">Extras</p>
                      {extras
                        .filter((e) => selectedExtras.includes(e.id))
                        .map((e) => (
                          <div
                            key={e.id}
                            className="mt-2 flex justify-between text-sm"
                          >
                            <span>{e.name}</span>
                            <span>{money(e.price)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                  <div className="grid gap-4 border-b border-[#780d0b]/10 py-5 text-sm sm:grid-cols-2">
                    <div>
                      <p className="summary-label">Entrega</p>
                      <p className="mt-2">
                        {date || "Fecha por definir"}
                        <br />
                        {schedule}
                        <br />
                        {deliveryZone === "centro"
                          ? "Dentro de Morelia"
                          : deliveryZone === "extendida"
                            ? "Alrededores de Morelia"
                            : "Zona por definir"}

                        <br />

                        <span className="text-[#d96a28]">
                          Envío por cotizar
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="summary-label">Dirección</p>
                      <p className="mt-2 line-clamp-2">
                        {address || "Dirección por definir"}
                      </p>
                    </div>
                  </div>
                  <p className="summary-label mt-6">Forma de pago</p>
                  <div className="mt-3 border border-[#780d0b] bg-[#f8eee1] p-4 text-sm">
                    <b className="block text-[#64100e]">
                      Transferencia bancaria
                    </b>
                    <small className="mt-1 block leading-5 text-[#8a6b60]">
                      Te enviaremos los datos por WhatsApp después de revisar la
                      disponibilidad. El pedido se confirma al recibir el
                      comprobante del anticipo.
                    </small>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-y border-[#780d0b]/15 py-5">
                    <div>
                      <span className="block font-serif text-xl">Subtotal</span>

                      <small className="text-xs text-[#785c53]">
                        Envío no incluido
                      </small>
                    </div>
                    <strong className="font-serif text-3xl text-[#780d0b]">
                      {money(total)}
                    </strong>
                  </div>
                </div>
              )}
              {step === 5 && confirmed && (
                <div className="py-5 text-center">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f2c44c] text-[#64100e]">
                    <CheckIcon />
                  </div>
                  <p className="step-label mt-7">Resumen preparado</p>
                  <h3 className="mt-3 font-serif text-4xl text-[#64100e]">
                    ¡Tu solicitud está lista!
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#785c53]">
                    Envíala por WhatsApp para revisar disponibilidad y recibir
                    los datos de transferencia. Tu pedido quedará confirmado
                    cuando recibamos el comprobante del anticipo.
                  </p>
                  <div className="mx-auto mt-8 max-w-md border border-[#d8c7b7] p-5 text-left text-sm">
                    <div className="flex justify-between">
                      <span>{selected.name}</span>
                      <b>{money(total)}</b>
                    </div>
                    <div className="mt-3 flex justify-between text-[#785c53]">
                      <span>{date || "Fecha por definir"}</span>
                      <span>{schedule}</span>
                    </div>
                  </div>
                  {whatsappOrderUrl ? (
                    <a
                      href={whatsappOrderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mx-auto mt-6 flex w-fit items-center gap-3 bg-[#780d0b] px-6 py-4 text-sm font-bold text-white"
                    >
                      Enviar solicitud por WhatsApp <ArrowIcon />
                    </a>
                  ) : (
                    <div className="mx-auto mt-6 w-fit border border-[#d8c7b7] bg-[#f8eee1] px-6 py-4 text-sm font-semibold text-[#785c53]">
                      Pedidos por WhatsApp disponibles próximamente
                    </div>
                  )}
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="mt-5 block w-full text-sm font-semibold text-[#780d0b] underline underline-offset-4"
                  >
                    Volver a la tienda
                  </button>
                </div>
              )}
            </div>
            {!confirmed && (
              <div className="sticky bottom-0 border-t border-[#780d0b]/10 bg-[#fffaf3] px-5 py-5 shadow-[0_-12px_35px_rgba(74,31,20,.08)] md:px-9">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-[#785c53]">Subtotal (sin envío)</span>
                  <strong className="font-serif text-2xl text-[#64100e]">
                    {money(total)}
                  </strong>
                </div>
                <div className="flex gap-3">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="border border-[#780d0b]/25 px-5 py-3.5 text-sm font-bold text-[#64100e]"
                    >
                      Atrás
                    </button>
                  )}
                  {step < 4 ? (
                    <button
                      type="submit"
                      form={
                        step === 2
                          ? "recipient-form"
                          : step === 3
                            ? "delivery-form"
                            : undefined
                      }
                      onClick={step === 1 ? () => nextStep() : undefined}
                      className="flex flex-1 items-center justify-center gap-3 bg-[#780d0b] px-6 py-3.5 text-sm font-bold text-white"
                    >
                      Continuar <ArrowIcon />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setConfirmed(true);
                        setStep(5);
                      }}
                      className="flex flex-1 items-center justify-center gap-3 bg-[#d96a28] px-6 py-3.5 text-sm font-bold text-white"
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