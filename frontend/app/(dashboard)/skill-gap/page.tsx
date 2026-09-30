"use client";

import { PageHero } from "@/components/PageHero";
import { ImageCard } from "@/components/ImageCard";
import { images } from "@/lib/content";
import { ShieldAlert, BarChart4, TrendingUp } from "lucide-react";

export default function SkillGapPage() {
    return (
        <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8 space-y-16 animate-fade-in-up">
            <PageHero
                title="Skill Gap Analysis"
                description="Identify what skills you are missing for your target roles."
                imageSrc={images.heroes.skillGap}
            />

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-sora font-semibold text-text-primary">Analysis Tools</h2>
                    <span className="px-3 py-1 bg-accent-orange/10 text-accent-orange font-semibold rounded-full text-sm">
                        Coming Soon
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 grayscale-[30%] hover:grayscale-0 hover:opacity-100 transition-all">
                    <ImageCard
                        title={images.skillGapBoxes[0].title}
                        imageSrc={images.skillGapBoxes[0].src}
                        icon={ShieldAlert}
                    />
                    <ImageCard
                        title={images.skillGapBoxes[1].title}
                        imageSrc={images.skillGapBoxes[1].src}
                        icon={BarChart4}
                    />
                    <ImageCard
                        title={images.skillGapBoxes[2].title}
                        imageSrc={images.skillGapBoxes[2].src}
                        icon={TrendingUp}
                    />
                </div>
            </section>
        </div>
    );
}
