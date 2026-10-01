"use client";

import { useState } from "react";
import Link from "next/link";
import { brandConfig } from "@/lib/brand";
import { Github, Linkedin, Mail, Twitter, Send } from "lucide-react";
import { images } from "@/lib/content";
import Image from "next/image";

export function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState("");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:8000/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                setSubscribed(true);
                setEmail("");
            } else {
                const data = await res.json();
                setError(data.detail || "Failed to subscribe.");
            }
        } catch (err) {
            setError("Something went wrong.");
        }
    };

    return (
        <footer className="w-full bg-[#1C1C1E] border-t border-[#2C2C2E] text-zinc-400 mt-auto">
            {/* Top band: Newsletter */}
            <div className="border-b border-[#2C2C2E]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="font-sora font-semibold text-white text-lg">Get career tips in your inbox</h3>
                        <p className="text-sm mt-1">Join others receiving our top interview and resume advice.</p>
                    </div>
                    <form onSubmit={handleSubscribe} className="flex w-full md:w-auto relative max-w-md">
                        {subscribed ? (
                            <span className="text-green-400 font-medium bg-green-400/10 px-4 py-2 rounded-md">Thanks for subscribing!</span>
                        ) : (
                            <>
                                <input
                                    type="email"
                                    required
                                    placeholder="Your email address"
                                    className="flex-1 bg-[#2A2A2E] border border-[#3A3A3E] text-white rounded-l-md px-4 py-2 focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button type="submit" className="bg-accent-orange text-white px-4 py-2 rounded-r-md font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
                                    Subscribe <Send className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        {error && <p className="absolute -bottom-6 left-0 text-red-500 text-xs">{error}</p>}
                    </form>
                </div>
            </div>

            {/* Main Columns */}
            <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-8 h-8 overflow-hidden rounded-[4px] relative bg-white">
                            <Image src={images.logo} alt="Logo" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-sora font-extrabold text-white tracking-tight">CAREER<span className="text-brand-blue">PILOT</span></span>
                        </div>
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs text-zinc-400">
                        Your personal AI-driven career coach. Plan, strategize, and land your dream job faster.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <a href={brandConfig.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent-orange transition-colors"><Linkedin className="w-5 h-5" /></a>
                        <a href={brandConfig.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent-orange transition-colors"><Github className="w-5 h-5" /></a>
                        {brandConfig.portfolio && (
                            <a href={brandConfig.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-accent-orange transition-colors text-sm font-semibold">Port</a>
                        )}
                        <a href={`mailto:${brandConfig.email}`} className="hover:text-accent-orange transition-colors"><Mail className="w-5 h-5" /></a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-sora font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/career-coach" className="hover:text-white transition-colors">AI Career Coach</Link></li>
                        <li><Link href="/resume" className="hover:text-white transition-colors">Resume Intelligence</Link></li>
                        <li><Link href="/ats" className="hover:text-white transition-colors">ATS Evaluation</Link></li>
                        <li><Link href="/skill-gap" className="hover:text-white transition-colors">Skill Gap Analysis</Link></li>
                        <li><Link href="/roadmap" className="hover:text-white transition-colors">Learning Roadmap</Link></li>
                        <li><Link href="/mock-interview" className="hover:text-white transition-colors">AI Mock Interview</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-sora font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy policy</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms of use</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-sora font-semibold mb-4">Contact Info</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href={`mailto:${brandConfig.email}`} className="hover:text-white transition-colors">{brandConfig.email}</a></li>
                        {brandConfig.phone && <li className="text-zinc-400">{brandConfig.phone}</li>}
                        {brandConfig.address && <li className="text-zinc-400">{brandConfig.address}</li>}
                        {brandConfig.workingHours && <li className="text-zinc-400">{brandConfig.workingHours}</li>}
                        <li className="text-zinc-400 italic mt-2">{brandConfig.responseTime}</li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[#2C2C2E] py-6">
                <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <div>
                        © {new Date().getFullYear()} CareerPilot AI. Built by Mudassar Hussain.
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy#cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
