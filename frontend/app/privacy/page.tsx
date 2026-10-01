import { PageHero } from "@/components/PageHero";
import { brandConfig } from "@/lib/brand";

export default function PrivacyPage() {
    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen pb-20">
            <div className="bg-[#1C1C1E] py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-sora text-3xl md:text-5xl font-extrabold text-white mb-4">Privacy Policy (Draft)</h1>
                    <p className="text-zinc-400">Last updated: October 2026</p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border-soft prose prose-zinc max-w-none">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                        <p className="text-sm text-yellow-800 m-0">
                            <strong>Note:</strong> This is a draft privacy policy based on the platform's real behavior. It must be reviewed by legal counsel before a broader public launch.
                        </p>
                    </div>

                    <h3>1. What Information We Collect</h3>
                    <p>We collect only what is necessary to provide the CareerPilot AI services:</p>
                    <ul>
                        <li><strong>Account Information:</strong> Name, email address, and hashed password.</li>
                        <li><strong>Profile Data:</strong> Job titles, education, basic bio, and links you choose to provide.</li>
                        <li><strong>Career Materials:</strong> Uploaded resumes (PDF/DOCX) for analysis.</li>
                        <li><strong>Interview Recordings:</strong> Optional audio/video recordings during mock interviews (only if explicit consent is given).</li>
                        <li><strong>Usage Data:</strong> Basic interaction logs, such as when modules are accessed, for platform improvement.</li>
                    </ul>

                    <h3>2. How We Use Your Information</h3>
                    <p>Your data is used strictly for generating your personalized AI coaching feedback, ATS scores, skill gaps, and learning roadmaps. We do not sell your data or use it for unrelated marketing.</p>

                    <h3>3. Data Retention, Export, and Deletion</h3>
                    <ul>
                        <li><strong>Retention:</strong> Interview recordings are automatically deleted after 30 days unless you explicitly save them to your account. Resumes and profile data are kept until you delete them.</li>
                        <li><strong>Export:</strong> You can export a JSON file of all your data directly from the Settings page at any time.</li>
                        <li><strong>Deletion:</strong> You can completely delete your account from Settings. This action securely removes all your database rows and uploaded files.</li>
                    </ul>

                    <h3>4. Third-Party AI Providers</h3>
                    <p>Certain text and audio components of your input (such as resume text or mock interview transcripts) may be processed by third-party AI providers (e.g., Google or OpenAI) to generate feedback. We will list these providers here when those specific AI features go live.</p>

                    <h3>5. Security Basics</h3>
                    <p>We implement standard security measures: passwords are hashed (bcrypt), connections are encrypted (HTTPS), and user data is isolated via database constraints so you can only access your own data.</p>

                    <h3 id="cookies">6. Cookies and Tracking</h3>
                    <p>We use minimal cookies necessary for the platform to function:</p>
                    <ul>
                        <li><strong>Authentication:</strong> Tokens used to keep you logged in securely.</li>
                        <li>We do not use aggressive third-party trackers or cross-site tracking tools.</li>
                    </ul>

                    <h3>7. Contact Us</h3>
                    <p>If you have any questions about this policy or your data, please contact us at <a href={"mailto:" + brandConfig.email}>{brandConfig.email}</a>.</p>
                </div>
            </main>
        </div>
    );
}
