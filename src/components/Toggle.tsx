'use client'

import React from "react";

// Saves a preference and mirrors it onto <html data-{name}> for CSS
// With activeLabel it's a button whose label names the action, e.g. which view it switches to
export default function Toggle({ name, value, label, activeLabel }: { name: string, value: string, label: string, activeLabel?: string }) {
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

    return activeLabel
        ? <button type="button" onClick={toggle}>{on ? activeLabel : label}</button>
        : <label><input type="checkbox" checked={on} onChange={toggle} /> {label}</label>;
}
