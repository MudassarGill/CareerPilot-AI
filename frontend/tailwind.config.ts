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
                brand: {
                    DEFAULT: "#1EA7E8",
                    blue: "#1EA7E8",
                },
                deep: {
                    blue: "#0E7FC0",
                },
                charcoal: "#3A3A3E",
                accent: {
                    orange: "#F97316",
                },
                page: {
                    bg: "#F5F7FB",
                },
                card: {
                    DEFAULT: "#FFFFFF",
                },
                border: {
                    soft: "#E6EBF2",
                },
                text: {
                    primary: "#14213D",
                    muted: "#66728C",
                }
            },
            fontFamily: {
                sora: ["var(--font-sora)", "sans-serif"],
                sans: ["var(--font-dm-sans)", "sans-serif"],
            },
            keyframes: {
                slideBounce: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(200%)' },
                },
                underlineExpand: {
                    '0%': { width: '0%', left: '0%' },
                    '100%': { width: '100%', left: '0%' }
                }
            },
            animation: {
                'slide-bounce': 'slideBounce 2.5s ease-in-out infinite',
                'underline-expand': 'underlineExpand 0.3s ease-out forwards',
            }
        },
    },
    plugins: [],
};
export default config;
