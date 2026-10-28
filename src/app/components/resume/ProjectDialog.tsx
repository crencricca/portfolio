'use client'

import Image from "next/image";
import React from "react";
import styles from "./dialog.module.css";
import type { Project } from "@/data/resume";
import { w95Font } from "./w95";

type Props = {
    project?: Project,
    onClose: () => void,
}

const prefersStillMedia = () =>
    document.documentElement.dataset.animations === 'off'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ProjectDialog({ project, onClose }: Props) {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const win95 = project?.cardStyle === 'win95';

    React.useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (project && !dialog.open) dialog.showModal();
        if (!project && dialog.open) dialog.close();
    }, [project]);

    // Esc closes the dialog natively; sync state when it does
    React.useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        dialog.addEventListener('close', onClose);
        return () => dialog.removeEventListener('close', onClose);
    }, [onClose]);

    const close = () => {
        dialogRef.current?.close();
        onClose();
    }

    // Clicks on the backdrop land on the <dialog> itself, never on the card
    const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) close();
    }

    const renderMedia = (project: Project) => {
        if (!project.media) {
            return (
                <div className={styles.placeholder}>
                    {!win95 && <Image src="/space-frame.png" alt="" fill sizes="(max-width: 700px) 100vw, 600px" />}
                    <span>Screenshots coming soon</span>
                </div>
            );
        }

        const src = `/projects/${project.media.file}`;
        if (/\.(mp4|webm)$/.test(project.media.file)) {
            const still = prefersStillMedia();
            return (
                <div className={styles.media}>
                    <video src={src} aria-label={project.media.alt} muted loop playsInline autoPlay={!still} controls={still} />
                </div>
            );
        }

        return (
            <div className={styles.media}>
                <Image src={src} alt={project.media.alt} fill sizes="(max-width: 700px) 100vw, 600px" />
            </div>
        );
    }

    return (
        <dialog
            ref={dialogRef}
            className={`${styles.dialog} ${win95 ? `${styles.win95} ${w95Font.className}` : ''}`}
            aria-labelledby="project-dialog-title"
            onClick={handleClick}
        >
            {project && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 id="project-dialog-title">{project.name}</h2>
                        <button type="button" className={styles.close} onClick={close} aria-label="Close">
                            <span aria-hidden="true">{win95 ? '✕' : '×'}</span>
                        </button>
                    </div>
                    <div className={styles.cardBody}>
                        {renderMedia(project)}
                        {project.growing && <p className={styles.badge}>Still growing · in progress</p>}
                        <p className={styles.oneLiner}>{project.oneLiner}</p>
                        <ul className={styles.tags} aria-label="Built with">
                            {project.stack.map(tag => <li key={tag}>{tag}</li>)}
                        </ul>
                        <ul className={styles.links}>
                            {project.links.map(link => (
                                <li key={link.href}><a href={link.href}>{link.label}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </dialog>
    );
}
