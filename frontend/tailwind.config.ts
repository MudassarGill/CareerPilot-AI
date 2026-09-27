import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            keyframes: {
                slideBounce: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(200%)' },
                }
            },
            animation: {
                'slide-bounce': 'slideBounce 2.5s ease-in-out infinite',
            }
        },
    },
    plugins: [],
};
export default config;
