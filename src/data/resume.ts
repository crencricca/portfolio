// Resume content for the site and scripts/generate-readme.ts. Node runs that
// script directly, so keep this file import-free and erasable TypeScript only.

export type Role = {
    org: string,
    title: string,
    start: string,
    end?: string,
    location?: string,
    url?: string,
    description?: string,
}

export type Project = {
    slug: string,
    name: string,
    oneLiner: string,
    stack: string[],
    links: { label: string, href: string }[],
    tier: 'featured' | 'regular' | 'sprout',
    growing?: boolean,
    cardStyle?: 'win95',
    media?: { file: string, alt: string }, // file in public/projects/
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Dates are 'YYYY-MM'
export const formatMonth = (date: string) => `${MONTHS[Number(date.slice(5)) - 1]} ${date.slice(0, 4)}`;
export const formatRange = (start: string, end?: string) => `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;

export const resume: {
    name: string,
    tagline: string,
    bio: string,
    location: string,
    lastUpdated: string,
    links: { linkedin: string, github: string, pdf: string, site: string },
    experience: Role[],
    education: { school: string, degree: string, years: string },
    roots: Role[],
    skills: string[],
    projects: Project[],
} = {
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
        { org: 'TED Conferences', title: 'Software Engineer', start: '2026-06', location: 'New York, NY', url: 'https://www.ted.com' },
        { org: 'Coinbase', title: 'Software Engineer', start: '2026-02', end: '2026-06', url: 'https://www.coinbase.com' },
        { org: 'Ridgeline', title: 'UI Product Engineer II', start: '2022-08', end: '2026-02', location: 'Manhattan, NY', url: 'https://www.ridgelineapps.com' },
    ],
    education: { school: 'Cornell University', degree: 'BA, Computer Science', years: '2018 – 2022' },
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
    skills: ['TypeScript', 'React', 'Next.js', 'CSS', 'React Native', 'Godot'],
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
