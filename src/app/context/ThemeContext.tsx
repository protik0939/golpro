"use client";

import { useEffect, useState } from "react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    // Ensure theme is applied before rendering
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "Dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>; // Prevent hydration mismatch
    }

    return <>{children}</>;
};

export default ThemeProvider;
