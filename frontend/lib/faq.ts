import { brandConfig } from "@/lib/brand";

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export const faqData: FAQItem[] = [
    {
        id: "1",
        question: "What is this platform?",
        answer: "An AI-powered career platform that brings resume analysis, ATS checks, skill gap analysis, a learning roadmap and interview practice into one place."
    },
    {
        id: "2",
        question: "Which features are available right now?",
        answer: "Account and dashboard are live. The other modules are being released phase by phase; each module page shows whether it is Live or Coming soon."
    },
    {
        id: "3",
        question: "Which resume formats are supported?",
        answer: "PDF and DOCX, up to 5 MB, when the resume module is released."
    },
    {
        id: "4",
        question: "How is my data protected?",
        answer: "Passwords are hashed, files are stored privately, and only you can see your data. You can export or delete your data at any time from Settings."
    },
    {
        id: "5",
        question: "Are interview recordings stored?",
        answer: "Only with your consent, and they are deleted after 30 days unless you save them. (applies when interview modules are released)"
    },
    {
        id: "6",
        question: "Is the ATS score exact?",
        answer: "No. It is an estimate that explains its reasoning, because real employer systems differ."
    },
    {
        id: "7",
        question: "How do I contact support?",
        answer: `Use the Contact page or email ${brandConfig.email}. ${brandConfig.responseTime}`
    },
    {
        id: "8",
        question: "Can I delete my account?",
        answer: "Yes, from Settings. It removes your account, files and data."
    }
];

export const faqItems = faqData;
