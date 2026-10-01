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

    const appLinks = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "AI Career Coach", href: "/career-coach" },
        { label: "Resume Intelligence", href: "/resume" },
        { label: "ATS Evaluation", href: "/ats" },
        { label: "Skill Gap Analysis", href: "/skill-gap" },
        { label: "Learning Roadmap", href: "/roadmap" },
        { label: "AI Mock Interview", href: "/mock-interview" },
    ];

    const publicLinks = [
        { label: "About", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
    ];

    const menuItems = user ? appLinks : publicLinks;

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 64px)" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 bg-[#1C1C1E] z-40 overflow-y-auto border-t border-[#2C2C2E]"
        >
            <div className="p-4 space-y-6">
                {!user ? (
                    <div className="flex flex-col gap-4 mb-4">
                        <Link href="/login" onClick={() => setIsOpen(false)} className="text-white hover:text-zinc-200 transition-colors font-medium border border-[#3A3A3E] text-center rounded-lg py-3">Log in</Link>
                        <Link href="/register" onClick={() => setIsOpen(false)} className="bg-brand-blue text-white text-center rounded-lg py-3 font-semibold hover:bg-deep-blue transition-colors">Sign up</Link>
                    </div>
                ) : (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-[#2A2A2E] border border-[#3A3A3E] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                        <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                )}

                <nav className="flex flex-col space-y-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-white px-2 hover:text-zinc-300 transition-colors"
                        >
                            <span className="relative inline-block">
                                {item.label}
                                {pathname === item.href && (
                                    <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-accent-orange" />
                                )}
                            </span>
                        </Link>
                    ))}
                </nav>

                {user && (
                    <div className="pt-6 border-t border-[#2C2C2E] flex flex-col space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-brand-blue flex flex-col items-center justify-center text-white font-bold">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="font-medium text-white">{user.name}</span>
                        </div>
                        <Link href="/profile" onClick={() => setIsOpen(false)} className="text-left text-lg font-medium text-white px-2 hover:text-brand-blue">My Profile</Link>
                        <Link href="/settings" onClick={() => setIsOpen(false)} className="text-left text-lg font-medium text-white px-2 hover:text-brand-blue">Settings</Link>
                        <button
                            onClick={() => { setIsOpen(false); logout(); }}
                            className="text-left text-lg font-medium text-red-400 px-2 hover:text-red-300"
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
