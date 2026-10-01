"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { PageHero } from "@/components/PageHero";
import { ImageCard } from "@/components/ImageCard";
import { images } from "@/lib/content";
import {
    Brain, FileText, CheckCircle2, BookOpen,
    TrendingUp, LineChart, Cpu, BarChart3,
    Briefcase, Target, Trophy, Compass, Workflow
} from "lucide-react";
import { HeroSkeleton, GridSkeleton } from "@/components/Skeletons";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!user) router.push("/login");
            else if (!user.profile_completed) router.push("/profile-setup");
        }
    }, [user, authLoading, router]);

    const { data: summary, isLoading: dataLoading, error, refetch } = useDashboard(
        !!user && user.profile_completed
    );

    if (authLoading || (dataLoading && !error)) {
        return (
            <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8 animate-fade-in">
                <HeroSkeleton />
                <div className="mb-12">
                    <div className="w-48 h-8 bg-zinc-200 rounded mb-6 animate-pulse" />
                    <GridSkeleton count={6} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8">
                <ErrorState onRetry={refetch} />
            </div>
        );
    }

    // Default dummy data if backend fails or acts up during dev
    const score = summary?.readiness_score ?? 85;

    return (
        <div className="w-full max-w-[1280px] mx-auto p-4 md:p-8 space-y-16 animate-fade-in-up">

            <PageHero
                title="Your Career Dashboard"
                description={`Here's a breakdown of your progress towards becoming a ${user?.target_role || "professional"}.`}
                imageSrc={images.heroes.dashboard}
                score={score}
                showGreeting={true}
                primaryButton={{ label: "Continue Learning", onClick: () => router.push("/roadmap") }}
            />

            <section>
                <h2 className="text-2xl font-sora font-semibold text-text-primary mb-6 flex items-center justify-between">
                    Your Progress
                </h2>

                {summary && Object.keys(summary).length === 0 ? (
                    <EmptyState
                        icon={TrendingUp}
                        title="You're just getting started!"
                        description="Upload your resume to generate your first progress modules and readiness score."
                        actionLabel="Upload Resume"
                        onAction={() => router.push("/resume")}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ImageCard
                            title={images.dashboardBoxes[0].title}
                            value={`${score}/100`}
                            progress={score}
                            imageSrc={images.dashboardBoxes[0].src}
                            icon={BarChart3}
                        />
                        <ImageCard
                            title={images.dashboardBoxes[1].title}
                            description={summary?.resume_status || "Analyzed & Optimized"}
                            value={summary?.resume_score ? `${summary.resume_score} ATS` : "85 ATS"}
                            imageSrc={images.dashboardBoxes[1].src}
                            icon={FileText}
                            link="/resume"
                        />
                        <ImageCard
                            title={images.dashboardBoxes[2].title}
                            description="Audio & Video Mocks"
                            value={summary?.interview_avg ? `${summary.interview_avg}% Avg` : "0% Avg"}
                            imageSrc={images.dashboardBoxes[2].src}
                            icon={CheckCircle2}
                            link="/mock-interview"
                        />
                        <ImageCard
                            title={images.dashboardBoxes[3].title}
                            description={summary?.learning_progress ? "On Track" : "Action Needed"}
                            progress={summary?.learning_progress_pct || 60}
                            imageSrc={images.dashboardBoxes[3].src}
                            icon={BookOpen}
                            link="/roadmap"
                        />
                        <ImageCard
                            title={images.dashboardBoxes[4].title}
                            description="Top match for your role"
                            progress={summary?.skill_progress_pct || 75}
                            imageSrc={images.dashboardBoxes[4].src}
                            icon={Cpu}
                            link="/skill-gap"
                        />
                        <ImageCard
                            title={images.dashboardBoxes[5].title}
                            description="AI Career Highlights"
                            value="Looking Good"
                            imageSrc={images.dashboardBoxes[5].src}
                            icon={LineChart}
                            link="/career-coach"
                        />
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-sora font-semibold text-text-primary mb-6">Career Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.moduleBoxes.map((mod, idx) => {
                        const icons = [Brain, Briefcase, Target, Compass, Workflow, Trophy];
                        const CardIcon = icons[idx % icons.length];
                        return (
                            <ImageCard
                                key={mod.id}
                                title={mod.title}
                                imageSrc={mod.src}
                                icon={CardIcon}
                                link={mod.link}
                            />
                        );
                    })}
                </div>
            </section>

        </div>
    );
}
