import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                buena: {
                    primary: "#2563EB", // Primary blue
                    secondary: "#0F172A", // Dark blue/slate
                    success: "#10B981", // Green for success/income
                    warning: "#F59E0B", // Amber for warnings/medium priority
                    danger: "#EF4444", // Red for errors/high priority
                    info: "#3B82F6", // Light blue for info
                    muted: "#64748B", // Slate for muted text
                    light: "#F8FAFC", // Very light gray for backgrounds
                    dark: "#1E293B", // Dark slate for text
                    border: "#E2E8F0", // Light gray for borders
                },
            },
            boxShadow: {
                card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
            borderRadius: {
                card: "0.75rem",
            },
        },
    },
    plugins: [],
};

export default config;