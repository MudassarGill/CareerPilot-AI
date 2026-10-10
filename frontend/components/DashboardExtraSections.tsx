"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function DashboardExtraSections() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "Is Career Pilot free to start?",
            a: "Yes! You can get started for free, create your profile, analyze your initial resume, and explore basic roadmap features at no cost."
        },
        {
            q: "How does the ATS check work?",
            a: "Our ATS check scans your resume using AI algorithms trained on modern Applicant Tracking Systems to identify formatting errors, keyword gaps, and impact score improvements."
        },
        {
            q: "Is my resume data private?",
            a: "Absolutely. Your personal information and uploaded resume documents are encrypted and never shared with third parties or public recruiters."
        },
        {
            q: "Can I practise interviews by video?",
            a: "Yes! CareerPilot AI supports both audio and video AI mock interviews with instant body language, tone, and technical feedback."
        },
        {
            q: "How do I contact support?",
            a: "You can reach our dedicated support team directly using the Contact form at the bottom of this page or by emailing support@careerpilot.ai."
        }
    ];

    return (
        <div className="w-full space-y-16 py-8">

            {/* How It Works Section */}
            <section className="w-full">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="font-sora text-3xl font-bold text-text-primary">How It Works</h2>
                    <p className="text-text-muted mt-2">Accelerate your career in 3 simple AI-guided steps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 border border-border-soft transition-all duration-300 flex flex-col items-center text-center group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            1
                        </div>
                        <h3 className="font-sora text-xl font-bold text-text-primary mb-3">Upload Resume</h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Upload your resume for instant ATS analysis, skill extraction, and personalized feedback.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 border border-border-soft transition-all duration-300 flex flex-col items-center text-center group">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-accent-orange flex items-center justify-center font-bold text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            2
                        </div>
                        <h3 className="font-sora text-xl font-bold text-text-primary mb-3">Get Custom Roadmap</h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Receive an AI-curated skill gap analysis and step-by-step learning path for your dream role.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 border border-border-soft transition-all duration-300 flex flex-col items-center text-center group">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            3
                        </div>
                        <h3 className="font-sora text-xl font-bold text-text-primary mb-3">Practice & Land Job</h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Sharpen your interview skills with real-time AI mock sessions and track your readiness.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="w-full py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-white to-blue-50/40 p-6 rounded-2xl shadow-md border border-border-soft text-center hover:shadow-lg transition-shadow">
                        <span className="block font-sora text-3xl md:text-4xl font-extrabold text-brand-blue">10k+</span>
                        <span className="text-xs md:text-sm font-semibold text-text-muted mt-2 block">Resumes analysed</span>
                    </div>

                    <div className="bg-gradient-to-br from-white to-orange-50/40 p-6 rounded-2xl shadow-md border border-border-soft text-center hover:shadow-lg transition-shadow">
                        <span className="block font-sora text-3xl md:text-4xl font-extrabold text-accent-orange">25k+</span>
                        <span className="text-xs md:text-sm font-semibold text-text-muted mt-2 block">Mock interviews</span>
                    </div>

                    <div className="bg-gradient-to-br from-white to-purple-50/40 p-6 rounded-2xl shadow-md border border-border-soft text-center hover:shadow-lg transition-shadow">
                        <span className="block font-sora text-3xl md:text-4xl font-extrabold text-purple-600">120+</span>
                        <span className="text-xs md:text-sm font-semibold text-text-muted mt-2 block">Target roles</span>
                    </div>

                    <div className="bg-gradient-to-br from-white to-amber-50/40 p-6 rounded-2xl shadow-md border border-border-soft text-center hover:shadow-lg transition-shadow">
                        <span className="block font-sora text-3xl md:text-4xl font-extrabold text-amber-500">4.8 / 5</span>
                        <span className="text-xs md:text-sm font-semibold text-text-muted mt-2 block">User rating</span>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full pt-4">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-semibold rounded-full mb-3">
                        <HelpCircle className="w-4 h-4" /> Got Questions?
                    </div>
                    <h2 className="font-sora text-3xl font-bold text-text-primary">Frequently Asked Questions</h2>
                    <p className="text-text-muted mt-2">Everything you need to know about CareerPilot AI.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl border border-border-soft shadow-sm overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="w-full p-6 text-left flex justify-between items-center gap-4 font-sora font-semibold text-text-primary hover:text-brand-blue transition-colors focus:outline-none"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-blue" : ""}`} />
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-6 text-text-muted text-sm leading-relaxed border-t border-zinc-100 pt-4 bg-zinc-50/50">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

        </div>
    );
}
