'use client'

import React from "react";
import { ANIMATIONS_KEY, savePreference } from "../preferences";

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export default function AnimationsToggle({ className }: { className?: string }) {
    const [disabled, setDisabled] = React.useState(false);
    const [systemReduced, setSystemReduced] = React.useState(false);

    React.useEffect(() => {
        setDisabled(document.documentElement.dataset.animations === 'off');
        const query = window.matchMedia(REDUCED_MOTION);
        const update = () => setSystemReduced(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const off = e.target.checked;
        setDisabled(off);
        if (off) {
            document.documentElement.dataset.animations = 'off';
        } else {
            delete document.documentElement.dataset.animations;
        }
        savePreference(ANIMATIONS_KEY, off ? 'off' : 'on');
    }

    return (
        <label className={className} title={systemReduced ? 'Your device is set to reduce motion' : undefined}>
            <input
                type="checkbox"
                checked={disabled || systemReduced}
                disabled={systemReduced}
                onChange={handleChange}
            />
            Disable Animations
        </label>
    );
}
