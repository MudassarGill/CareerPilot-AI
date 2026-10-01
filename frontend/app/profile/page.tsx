"use client";

import { PageHero } from "@/components/PageHero";
import { images } from "@/lib/content";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Settings, MapPin, Briefcase } from "lucide-react";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen bg-page-bg flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen pb-20">
            <PageHero
                title="My Profile"
                description="Manage your professional presence and view your career overview."
                imageSrc={images.phase3.profileHero}
            />

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 w-full">
                <div className="bg-white rounded-3xl shadow-sm border border-border-soft overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-brand-blue relative">
                        <Link href="/settings" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors">
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Profile Info */}
                    <div className="px-8 pb-8 relative">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl sm:text-5xl font-bold text-brand-blue shrink-0 -mt-12 sm:-mt-16 z-10">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>

                            <div className="pt-2 sm:pt-4 flex-1">
                                <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-text-primary">{user.name}</h1>
                                <p className="text-text-muted font-medium mb-4">{user.email}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                                    <div className="flex items-center gap-1.5 bg-page-bg px-3 py-1.5 rounded-lg border border-border-soft">
                                        <Briefcase className="w-4 h-4 text-brand-blue" />
                                        <span>Software Engineer (Target)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-page-bg px-3 py-1.5 rounded-lg border border-border-soft">
                                        <MapPin className="w-4 h-4 text-brand-blue" />
                                        <span>Remote / Worldwide</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 sm:pt-4">
                                <Link href="/settings" className="px-5 py-2 border border-border-soft hover:bg-page-bg rounded-lg font-medium transition-colors text-sm text-text-primary hidden sm:block">
                                    Edit Profile
                                </Link>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="mt-8 border-t border-border-soft pt-8">
                            <h2 className="font-sora text-xl font-bold text-text-primary mb-4">About Me</h2>
                            <p className="text-text-muted leading-relaxed">
                                (Bio will appear here once you fill IT out in settings. This area can highlight your career objectives, past achievements, or personal story.)
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="mt-8 border-t border-border-soft pt-8">
                            <h2 className="font-sora text-xl font-bold text-text-primary mb-6">Career Highlights</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-page-bg p-5 rounded-xl border border-border-soft">
                                    <div className="text-3xl font-bold text-brand-blue mb-1">--</div>
                                    <div className="text-sm font-medium text-text-primary">Skills Verified</div>
                                </div>
                                <div className="bg-page-bg p-5 rounded-xl border border-border-soft">
                                    <div className="text-3xl font-bold text-brand-blue mb-1">--</div>
                                    <div className="text-sm font-medium text-text-primary">ATS Score Average</div>
                                </div>
                                <div className="bg-page-bg p-5 rounded-xl border border-border-soft">
                                    <div className="text-3xl font-bold text-brand-blue mb-1">--</div>
                                    <div className="text-sm font-medium text-text-primary">Mock Interviews</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
