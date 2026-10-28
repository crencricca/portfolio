// Single source of truth for resume content. The homepage, /resume, and the
// GitHub profile README (scripts/generate-readme.ts) all read from this file.
//
// Keep it self-contained (no imports) and use only erasable TypeScript (no
// enums or namespaces) so Node can run the README script against it directly.
//
// Dates are 'YYYY-MM' strings. Omit `end` on a role that is still current.

export type Link = {
    label: string,
    href: string,
}

export type Role = {
    company: string,
    title: string,
    start: string,
    end?: string,
    location?: string,
    url?: string,
    highlights?: string[],
}

export type RootItem = {
    org: string,
    title: string,
    start: string,
    end: string,
    location?: string,
    description?: string,
}

export type Education = {
    school: string,
    degree: string,
    start: number,
    end: number,
}

export type SkillGroup = {
    name: string,
    skills: string[],
}

export type ProjectMedia = {
    // File in public/projects/. .mp4/.webm render as a looping video.
    file: string,
    alt: string,
}

export type Project = {
    slug: string,
    name: string,
    oneLiner: string,
    // Entries that match a skill name (or end with it, like 'Tailwind CSS' for CSS) stir that
    // skill's seed when the project is hovered.
    stack: string[],
    links: Link[],
    tier: 'featured' | 'regular' | 'sprout',
    growing?: boolean,
    cardStyle?: 'win95',
    media?: ProjectMedia,
}

export type Resume = {
    name: string,
    tagline: string,
    bio: string,
    location: string,
    lastUpdated: string,
    links: {
        linkedin: string,
        github: string,
        pdf: string,
        site: string,
    },
    experience: Role[],
    education: Education[],
    roots: RootItem[],
    skills: SkillGroup[],
    projects: Project[],
}

export const resume: Resume = {
    name: 'Catie Rencricca',
    tagline: 'Software engineer with a UX obsession.',
    bio: 'Passionate about intuitive UX, scalable UI systems, and modern web architecture.',
    location: 'New York City',
    lastUpdated: '2026-10',
    links: {
        linkedin: 'https://www.linkedin.com/in/catierencricca/',
        github: 'https://github.com/crencricca',
        pdf: 'https://drive.google.com/file/d/1wLjwqueyCvpkhlvYwRD-UM26ngoiqsyk/view?usp=sharing',
        site: 'https://heycatie.vercel.app',
    },
    experience: [
        {
            company: 'TED Conferences',
            title: 'Software Engineer',
            start: '2026-06',
            location: 'New York, NY',
            url: 'https://www.ted.com',
        },
        {
            company: 'Coinbase',
            title: 'Software Engineer',
            start: '2026-02',
            end: '2026-06',
            url: 'https://www.coinbase.com',
        },
        {
            company: 'Ridgeline',
            title: 'UI Product Engineer II',
            start: '2022-08',
            end: '2026-02',
            location: 'Manhattan, NY',
            url: 'https://www.ridgelineapps.com',
        },
    ],
    education: [
        {
            school: 'Cornell University',
            degree: 'BA, Computer Science',
            start: 2018,
            end: 2022,
        },
    ],
    roots: [
        {
            org: 'Cornell University',
            title: 'CS 1110 Consultant',
            start: '2020-08',
            end: '2022-05',
            location: 'Ithaca, NY',
            description: 'Led a discussion section of 20–30 students twice a week, held consulting hours, graded assignments and exams, and proctored exams.',
        },
        {
            org: 'Neighbor 2 Neighbor',
            title: 'Web Developer',
            start: '2019-01',
            end: '2022-05',
            location: 'Tompkins County, NY',
            description: 'Built a responsive inventory-tracking app in Vue.js with a team of 5 other Milstein Program students for a nonprofit that distributes donated furniture to people in need.',
        },
        {
            org: 'Milstein Program in Technology and Humanity',
            title: 'Student Staff',
            start: '2018-08',
            end: '2022-05',
            location: 'Tompkins County, NY',
            description: 'Promoted the program online and in person, produced videos in Adobe Premiere, wrote articles, and ran its social media.',
        },
    ],
    skills: [
        { name: 'Frontend', skills: ['TypeScript', 'React', 'Next.js', 'CSS'] },
        { name: 'Mobile', skills: ['React Native'] },
        { name: 'Game dev', skills: ['Godot'] },
    ],
    projects: [
        {
            slug: 'wish-you-were-here',
            name: 'Wish You Were Here',
            oneLiner: 'A Windows 95 desktop rebuilt in Godot, with draggable windows, folders, a text editor, and a taskbar, hiding a mystery you uncover by digging through the files.',
            stack: ['Godot', 'GDScript'],
            links: [{ label: 'GitHub', href: 'https://github.com/crencricca/Wish-You-Were-Here' }],
            tier: 'featured',
            growing: true,
            cardStyle: 'win95',
        },
        {
            slug: 'localhost',
            name: 'localhost',
            oneLiner: 'A social coordination app, built for the web with Next.js and for mobile with React Native.',
            stack: ['TypeScript', 'React', 'Next.js', 'React Native', 'Firebase', 'Tailwind CSS'],
            links: [
                { label: 'Live site', href: 'https://localhosting.vercel.app' },
                { label: 'Web repo', href: 'https://github.com/crencricca/localhost' },
                { label: 'Mobile repo', href: 'https://github.com/crencricca/localhost-native' },
            ],
            tier: 'regular',
        },
        {
            slug: 'witchy-advice',
            name: 'witchy-advice',
            oneLiner: 'A potion-brewing mini-game.',
            stack: ['Godot', 'GDScript'],
            links: [{ label: 'GitHub', href: 'https://github.com/crencricca/witchy-advice' }],
            tier: 'regular',
        },
        {
            slug: 'coffee-shop-simulator',
            name: 'coffee-shop-simulator',
            oneLiner: 'Discover new recipes by combining ingredients.',
            stack: ['Godot', 'GDScript'],
            links: [{ label: 'GitHub', href: 'https://github.com/crencricca/coffee-shop-simulator' }],
            tier: 'regular',
        },
        {
            slug: 'flumph',
            name: 'flumph',
            oneLiner: 'A D&D-inspired, turn-based roguelike where the game acts as your dungeon master. Dice decide the outcomes, branching paths sit under fog of war, and you upgrade a camp between runs.',
            stack: ['Godot', 'GDScript'],
            links: [{ label: 'GitHub', href: 'https://github.com/crencricca/flumph' }],
            tier: 'regular',
            growing: true,
        },
        {
            slug: 'aol-chat',
            name: 'aol-chat',
            oneLiner: 'A nostalgic chat interface for anyone else who misses AIM.',
            stack: ['React', 'Tailwind CSS'],
            links: [{ label: 'GitHub', href: 'https://github.com/crencricca/aol-chat' }],
            tier: 'sprout',
        },
        {
            slug: 'native-weather',
            name: 'native-weather',
            oneLiner: "Today's and yesterday's weather, side by side.",
            stack: ['React Native', 'TypeScript'],
            links: [{ label: 'GitHub', href: 'https://github.com/crencricca/native-weather' }],
            tier: 'sprout',
        },
        {
            slug: 'calendar',
            name: 'calendar',
            oneLiner: 'Plan events with friends.',
            stack: ['React', 'TypeScript', 'Tailwind CSS'],
            links: [{ label: 'GitHub', href: 'https://github.com/crencricca/calendar' }],
            tier: 'sprout',
        },
    ],
}

export const currentRole = (data: Resume = resume): Role | undefined =>
    data.experience.find(role => !role.end);
