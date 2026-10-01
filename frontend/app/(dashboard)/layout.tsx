import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-page-bg max-w-[100vw] overflow-x-hidden">
            <Navbar />
            <main className="flex-1 w-full flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
}
