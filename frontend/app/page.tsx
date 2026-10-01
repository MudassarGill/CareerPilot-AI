import Link from "next/link";
import Image from "next/image";
import { FAQSection } from "@/components/FAQSection";
import { images } from "@/lib/content";
import { brandConfig } from "@/lib/brand";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ImageCard } from "@/components/ImageCard";

export default function LandingPage() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full bg-[#1C1C1E] text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image src={images.phase3.landingHero} alt="Hero Background" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/80 to-transparent" />
                </div>
                <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
                    <h1 className="font-sora text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Your Personal AI-Driven <span className="text-brand-blue">Career Coach</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mb-10">
                        Plan, strategize, and land your dream job faster with CareerPilot AI. All your career tools in one intelligent platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/register" className="bg-accent-orange text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                            Get started
                        </Link>
                        <Link href="/login" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                            Log in
                        </Link>
                    </div>
                </div>
            </section>

            {/* Modules Section */}
            <section className="w-full py-20 bg-page-bg">
                <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-sora text-3xl font-bold text-text-primary">Everything you need to succeed</h2>
                        <p className="text-text-muted mt-2">Explore the tools available to boost your career.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.moduleBoxes.map((module) => (
                            <Link key={module.id} href={module.link} className="block group">
                                <ImageCard
                                    title={module.title}
                                    imagePath={module.src}
                                    isActive={true}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works Section */}
            <section className="w-full py-20 bg-white">
                <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-sora text-3xl font-bold text-text-primary">How it works</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-2xl font-bold mb-6">1</div>
                            <h3 className="font-sora font-semibold text-xl mb-3 text-text-primary">Upload resume</h3>
                            <p className="text-text-muted">Start by uploading your current resume. Our AI evaluates it against top industry standards.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-2xl font-bold mb-6">2</div>
                            <h3 className="font-sora font-semibold text-xl mb-3 text-text-primary">Find skill gaps</h3>
                            <p className="text-text-muted">Compare your profile to your target role and get a custom roadmap of what to learn next.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-2xl font-bold mb-6">3</div>
                            <h3 className="font-sora font-semibold text-xl mb-3 text-text-primary">Practise & Improve</h3>
                            <p className="text-text-muted">Simulate real interviews, answer tough questions, and improve with actionable feedback.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why this platform Section */}
            <section className="w-full py-20 bg-brand-blue text-white">
                <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="font-sora text-3xl font-bold mb-6">Why this platform</h2>
                            <p className="text-lg opacity-90 mb-8">
                                Built to provide genuine value without the noise. CareerPilot AI brings clarity to your next career move.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold">All career tools in one place</h4>
                                        <p className="opacity-80 text-sm">No need to juggle multiple subscriptions for resumes, roadmaps, and mock interviews.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold">Estimates are explained, not hidden</h4>
                                        <p className="opacity-80 text-sm">When we score your ATS readiness, we tell you exactly why and how to improve it.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold">Delete your data at any time</h4>
                                        <p className="opacity-80 text-sm">We believe in full user control. Simply wipe your data from settings whenever you want.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-deep-blue/50 border-[4px] border-white/10">
                            <Image src={images.heroes.dashboard} fill className="object-cover" alt="Platform preview" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Preview Section */}
            <section className="w-full py-20 bg-page-bg">
                <div className="max-w-[800px] mx-auto px-4 md:px-6 flex flex-col items-center">
                    <h2 className="font-sora text-3xl font-bold text-text-primary mb-10">Frequently Asked Questions</h2>
                    <FAQSection isPreview={true} />
                    <Link href="/faq" className="mt-8 flex items-center gap-2 text-brand-blue font-bold hover:text-deep-blue transition-colors outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-2 py-1">
                        View all questions <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* CTA Band */}
            <section className="w-full bg-[#1C1C1E] text-white py-16 border-t border-[#2C2C2E]">
                <div className="max-w-[1280px] mx-auto px-4 text-center">
                    <h2 className="font-sora text-2xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-zinc-400 mb-8 max-w-md mx-auto">We're here to help. Reach out to ask about features, integrations or support.</p>
                    <Link href="/contact" className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-deep-blue transition-colors inline-block focus:ring-4 focus:ring-brand-blue/50 outline-none">
                        Contact us
                    </Link>
                </div>
            </section>
        </div>
    );
}
