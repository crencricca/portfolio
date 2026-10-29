import type { CSSProperties } from "react";
import type { Project } from "@/data/resume";

const INK = '#2a2a2a';
const BLOOMS = [['#f2c14e', '#a8641c'], ['#e8a0b4', '#b04a68'], ['#e2574c', '#7a2019'], ['#d49697', '#8e4c4d']];
const SIZES = { featured: [140, 230], regular: [110, 170], sprout: [80, 96] };

// Wobbles lines so they look hand-drawn; referenced as url(#sketch)
export const SketchDefs = () => (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="sketch">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
    </svg>
);

export const CloudShape = ({ fillOpacity = 0.9, style }: { fillOpacity?: number, style?: CSSProperties }) => (
    <svg viewBox="0 0 220 140" style={style} aria-hidden="true">
        <path
            d="M40 118 C22 120 10 108 14 94 C4 88 4 70 18 64 C12 46 28 32 46 38 C50 20 72 10 92 20 C104 4 136 4 148 22 C164 12 188 22 186 42 C204 44 214 62 204 76 C216 88 208 112 186 112 C180 124 160 128 148 118 C136 130 112 130 102 120 C90 130 64 130 58 120 C52 124 44 122 40 118 Z"
            fill="#fff" fillOpacity={fillOpacity} stroke="#fff" strokeWidth="5" strokeLinejoin="round" filter="url(#sketch)"
        />
    </svg>
);

const Leaf = ({ x, y, size, flip = false }: { x: number, y: number, size: number, flip?: boolean }) => {
    const d = flip ? -size : size;
    return <path d={`M${x} ${y}q${d * 0.55} ${-size * 0.6} ${d} ${-size * 0.2}q${-d * 0.4} ${size * 0.5} ${-d} ${size * 0.2}Z`} fill="#6ba84a" />;
};

const Bloom = ({ x, y, r, petals = 5, color }: { x: number, y: number, r: number, petals?: number, color: string[] }) => (
    <>
        {Array.from({ length: petals }, (_, i) => (
            <ellipse key={i} cx={x} cy={y - r * 0.9} rx={r * (petals > 5 ? 0.28 : 0.55)} ry={r} transform={`rotate(${360 / petals * i} ${x} ${y})`} fill={color[0]} />
        ))}
        <circle cx={x} cy={y} r={r * 0.42} fill={color[1]} />
    </>
);

const Tulip = ({ x, y, s, color }: { x: number, y: number, s: number, color: string }) => (
    <path d={`M${x - 12 * s} ${y - 6 * s}C${x - 14 * s} ${y + 12 * s} ${x + 14 * s} ${y + 12 * s} ${x + 12 * s} ${y - 6 * s}L${x + 8 * s} ${y - 18 * s}L${x + 3 * s} ${y - 9 * s}L${x} ${y - 20 * s}L${x - 3 * s} ${y - 9 * s}L${x - 8 * s} ${y - 18 * s}Z`} fill={color} />
);

const Stem = ({ d }: { d: string }) => <path d={d} fill="none" stroke="#4b8530" strokeWidth="4" strokeLinecap="round" />;

// variant picks the color and, for regular plants, the flower shape
export const Plant = ({ tier, variant }: { tier: Project['tier'], variant: number }) => {
    const [w, h] = SIZES[tier];
    const x = w / 2;
    const color = BLOOMS[variant % 4];
    let parts;
    if (tier === 'sprout') {
        parts = <>
            <Stem d={`M${x} ${h}C${x - 3} ${h * 0.7} ${x + 4} ${h * 0.5} ${x} 34`} />
            <Leaf x={x} y={h - 18} size={20} flip />
            <Leaf x={x} y={h - 30} size={18} />
            <Tulip x={x} y={30} s={0.65} color={color[0]} />
        </>;
    } else if (tier === 'featured') {
        parts = <>
            <Stem d={`M${x} ${h}C${x - 8} ${h * 0.7} ${x + 10} ${h * 0.42} ${x - 6} 46`} />
            <Stem d={`M${x - 2} ${h * 0.6}C${x + 14} ${h * 0.5} ${x + 30} ${h * 0.45} ${x + 38} 104`} />
            <Leaf x={x} y={h * 0.82} size={34} flip />
            <Leaf x={x + 2} y={h * 0.7} size={30} />
            <Bloom x={x - 6} y={42} r={22} color={color} />
            <Bloom x={x + 38} y={100} r={14} color={BLOOMS[(variant + 2) % 4]} />
        </>;
    } else {
        parts = <>
            <Stem d={`M${x} ${h}C${x - 6} ${h * 0.72} ${x + 8} ${h * 0.45} ${x} 44`} />
            <Leaf x={x} y={h * 0.78} size={28} flip={variant % 2 === 0} />
            <Leaf x={x + 1} y={h * 0.55} size={24} flip={variant % 2 === 1} />
            {variant % 3 === 0 && <Bloom x={x} y={40} r={17} color={color} />}
            {variant % 3 === 1 && <Bloom x={x} y={40} r={18} petals={12} color={color} />}
            {variant % 3 === 2 && <Tulip x={x} y={40} s={1.15} color={color[0]} />}
        </>;
    }
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            <g filter="url(#sketch)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round">{parts}</g>
        </svg>
    );
}

const RAYS = Array.from({ length: 9 }, (_, i) => {
    const angle = (-160 + i * 17.5) * Math.PI / 180;
    return [(20 + 15 * Math.cos(angle)).toFixed(2), (18 + 15 * Math.sin(angle)).toFixed(2)];
});

export const Seed = () => (
    <svg viewBox="0 0 40 56" fill="currentColor" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden="true">
        {RAYS.map(([x, y]) => <path key={x} d={`M20 18L${x} ${y}`} />)}
        {RAYS.map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.1" stroke="none" />)}
        <path d="M20 18V43" />
        <ellipse cx="20" cy="47" rx="2.4" ry="5" stroke="none" />
    </svg>
);

// Taproot from the degree to the three roles below it
export const RootLines = () => (
    <svg viewBox="0 0 900 90" preserveAspectRatio="none" aria-hidden="true">
        {['M450 0C450 40 160 30 150 90', 'M450 0C455 35 445 60 450 90', 'M450 0C450 40 740 30 750 90'].map(d => <path key={d} d={d} pathLength={1} />)}
        <g strokeWidth="1.75">
            {['M300 31q-20 14-46 12', 'M612 30q24 12 50 8', 'M452 52q14 8 24 22', 'M205 55q-16 6-32 2', 'M700 52q16 8 32 4'].map(d => <path key={d} d={d} pathLength={1} />)}
        </g>
    </svg>
);

// Decorative bugs in the soil under Education
export const SoilCritters = () => (
    <svg viewBox="0 0 900 280" aria-hidden="true">
        <g filter="url(#sketch)" stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
            <g transform="translate(48 210)">
                <ellipse cx="14" cy="16" rx="11" ry="13" fill="#c44536" />
                <circle cx="14" cy="6" r="5.5" fill="#2a2a2a" />
                <path d="M14 8V28M8 16h12" fill="none" />
                <circle cx="9" cy="12" r="1.6" fill="#fff" stroke="none" />
                <circle cx="18" cy="20" r="1.8" fill="#fff" stroke="none" />
                <path d="M11 2q-6-8-10-2M17 2q6-8 10-2" fill="none" />
            </g>
            <g transform="translate(820 40) rotate(18)">
                <ellipse cx="16" cy="12" rx="16" ry="10" fill="#5a7a3a" />
                <ellipse cx="28" cy="11" rx="7" ry="6" fill="#3d5428" />
                <path d="M4 10q-8-6-10 2M4 14q-8 4-8 10" fill="none" />
                <circle cx="31" cy="9" r="1.2" fill="#1d1d1f" stroke="none" />
            </g>
            <g transform="translate(780 200) rotate(-12)">
                <path d="M2 10C10 0 22 20 34 8C42 0 50 14 58 8" fill="none" stroke="#c9a07a" strokeWidth="3" />
            </g>
        </g>
    </svg>
);
