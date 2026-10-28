// Writes profile-readme/ (copy into crencricca/crencricca) and the site's Open
// Graph image from src/data/resume.ts. Run with `npm run readme`.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { formatMonth, resume, type Project } from "../src/data/resume.ts";

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE = resume.links.site;
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CLOUD = 'M40 118 C22 120 10 108 14 94 C4 88 4 70 18 64 C12 46 28 32 46 38 C50 20 72 10 92 20 C104 4 136 4 148 22 C164 12 188 22 186 42 C204 44 214 62 204 76 C216 88 208 112 186 112 C180 124 160 128 148 118 C136 130 112 130 102 120 C90 130 64 130 58 120 C52 124 44 122 40 118 Z';

const asset = (file: string) => readFileSync(join(ROOT, 'scripts/assets', file)).toString('base64');
const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Seeded so unchanged data regenerates identical files
let seed = 7;
const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const grass = (width: number, height: number, blade: number) => {
    const greens = ['#4b8530', '#5b9a3a', '#6ba84a'].map(color => ({ color, d: '' }));
    for (let x = -4; x < width + 4; x += 3.2) {
        const h = blade * (0.45 + random() * 0.55);
        const lean = (random() - 0.5) * 10;
        greens[Math.floor(random() * 3)].d += `M${x.toFixed(1)} ${height}q${(lean * 0.3).toFixed(1)} ${(-h * 0.6).toFixed(1)} ${lean.toFixed(1)} ${(-h).toFixed(1)}`;
    }
    const flowers = [0.03, 0.06, 0.1, 0.14, 0.33, 0.58, 0.62, 0.66, 0.86, 0.9].map((spot, i) => {
        const x = (width * spot).toFixed(1);
        const top = (height - blade * (1 + random() * 0.4)).toFixed(1);
        return `<path d="M${x} ${height}V${top}" stroke="#4b8530" stroke-width="1.6"/><circle cx="${x}" cy="${top}" r="${(blade * 0.2).toFixed(1)}" fill="${['#e8a0b4', '#e2574c', '#f2c14e'][i % 3]}"/>`;
    });
    return `<g fill="none" stroke-width="2.2" stroke-linecap="round">${greens.map(g => `<path stroke="${g.color}" d="${g.d}"/>`).join('')}</g>${flowers.join('')}`;
};

type Layout = { width: number, height: number, name: number, x: number, y: number, avatar: number, blade: number, clouds: number[][], drift: boolean };

const svg = (l: Layout) => {
    // Drifting clouds rest at their x when motion is reduced
    const clouds = l.clouds.map(([x, y, scale, seconds]) => {
        const drift = l.drift ? ` class="drift" style="animation-duration:${seconds}s;animation-delay:${(-(x + 260) / (l.width + 520) * seconds).toFixed(1)}s"` : '';
        return `<g transform="translate(0 ${y})"><g transform="translate(${x})"${drift}><path d="${CLOUD}" transform="scale(${scale})"/></g></g>`;
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${l.width}" height="${l.height}" viewBox="0 0 ${l.width} ${l.height}" role="img" aria-label="${esc(`${resume.name}: ${resume.tagline}`)}">
  <style>
    @font-face { font-family: "Concert One"; src: url(data:font/woff2;base64,${asset('concert-one-latin.woff2')}); }
    text { font-family: "Concert One", sans-serif; }
    .drift { animation: drift linear infinite; }
    @keyframes drift { from { transform: translateX(-260px); } to { transform: translateX(${l.width + 260}px); } }
    @media (prefers-reduced-motion: reduce) { .drift { animation: none; } }
  </style>
  <defs>
    <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#c3dcee"/><stop offset="1" stop-color="#d3e6f4"/></linearGradient>
    <clipPath id="frame"><rect width="${l.width}" height="${l.height}" rx="18"/></clipPath>
    <filter id="glow"><feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="#d49697"/></filter>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="100%" height="100%" fill="url(#sky)"/>
    <g fill="#fff" fill-opacity="0.35" stroke="#fff" stroke-width="5" stroke-linejoin="round">${clouds.join('')}</g>
    <image href="data:image/png;base64,${asset('avatar.png')}" x="${l.width - l.avatar - l.x}" y="${(l.height - l.avatar - l.blade) / 2}" width="${l.avatar}" height="${l.avatar}"/>
    <text x="${l.x}" y="${l.y}" font-size="${l.name}" font-weight="bold" letter-spacing="2" fill="#1d1d1f">${esc(resume.name)}</text>
    <text x="${l.x}" y="${l.y + l.name * 0.75}" font-size="${l.name * 0.36}" fill="#1d1d1f" filter="url(#glow)">${esc(resume.tagline)}</text>
    <text x="${l.x}" y="${l.y + l.name * 1.35}" font-size="${l.name * 0.3}" fill="#4f4f55">${SITE.replace('https://', '')} →</text>
    ${grass(l.width, l.height, l.blade)}
  </g>
</svg>
`;
};

const cell = (project: Project) => {
    const href = project.links[0].href;
    const image = project.media ? `<a href="${href}"><img src="${SITE}/projects/${project.media.file}" alt="${esc(project.media.alt)}" width="100%"></a><br>` : '';
    return `<td width="50%" valign="top">${image}<b><a href="${href}">${esc(project.name)}</a></b>${project.growing ? ' <sub>🌱 growing</sub>' : ''}<br>${esc(project.oneLiner)}</td>`;
};

const featured = resume.projects.filter(project => project.tier !== 'sprout');
const rows = featured.filter((_, i) => i % 2 === 0).map((_, i) => `  <tr>${featured.slice(i * 2, i * 2 + 2).map(cell).join('')}</tr>`);
const current = resume.experience.find(role => !role.end);

mkdirSync(join(ROOT, 'profile-readme'), { recursive: true });
writeFileSync(join(ROOT, 'profile-readme/banner.svg'), svg({
    width: 1200, height: 300, name: 68, x: 64, y: 118, avatar: 230, blade: 26, drift: true,
    clouds: [[120, 14, 0.42, 150], [560, 40, 0.55, 120], [760, 170, 0.36, 170], [1080, 16, 0.4, 135]],
}));
writeFileSync(join(ROOT, 'profile-readme/README.md'), `<!-- Generated by scripts/generate-readme.ts in crencricca/portfolio. Edit src/data/resume.ts there, then run npm run readme. -->

<a href="${SITE}"><img src="./banner.svg" alt="${esc(`${resume.name}: ${resume.tagline}`)}" width="100%"></a>

Hi, I'm Catie! ${current ? `I'm a ${current.title} at [${current.org}](${current.url}) in ${resume.location}. ` : ''}${resume.bio}

### 🌷 In the garden

<table>
${rows.join('\n')}
</table>

Also sprouting:
${resume.projects.filter(project => project.tier === 'sprout').map(project => `- [${project.name}](${project.links[0].href}) · ${project.oneLiner}`).join('\n')}

### [Visit my site →](${SITE})

[LinkedIn](${resume.links.linkedin})

<sub>Last updated ${formatMonth(resume.lastUpdated)}</sub>
`);

if (existsSync(CHROME)) {
    const dir = mkdtempSync(join(tmpdir(), 'og-'));
    writeFileSync(join(dir, 'og.svg'), svg({
        width: 1200, height: 630, name: 92, x: 72, y: 270, avatar: 330, blade: 46, drift: false,
        clouds: [[60, 40, 0.7], [520, 70, 0.5], [1010, 40, 0.6], [600, 470, 0.45]],
    }));
    execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', `--user-data-dir=${dir}`, '--virtual-time-budget=3000', '--window-size=1200,630', `--screenshot=${join(ROOT, 'src/app/opengraph-image.png')}`, `file://${dir}/og.svg`], { stdio: 'ignore' });
    rmSync(dir, { recursive: true, force: true });
    writeFileSync(join(ROOT, 'src/app/opengraph-image.alt.txt'), `${resume.name}: ${resume.tagline}`);
} else {
    console.warn('Chrome not found (set CHROME_PATH), so the Open Graph image was skipped.');
}
