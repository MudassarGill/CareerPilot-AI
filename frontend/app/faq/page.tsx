import { FAQSection } from "@/components/FAQSection";
import { PageHero } from "@/components/PageHero";
import { images } from "@/lib/content";

export default function FAQPage() {
    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen">
            <PageHero
                title="Frequently Asked Questions"
                description="Find answers to common questions about CareerPilot AI, features, data privacy, and more."
                imageSrc={images.phase3.faqHero}
            />

            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-24">
                <FAQSection isPreview={false} />
            </div>
        </div>
    );
}
