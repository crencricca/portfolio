import type { Metadata } from "next";
import Image from "next/image";
import React from "react";
import styles from "./components/resume/resume.module.css";
import { bodyFont, titleFont } from "./fonts";
import { currentRole, resume } from "@/data/resume";
import { formatMonth, formatRange } from "@/data/format";
import SiteHeader from "./components/SiteHeader";
import AnimationsToggle from "./components/AnimationsToggle";
import { CloudShape, RootLines, SketchDefs } from "./components/resume/art";
import SkillGarden from "./components/resume/SkillGarden";
import PlainResume from "./components/resume/PlainResume";
import ViewToggle from "./components/resume/ViewToggle";

export const metadata: Metadata = {
    description: `${resume.tagline} ${resume.bio}`,
    openGraph: {
        title: resume.name,
        description: resume.tagline,
        url: '/',
        type: 'profile',
    },
    twitter: {
        card: 'summary_large_image',
    },
};

// Decorative clouds drift in their own strips above and below the intro, so
// they never pass behind text or the avatar. x is where each rests when
// animations are off.
type SkyCloud = { x: string, y: number, width: number, duration: number, delay: number };

const SKY_CLOUDS: Record<'above' | 'below', SkyCloud[]> = {
    above: [
        { x: '8vw', y: 6, width: 125, duration: 140, delay: -40 },
        { x: '62vw', y: 22, width: 85, duration: 95, delay: -70 },
    ],
    below: [
        { x: '38vw', y: 4, width: 100, duration: 120, delay: -15 },
        { x: '84vw', y: 20, width: 70, duration: 105, delay: -55 },
    ],
};

export default function Home() {
    const current = currentRole();
    const education = resume.education[0];

    const renderCloudLane = (lane: keyof typeof SKY_CLOUDS) => (
        <div className={styles.cloudLane} aria-hidden="true">
            {SKY_CLOUDS[lane].map(cloud => (
                <CloudShape
                    key={cloud.x}
                    className={styles.drift}
                    fillOpacity={0.35}
                    style={{ '--x': cloud.x, top: cloud.y, width: cloud.width, animationDuration: `${cloud.duration}s`, animationDelay: `${cloud.delay}s` } as React.CSSProperties}
                />
            ))}
        </div>
    );

    const renderSky = () => (
        <section className={styles.sky} aria-labelledby="resume-name">
            {renderCloudLane('above')}
            <div className={styles.hero}>
                <div>
                    <h1 id="resume-name" className={`${titleFont.className} ${styles.name}`}>
                        {resume.name}
                    </h1>
                    <p className={`${titleFont.className} ${styles.tagline}`}>{resume.tagline}</p>
                    {current && (
                        <p className={styles.current}>
                            <strong>{current.title}</strong> at <a href={current.url}>{current.company}</a> · {resume.location}
                        </p>
                    )}
                    <p className={styles.bio}>{resume.bio}</p>
                    <ul className={styles.heroLinks}>
                        <li><a href={resume.links.linkedin}>LinkedIn</a></li>
                        <li><a href={resume.links.github}>GitHub</a></li>
                        <li><a href={resume.links.pdf}>PDF resume</a></li>
                    </ul>
                </div>
                <Image className={styles.avatar} src="/avatar.png" alt="Sketch of Catie" width={220} height={220} priority />
            </div>
            {renderCloudLane('below')}
            <a className={styles.scrollCue} href="#experience">
                drift down <span aria-hidden="true">↓</span>
            </a>
        </section>
    );

    const renderClouds = () => (
        <section id="experience" className={styles.clouds} aria-labelledby="experience-title">
            <h2 id="experience-title" className={`${titleFont.className} ${styles.sectionTitle}`}>
                Experience
                <span className={styles.sectionNote}>~ up in the clouds ~</span>
            </h2>
            <ol className={styles.cloudList}>
                {resume.experience.map((role, i) => (
                    <li key={`${role.company}-${role.start}`} className={styles.cloudItem} data-depth={Math.min(i, 2)}>
                        <article className={styles.cloud}>
                            <CloudShape className={styles.cloudShape} />
                            <div className={styles.cloudText}>
                                <h3 className={titleFont.className}>
                                    {role.url ? <a href={role.url}>{role.company}</a> : role.company}
                                </h3>
                                <p className={styles.role}>{role.title}</p>
                                <p className={styles.meta}>
                                    {formatRange(role.start, role.end)}
                                    {role.location && <span>{role.location}</span>}
                                </p>
                            </div>
                        </article>
                        {role.highlights?.length ? (
                            <details className={styles.highlights}>
                                <summary>Highlights</summary>
                                <ul>{role.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
                            </details>
                        ) : null}
                    </li>
                ))}
            </ol>
        </section>
    );

    const renderRoots = () => (
        <section id="education" className={styles.roots} aria-labelledby="roots-title">
            <h2 id="roots-title" className={`${titleFont.className} ${styles.sectionTitle}`}>
                Education
                <span className={styles.sectionNote}>~ where I grew from ~</span>
            </h2>
            {education && (
                <div className={styles.rootNode}>
                    <h3 className={titleFont.className}>{education.school}</h3>
                    <p>{education.degree} · {education.start} – {education.end}</p>
                </div>
            )}
            <RootLines className={styles.rootLines} />
            <ol className={styles.rootList}>
                {resume.roots.map(root => (
                    <li key={`${root.org}-${root.title}`} className={styles.rootCard}>
                        <h3 className={titleFont.className}>{root.title}</h3>
                        <p className={styles.org}>{root.org}</p>
                        <p className={styles.meta}>
                            {formatRange(root.start, root.end)}{root.location ? ` · ${root.location}` : ''}
                        </p>
                        {root.description && <p>{root.description}</p>}
                    </li>
                ))}
            </ol>
        </section>
    );

    return (
        <div className={`${styles.page} ${bodyFont.className} ${bodyFont.variable} ${titleFont.variable}`}>
            <SiteHeader>
                <ViewToggle className={styles.viewToggle} />
            </SiteHeader>
            <main>
                <div className={styles.scene}>
                    <SketchDefs />
                    {renderSky()}
                    {renderClouds()}
                    <SkillGarden skills={resume.skills} projects={resume.projects} />
                    {renderRoots()}
                </div>
                <div className={styles.plainWrap}>
                    <PlainResume />
                </div>
            </main>
            <footer className={styles.footer}>
                <AnimationsToggle className={styles.toggle} />
                <p>
                    Last updated <time dateTime={resume.lastUpdated}>{formatMonth(resume.lastUpdated, 'long')}</time>
                </p>
            </footer>
        </div>
    );
}
