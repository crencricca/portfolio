'use client'

import React from "react";
import styles from "./garden.module.css";
import { titleFont } from "../fonts";
import type { Project, SkillGroup } from "@/data/resume";
import { Plant, Seed } from "./art";
import ProjectDialog from "./ProjectDialog";

type Props = {
    skills: SkillGroup[],
    projects: Project[],
}

// 'Tailwind CSS' counts as CSS, but 'React Native' doesn't count as React
const usesSkill = (project: Project, skill: string) =>
    project.stack.some(tool => tool === skill || tool.endsWith(` ${skill}`));

// Skills float above the garden as dandelion seeds. Hovering or focusing a
// project stirs the seeds it was built with.
export default function SkillGarden({ skills, projects }: Props) {
    const [activeSlug, setActiveSlug] = React.useState<string | null>(null);
    const [openSlug, setOpenSlug] = React.useState<string | null>(null);
    const activeProject = projects.find(project => project.slug === activeSlug);

    const renderSeed = (skill: string, index: number) => (
        <li
            key={skill}
            className={styles.seed}
            data-stirred={(activeProject && usesSkill(activeProject, skill)) || undefined}
            style={{ '--i': index } as React.CSSProperties}
        >
            <Seed className={styles.seedArt} />
            {skill}
        </li>
    );

    const renderPlant = (project: Project, index: number) => (
        <li key={project.slug} className={styles.plot} data-tier={project.tier}>
            <button
                type="button"
                className={styles.plant}
                aria-haspopup="dialog"
                onMouseEnter={() => setActiveSlug(project.slug)}
                onMouseLeave={() => setActiveSlug(null)}
                onFocus={() => setActiveSlug(project.slug)}
                onBlur={() => setActiveSlug(null)}
                onClick={() => setOpenSlug(project.slug)}
            >
                <span className={styles.sprout}>
                    <Plant className={styles.art} tier={project.tier} variant={index} />
                </span>
                <span className={styles.stake}>
                    {project.name}
                    {project.growing && (
                        <span className={styles.growing}><span className="visually-hidden">, </span>growing</span>
                    )}
                </span>
            </button>
        </li>
    );

    return (
        <>
            <section id="projects" className={styles.garden} aria-labelledby="projects-title">
                <h2 id="projects-title" className={`${titleFont.className} ${styles.sectionTitle}`}>
                    Projects
                    <span className={styles.sectionNote}>~ skills on the breeze, projects in the garden ~</span>
                </h2>
                <ul className={styles.seeds} aria-label="Skills">
                    {skills.flatMap(group => group.skills).map(renderSeed)}
                </ul>
                <ul className={styles.bed}>
                    {projects.map(renderPlant)}
                </ul>
            </section>

            <ProjectDialog
                project={projects.find(project => project.slug === openSlug)}
                onClose={() => setOpenSlug(null)}
            />
        </>
    );
}
