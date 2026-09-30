"use client";

import { PageHero } from "@/components/PageHero";
import { ImageCard } from "@/components/ImageCard";
import { images } from "@/lib/content";
import { MessageSquare, FileLineChart, Sparkles } from "lucide-react";

export default function CareerCoachPage() {
    return (
        <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8 space-y-16 animate-fade-in-up">
            <PageHero
                title="AI Career Coach"
                description="Get personalized advice, interview tips, and salary negotiation strategies from your AI coach."
                imageSrc={images.heroes.coach}
            />

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-sora font-semibold text-text-primary">Coach Modules</h2>
                    <span className="px-3 py-1 bg-accent-orange/10 text-accent-orange font-semibold rounded-full text-sm">
                        Coming Soon
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 grayscale-[30%] hover:grayscale-0 hover:opacity-100 transition-all">
                    <ImageCard
                        title={images.coachBoxes[0].title}
                        imageSrc={images.coachBoxes[0].src}
                        icon={MessageSquare}
                    />
                    <ImageCard
                        title={images.coachBoxes[1].title}
                        imageSrc={images.coachBoxes[1].src}
                        icon={FileLineChart}
                    />
                    <ImageCard
                        title={images.coachBoxes[2].title}
                        imageSrc={images.coachBoxes[2].src}
                        icon={Sparkles}
                    />
                </div>
            </section>
        </div>
    );
}
