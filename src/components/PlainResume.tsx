import React from "react";
import styles from "./resume.module.css";
import { formatRange, resume } from "@/data/resume";

const short = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const Item = ({ title, aside, children }: { title: string, aside: string, children?: React.ReactNode }) => (
    <>
        <h3>{title}<span>{aside}</span></h3>
        {children}
    </>
);

// The resume without the scene; also what prints
export default function PlainResume() {
    const { links, education } = resume;
    return (
        <article className={styles.plain}>
            <h1>{resume.name}</h1>
            <p>{resume.tagline} {resume.bio}</p>
            <p>{resume.location} {[links.linkedin, links.github, links.site].map(href => <a key={href} href={href}>{short(href)}</a>)}</p>
            <h2>Experience</h2>
            {resume.experience.map(role => (
                <Item key={role.org} title={`${role.title}, ${role.org}`} aside={formatRange(role.start, role.end)}>
                    {role.location && <p>{role.location}</p>}
                </Item>
            ))}
            <h2>Projects</h2>
            {resume.projects.map(project => (
                <Item key={project.slug} title={project.growing ? `${project.name} (in progress)` : project.name} aside={project.stack.join(', ')}>
                    <p>{project.oneLiner}</p>
                    <p>{project.links.map(link => <a key={link.href} href={link.href}>{short(link.href)}</a>)}</p>
                </Item>
            ))}
            <h2>Skills</h2>
            <p>{resume.skills.join(', ')}</p>
            <h2>Education</h2>
            <Item title={`${education.school}, ${education.degree}`} aside={education.years} />
            {resume.roots.map(role => (
                <Item key={role.org} title={`${role.title}, ${role.org}`} aside={formatRange(role.start, role.end)}>
                    <p>{role.description}</p>
                </Item>
            ))}
        </article>
    );
}
