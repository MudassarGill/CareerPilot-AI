"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ImageCardProps {
    title: string;
    description?: string;
    imageSrc: string;
    icon?: LucideIcon;
    value?: string | number;
    progress?: number;
    link?: string;
    onClick?: () => void;
}

export function ImageCard({ title, description, imageSrc, icon: Icon, value, progress, link, onClick }: ImageCardProps) {
    const InnerContent = () => (
        <div className="w-full h-full flex flex-col group">
            {/* Top Image Section */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                {/* Gradient overlay for contrast if text were on it, plus aesthetics */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1428]/50 to-transparent" />

                {/* Icon Badge overlapping bottom left */}
                {Icon && (
                    <div className="absolute -bottom-4 left-4 z-10 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center transition-colors duration-300 group-hover:bg-accent-orange group-hover:shadow-lg">
                        <Icon className="w-6 h-6 text-brand-blue transition-colors duration-300 group-hover:text-white" />
                    </div>
                )}
            </div>

            {/* Bottom Content Section */}
            <div className="flex-1 p-5 pt-8 bg-card rounded-b-2xl flex flex-col justify-between">
                <div>
                    <h3 className="font-sora font-semibold text-text-primary text-lg mb-1">{title}</h3>
                    {description && <p className="text-sm text-text-muted mb-4">{description}</p>}

                    {(value !== undefined || progress !== undefined) && (
                        <div className="mt-2 space-y-2">
                            {value !== undefined && (
                                <p className="text-xl font-bold text-text-primary">{value}</p>
                            )}
                            {progress !== undefined && (
                                <div className="w-full h-2 bg-border-soft rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-blue rounded-full transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {link && (
                    <div className="mt-4 flex items-center text-sm font-medium text-brand-blue group-hover:text-deep-blue transition-colors">
                        Explore <ArrowRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
                    </div>
                )}
            </div>
        </div>
    );

    const wrapperClasses = "block w-full h-full bg-card rounded-2xl border border-border-soft shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-brand-blue/30 cursor-pointer overflow-visible";

    if (link) {
        return (
            <Link href={link} className={wrapperClasses}>
                <InnerContent />
            </Link>
        );
    }

    return (
        <button className={`${wrapperClasses} text-left`} onClick={onClick}>
            <InnerContent />
        </button>
    );
}
