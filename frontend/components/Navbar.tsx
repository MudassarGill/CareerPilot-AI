"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { NavDropdown } from "./NavDropdown";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "@/lib/auth-context";
import { images } from "@/lib/content";
import { AnimatePresence } from "framer-motion";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const mainLinks = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "AI Career Coach", href: "/career-coach" },
        { label: "Resume Intelligence", href: "/resume" },
        { label: "ATS Evaluation", href: "/ats" },
    ];

    const moreLinks = [
        { label: "Skill Gap Analysis", href: "/skill-gap" },
        { label: "Learning Roadmap", href: "/roadmap" },
        { label: "AI Mock Interview", href: "/mock-interview" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-[#1C1C1E] border-b border-[#2C2C2E] shadow-sm h-16 flex items-center">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
                    {/* Visual Mark - crops just the mark from the original CAREER CLUB logo */}
                    <div className="w-10 h-10 overflow-hidden relative rounded-[4px] relative">
                        {/* We approximate a crop using object-position, adjust as needed depending on real file coords */}
                        <Image
                            src={images.logo}
                            alt="Logo Mark"
                            fill
                            className="object-cover object-left scale-150 transform translate-x-2"
                        />
                    </div>
                    {/* Live Text Name */}
                    <div className="flex flex-col ml-1 leading-none shadow-sm drop-shadow-sm transition-transform group-active:scale-95">
                        <span className="font-sora font-extrabold text-white text-[18px] tracking-tight">
                            CAREER
                        </span>
                        <span className="font-sora font-extrabold text-[#1EA7E8] text-[13px] tracking-wider text-right -mt-0.5">
                            PLOT
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-8">
                    {mainLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group relative font-medium text-zinc-100 py-2 text-sm xl:text-base outline-none rounded-md hover:text-white"
                        >
                            <span className="relative z-10">{item.label}</span>
                            <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent-orange transition-all duration-300 ease-out
                                ${pathname === item.href ? "w-full" : "w-0 group-hover:w-full"}`}
                            />
                        </Link>
                    ))}
                    <NavDropdown label="More" items={moreLinks} />
                </nav>

                <div className="flex-grow hidden lg:block" />

                {/* Right utilities */}
                <div className="hidden lg:flex items-center gap-5">
                    {/* Search Field */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-48 xl:w-64 bg-[#2A2A2E] border border-[#3A3A3E] text-white placeholder-zinc-400 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all font-medium"
                        />
                        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-accent-orange transition-colors" />
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-lg shadow hover:bg-deep-blue transition group focus:outline-none focus:ring-2 focus:ring-accent-orange focus:ring-offset-2"
                        >
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </button>

                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-border-soft overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-border-soft flex flex-col">
                                        <span className="font-semibold text-text-primary text-sm truncate">{user?.name}</span>
                                        <span className="text-text-muted text-xs truncate">{user?.email}</span>
                                    </div>
                                    <div className="py-2">
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-text-primary hover:bg-zinc-50" onClick={() => setIsProfileOpen(false)}>
                                            Profile Settings
                                        </Link>
                                        <button
                                            onClick={() => { setIsProfileOpen(false); logout(); }}
                                            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-zinc-50 hover:text-red-600"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="lg:hidden p-2 text-white hover:bg-zinc-800 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
                )}
            </AnimatePresence>
        </header>
    );
}
