"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { images } from "@/lib/content";
import Image from "next/image";
import { Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    // Prevent body scroll when open
    if (typeof document !== "undefined") {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    const menuItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "AI Career Coach", href: "/career-coach" },
        { label: "Resume Intelligence", href: "/resume" },
        { label: "ATS Evaluation", href: "/ats" },
        { label: "Skill Gap Analysis", href: "/skill-gap" },
        { label: "Learning Roadmap", href: "/roadmap" },
        { label: "AI Mock Interview", href: "/mock-interview" },
    ];

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 64px)" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 bg-white z-40 overflow-y-auto border-t border-border-soft"
        >
            <div className="p-4 space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-page-bg border border-border-soft rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>

                <nav className="flex flex-col space-y-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-text-primary px-2"
                        >
                            <span className="relative inline-block">
                                {item.label}
                                {pathname === item.href && (
                                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent-orange" />
                                )}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-border-soft flex flex-col space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-brand-blue flex flex-col items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-text-primary">{user?.name}</span>
                    </div>
                    <button
                        onClick={() => { setIsOpen(false); logout(); }}
                        className="text-left text-lg font-medium text-text-primary px-2 hover:text-red-500"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
