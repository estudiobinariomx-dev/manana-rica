// Temporadas de Mañana Rica.
// Este archivo no usa React: lo leen tanto el layout (servidor) como la página (cliente).

export type Season =
    | "normal"
    | "amor"
    | "ninos"
    | "mama"
    | "papa"
    | "patrias"
    | "halloween"
    | "muertos"
    | "navidad";

export type Mode = "light" | "dark";

export const SEASONS: Season[] = [
    "normal",
    "amor",
    "ninos",
    "mama",
    "papa",
    "patrias",
    "halloween",
    "muertos",
    "navidad",
];

/**
 * Fechas en que cada temporada se activa sola (hora de Morelia).
 * Formato MMDD: 201 = 1 de febrero, 1027 = 27 de octubre.
 * Si "start" es mayor que "end", el rango cruza el año nuevo (diciembre → enero).
 * "end: 'tercer-domingo-junio'" se calcula cada año (Día del Padre).
 * Fuera de estos rangos se usa el tema normal.
 */
export const SEASON_DATES: {
    season: Exclude<Season, "normal">;
    start: number;
    end: number | "tercer-domingo-junio";
}[] = [
        { season: "amor", start: 201, end: 214 },
        { season: "ninos", start: 420, end: 430 },
        { season: "mama", start: 501, end: 510 },
        { season: "papa", start: 601, end: "tercer-domingo-junio" },
        { season: "patrias", start: 901, end: 916 },
        { season: "halloween", start: 1001, end: 1027 },
        { season: "muertos", start: 1028, end: 1103 },
        { season: "navidad", start: 1201, end: 106 },
    ];

// Clave de localStorage para recordar si el visitante eligió modo claro u oscuro
export const MODE_STORAGE_KEY = "mr-mode";

type SeasonText = {
    /** Etiqueta arriba del título principal */
    eyebrow: string;
    /** Las dos líneas del círculo amarillo junto a la foto */
    badge: [string, string];
    /** Frases de la franja que se desliza */
    marquee: string[];
    /** Ocasión que se muestra primero en el carrusel (debe coincidir con su nombre) */
    featuredOccasion?: string;
};

/** Textos que cambian según la temporada */
export const seasonContent: Record<Season, SeasonText> = {
    normal: {
        eyebrow: "Entregas en Morelia",
        badge: ["Ingredientes", "frescos y saludables."],
        marquee: ["Ingredientes frescos", "Personalizable", "Entrega local", "Hecho en Morelia"],
    },
    amor: {
        eyebrow: "Amor y amistad · Morelia",
        badge: ["Con todo", "el corazón"],
        marquee: ["Amor y amistad", "Detalles que enamoran", "Personalizable", "Hecho en Morelia"],
        featuredOccasion: "Amor y aniversario",
    },
    ninos: {
        eyebrow: "Día del Niño · Morelia",
        badge: ["Para los", "más peques"],
        marquee: ["Día del Niño", "Sorpresas divertidas", "Personalizable", "Hecho en Morelia"],
    },
    mama: {
        eyebrow: "Día de las Madres · Morelia",
        badge: ["Para la", "mejor mamá"],
        marquee: ["Consiente a mamá", "Una mañana para ella", "Personalizable", "Hecho en Morelia"],
        featuredOccasion: "Día de las Madres",
    },
    papa: {
        eyebrow: "Día del Padre · Morelia",
        badge: ["Para el", "mejor papá"],
        marquee: ["Gracias, papá", "Un desayuno para él", "Personalizable", "Hecho en Morelia"],
        featuredOccasion: "Día del Padre",
    },
    patrias: {
        eyebrow: "Mes patrio · Morelia",
        badge: ["¡Viva", "México!"],
        marquee: ["Mes patrio", "Sabor bien mexicano", "Personalizable", "Hecho en Morelia"],
    },
    halloween: {
        eyebrow: "Edición Halloween · Morelia",
        badge: ["Dulce", "o truco"],
        marquee: ["Dulce o truco", "Sorpresas de miedo", "Personalizable", "Hecho en Morelia"],
    },
    muertos: {
        eyebrow: "Día de Muertos · Morelia",
        badge: ["Amor que", "no se olvida"],
        marquee: ["Tradición y sabor", "Para quienes recordamos", "Personalizable", "Hecho en Morelia"],
    },
    navidad: {
        eyebrow: "Edición navideña · Morelia",
        badge: ["Feliz", "Navidad"],
        marquee: ["Regala una mañana bonita", "Detalles navideños", "Personalizable", "Hecho en Morelia"],
    },
};

/**
 * Script que corre antes de que la página se pinte. Pone en <html>:
 *   data-season = temporada (por fecha, o forzada con ?tema=navidad en la URL)
 *   data-mode   = light | dark (lo que eligió el visitante o, si no, lo de su sistema)
 * Así los colores correctos aparecen desde el primer instante, sin parpadeo.
 */
export const themeInitScript = `(function () {
  try {
    var root = document.documentElement;
    var seasons = ${JSON.stringify(SEASONS)};
    var ranges = ${JSON.stringify(SEASON_DATES)};
    var forced = new URLSearchParams(location.search).get("tema");
    var season = "normal";

    if (forced && seasons.indexOf(forced) > -1) {
      season = forced;
    } else {
      // Fecha de hoy en Morelia, como "2026-10-02"
      var today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit"
      }).format(new Date()).split("-");
      var year = Number(today[0]);
      var md = Number(today[1] + today[2]);

      for (var i = 0; i < ranges.length; i++) {
        var r = ranges[i];
        var end = r.end;
        if (end === "tercer-domingo-junio") {
          var juneFirst = new Date(Date.UTC(year, 5, 1)).getUTCDay();
          end = 600 + 1 + ((7 - juneFirst) % 7) + 14;
        }
        var inRange = r.start <= end ? md >= r.start && md <= end : md >= r.start || md <= end;
        if (inRange) { season = r.season; break; }
      }
    }

    var mode = localStorage.getItem("${MODE_STORAGE_KEY}");
    if (mode !== "light" && mode !== "dark") {
      mode = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    root.dataset.season = season;
    root.dataset.mode = mode;
  } catch (e) {}
})();`;