'use client'

import React from "react";

// Saves a preference and mirrors it onto <html data-{name}> for CSS
export default function Toggle({ name, value, label, button = false }: { name: string, value: string, label: string, button?: boolean }) {
    const [on, setOn] = React.useState(false);
    React.useEffect(() => setOn(document.documentElement.dataset[name] === value), [name, value]);

    const toggle = () => {
        const next = !on;
        setOn(next);
        if (next) document.documentElement.dataset[name] = value;
        else delete document.documentElement.dataset[name];
        try {
            if (next) localStorage.setItem(`catie:${name}`, value);
            else localStorage.removeItem(`catie:${name}`);
        } catch {}
    }

    return button
        ? <button type="button" aria-pressed={on} onClick={toggle}>{label}</button>
        : <label><input type="checkbox" checked={on} onChange={toggle} /> {label}</label>;
}
