import { PageHero } from "@/components/PageHero";
import { brandConfig } from "@/lib/brand";
import { images } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen">
            <PageHero
                title="About CareerPilot AI"
                description="An intelligent career platform bringing everything you need to succeed into one place."
                imageSrc={images.phase3.aboutHero}
            />

            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-24 space-y-24">
                {/* About the project & Mission */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-sora text-3xl font-bold text-text-primary mb-4">About the platform</h2>
                            <p className="text-text-muted leading-relaxed text-lg">
                                CareerPilot AI was built to solve a simple problem: job seekers shouldn't have to jump between
                                five different tools just to prepare for an interview. We combine advanced resume evaluation,
                                precise ATS scoring, skill gap identification, and AI-driven mock interviews into a single, cohesive platform.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-sora text-3xl font-bold text-text-primary mb-4">Our Mission</h2>
                            <p className="text-text-muted leading-relaxed text-lg">
                                Our mission is to democratize career prep, giving everyone the tools needed to present their best self to potential employers while maintaining strict control over their own data.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl border-[4px] border-white">
                        <Image src={images.phase3.aboutMission} fill className="object-cover" alt="Mission" />
                    </div>
                </section>

                {/* What you can do */}
                <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border-soft">
                    <h2 className="font-sora text-3xl font-bold text-text-primary mb-8 text-center">What you can do</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.moduleBoxes.map((module) => {
                            const isLive = module.title === "AI Career Coach" || module.title === "Skill Gap Analysis";
                            return (
                                <div key={module.id} className="relative group border border-border-soft rounded-2xl overflow-hidden shadow-sm flex items-center justify-between p-4 bg-page-bg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0">
                                            <Image src={module.src} fill className="object-cover" alt={module.title} />
                                        </div>
                                        <span className="font-sora font-semibold text-text-primary text-sm">{module.title}</span>
                                    </div>
                                    <span className={"text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full " + (isLive ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-600')}>
                                        {isLive ? 'Live' : 'Coming soon'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Built by */}
                <section className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="font-sora text-3xl font-bold text-text-primary">Built by</h2>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-border-soft flex flex-col md:flex-row items-center gap-8 text-left">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shrink-0 border-4 border-page-bg shadow-md bg-brand-blue flex items-center justify-center relative">
                            {images.phase3.founder ? (
                                <Image src={images.phase3.founder} fill className="object-cover" alt={brandConfig.owner} />
                            ) : (
                                <span className="text-4xl text-white font-bold">{brandConfig.owner.split(' ').map(n => n[0]).join('')}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-sora text-2xl font-bold text-text-primary">{brandConfig.owner}</h3>
                            <p className="text-brand-blue font-medium mt-1">{brandConfig.degree}</p>
                            <p className="text-text-muted mt-2 text-sm">Supervisor: {brandConfig.supervisor}</p>

                            <div className="flex flex-wrap items-center gap-4 mt-6">
                                <a href={brandConfig.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-page-bg rounded-lg text-sm font-medium hover:bg-brand-blue hover:text-white transition-colors">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </a>
                                <a href={brandConfig.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-page-bg rounded-lg text-sm font-medium hover:bg-brand-blue hover:text-white transition-colors">
                                    <Github className="w-4 h-4" /> GitHub
                                </a>
                                {brandConfig.portfolio && (
                                    <a href={brandConfig.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-page-bg rounded-lg text-sm font-medium hover:bg-brand-blue hover:text-white transition-colors">
                                        Portfolio
                                    </a>
                                )}
                                <a href={"mailto:" + brandConfig.email} className="flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm">
                                    <Mail className="w-4 h-4" /> Email
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Link href="/register" className="inline-block bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-deep-blue transition-colors shadow-md">
                            Join the platform
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
