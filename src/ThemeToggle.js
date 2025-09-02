import React, { useEffect, useState } from "react";

const THEME_KEY = "app-theme"; // 'light' | 'dark'

function applyTheme(theme) {
    const body = document.body;
    if (theme === "dark") body.classList.add("theme-dark");
    else body.classList.remove("theme-dark");
}

function detectInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "light";
    if (saved === "dark" || saved === "light") return saved;
    // fallback to system preference
    //const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    //return prefersDark ? "dark" : "light";
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState(detectInitialTheme); // 'light' | 'dark'

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));

    return (
        <button
            type="button"
            onClick={toggle}
            className="btn theme-toggle"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
            <span className="theme-toggle-icon" aria-hidden>
                {theme === "dark" ? "🌙" : "🌞"}
            </span>
            <span className="theme-toggle-text">
                {theme === "dark" ? "Dark" : "Light"}
            </span>
        </button>
    );
}
