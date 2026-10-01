"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqData } from "@/lib/faq";

interface FAQSectionProps {
    isPreview?: boolean;
}

export function FAQSection({ isPreview = false }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const questions = isPreview ? faqData.slice(0, 4) : faqData;

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            {questions.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                    <div
                        key={index}
                        className="border border-border-soft rounded-lg bg-white overflow-hidden transition-all shadow-sm"
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue"
                            aria-expanded={isOpen}
                        >
                            <span className="font-sora font-semibold text-text-primary text-base md:text-lg pr-4">
                                {faq.question}
                            </span>
                            <span className="text-zinc-400 flex-shrink-0">
                                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </span>
                        </button>
                        <div
                            className={"overflow-hidden transition-all duration-300 ease-in-out " + (isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}
                        >
                            <div className="p-5 md:p-6 pt-0 text-text-muted leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div >
    );
}
