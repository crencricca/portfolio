import type { Metadata } from "next";
import Image from "next/image";
import styles from "./resume.module.css";
import { bodyFont, titleFont } from "../fonts";
import { currentRole, resume } from "@/data/resume";
import { formatMonth, formatRange } from "@/data/format";
import SiteHeader from "../components/SiteHeader";
import AnimationsToggle from "../components/AnimationsToggle";
import { CloudShape, RootLines, SketchDefs } from "./art";
import SkillGarden from "./SkillGarden";
import PlainResume from "./PlainResume";
import ViewToggle from "./ViewToggle";

export const metadata: Metadata = {
    title: `Resume · ${resume.name}`,
    description: `${resume.tagline} ${resume.bio}`,
    openGraph: {
        title: `${resume.name} · Resume`,
        description: resume.tagline,
        url: '/resume',
        type: 'profile',
    },
    twitter: {
        card: 'summary_large_image',
    },
};

export default function ResumePage() {
    const current = currentRole();
    const [firstName, ...restOfName] = resume.name.split(' ');
    const education = resume.education[0];

    const renderSky = () => (
        <section className={styles.sky} aria-labelledby="resume-name">
            <div className={styles.skyClouds} aria-hidden="true">
                <Image className={styles.drift} src="/cloud.png" alt="" width={125} height={75} />
                <Image className={styles.drift} src="/cloud.png" alt="" width={85} height={50} />
                <Image className={styles.drift} src="/cloud.png" alt="" width={100} height={60} />
            </div>
            <div className={styles.hero}>
                <div>
                    <h1 id="resume-name" className={`${titleFont.className} ${styles.name}`}>
                        <span className={styles.firstName}>{firstName}</span> {restOfName.join(' ')}
                    </h1>
                    <p className={`${titleFont.className} ${styles.tagline}`}>{resume.tagline}</p>
                    {current && (
                        <p className={styles.current}>
                            Currently <strong>{current.title}</strong> at <a href={current.url}>{current.company}</a> · {resume.location}
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
                                <p>{role.title}</p>
                                <p className={styles.meta}>{formatRange(role.start, role.end)}</p>
                                {role.location && <p className={styles.meta}>{role.location}</p>}
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
            <SiteHeader current="resume">
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
