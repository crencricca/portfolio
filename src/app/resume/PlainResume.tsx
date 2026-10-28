import styles from "./plain.module.css";
import { titleFont } from "../fonts";
import { resume } from "@/data/resume";
import { formatRange } from "@/data/format";

// Printed links need to be readable on paper, so show the URL itself
const displayUrl = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// The same resume with no metaphor: quick to scan, and what gets printed.
export default function PlainResume() {
    const education = resume.education[0];

    return (
        <article className={styles.plain} aria-labelledby="plain-name">
            <header className={styles.intro}>
                <h1 id="plain-name" className={titleFont.className}>{resume.name}</h1>
                <p>{resume.tagline} {resume.bio}</p>
                <p className={styles.contact}>
                    <span>{resume.location}</span>
                    <a href={resume.links.linkedin}>{displayUrl(resume.links.linkedin)}</a>
                    <a href={resume.links.github}>{displayUrl(resume.links.github)}</a>
                    <a href={resume.links.site}>{displayUrl(resume.links.site)}</a>
                </p>
            </header>

            <section aria-labelledby="plain-experience">
                <h2 id="plain-experience" className={titleFont.className}>Experience</h2>
                {resume.experience.map(role => (
                    <div key={`${role.company}-${role.start}`} className={styles.item}>
                        <div className={styles.itemHead}>
                            <h3>{role.title}, {role.company}</h3>
                            <span className={styles.dates}>{formatRange(role.start, role.end)}</span>
                        </div>
                        {role.location && <p className={styles.muted}>{role.location}</p>}
                        {role.highlights?.length ? (
                            <ul>{role.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
                        ) : null}
                    </div>
                ))}
            </section>

            <section aria-labelledby="plain-projects">
                <h2 id="plain-projects" className={titleFont.className}>Projects</h2>
                {resume.projects.map(project => (
                    <div key={project.slug} className={styles.item}>
                        <div className={styles.itemHead}>
                            <h3>{project.name}{project.growing ? ' (in progress)' : ''}</h3>
                            <span className={styles.dates}>{project.stack.join(', ')}</span>
                        </div>
                        <p>{project.oneLiner}</p>
                        <p className={styles.links}>
                            {project.links.map(link => <a key={link.href} href={link.href}>{displayUrl(link.href)}</a>)}
                        </p>
                    </div>
                ))}
            </section>

            <section aria-labelledby="plain-skills">
                <h2 id="plain-skills" className={titleFont.className}>Skills</h2>
                <dl className={styles.skills}>
                    {resume.skills.map(group => (
                        <div key={group.name}>
                            <dt>{group.name}</dt>
                            <dd>{group.skills.join(', ')}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section aria-labelledby="plain-education">
                <h2 id="plain-education" className={titleFont.className}>Education</h2>
                {education && (
                    <div className={styles.item}>
                        <div className={styles.itemHead}>
                            <h3>{education.school}, {education.degree}</h3>
                            <span className={styles.dates}>{education.start} – {education.end}</span>
                        </div>
                    </div>
                )}
                {resume.roots.map(root => (
                    <div key={`${root.org}-${root.title}`} className={styles.item}>
                        <div className={styles.itemHead}>
                            <h3>{root.title}, {root.org}</h3>
                            <span className={styles.dates}>{formatRange(root.start, root.end)}</span>
                        </div>
                        {root.description && <p>{root.description}</p>}
                    </div>
                ))}
            </section>
        </article>
    );
}
