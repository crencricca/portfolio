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

// Skills drift down as seeds; hovering, focusing, or tapping one makes the
// projects built with it glow in the garden below.
export default function SkillGarden({ skills, projects }: Props) {
    const [hovered, setHovered] = React.useState<string | null>(null);
    const [pinned, setPinned] = React.useState<string | null>(null);
    const [openSlug, setOpenSlug] = React.useState<string | null>(null);
    const active = hovered ?? pinned;

    const grewInto = React.useMemo(() => {
        const map: Record<string, string[]> = {};
        projects.forEach(project => project.stack.forEach(skill => {
            (map[skill] ??= []).push(project.name);
        }));
        return map;
    }, [projects]);

    const renderSeed = (skill: string, index: number) => {
        const grown = grewInto[skill] ?? [];
        const content = (
            <>
                <Seed className={styles.seedArt} />
                <span className={styles.seedLabel}>{skill}</span>
            </>
        );

        return (
            <li key={skill} style={{ '--i': index } as React.CSSProperties}>
                {grown.length ? (
                    <button
                        type="button"
                        className={`${styles.seed} ${styles.seedButton}`}
                        aria-pressed={pinned === skill}
                        onMouseEnter={() => setHovered(skill)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(skill)}
                        onBlur={() => setHovered(null)}
                        onClick={() => setPinned(pinned === skill ? null : skill)}
                    >
                        {content}
                        <span className="visually-hidden">, grew into {grown.join(', ')}</span>
                    </button>
                ) : (
                    <span className={styles.seed}>{content}</span>
                )}
            </li>
        );
    }

    const renderPlant = (project: Project, index: number) => {
        const glowing = active ? project.stack.includes(active) : false;
        return (
            <li key={project.slug} className={styles.plot} data-tier={project.tier} data-glow={glowing || undefined}>
                <button
                    type="button"
                    className={styles.plant}
                    aria-haspopup="dialog"
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
    }

    return (
        <>
            <section id="skills" className={styles.seeds} aria-labelledby="skills-title">
                <h2 id="skills-title" className={`${titleFont.className} ${styles.sectionTitle}`}>
                    Skills
                    <span className={styles.sectionNote}>~ seeds on the breeze ~</span>
                </h2>
                <p className={styles.hint}>Hover or tap a seed to see what grew from it.</p>
                <div className={styles.seedGroups}>
                    {skills.map(group => (
                        <div key={group.name} className={styles.seedGroup}>
                            <h3>{group.name}</h3>
                            <ul className={styles.seedList}>
                                {group.skills.map(renderSeed)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section id="projects" className={styles.garden} aria-labelledby="projects-title">
                <h2 id="projects-title" className={`${titleFont.className} ${styles.sectionTitle}`}>
                    Projects
                    <span className={styles.sectionNote}>~ the garden ~</span>
                </h2>
                <ul className={styles.bed} data-active={active ? '' : undefined}>
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
