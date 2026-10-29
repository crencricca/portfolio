import type { Metadata } from "next";
import Image from "next/image";
import { Concert_One, Dosis } from "next/font/google";
import React from "react";
import styles from "@/components/resume.module.css";
import { formatMonth, formatRange, resume } from "@/data/resume";
import { CloudShape, RootLines, SketchDefs, SoilCritters } from "@/components/art";
import Garden from "@/components/Garden";
import PlainResume from "@/components/PlainResume";
import Toggle from "@/components/Toggle";

const titleFont = Concert_One({ subsets: ['latin'], weight: '400', variable: '--font-title' });
const bodyFont = Dosis({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
    description: `${resume.tagline} ${resume.bio}`,
    openGraph: { title: resume.name, siteName: resume.name, description: resume.tagline, type: 'profile', images: '/opengraph-image.png' },
    twitter: { card: 'summary_large_image' },
};

// Tells Google the site name to show in search results instead of "Vercel"
const WEBSITE_SCHEMA = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: resume.name, url: `${resume.links.site}/` });

// Applies saved toggles (see Toggle) before first paint
const RESTORE_PREFERENCES = `try{for(const n of['animations','view']){const v=localStorage.getItem('catie:'+n);if(v)document.documentElement.dataset[n]=v}}catch(e){}`;

// Clouds drifting above and below the intro: [resting x, top, width, seconds per crossing].
// Each starts at its resting x, which is also where it stays when motion is off.
const LANES = [
    [['8vw', 6, 125, 140], ['62vw', 22, 85, 95]],
    [['38vw', 4, 100, 120], ['84vw', 20, 70, 105]],
] as const;

const Lane = ({ clouds }: { clouds: typeof LANES[number] }) => (
    <div className={styles.lane} aria-hidden="true">
        {clouds.map(([x, top, width, seconds]) => (
            <CloudShape
                key={x}
                fillOpacity={0.35}
                style={{ '--x': x, top, width, animationDuration: `${seconds}s`, animationDelay: `${-(parseFloat(x) + 25) / 135 * seconds}s` } as React.CSSProperties}
            />
        ))}
    </div>
);

export default function ResumePage() {
    const current = resume.experience.find(role => !role.end);
    const { links, education } = resume;

    return (
        <div className={`${styles.page} ${titleFont.variable} ${bodyFont.variable}`}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBSITE_SCHEMA }} />
            <script dangerouslySetInnerHTML={{ __html: RESTORE_PREFERENCES }} />
            <SketchDefs />
            <header className={styles.header}>
                <a href="/" className={styles.home}>
                    <svg aria-hidden="true" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" /></svg>
                    {resume.name}
                </a>
                <nav aria-label="Main">
                    <a href={links.linkedin}>LinkedIn</a>
                    <a href={links.pdf}>PDF</a>
                    <a href={links.github}>Github</a>
                    <Toggle name="view" value="plain" label="Switch to plain resume" activeLabel="Switch to garden view" />
                </nav>
            </header>
            <main>
                <div className={styles.scene}>
                    <section className={styles.sky} aria-labelledby="name">
                        <Lane clouds={LANES[0]} />
                        <div className={styles.hero}>
                            <div>
                                <h1 id="name">{resume.name}</h1>
                                <p className={styles.tagline}>{resume.tagline}</p>
                                {current && <p className={styles.current}><strong>{current.title}</strong> at <a href={current.url}>{current.org}</a><span className={styles.sep} aria-hidden="true"> · </span><span className={styles.place}>{resume.location}</span></p>}
                                <p className={styles.bio}>{resume.bio}</p>
                            </div>
                            <Image src="/avatar.png" alt="Sketch of Catie" width={220} height={220} priority />
                        </div>
                        <Lane clouds={LANES[1]} />
                        <a className={styles.cue} href="#experience">drift down <span aria-hidden="true">↓</span></a>
                    </section>

                    <section id="experience" className={styles.clouds} aria-labelledby="experience-title">
                        <h2 id="experience-title">Experience<span>~ up in the clouds ~</span></h2>
                        <ol>
                            {resume.experience.map((role, i) => (
                                <li key={role.org} style={{ '--i': i } as React.CSSProperties}>
                                    <article>
                                        <CloudShape />
                                        <div>
                                            <h3><a href={role.url}>{role.org}</a></h3>
                                            <strong>{role.title}</strong>
                                            <small>
                                                <span>{formatRange(role.start, role.end)}</span>
                                                {role.location && <span>{role.location}</span>}
                                            </small>
                                        </div>
                                    </article>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <Garden />

                    <section id="education" className={styles.roots} aria-labelledby="education-title">
                        <div className={styles.critters} aria-hidden="true"><SoilCritters /></div>
                        <h2 id="education-title">Education<span>~ where I grew from ~</span></h2>
                        <div className={styles.degree}>
                            <h3>{education.school}</h3>
                            <p>{education.degree} · {education.years}</p>
                        </div>
                        <RootLines />
                        <ol>
                            {resume.roots.map(role => (
                                <li key={role.org}>
                                    <h3>{role.title}</h3>
                                    <strong>{role.org}</strong>
                                    <small>{formatRange(role.start, role.end)} · {role.location}</small>
                                    <p>{role.description}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>
                <PlainResume />
            </main>
            <footer className={styles.footer}>
                <Toggle name="animations" value="off" label="Disable Animations" />
                <p>Last updated {formatMonth(resume.lastUpdated)}</p>
            </footer>
        </div>
    );
}
