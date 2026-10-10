import { PageHero } from "@/components/PageHero";
import { brandConfig } from "@/lib/brand";
import { images } from "@/lib/content";

export default function PrivacyPage() {
    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen pb-20">
            <PageHero
                title="Privacy Policy"
                description="How CareerPilot AI collects, uses, and safeguards your personal information."
                imageSrc={images.phase3.aboutHero}
            />

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 w-full space-y-10">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-border-soft shadow-sm space-y-8 text-text-primary">

                    <div>
                        <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Last Updated: October 2026</p>
                        <h1 className="font-sora text-2xl font-bold mt-1">CareerPilot AI Privacy Policy</h1>
                        <p className="text-text-muted text-sm mt-3 leading-relaxed">
                            At CareerPilot AI (developed by {brandConfig.owner} at {brandConfig.institution}), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, store, and protect your information when you use our platform.
                        </p>
                    </div>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">1. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted leading-relaxed">
                            <li><strong className="text-text-primary">Account Data:</strong> Full name, email address, password hash, phone number, location, target role, education, and headline.</li>
                            <li><strong className="text-text-primary">Document Data:</strong> Resumes, cover letters, and project links submitted for ATS evaluation and parsing.</li>
                            <li><strong className="text-text-primary">Interview & Preference Data:</strong> Mock interview responses, recording consent preferences, email notification choices, and consent logs.</li>
                            <li><strong className="text-text-primary">Usage & Technical Data:</strong> IP address, browser type, login timestamps, and failed login counts for security rate limiting.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted leading-relaxed">
                            <li>To provide core platform features: ATS scoring, resume intelligence, skill gap analysis, and mock interviews.</li>
                            <li>To send account verification, password reset, contact form responses, and requested newsletter emails via Mailpit/SMTP.</li>
                            <li>To calculate your profile completeness score and personalize learning roadmaps.</li>
                            <li>To enforce account security (15-minute lockouts after 5 failed login attempts) and prevent abuse.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-border-soft pt-6" id="cookies">
                        <h2 className="font-sora text-xl font-bold">3. Cookies & Local Storage</h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            CareerPilot AI uses browser <code className="bg-page-bg px-2 py-0.5 rounded text-brand-blue font-mono">localStorage</code> to store JWT access and refresh tokens for secure authentication sessions. We do not use third-party tracking cookies or advertising pixels.
                        </p>
                    </section>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">4. Data Export & Deletion Rights</h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            You retain full ownership of your data. Under your Account Settings (<code className="bg-page-bg px-2 py-0.5 rounded text-brand-blue font-mono">/settings</code>), you have the right to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted leading-relaxed">
                            <li><strong className="text-text-primary">Export Data:</strong> Download a full JSON file containing your account records, resumes, and interview logs.</li>
                            <li><strong className="text-text-primary">Delete Account:</strong> Permanently delete your account and all associated records from our database.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">5. Contact Us</h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            If you have questions regarding this Privacy Policy or your data, please contact us at:
                        </p>
                        <p className="text-sm font-semibold text-brand-blue">
                            <a href={`mailto:${brandConfig.email}`}>{brandConfig.email}</a>
                        </p>
                    </section>

                </div>
            </main>
        </div>
    );
}
