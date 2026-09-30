"use client";

import { PageHero } from "@/components/PageHero";
import { ImageCard } from "@/components/ImageCard";
import { images } from "@/lib/content";
import { Target, SearchCheck, FileArchive } from "lucide-react";

export default function ATSPage() {
    return (
        <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8 space-y-16 animate-fade-in-up">
            <PageHero
                title="ATS Evaluation"
                description="See how your resume performs against Applicant Tracking Systems."
                imageSrc={images.heroes.ats}
            />

            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-sora font-semibold text-text-primary">ATS Tools</h2>
                    <span className="px-3 py-1 bg-accent-orange/10 text-accent-orange font-semibold rounded-full text-sm">
                        Coming Soon
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 grayscale-[30%] hover:grayscale-0 hover:opacity-100 transition-all">
                    <ImageCard
                        title={images.atsBoxes[0].title}
                        imageSrc={images.atsBoxes[0].src}
                        icon={Target}
                    />
                    <ImageCard
                        title={images.atsBoxes[1].title}
                        imageSrc={images.atsBoxes[1].src}
                        icon={SearchCheck}
                    />
                    <ImageCard
                        title={images.atsBoxes[2].title}
                        imageSrc={images.atsBoxes[2].src}
                        icon={FileArchive}
                    />
                </div>
            </section>
        </div>
    );
}
