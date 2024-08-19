'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Concert_One, Dosis } from "next/font/google";
import React from "react";
import * as constants from './constants';

const titleFont = Concert_One({
    subsets: ['latin'],
    variable: '--font-title',
    display: 'swap',
    weight: '400',
});

const bodyFont = Dosis({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});

export default function Home() {
  const avatarWidth = 250;
  const cursorRef = React.createRef<HTMLDivElement>();
  const [isAnimating, setIsAnimating] = React.useState(true);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cursorRef || !cursorRef.current) return;
    console.log(cursorRef.current);
    cursorRef.current.style.top = e.pageY + 'px';
    cursorRef.current.style.left = e.pageX + 'px';
  }

  const renderHeader = () => (
    <header className={styles.header}>
        <div className={styles.title}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>
            <h3 className={titleFont.className}><a>Catie Rencricca</a></h3>
        </div>
        <div className={`${styles.navigation} ${bodyFont.variable}`}>
            <a href="https://www.linkedin.com/in/catierencricca/" title="LinkedIn">LinkedIn</a>
            <a href="https://drive.google.com/file/d/1wLjwqueyCvpkhlvYwRD-UM26ngoiqsyk/view?usp=sharing" title="Resume">Resume</a>
            <a href="https://github.com/crencricca" title="Github">Github</a>
        </div>
    </header>
  );

  const renderBio = () => (
    <div className={styles.bio}>
        <div className={titleFont.className}>
            <h1 style={{ letterSpacing: '2px', paddingBottom: '1rem' }}>
                Hi, I&#39;m <span className={styles.accentColor}>Catie</span>! 
                <span className={styles.tagline}>{constants.tagline}</span>
            </h1>
            <h3 className={bodyFont.className} style={{ fontWeight: 'normal', maxWidth: '80vh' }}>{constants.bio}</h3>
        </div>
        <Image
          className={styles.avatar}
          src="/avatar.png"
          alt="Catie Avatar"
          width={avatarWidth}
          height={avatarWidth}
          priority
        />
    </div>
  );

  return (
    <main className={styles.main}>
        {renderHeader()}
        <div className={styles.content}>
            <div className={styles.sky}>
                <Image 
                    className={isAnimating ? styles.cloud : ''}
                    src="/cloud.png"
                    alt="Cloud"
                    width={85}
                    height={50}
                />
                <Image 
                    className={isAnimating ? styles.cloudXL : ''}
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
        {/* <div className={`${styles.cursor} cursor`} ref={cursorRef}>hi</div> */}
        <footer className={styles.footer}>
            <p className={bodyFont.className}>
                <input className={styles.checkbox} checked={!isAnimating} title="Animations" type="checkbox" onClick={() => setIsAnimating(!isAnimating)} />
                Disable Animations
            </p>
            <span className={styles.grass} />
        </footer>
    </main>
  );
}
