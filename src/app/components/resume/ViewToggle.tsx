'use client'

import React from "react";
import { VIEW_KEY, savePreference } from "../../preferences";

export default function ViewToggle({ className }: { className?: string }) {
    const [plain, setPlain] = React.useState(false);

    React.useEffect(() => {
        setPlain(document.documentElement.dataset.view === 'plain');
    }, []);

    const handleClick = () => {
        const next = !plain;
        setPlain(next);
        if (next) {
            document.documentElement.dataset.view = 'plain';
        } else {
            delete document.documentElement.dataset.view;
        }
        savePreference(VIEW_KEY, next ? 'plain' : 'garden');
        // The page content swaps, so jump rather than glide back to the top
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    return (
        <button type="button" className={className} aria-pressed={plain} onClick={handleClick}>
            Plain resume
        </button>
    );
}
