"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PageHero } from "@/components/PageHero";
import { images } from "@/lib/content";
import { brandConfig } from "@/lib/brand";
import { faqItems } from "@/lib/faq";
import {
    Sparkles, ArrowRight, Bot, FileText, Target, BarChart2,
    BookOpen, Video, ShieldCheck, Zap, Award, CheckCircle2
} from "lucide-react";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-page-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
            </div>
        );
    }

    const modules = [
        {
            icon: Bot,
            title: "AI Career Coach",
            desc: "24/7 intelligent career advisor offering tailored guidance, strategy, and direction.",
            href: "/career-coach",
            status: "Live"
        },
        {
            icon: FileText,
            title: "Resume Intelligence",
            desc: "Deep parsing and instant feedback to elevate your resume impact.",
            href: "/resume",
            status: "Live"
        },
        {
            icon: Target,
            title: "ATS Evaluation",
            desc: "Simulate ATS scoring against real job descriptions to identify keywords.",
            href: "/ats",
            status: "Live"
        },
        {
            icon: BarChart2,
            title: "Skill Gap Analysis",
            desc: "Pinpoint missing technical & soft skills for target roles.",
            href: "/skill-gap",
            status: "Live"
        },
        {
            icon: BookOpen,
            title: "Learning Roadmap",
            desc: "Step-by-step personalized learning paths to close skill gaps fast.",
            href: "/roadmap",
            status: "Live"
        },
        {
            icon: Video,
            title: "AI Mock Interview",
            desc: "Practice role-specific voice & text interview questions with AI feedback.",
            href: "/mock-interview",
            status: "Live"
        },
    ];

    const steps = [
        { num: "01", title: "Create Your Account", desc: "Sign up in seconds and specify your target career role." },
        { num: "02", title: "Upload Resume & Analyze", desc: "Get instant ATS evaluation and skill gap breakdowns." },
        { num: "03", title: "Execute Learning & Practice", desc: "Follow customized roadmaps and practice AI mock interviews." },
    ];

    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen pb-20">
            {/* Hero Section */}
            <PageHero
                title="Navigate Your Career Path with AI Precision"
                description="CareerPilot AI is a multi-agent intelligence platform empowering jobseekers with resume parsing, ATS scoring, skill gap detection, personalized roadmaps, and AI mock interviews."
                imageSrc={images.heroes.hero8}
                imageAlt="CareerPilot AI Landing Hero"
                badgeText="Multi-Agent AI Platform"
                primaryAction={{ label: "Get Started Free", href: "/register" }}
                secondaryAction={{ label: "Learn More", href: "/about" }}
            />

            <main className="max-w-[1280px] w-full mx-auto px-4 md:px-6 lg:px-8 py-16 space-y-20">

                {/* Modules Grid */}
                <section>
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-accent-orange font-semibold text-sm tracking-wider uppercase">Comprehensive Suite</span>
                        <h2 className="font-sora text-3xl md:text-4xl font-extrabold text-text-primary mt-2">
                            6 Intelligence Modules in One Platform
                        </h2>
                        <p className="text-text-muted mt-3">
                            Everything you need to analyze, improve, and accelerate your job search.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((mod) => (
                            <Link
                                key={mod.title}
                                href={mod.href}
                                className="bg-white rounded-3xl p-6 border border-border-soft hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                            <mod.icon className="w-6 h-6" />
                                        </div>
                                        <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                                            {mod.status}
                                        </span>
                                    </div>
                                    <h3 className="font-sora text-xl font-bold text-text-primary group-hover:text-brand-blue transition-colors">
                                        {mod.title}
                                    </h3>
                                    <p className="text-text-muted text-sm mt-2 leading-relaxed">
                                        {mod.desc}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border-soft flex items-center text-sm font-semibold text-brand-blue group-hover:text-deep-blue">
                                    Explore module <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-white rounded-3xl p-8 md:p-12 border border-border-soft">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-accent-orange font-semibold text-sm tracking-wider uppercase">Simple Workflow</span>
                        <h2 className="font-sora text-3xl font-bold text-text-primary mt-2">
                            How CareerPilot AI Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div key={step.num} className="relative flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-page-bg text-brand-blue font-sora font-extrabold text-2xl rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-border-soft">
                                    {step.num}
                                </div>
                                <h3 className="font-sora text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                                <p className="text-text-muted text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why CareerPilot AI */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-accent-orange font-semibold text-sm tracking-wider uppercase">Built for Results</span>
                        <h2 className="font-sora text-3xl md:text-4xl font-extrabold text-text-primary mt-2 mb-6">
                            Why Jobseekers Choose CareerPilot AI
                        </h2>
                        <div className="space-y-4">
                            {[
                                { title: "Privacy-First Data Protection", desc: "Your resumes and recordings are kept secure and isolated." },
                                { title: "Academic & Professional Excellence", desc: `Developed under expert supervision at ${brandConfig.institution}.` },
                                { title: "Instant Feedback & Actionable Insights", desc: "No generic templates — receive tailored ATS & interview analysis." },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-sora font-bold text-text-primary text-base">{item.title}</h4>
                                        <p className="text-text-muted text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg border border-border-soft">
                        <Image
                            src={images.heroes.hero2}
                            alt="Platform Dashboard Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* FAQ Preview */}
                <section className="bg-white rounded-3xl p-8 md:p-12 border border-border-soft">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="font-sora text-2xl md:text-3xl font-bold text-text-primary">Frequently Asked Questions</h2>
                            <p className="text-text-muted text-sm mt-1">Got questions? We've got answers.</p>
                        </div>
                        <Link href="/faq" className="text-brand-blue font-semibold hover:underline flex items-center gap-1 text-sm">
                            View all FAQs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqItems.slice(0, 4).map((faq) => (
                            <div key={faq.id} className="p-4 bg-page-bg rounded-2xl border border-border-soft">
                                <h4 className="font-sora font-bold text-text-primary text-base mb-2">{faq.question}</h4>
                                <p className="text-text-muted text-sm leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-brand-blue to-deep-blue text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="font-sora text-3xl md:text-4xl font-extrabold">Ready to Pilot Your Career Success?</h2>
                        <p className="text-blue-100 text-sm md:text-base">
                            Join jobseekers using CareerPilot AI to optimize resumes, pass interviews, and land top offers.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                            <Link
                                href="/register"
                                className="bg-accent-orange hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-xl border border-white/20 transition-all"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
