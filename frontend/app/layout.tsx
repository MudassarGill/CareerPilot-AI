import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CareerPilot AI",
    description: "Phase 1 - Auth Module",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
