// Hand-drawn SVG art for the resume scene. Colors follow public/cloud.png and
// public/border.png so the new pieces sit next to the existing doodles.
import React from "react";
import type { Project } from "@/data/resume";

const INK = '#2a2a2a';
const STEM = '#4b8530';
const LEAF = '#6ba84a';

const BLOOMS = [
    { petal: '#f2c14e', center: '#a8641c' },
    { petal: '#e8a0b4', center: '#b04a68' },
    { petal: '#e2574c', center: '#7a2019' },
    { petal: '#d49697', center: '#8e4c4d' },
];

const PLANT_SIZES = {
    featured: { w: 140, h: 230 },
    regular: { w: 110, h: 170 },
    sprout: { w: 80, h: 96 },
};

// Slight wobble so lines look drawn by hand. Referenced by id from the art below.
export const SketchDefs = () => (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id="sketch">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </svg>
);

// White outline on the blue sky; fillOpacity sets how solid the cloud's body is
export const CloudShape = ({ className, style, fillOpacity = 0.9 }: { className?: string, style?: React.CSSProperties, fillOpacity?: number }) => (
    <svg className={className} style={style} viewBox="0 0 220 140" aria-hidden="true">
        <path
            d="M40 118 C22 120 10 108 14 94 C4 88 4 70 18 64 C12 46 28 32 46 38 C50 20 72 10 92 20 C104 4 136 4 148 22 C164 12 188 22 186 42 C204 44 214 62 204 76 C216 88 208 112 186 112 C180 124 160 128 148 118 C136 130 112 130 102 120 C90 130 64 130 58 120 C52 124 44 122 40 118 Z"
            fill="#fff"
            fillOpacity={fillOpacity}
            stroke="#fff"
            strokeWidth="5"
            strokeLinejoin="round"
            filter="url(#sketch)"
        />
    </svg>
);

const Leaf = ({ x, y, size, flip = false }: { x: number, y: number, size: number, flip?: boolean }) => {
    const dir = flip ? -1 : 1;
    return (
        <path
            d={`M${x} ${y} q ${dir * size * 0.55} ${-size * 0.6} ${dir * size} ${-size * 0.2} q ${-dir * size * 0.4} ${size * 0.5} ${-dir * size} ${size * 0.2} Z`}
            fill={LEAF}
            stroke={INK}
            strokeWidth="1.2"
            strokeLinejoin="round"
        />
    );
}

const Petals = ({ cx, cy, r, count, thin = false, bloom }: { cx: number, cy: number, r: number, count: number, thin?: boolean, bloom: typeof BLOOMS[number] }) => (
    <g>
        {Array.from({ length: count }, (_, i) => (
            <ellipse
                key={i}
                cx={cx}
                cy={cy - r * 0.9}
                rx={r * (thin ? 0.28 : 0.55)}
                ry={r}
                transform={`rotate(${(360 / count) * i} ${cx} ${cy})`}
                fill={bloom.petal}
                stroke={INK}
                strokeWidth="1.2"
            />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.42} fill={bloom.center} stroke={INK} strokeWidth="1.2" />
    </g>
);

const Tulip = ({ cx, cy, s, bloom }: { cx: number, cy: number, s: number, bloom: typeof BLOOMS[number] }) => (
    <path
        d={`M${cx - 12 * s} ${cy - 6 * s} C${cx - 14 * s} ${cy + 12 * s} ${cx + 14 * s} ${cy + 12 * s} ${cx + 12 * s} ${cy - 6 * s} L${cx + 8 * s} ${cy - 18 * s} L${cx + 3 * s} ${cy - 9 * s} L${cx} ${cy - 20 * s} L${cx - 3 * s} ${cy - 9 * s} L${cx - 8 * s} ${cy - 18 * s} Z`}
        fill={bloom.petal}
        stroke={INK}
        strokeWidth="1.2"
        strokeLinejoin="round"
    />
);

const Stem = ({ d }: { d: string }) => (
    <path d={d} fill="none" stroke={STEM} strokeWidth="4" strokeLinecap="round" />
);

// variant picks the flower color and (for regular plants) the flower shape
export const Plant = ({ tier, variant, className }: { tier: Project['tier'], variant: number, className?: string }) => {
    const { w, h } = PLANT_SIZES[tier];
    const cx = w / 2;
    const bloom = BLOOMS[variant % BLOOMS.length];

    if (tier === 'sprout') {
        return (
            <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
                <g filter="url(#sketch)">
                    <Stem d={`M${cx} ${h} C${cx - 3} ${h * 0.7} ${cx + 4} ${h * 0.5} ${cx} 34`} />
                    <Leaf x={cx} y={h - 18} size={20} flip />
                    <Leaf x={cx} y={h - 30} size={18} />
                    <Tulip cx={cx} cy={30} s={0.65} bloom={bloom} />
                </g>
            </svg>
        );
    }

    if (tier === 'featured') {
        const side = BLOOMS[(variant + 2) % BLOOMS.length];
        return (
            <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
                <g filter="url(#sketch)">
                    <Stem d={`M${cx} ${h} C${cx - 8} ${h * 0.7} ${cx + 10} ${h * 0.42} ${cx - 6} 46`} />
                    <Stem d={`M${cx - 2} ${h * 0.6} C${cx + 14} ${h * 0.5} ${cx + 30} ${h * 0.45} ${cx + 38} 104`} />
                    <Leaf x={cx} y={h * 0.82} size={34} flip />
                    <Leaf x={cx + 2} y={h * 0.7} size={30} />
                    <Petals cx={cx - 6} cy={42} r={22} count={5} bloom={bloom} />
                    <Petals cx={cx + 38} cy={100} r={14} count={5} bloom={side} />
                </g>
            </svg>
        );
    }

    const shape = variant % 3;
    return (
        <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            <g filter="url(#sketch)">
                <Stem d={`M${cx} ${h} C${cx - 6} ${h * 0.72} ${cx + 8} ${h * 0.45} ${cx} 44`} />
                <Leaf x={cx} y={h * 0.78} size={28} flip={variant % 2 === 0} />
                <Leaf x={cx + 1} y={h * 0.55} size={24} flip={variant % 2 === 1} />
                {shape === 0 && <Petals cx={cx} cy={40} r={17} count={5} bloom={bloom} />}
                {shape === 1 && <Petals cx={cx} cy={40} r={18} count={12} thin bloom={bloom} />}
                {shape === 2 && <Tulip cx={cx} cy={40} s={1.15} bloom={bloom} />}
            </g>
        </svg>
    );
}

const SEED_RAYS = Array.from({ length: 9 }, (_, i) => {
    const angle = ((-160 + i * (140 / 8)) * Math.PI) / 180;
    return { x: (20 + 15 * Math.cos(angle)).toFixed(2), y: (18 + 15 * Math.sin(angle)).toFixed(2) };
});

export const Seed = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 40 56" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
            {SEED_RAYS.map(({ x, y }) => <path key={`${x}-${y}`} d={`M20 18 L${x} ${y}`} />)}
            <path d="M20 18 L20 43" />
        </g>
        {SEED_RAYS.map(({ x, y }) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="currentColor" />)}
        <ellipse cx="20" cy="47" rx="2.4" ry="5" fill="currentColor" />
    </svg>
);

// Taproot from the degree down to the three roles below it (desktop layout).
export const RootLines = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 900 90" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={1} d="M450 0 C450 40 160 30 150 90" />
        <path pathLength={1} d="M450 0 C455 35 445 60 450 90" />
        <path pathLength={1} d="M450 0 C450 40 740 30 750 90" />
        <path pathLength={1} data-rootlet d="M300 31 q-20 14 -46 12" />
        <path pathLength={1} data-rootlet d="M612 30 q24 12 50 8" />
        <path pathLength={1} data-rootlet d="M452 52 q14 8 24 22" />
        <path pathLength={1} data-rootlet d="M205 55 q-16 6 -32 2" />
        <path pathLength={1} data-rootlet d="M700 52 q16 8 32 4" />
    </svg>
);
