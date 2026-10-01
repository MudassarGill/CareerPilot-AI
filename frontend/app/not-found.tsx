"use client";

import Link from "next/link";
import { MoveLeft, Search } from "lucide-react";
import { useEffect } from "react";
import { images } from "@/lib/content";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border-soft text-center group">
                <div className="w-24 h-24 mx-auto bg-page-bg rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <Search className="w-10 h-10 text-brand-blue" />
                </div>

                <h1 className="font-sora text-3xl font-extrabold text-text-primary mb-3">404</h1>
                <h2 className="font-sora text-xl font-bold text-text-primary mb-4">Page not found</h2>

                <p className="text-text-muted text-sm leading-relaxed mb-8">
                    The page you are looking for doesn't exist, has been moved, or you don't have permission to access it.
                </p>

                <div className="flex flex-col gap-3">
                    <Link href="/" className="bg-brand-blue text-white font-semibold py-3 px-6 rounded-xl hover:bg-deep-blue transition-colors shadow-md w-full">
                        Return to Homepage
                    </Link>
                    <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 text-sm font-semibold text-text-muted hover:text-text-primary py-3 transition-colors bg-page-bg rounded-xl border border-border-soft w-full">
                        <MoveLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
