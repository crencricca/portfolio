'use client'

import Image from "next/image";
import styles from "./page.module.css";
import React from "react";
import { bodyFont, titleFont } from "./fonts";
import { currentRole, resume } from "@/data/resume";
import { formatMonth } from "@/data/format";
import SiteHeader from "./components/SiteHeader";
import AnimationsToggle from "./components/AnimationsToggle";

export default function Home() {
    const avatarWidth = 250;
    const cursorRef = React.createRef<HTMLDivElement>();
    const current = currentRole();

    const handleMouseMove = (e: MouseEvent) => {
        if (!cursorRef || !cursorRef.current) return;
        console.log(cursorRef.current);
        cursorRef.current.style.top = e.pageY + 'px';
        cursorRef.current.style.left = e.pageX + 'px';
    }

    const renderBio = () => (
        <div className={styles.bio}>
            <div className={titleFont.className}>
                <h1 style={{ letterSpacing: '2px', paddingBottom: '1rem' }}>
                    Hi, I&#39;m <span className={styles.accentColor}>Catie</span>!
                    <span className={styles.tagline}>{resume.tagline}</span>
                </h1>
                <h3 className={bodyFont.className} style={{ fontWeight: 'normal', maxWidth: '80vh' }}>
                    {current && (
                        <>
                            Software engineer currently based in {resume.location} at <a href={current.url}>{current.company}</a> since {formatMonth(current.start, 'long')}.{' '}
                        </>
                    )}
                    {resume.bio}
                </h3>
                {/* <button className={styles.button}>PROJECTS</button> */}
            </div>
            <div className={styles.avatarContainer}>
                <Image
                    className={styles.avatar}
                    src="/avatar.png"
                    alt="Catie Avatar"
                    width={avatarWidth}
                    height={avatarWidth}
                    priority
                />
            </div>
        </div>
    );

    return (
        <main className={styles.main}>
            <SiteHeader current="home" fixed />
            <div className={styles.content}>
                <div className={styles.sky}>
                    <Image
                        className={styles.cloud}
                        src="/cloud.png"
                        alt="Cloud"
                        width={85}
                        height={50}
                    />
                    <Image
                        className={styles.cloudXL}
                        src="/cloud.png"
                        alt="Cloud"
                        width={125}
                        height={75}
                    />
                </div>
                <div className={styles.center}>
                    {renderBio()}
                </div>
            </div>
            {/* <div className={styles.content}>
                <div>Coming Soon...</div>
            </div> */}
            {/* <div className={`${styles.cursor} cursor`} ref={cursorRef}>hi</div> */}
            <footer className={styles.footer}>
                <p className={bodyFont.className}>
                    <AnimationsToggle className={styles.toggle} />
                </p>
                <span className={styles.grass} />
            </footer>
        </main>
    );
}
