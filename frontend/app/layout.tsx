import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Providers from "./providers"; // We'll create this to wrap query client

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
    display: 'swap',
});
const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    display: 'swap',
});

export const metadata: Metadata = {
    title: "CareerPilot AI",
    description: "Multi-Agent Career Intelligence Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${sora.variable} ${dmSans.variable} font-sans antialiased`}>
                <Providers>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}
