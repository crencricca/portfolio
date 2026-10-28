import localFont from "next/font/local";

// W95FA from Wish You Were Here (see fonts/w95fa-OFL.txt). Only that project's
// card uses it, so don't preload it.
export const w95Font = localFont({
    src: './fonts/w95fa.woff2',
    display: 'swap',
    preload: false,
    fallback: ['Tahoma', 'Verdana', 'sans-serif'],
});
