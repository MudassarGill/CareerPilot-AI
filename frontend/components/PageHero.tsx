"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { ScoreRing } from "./ScoreRing";
import { useAuth } from "@/lib/auth-context";

interface PageHeroProps {
    title: string;
    description: string;
    imageSrc: string;
    primaryButton?: { label: string; onClick: () => void };
    secondaryButton?: { label: string; onClick: () => void };
    score?: number;
    showGreeting?: boolean;
}

export function PageHero({
    title,
    description,
    imageSrc,
    primaryButton,
    secondaryButton,
    score,
    showGreeting
}: PageHeroProps) {
    const { user } = useAuth();

    return (
        <div className="relative w-full overflow-hidden rounded-3xl shadow-xl shadow-brand-blue/5 border border-white/10 group mb-12">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={imageSrc}
                    alt="Hero Background"
                    fill
                    className="object-cover transition-transform duration-[10s] ease-linear group-hover:scale-105"
                    priority
                />
            </div>

            {/* Dark Gradient Overlay for optimal text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1428]/95 via-[#0A1428]/60 to-[#0A1428]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1428]/50 to-transparent" />

            {/* Content Container */}
            <div className="relative z-10 w-full px-8 py-12 md:py-16 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 h-full min-h-[280px]">
                <div className="max-w-2xl text-white space-y-4">
                    {showGreeting && user && (
                        <p className="text-brand-blue font-medium tracking-wide">
                            Welcome back, {user.name?.split(' ')[0]} 
                        </p>
                    )}
                    <h1 className="text-3xl md:text-5xl font-sora font-extrabold tracking-tight drop-shadow-md">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-50 max-w-xl font-sans opacity-90 drop-shadow">
                        {description}
                    </p>

                    {(primaryButton || secondaryButton) && (
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            {primaryButton && (
                                <button
                                    onClick={primaryButton.onClick}
                                    className="px-6 py-3 bg-brand-blue hover:bg-deep-blue text-white rounded-xl font-medium shadow-lg shadow-brand-blue/30 transition-all focus:ring-4 focus:ring-brand-blue/50"
                                >
                                    {primaryButton.label}
                                </button>
                            )}
                            {secondaryButton && (
                                <button
                                    onClick={secondaryButton.onClick}
                                    className="px-6 py-3 bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10 text-white rounded-xl font-medium transition-all"
                                >
                                    {secondaryButton.label}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {score !== undefined && (
                    <div className="flex flex-col items-center flex-shrink-0 animate-fade-in-up md:mr-8">
                        <ScoreRing score={score} size={140} />
                        <span className="mt-4 text-sm font-medium text-white tracking-widest uppercase opacity-80">
                            Readiness Score
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
