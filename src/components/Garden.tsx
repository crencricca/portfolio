'use client'

import Image from "next/image";
import localFont from "next/font/local";
import React from "react";
import styles from "./resume.module.css";
import { resume, type Project } from "@/data/resume";
import { Plant, Seed } from "./art";

const w95 = localFont({ src: './fonts/w95fa.woff2', preload: false });

// 'Tailwind CSS' counts as CSS, but 'React Native' doesn't count as React
const uses = (project: Project, skill: string) => project.stack.some(tool => tool === skill || tool.endsWith(` ${skill}`));

// Projects as plants; skills float above as seeds and stir when a project using them is hovered
export default function Garden() {
    const [hovered, setHovered] = React.useState<Project>();
    const [open, setOpen] = React.useState<Project>();
    const dialog = React.useRef<HTMLDialogElement>(null);

    return (
        <section id="projects" className={styles.garden} aria-labelledby="projects-title">
            <h2 id="projects-title">Projects<span>~ skills on the breeze, projects in the garden ~</span></h2>
            <ul className={styles.seeds} aria-label="Skills">
                {resume.skills.map((skill, i) => (
                    <li key={skill} data-stirred={(hovered && uses(hovered, skill)) || undefined} style={{ '--i': i } as React.CSSProperties}>
                        <Seed />{skill}
                    </li>
                ))}
            </ul>
            <ul className={styles.bed}>
                {resume.projects.map((project, i) => (
                    <li key={project.slug} data-tier={project.tier}>
                        <button
                            type="button"
                            aria-haspopup="dialog"
                            onMouseEnter={() => setHovered(project)}
                            onMouseLeave={() => setHovered(undefined)}
                            onFocus={() => setHovered(project)}
                            onBlur={() => setHovered(undefined)}
                            onClick={() => { setOpen(project); dialog.current?.showModal(); }}
                        >
                            <span className={styles.sprout}><Plant tier={project.tier} variant={i} /></span>
                            <span className={styles.stake}>{project.name}{project.growing && <small>growing</small>}</span>
                        </button>
                    </li>
                ))}
            </ul>
            <dialog
                ref={dialog}
                className={open?.cardStyle === 'win95' ? `${styles.card} ${styles.win95} ${w95.className}` : styles.card}
                aria-labelledby="card-title"
                onClick={e => e.target === e.currentTarget && e.currentTarget.close()}
            >
                {open && (
                    <div>
                        <header>
                            <h3 id="card-title">{open.name}</h3>
                            <button type="button" aria-label="Close" onClick={() => dialog.current?.close()}>×</button>
                        </header>
                        {open.media
                            ? <div className={styles.media}><Image src={`/projects/${open.media.file}`} alt={open.media.alt} fill sizes="620px" /></div>
                            : <p className={styles.media}>Screenshots coming soon</p>}
                        {open.growing && <p className={styles.badge}>Still growing · in progress</p>}
                        <p>{open.oneLiner}</p>
                        <ul className={styles.tags} aria-label="Built with">{open.stack.map(tool => <li key={tool}>{tool}</li>)}</ul>
                        <p>{open.links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</p>
                    </div>
                )}
            </dialog>
        </section>
    );
}
