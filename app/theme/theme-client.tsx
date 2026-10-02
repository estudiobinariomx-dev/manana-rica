"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import { MODE_STORAGE_KEY, SEASONS, type Mode, type Season } from "./seasons";

/* ------------------------------------------------------------------ */
/* Lectura del tema desde <html data-season data-mode>                 */
/* ------------------------------------------------------------------ */

const subscribe = (onChange: () => void) => {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-season", "data-mode"],
    });
    return () => observer.disconnect();
};

const readSeason = (): Season => {
    const value = document.documentElement.dataset.season as Season | undefined;
    return value && SEASONS.includes(value) ? value : "normal";
};

const readMode = (): Mode =>
    document.documentElement.dataset.mode === "dark" ? "dark" : "light";

/** Temporada activa. En el servidor siempre es "normal". */
export function useSeason(): Season {
    return useSyncExternalStore(subscribe, readSeason, () => "normal");
}

/** Modo claro u oscuro activo. */
export function useMode(): Mode {
    return useSyncExternalStore(subscribe, readMode, () => "light");
}

/* ------------------------------------------------------------------ */
/* Botón de modo claro / oscuro                                        */
/* ------------------------------------------------------------------ */

export function ModeToggle({ className = "" }: { className?: string }) {
    const mode = useMode();
    const isDark = mode === "dark";

    const toggle = () => {
        const next: Mode = isDark ? "light" : "dark";
        document.documentElement.dataset.mode = next;
        try {
            localStorage.setItem(MODE_STORAGE_KEY, next);
        } catch {
            // Sin almacenamiento (modo privado estricto): el cambio dura solo esta visita
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition duration-300 ${className}`}
        >
            {isDark ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4.2" />
                    <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
                </svg>
            )}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/* Decoraciones de temporada                                           */
/* ------------------------------------------------------------------ */

/** Guirnalda que cuelga en la parte alta del hero */
export function SeasonGarland({ season }: { season: Season }) {
    const garlands: Partial<Record<Season, () => ReactNode>> = {
        amor: () => <HeartGarland />,
        ninos: () => (
            <Bunting colors={["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"]} icon={(i) => (i % 2 ? <StarIcon /> : null)} />
        ),
        mama: () => <FlowerGarland />,
        papa: () => <Bunting colors={["#22395c", "#e9b44c", "#f4f1ea"]} icon={(i) => (i % 3 === 0 ? <TieIcon /> : null)} />,
        patrias: () => <PapelPicado colors={["#006847", "#ffffff", "#ce1126"]} />,
        halloween: () => (
            <Bunting
                colors={["#ff7a1a", "#4b2466", "#7cb518"]}
                icon={(i) => (i % 3 === 0 ? <PumpkinFace /> : i % 3 === 1 ? <MiniBat /> : null)}
            />
        ),
        muertos: () => <PapelPicado colors={["#e4007c", "#ff8c00", "#7b2cbf", "#ffd60a", "#00a6a6", "#e63946"]} />,
        navidad: () => <Lights />,
    };

    const garland = garlands[season];
    if (!garland) return null;

    return (
        <div
            aria-hidden="true"
            className="season-garland pointer-events-none absolute inset-x-0 top-[78px] z-20 flex justify-center overflow-hidden"
        >
            {garland()}
        </div>
    );
}

/** Elementos que flotan alrededor de la foto del hero */
export function SeasonFloaters({ season }: { season: Season }) {
    const floaters: Partial<Record<Season, () => ReactNode>> = {
        amor: () => <Heart />,
        ninos: () => <Balloon />,
        mama: () => <Flower />,
        papa: () => <Mustache />,
        patrias: () => <Rehilete />,
        halloween: () => <Bat />,
        muertos: () => <Marigold />,
        navidad: () => <Snowflake />,
    };

    const item = floaters[season];
    if (!item) return null;

    const spots = [
        "left-[6%] top-[12%] h-10 w-10",
        "left-[38%] top-[4%] h-7 w-7 [animation-delay:-1.4s]",
        "right-[30%] top-[18%] h-8 w-8 [animation-delay:-2.6s]",
        "left-[-2%] bottom-[30%] h-8 w-8 [animation-delay:-0.8s]",
        "right-[4%] bottom-[22%] h-11 w-11 [animation-delay:-3.2s]",
    ];

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
            {spots.map((spot) => (
                <span key={spot} className={`season-floater absolute ${spot}`}>
                    {item()}
                </span>
            ))}
        </div>
    );
}

/* ---------- Guirnaldas ---------- */

function PapelPicado({ colors }: { colors: string[] }) {
    return (
        <svg viewBox="0 0 1200 70" className="h-auto w-full min-w-[900px]">
            <path d="M0 4 Q600 14 1200 4" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
            {Array.from({ length: 16 }, (_, i) => {
                const x = 8 + i * 74.5;
                const y = 6 + Math.sin((i / 15) * Math.PI) * 6;
                return (
                    <g key={i} transform={`translate(${x} ${y})`}>
                        <g className="garland-sway" style={{ animationDelay: `${-i * 0.3}s` }}>
                            <path
                                d="M0 0h62v46l-5.2 6-5.2-6-5.2 6-5.2-6-5.2 6-5.2-6-5.2 6-5.2-6-5.2 6-5.2-6-5.2 6L0 46Z"
                                fill={colors[i % colors.length]}
                                fillOpacity=".95"
                                stroke="#000"
                                strokeOpacity=".08"
                            />
                            {/* Recortes del papel */}
                            <g fill="var(--c-bg)">
                                <circle cx="31" cy="20" r="7" />
                                <path d="M31 5l3 5h-6Z" />
                                <path d="M12 14l4 4-4 4-4-4Z" />
                                <path d="M50 14l4 4-4 4-4-4Z" />
                                <circle cx="14" cy="36" r="2.4" />
                                <circle cx="31" cy="38" r="2.4" />
                                <circle cx="48" cy="36" r="2.4" />
                            </g>
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}

/** Banderines triangulares con un ícono opcional en algunos */
function Bunting({ colors, icon }: { colors: string[]; icon?: (i: number) => ReactNode }) {
    return (
        <svg viewBox="0 0 1200 64" className="h-auto w-full min-w-[900px]">
            <path d="M0 6 Q600 22 1200 6" fill="none" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.5" />
            {Array.from({ length: 22 }, (_, i) => {
                const x = 6 + i * 54.4;
                const t = i / 21;
                const y = 8 + 32 * t * (1 - t);
                return (
                    <g key={i} transform={`translate(${x} ${y})`}>
                        <g className="garland-sway" style={{ animationDelay: `${-i * 0.25}s` }}>
                            <path d="M0 0h40L20 38Z" fill={colors[i % colors.length]} stroke="#000" strokeOpacity=".08" />
                            {icon?.(i)}
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}

/** Corazones colgando de un hilo */
function HeartGarland() {
    const colors = ["#e11d48", "#fb7185", "#be123c", "#f9a8d4"];

    return (
        <svg viewBox="0 0 1200 70" className="h-auto w-full min-w-[900px]">
            <path d="M0 6 Q600 26 1200 6" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
            {Array.from({ length: 20 }, (_, i) => {
                const x = 30 + i * 60;
                const t = (x - 0) / 1200;
                const y = 6 + 40 * t * (1 - t);
                const drop = 10 + (i % 3) * 8;
                return (
                    <g key={i} transform={`translate(${x} ${y})`}>
                        <g className="garland-sway" style={{ animationDelay: `${-i * 0.3}s` }}>
                            <path d={`M0 0V${drop}`} stroke="currentColor" strokeOpacity=".35" />
                            <path
                                transform={`translate(0 ${drop})`}
                                d="M0 18C-10 10-14 4-10-1s9-3 10 2c1-5 6-7 10-2s0 11-10 19Z"
                                fill={colors[i % colors.length]}
                            />
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}

/** Florecitas sobre una enredadera */
function FlowerGarland() {
    const colors = ["#f472b6", "#fda4af", "#c084fc", "#fdba74"];

    return (
        <svg viewBox="0 0 1200 60" className="h-auto w-full min-w-[900px]">
            <path
                d="M0 14 Q75 30 150 14 T300 14 T450 14 T600 14 T750 14 T900 14 T1050 14 T1200 14"
                fill="none"
                stroke="#6b8f5e"
                strokeWidth="2.5"
            />
            {Array.from({ length: 24 }, (_, i) => {
                const x = 25 + i * 50;
                const y = 14 + Math.sin(((x % 150) / 150) * Math.PI) * 11;
                return (
                    <g key={i} transform={`translate(${x} ${y})`}>
                        {i % 2 === 0 ? (
                            <g className="garland-sway" style={{ animationDelay: `${-i * 0.2}s` }}>
                                {[0, 72, 144, 216, 288].map((deg) => (
                                    <ellipse key={deg} cx="0" cy="-6" rx="4.5" ry="6.5" fill={colors[(i / 2) % colors.length]} transform={`rotate(${deg})`} />
                                ))}
                                <circle r="3.2" fill="#fde68a" />
                            </g>
                        ) : (
                            <path d="M0 0c-6-6-10-2-10 2 4 1 7 0 10-2Zm0 0c6-6 10-2 10 2-4 1-7 0-10-2Z" fill="#6b8f5e" />
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

function Lights() {
    const colors = ["#e63946", "#2a9d5c", "#f4c430", "#3d8bfd"];

    return (
        <svg viewBox="0 0 1200 60" className="h-auto w-full min-w-[900px]">
            <path
                d="M0 8 Q75 30 150 8 T300 8 T450 8 T600 8 T750 8 T900 8 T1050 8 T1200 8"
                fill="none"
                stroke="#2f5d3a"
                strokeWidth="2.5"
            />
            {Array.from({ length: 24 }, (_, i) => {
                const x = 25 + i * 50;
                // Sigue la curva del cable (onda de 150 px)
                const y = 8 + Math.sin(((x % 150) / 150) * Math.PI) * 11;
                return (
                    <g key={i} transform={`translate(${x} ${y})`}>
                        <rect x="-3" y="0" width="6" height="6" rx="1" fill="#2f5d3a" />
                        <ellipse
                            cx="0"
                            cy="15"
                            rx="6"
                            ry="9"
                            fill={colors[i % colors.length]}
                            className="light-twinkle"
                            style={{ animationDelay: `${(i % 4) * 0.45}s` }}
                        />
                    </g>
                );
            })}
        </svg>
    );
}

/* ---------- Íconos para banderines (coordenadas del banderín de 40×38) ---------- */

function PumpkinFace() {
    return (
        <g fill="#1c1520">
            <path d="M13 8l4 4h-6Z" />
            <path d="M27 8l4 4h-6Z" />
            <path d="M12 17q8 6 16 0-8 3-16 0Z" />
        </g>
    );
}

function MiniBat() {
    return (
        <path
            d="M20 12c-2 0-3 1.5-3 3-2-2-5-2.5-7-1 2 .5 3 2 3 3.5 2-.8 4 0 5 1.5l2-2 2 2c1-1.5 3-2.3 5-1.5 0-1.5 1-3 3-3.5-2-1.5-5-1-7 1 0-1.5-1-3-3-3Z"
            fill="#ff7a1a"
        />
    );
}

function StarIcon() {
    return <path d="M20 5l2.4 5 5.4.6-4 3.7 1.1 5.3L20 17l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6Z" fill="#fff" fillOpacity=".9" />;
}

function TieIcon() {
    return (
        <g fill="#e9b44c">
            <path d="M17 5h6l-1.4 3h-3.2Z" />
            <path d="M18.6 8h2.8l2.4 12-3.8 4-3.8-4Z" />
        </g>
    );
}

/* ---------- Elementos flotantes ---------- */

function Heart() {
    return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
            <path d="M20 35C8 26 3 19 6 12s11-7 14-1c3-6 11-6 14 1s-2 14-14 23Z" fill="#e11d48" />
            <path d="M12 12c-2 1-3 3-3 5" stroke="#fff" strokeOpacity=".6" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function Balloon() {
    return (
        <svg viewBox="0 0 40 56" className="h-full w-full">
            <ellipse cx="20" cy="18" rx="14" ry="17" fill="#3b82f6" />
            <path d="M17 35h6l-3 4Z" fill="#2563eb" />
            <path d="M20 39q-4 6 0 10t0 7" stroke="currentColor" strokeOpacity=".4" fill="none" />
            <ellipse cx="14" cy="11" rx="3" ry="5" fill="#fff" fillOpacity=".5" transform="rotate(-20 14 11)" />
        </svg>
    );
}

function Flower() {
    return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
            {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse key={deg} cx="20" cy="10" rx="6" ry="9" fill={deg % 120 ? "#f472b6" : "#f9a8d4"} transform={`rotate(${deg} 20 20)`} />
            ))}
            <circle cx="20" cy="20" r="5.5" fill="#fde68a" />
        </svg>
    );
}

function Mustache() {
    return (
        <svg viewBox="2 3 44 15" className="h-full w-full text-[#3b2a1e] dark:text-[#e9d8c4]" fill="currentColor">
            <path d="M24 9c-3-5-9-6-13-2-2 2-3 6-8 6 3 4 9 5 14 2 3-2 5-3 7-4 2 1 4 2 7 4 5 3 11 2 14-2-5 0-6-4-8-6-4-4-10-3-13 2Z" />
        </svg>
    );
}

function Rehilete() {
    const colors = ["#006847", "#ffffff", "#ce1126", "#ffffff"];
    return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
            {colors.map((color, i) => (
                <path key={i} d="M20 20V4a8 8 0 0 1 8 8Z" fill={color} stroke="#000" strokeOpacity=".15" transform={`rotate(${i * 90} 20 20)`} />
            ))}
            <circle cx="20" cy="20" r="2.5" fill="#e9b44c" />
        </svg>
    );
}

function Bat() {
    return (
        <svg viewBox="10 3 44 20" className="h-full w-full text-[#1c1520] dark:text-[#cdb6e8]" fill="currentColor">
            <path d="M32 9c-2.5 0-4 2-4 4-3-4-9-6-15-4 4 1 6 4 6 7 4-2 8-1 10 2l3-3 3 3c2-3 6-4 10-2 0-3 2-6 6-7-6-2-12 0-15 4 0-2-1.5-4-4-4Z" />
            <path d="M30 8l1-3 1 2 1-2 1 3Z" />
        </svg>
    );
}

function Marigold() {
    return (
        <svg viewBox="0 0 40 40" className="h-full w-full">
            {Array.from({ length: 10 }, (_, i) => (
                <ellipse key={i} cx="20" cy="9" rx="5.5" ry="9" fill={i % 2 ? "#ff8c00" : "#ffa31a"} transform={`rotate(${i * 36} 20 20)`} />
            ))}
            <circle cx="20" cy="20" r="7" fill="#e86f00" />
            <circle cx="20" cy="20" r="3.5" fill="#b34700" />
        </svg>
    );
}

function Snowflake() {
    return (
        <svg viewBox="0 0 40 40" className="h-full w-full text-[#9cc3dc] dark:text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {[0, 60, 120].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 20 20)`}>
                    <path d="M20 3v34" />
                    <path d="M14 7l6 5 6-5M14 33l6-5 6 5" />
                </g>
            ))}
        </svg>
    );
}