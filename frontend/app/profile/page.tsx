"use client";

import { PageHero } from "@/components/PageHero";
import { images } from "@/lib/content";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, MapPin, Briefcase, GraduationCap, Link2, CheckCircle2, Award, FileText, Video, Sparkles } from "lucide-react";
import { fetchAPI } from "@/lib/api";

export default function ProfilePage() {
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            const loadProfile = async () => {
                try {
                    const data = await fetchAPI("/users/me");
                    setProfileData(data);
                } catch (e) {
                    setProfileData(user);
                } finally {
                    setIsLoadingProfile(false);
                }
            };
            loadProfile();
        }
    }, [user, loading, router]);

    if (loading || isLoadingProfile || !user) {
        return (
            <div className="min-h-screen bg-page-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
            </div>
        );
    }

    const u = profileData || user;
    const completeness = u.profile_completeness || 0;

    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen pb-20">
            <PageHero
                title="My Profile"
                description="Manage your professional presence, completeness score, and career overview."
                imageSrc={images.phase3.profileHero}
            />

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 w-full space-y-8">

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-border-soft overflow-hidden">
                    {/* Banner */}
                    <div className="h-36 bg-gradient-to-r from-brand-blue to-deep-blue relative">
                        <Link href="/settings" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2.5 rounded-xl text-white transition-colors flex items-center gap-2 text-xs font-semibold">
                            <Settings className="w-4 h-4" /> Edit Profile
                        </Link>
                    </div>

                    {/* Profile Details Header */}
                    <div className="px-8 pb-8 relative">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* Avatar */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl sm:text-5xl font-bold text-brand-blue shrink-0 -mt-12 sm:-mt-16 z-10 overflow-hidden relative">
                                {u.avatar_path ? (
                                    <img src={`http://localhost:8000${u.avatar_path}`} alt={u.name} className="w-full h-full object-cover" />
                                ) : (
                                    u.name?.charAt(0).toUpperCase()
                                )}
                            </div>

                            <div className="pt-2 sm:pt-4 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-text-primary">{u.name}</h1>
                                        <p className="text-brand-blue font-semibold text-sm">{u.headline || "Jobseeker / Candidate"}</p>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100 self-start">
                                        {u.user_type === "candidate" ? "Candidate" : "Professional"}
                                    </span>
                                </div>
                                <p className="text-text-muted text-sm mt-1">{u.email}</p>

                                <div className="flex flex-wrap gap-3 mt-4 text-xs text-text-muted">
                                    {u.target_role && (
                                        <div className="flex items-center gap-1.5 bg-page-bg px-3 py-1.5 rounded-lg border border-border-soft">
                                            <Briefcase className="w-4 h-4 text-brand-blue" />
                                            <span>{u.target_role} ({u.current_level || "Entry-level"})</span>
                                        </div>
                                    )}
                                    {u.location && (
                                        <div className="flex items-center gap-1.5 bg-page-bg px-3 py-1.5 rounded-lg border border-border-soft">
                                            <MapPin className="w-4 h-4 text-brand-blue" />
                                            <span>{u.location}</span>
                                        </div>
                                    )}
                                    {u.education && (
                                        <div className="flex items-center gap-1.5 bg-page-bg px-3 py-1.5 rounded-lg border border-border-soft">
                                            <GraduationCap className="w-4 h-4 text-brand-blue" />
                                            <span>{u.education}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Completeness Bar */}
                        <div className="mt-8 bg-blue-50/60 p-5 rounded-2xl border border-blue-100">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-brand-blue" />
                                    <span className="font-sora font-bold text-sm text-text-primary">Profile Completeness</span>
                                </div>
                                <span className="font-bold text-brand-blue text-sm">{completeness}%</span>
                            </div>
                            <div className="w-full bg-blue-200/50 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-brand-blue h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${completeness}%` }}
                                />
                            </div>
                            {completeness < 100 && (
                                <p className="text-xs text-text-muted mt-2">
                                    Complete your target role, bio, location, education, and avatar in <Link href="/settings" className="text-brand-blue font-semibold underline">Settings</Link> to reach 100%.
                                </p>
                            )}
                        </div>

                        {/* Bio Section */}
                        <div className="mt-8 border-t border-border-soft pt-8">
                            <h2 className="font-sora text-xl font-bold text-text-primary mb-3">About Me</h2>
                            <p className="text-text-muted leading-relaxed text-sm">
                                {u.bio || "No bio added yet. Add a short bio in Settings to showcase your career goals and experience."}
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="mt-8 border-t border-border-soft pt-8">
                            <h2 className="font-sora text-xl font-bold text-text-primary mb-6">Career Overview</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-page-bg p-5 rounded-xl border border-border-soft flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-text-primary">Ready</div>
                                        <div className="text-xs text-text-muted font-medium">Resume Analysis</div>
                                    </div>
                                </div>
                                <div className="bg-page-bg p-5 rounded-xl border border-border-soft flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-text-primary">Active</div>
                                        <div className="text-xs text-text-muted font-medium">Skill Tracking</div>
                                    </div>
                                </div>
                                <div className="bg-page-bg p-5 rounded-xl border border-border-soft flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-text-primary">Enabled</div>
                                        <div className="text-xs text-text-muted font-medium">AI Mock Interview</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
