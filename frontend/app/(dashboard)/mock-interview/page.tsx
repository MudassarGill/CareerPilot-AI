"use client";

import { PageHero } from "@/components/PageHero";
import { ImageCard } from "@/components/ImageCard";
import { images } from "@/lib/content";
import { Mic, Video, Settings2 } from "lucide-react";

export default function MockInterviewPage() {
    return (
        <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8 space-y-16 animate-fade-in-up">
            <PageHero
                title="AI Mock Interview"
                description="Practice your interview skills with our AI avatar and get instant feedback."
                imageSrc={images.heroes.mockInterview}
            />

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-sora font-semibold text-text-primary">Interview Modes</h2>
                    <span className="px-3 py-1 bg-accent-orange/10 text-accent-orange font-semibold rounded-full text-sm">
                        Coming Soon
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 grayscale-[30%] hover:grayscale-0 hover:opacity-100 transition-all">
                    <ImageCard
                        title={images.mockInterviewBoxes[0].title}
                        imageSrc={images.mockInterviewBoxes[0].src}
                        icon={Mic}
                    />
                    <ImageCard
                        title={images.mockInterviewBoxes[1].title}
                        imageSrc={images.mockInterviewBoxes[1].src}
                        icon={Video}
                    />
                    <ImageCard
                        title={images.mockInterviewBoxes[2].title}
                        imageSrc={images.mockInterviewBoxes[2].src}
                        icon={Settings2}
                    />
                </div>
            </section>
        </div>
    );
}
