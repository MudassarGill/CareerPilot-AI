import { PageHero } from "@/components/PageHero";
import { brandConfig } from "@/lib/brand";
import { images } from "@/lib/content";

export default function TermsPage() {
    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen pb-20">
            <PageHero
                title="Terms of Use"
                description="Terms and conditions governing your access and use of CareerPilot AI."
                imageSrc={images.phase3.aboutHero}
            />

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 w-full space-y-10">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-border-soft shadow-sm space-y-8 text-text-primary">

                    <div>
                        <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Effective Date: October 2026</p>
                        <h1 className="font-sora text-2xl font-bold mt-1">CareerPilot AI Terms of Use</h1>
                        <p className="text-text-muted text-sm mt-3 leading-relaxed">
                            Welcome to CareerPilot AI. By creating an account or accessing our services, you agree to comply with and be bound by the following terms and conditions.
                        </p>
                    </div>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">1. Account Responsibility</h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            You are responsible for maintaining the confidentiality of your account login credentials. Any activity conducted through your account is your responsibility.
                        </p>
                    </section>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">2. Acceptable Use</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted leading-relaxed">
                            <li>You agree to use CareerPilot AI for legitimate career development, resume evaluation, and job interview preparation purposes.</li>
                            <li>You agree not to submit automated spam, malicious code, or fraudulent documents through our contact or evaluation forms.</li>
                            <li>Attempts to brute-force accounts or bypass rate limits (5 contact messages/hr, 5 login attempts) are strictly prohibited.</li>
                        </ul>
                    </section>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">3. Intellectual Property & Disclaimer</h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            CareerPilot AI is an academic AI research and career development platform developed under supervision at {brandConfig.institution}. AI feedback, ATS scores, and interview roadmaps are provided for guidance purposes and do not guarantee employment offers.
                        </p>
                    </section>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">4. Termination</h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We reserve the right to suspend or terminate accounts that violate these terms. Users may also terminate their account at any time via Settings (<code className="bg-page-bg px-2 py-0.5 rounded text-brand-blue font-mono">/settings</code>).
                        </p>
                    </section>

                    <section className="space-y-3 border-t border-border-soft pt-6">
                        <h2 className="font-sora text-xl font-bold">5. Contact Information</h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            For legal inquiries or questions regarding these terms, reach out to:
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
