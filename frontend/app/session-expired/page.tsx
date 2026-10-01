"use client";

import Link from "next/link";
import { LogIn, Clock } from "lucide-react";
import { images } from "@/lib/content";

export default function SessionExpired() {
    return (
        <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border-soft text-center group">
                <div className="w-24 h-24 mx-auto bg-page-bg rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden text-brand-blue">
                    <Clock className="w-10 h-10" />
                </div>

                <h1 className="font-sora text-3xl font-extrabold text-text-primary mb-3">Session Expired</h1>
                <p className="text-text-muted text-sm leading-relaxed mb-8">
                    For your security, your session has timed out due to inactivity. Please log in again to continue.
                </p>

                <Link href="/login" className="flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-3 px-6 rounded-xl hover:bg-deep-blue transition-colors shadow-md w-full">
                    <LogIn className="w-5 h-5" /> Log in Again
                </Link>
            </div>
        </div>
    );
}
