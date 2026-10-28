import { Concert_One, Dosis } from "next/font/google";

export const titleFont = Concert_One({
    subsets: ['latin'],
    variable: '--font-title',
    display: 'swap',
    weight: '400',
});

export const bodyFont = Dosis({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});
