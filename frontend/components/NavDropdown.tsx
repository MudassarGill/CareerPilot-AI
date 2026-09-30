"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavDropdownProps {
    label: string;
    items: { label: string; href: string }[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = items.some(item => pathname === item.href);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="group relative flex items-center gap-1 font-medium text-text-primary py-2 outline-none rounded-md"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span>{label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent-orange transition-all duration-300 ease-out
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border-soft overflow-hidden z-50"
                    >
                        <div className="py-2">
                            {items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block px-4 py-2 hover:bg-zinc-50 group relative"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="font-medium text-text-primary text-sm relative">
                                        {item.label}
                                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent-orange transition-all duration-300 ease-out
                                            ${pathname === item.href ? "w-full" : "w-0 group-hover:w-full"}`}
                                        />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
