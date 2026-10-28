// Generates the GitHub profile README (for crencricca/crencricca) and the
// site's link-preview image from src/data/resume.ts.
//
//   npm run readme
//
// Writes:
//   profile-readme/README.md, banner-light.svg, banner-dark.svg  -> copy into crencricca/crencricca
//   src/app/opengraph-image.png                                  -> needs Google Chrome; skipped if not found
//
// Runs directly on Node (type stripping), so imports keep their .ts extensions.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { currentRole, resume } from "../src/data/resume.ts";
import type { Project } from "../src/data/resume.ts";
import { formatMonth } from "../src/data/format.ts";

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(ROOT, 'profile-readme');
const OG_PATH = join(ROOT, 'src/app/opengraph-image.png');
const SITE_URL = resume.links.site;
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const asset = (name: string) => readFileSync(join(ROOT, 'scripts/assets', name)).toString('base64');
const FONTS = {
    title: asset('concert-one-latin.woff2'),
    body: asset('dosis-latin.woff2'),
};
const AVATAR = asset('avatar.png');

const escapeXml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Deterministic randomness so regenerating without data changes yields identical files
const seededRandom = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Theme = {
    skyTop: string,
    skyBottom: string,
    ink: string,
    muted: string,
    link: string,
    cloudFill: string,
    cloudStroke: string,
    stars: boolean,
};

const LIGHT: Theme = {
    skyTop: '#e9f2f8',
    skyBottom: '#fbfdfe',
    ink: '#1d1d1f',
    muted: '#4f4f55',
    link: '#8e4c4d',
    cloudFill: '#ffffff',
    cloudStroke: '#d9a0a0',
    stars: false,
};

const DARK: Theme = {
    skyTop: '#0d1117',
    skyBottom: '#1a2130',
    ink: '#e6edf3',
    muted: '#a8b3bf',
    link: '#e8b4b5',
    cloudFill: '#1f2733',
    cloudStroke: '#d49697',
    stars: true,
};

// Hand-drawn cloud outline, 220x140
const CLOUD_PATH = 'M40 118 C22 120 10 108 14 94 C4 88 4 70 18 64 C12 46 28 32 46 38 C50 20 72 10 92 20 C104 4 136 4 148 22 C164 12 188 22 186 42 C204 44 214 62 204 76 C216 88 208 112 186 112 C180 124 160 128 148 118 C136 130 112 130 102 120 C90 130 64 130 58 120 C52 124 44 122 40 118 Z';

type Scene = {
    width: number,
    height: number,
    animated: boolean,
    nameSize: number,
    nameX: number,
    nameY: number,
    // Approximate rendered width of the first name, for the wavy underline
    firstNameWidth: number,
    taglineSize: number,
    linkSize: number,
    avatar: { x: number, y: number, size: number },
    clouds: { x: number, y: number, scale: number, duration: number }[],
    grassHeight: number,
};

const grass = (width: number, height: number, maxBlade: number) => {
    const random = seededRandom(7);
    const greens = ['#4b8530', '#5b9a3a', '#6ba84a'];
    const paths: string[][] = greens.map(() => []);
    for (let x = -4; x < width + 4; x += 3.2) {
        const blade = maxBlade * (0.45 + random() * 0.55);
        const lean = (random() - 0.5) * 10;
        paths[Math.floor(random() * greens.length)].push(
            `M${x.toFixed(1)} ${height} Q${(x + lean * 0.3).toFixed(1)} ${(height - blade * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(height - blade).toFixed(1)}`
        );
    }

    // Small flowers poking out of the grass, like public/border.png
    const petals = ['#e8a0b4', '#e2574c', '#f2c14e', '#e8a0b4'];
    const flowers: string[] = [];
    const spots = [0.03, 0.06, 0.1, 0.14, 0.33, 0.58, 0.62, 0.66, 0.86, 0.9];
    spots.forEach((spot, i) => {
        const x = width * spot;
        const top = height - maxBlade * (1 + random() * 0.4);
        const r = maxBlade * 0.13;
        flowers.push(`<path d="M${x.toFixed(1)} ${height} L${x.toFixed(1)} ${(top + r).toFixed(1)}" stroke="#4b8530" stroke-width="1.6"/>`);
        flowers.push(`<circle cx="${x.toFixed(1)}" cy="${top.toFixed(1)}" r="${(r * 1.5).toFixed(1)}" fill="${petals[i % petals.length]}"/>`);
        flowers.push(`<circle cx="${x.toFixed(1)}" cy="${top.toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="#7a2019" opacity="0.6"/>`);
    });

    return `
    <g stroke-linecap="round" fill="none" stroke-width="2.2">
      ${paths.map((d, i) => `<path stroke="${greens[i]}" d="${d.join(' ')}"/>`).join('\n      ')}
    </g>
    <g>${flowers.join('')}</g>`;
};

const stars = (width: number, height: number) => {
    const random = seededRandom(11);
    return Array.from({ length: 28 }, () => {
        const x = random() * width;
        const y = random() * height * 0.6;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + random() * 1.1).toFixed(1)}" fill="#e6edf3" opacity="${(0.35 + random() * 0.5).toFixed(2)}"/>`;
    }).join('');
};

const wave = (x: number, y: number, width: number, amplitude: number) => {
    const step = amplitude * 2.4;
    let d = `M${x} ${y}`;
    for (let i = 0, cx = x; cx < x + width; i++, cx += step) {
        d += ` q${step / 2} ${i % 2 ? amplitude * 1.6 : -amplitude * 1.6} ${step} 0`;
    }
    return d;
};

const scene = (s: Scene, theme: Theme) => {
    const [firstName, ...rest] = resume.name.split(' ');
    const { avatar } = s;

    const clouds = s.clouds.map(({ x, y, scale, duration }, i) => {
        const shape = `<path d="${CLOUD_PATH}" fill="${theme.cloudFill}" stroke="${theme.cloudStroke}" stroke-width="5" stroke-linejoin="round" transform="scale(${scale})"/>`;
        if (!s.animated) {
            return `<g transform="translate(${x} ${y})" opacity="0.8">${shape}</g>`;
        }
        // Negative delay starts each cloud partway across, roughly at x
        const delay = -((x + 260) / (s.width + 520)) * duration;
        return `<g transform="translate(0 ${y})" opacity="0.8"><g class="drift" style="animation-duration:${duration}s;animation-delay:${delay.toFixed(1)}s">${shape}</g></g>`;
    }).join('\n    ');

    const motion = s.animated ? `
      .drift { animation: drift linear infinite; }
      @keyframes drift { from { transform: translateX(-260px); } to { transform: translateX(${s.width + 260}px); } }
      @media (prefers-reduced-motion: reduce) { .drift { animation: none; transform: translateX(${Math.round(s.width * 0.45)}px); } }` : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}" role="img" aria-labelledby="title">
  <title id="title">${escapeXml(`${resume.name}: ${resume.tagline}`)}</title>
  <defs>
    <style>
      @font-face { font-family: "Concert One"; src: url(data:font/woff2;base64,${FONTS.title}) format("woff2"); }
      @font-face { font-family: "Dosis"; font-weight: 200 800; src: url(data:font/woff2;base64,${FONTS.body}) format("woff2"); }
      .name { font-family: "Concert One", "Trebuchet MS", sans-serif; font-weight: bold; letter-spacing: 2px; }
      .body { font-family: "Dosis", "Trebuchet MS", sans-serif; }${motion}
    </style>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${theme.skyTop}"/>
      <stop offset="1" stop-color="${theme.skyBottom}"/>
    </linearGradient>
    <clipPath id="frame"><rect width="${s.width}" height="${s.height}" rx="18"/></clipPath>
    <!-- The sketch has an opaque white background; keep only the circle it's drawn in -->
    <clipPath id="avatar"><circle cx="${avatar.x + avatar.size / 2}" cy="${avatar.y + avatar.size * 0.51}" r="${avatar.size * 0.465}"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${s.width}" height="${s.height}" fill="url(#sky)"/>
    ${theme.stars ? stars(s.width, s.height) : ''}
    ${clouds}
    <image clip-path="url(#avatar)" href="data:image/png;base64,${AVATAR}" x="${avatar.x}" y="${avatar.y}" width="${avatar.size}" height="${avatar.size}"/>
    <text class="name" x="${s.nameX}" y="${s.nameY}" font-size="${s.nameSize}" fill="${theme.ink}">${escapeXml(firstName)} ${escapeXml(rest.join(' '))}</text>
    <path d="${wave(s.nameX, s.nameY + s.nameSize * 0.24, s.firstNameWidth, s.nameSize * 0.05)}" fill="none" stroke="#d49697" stroke-width="${(s.nameSize * 0.045).toFixed(1)}" stroke-linecap="round"/>
    <text class="body" x="${s.nameX}" y="${s.nameY + s.nameSize * 0.95}" font-size="${s.taglineSize}" font-weight="600" fill="${theme.muted}">${escapeXml(resume.tagline)}</text>
    <text class="body" x="${s.nameX}" y="${s.nameY + s.nameSize * 0.95 + s.linkSize * 2}" font-size="${s.linkSize}" font-weight="700" fill="${theme.link}">${escapeXml(SITE_URL.replace(/^https?:\/\//, ''))} →</text>
    ${grass(s.width, s.height, s.grassHeight)}
  </g>
</svg>
`;
};

const BANNER: Scene = {
    width: 1200,
    height: 300,
    animated: true,
    nameSize: 68,
    nameX: 64,
    nameY: 118,
    firstNameWidth: 172,
    taglineSize: 28,
    linkSize: 21,
    avatar: { x: 930, y: 28, size: 230 },
    clouds: [
        { x: 120, y: 14, scale: 0.42, duration: 150 },
        { x: 560, y: 40, scale: 0.55, duration: 120 },
        { x: 760, y: 170, scale: 0.36, duration: 170 },
        { x: 1080, y: 16, scale: 0.4, duration: 135 },
    ],
    grassHeight: 26,
};

const OG: Scene = {
    width: 1200,
    height: 630,
    animated: false,
    nameSize: 92,
    nameX: 72,
    nameY: 270,
    firstNameWidth: 236,
    taglineSize: 42,
    linkSize: 32,
    avatar: { x: 820, y: 130, size: 330 },
    clouds: [
        { x: 60, y: 40, scale: 0.7, duration: 0 },
        { x: 520, y: 70, scale: 0.5, duration: 0 },
        { x: 1010, y: 40, scale: 0.6, duration: 0 },
        { x: 600, y: 470, scale: 0.45, duration: 0 },
    ],
    grassHeight: 46,
};

const projectCell = (project: Project) => {
    const href = project.links[0]?.href ?? resume.links.github;
    const image = project.media && /\.(png|jpe?g|gif|webp)$/.test(project.media.file)
        ? `<a href="${href}"><img src="${SITE_URL}/projects/${project.media.file}" alt="${escapeXml(project.media.alt)}" width="100%"></a><br>`
        : '';
    const growing = project.growing ? ' <sub>🌱 growing</sub>' : '';
    return `<td width="50%" valign="top">${image}<b><a href="${href}">${escapeXml(project.name)}</a></b>${growing}<br>${escapeXml(project.oneLiner)}</td>`;
};

const readme = () => {
    const current = currentRole();
    const featured = resume.projects.filter(project => project.tier !== 'sprout');
    const sprouts = resume.projects.filter(project => project.tier === 'sprout');

    const rows: string[] = [];
    for (let i = 0; i < featured.length; i += 2) {
        rows.push(`  <tr>\n    ${featured.slice(i, i + 2).map(projectCell).join('\n    ')}\n  </tr>`);
    }

    const intro = current
        ? `Hi, I'm Catie! I'm a ${current.title} at [${current.company}](${current.url ?? resume.links.linkedin}) in ${resume.location}. ${resume.bio}`
        : `Hi, I'm Catie! ${resume.bio}`;

    return `<!-- Generated by scripts/generate-readme.ts in crencricca/portfolio. Edit src/data/resume.ts there and run \`npm run readme\` instead of editing this file. -->

<a href="${SITE_URL}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./banner-dark.svg">
    <img alt="${escapeXml(`${resume.name}: ${resume.tagline}`)}" src="./banner-light.svg" width="100%">
  </picture>
</a>

${intro}

### 🌷 In the garden

<table>
${rows.join('\n')}
</table>

Also sprouting:
${sprouts.map(project => `- [${project.name}](${project.links[0]?.href}) · ${project.oneLiner}`).join('\n')}

### [Visit my site →](${SITE_URL})

[LinkedIn](${resume.links.linkedin})

<sub>Last updated ${formatMonth(resume.lastUpdated, 'long')}</sub>
`;
};

const renderOgImage = (svg: string) => {
    if (!existsSync(CHROME)) {
        console.warn(`Skipped ${OG_PATH}: Chrome not found (set CHROME_PATH to override).`);
        return;
    }
    const work = mkdtempSync(join(tmpdir(), 'og-'));
    try {
        const svgPath = join(work, 'og.svg');
        writeFileSync(svgPath, svg);
        execFileSync(CHROME, [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--no-first-run',
            `--user-data-dir=${join(work, 'profile')}`,
            '--virtual-time-budget=3000',
            `--window-size=${OG.width},${OG.height}`,
            `--screenshot=${OG_PATH}`,
            `file://${svgPath}`,
        ], { stdio: 'ignore' });
        writeFileSync(OG_PATH.replace(/\.png$/, '.alt.txt'), `${resume.name}: ${resume.tagline}`);
        console.log(`Wrote ${OG_PATH}`);
    } finally {
        rmSync(work, { recursive: true, force: true });
    }
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'README.md'), readme());
writeFileSync(join(OUT_DIR, 'banner-light.svg'), scene(BANNER, LIGHT));
writeFileSync(join(OUT_DIR, 'banner-dark.svg'), scene(BANNER, DARK));
console.log(`Wrote ${OUT_DIR}/README.md, banner-light.svg, banner-dark.svg`);
renderOgImage(scene(OG, LIGHT));
