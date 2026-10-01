"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHero } from "@/components/PageHero";
import { images } from "@/lib/content";
import { brandConfig } from "@/lib/brand";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { fetchAPI } from "@/lib/api";

const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Please provide more details in your message"),
    honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        setErrorMsg("");

        try {
            const res = await fetch("http://localhost:8000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setIsSuccess(true);
                reset();
            } else {
                const err = await res.json();
                setErrorMsg(err.detail || "Failed to send message. Please try again later.");
            }
        } catch (error) {
            setErrorMsg("An error occurred while sending your message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen">
            <PageHero
                title="Contact Us"
                description="Have questions? We're here to help you get the most out of CareerPilot AI."
                imageSrc={images.phase3.contactHero}
            />

            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-sora text-3xl font-bold text-text-primary mb-4">Get in touch</h2>
                            <p className="text-text-muted leading-relaxed text-lg">
                                Whether you're curious about a feature, need help with your account, or want to discuss a partnership, our team is ready to answer all your questions.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-border-soft shadow-sm space-y-6">
                            <h3 className="font-sora font-semibold text-xl text-text-primary border-b border-border-soft pb-4">
                                Contact Information
                            </h3>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary">Email Support</h4>
                                    <a href={"mailto:" + brandConfig.email} className="text-brand-blue hover:underline">
                                        {brandConfig.email}
                                    </a>
                                    <p className="text-text-muted text-sm mt-1">{brandConfig.responseTime}</p>
                                </div>
                            </div>

                            {brandConfig.workingHours && (
                                <div className="pt-4 border-t border-border-soft">
                                    <h4 className="font-semibold text-text-primary">Business Hours</h4>
                                    <p className="text-text-muted mt-1">{brandConfig.workingHours}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-border-soft relative overflow-hidden">
                        {isSuccess ? (
                            <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="font-sora text-2xl font-bold text-text-primary mb-2">Message Sent!</h3>
                                <p className="text-text-muted mb-8 max-w-sm mx-auto">
                                    Thanks for reaching out. We've received your message and will get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="bg-brand-blue text-white font-semibold py-3 px-8 rounded-full hover:bg-deep-blue transition-colors outline-none focus:ring-4 focus:ring-brand-blue/50"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {errorMsg && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary ml-1">Name</label>
                                        <input
                                            {...register("name")}
                                            className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary ml-1">Email <span className="text-red-500">*</span></label>
                                        <input
                                            {...register("email")}
                                            className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary ml-1">Phone (Optional)</label>
                                    <input
                                        {...register("phone")}
                                        className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary ml-1">Subject <span className="text-red-500">*</span></label>
                                    <input
                                        {...register("subject")}
                                        className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                        placeholder="How can we help you?"
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs ml-1">{errors.subject.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary ml-1">Message <span className="text-red-500">*</span></label>
                                    <textarea
                                        {...register("message")}
                                        rows={5}
                                        className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                                        placeholder="Please provide details so we can assist you better..."
                                    />
                                    {errors.message && <p className="text-red-500 text-xs ml-1">{errors.message.message}</p>}
                                </div>

                                {/* Honeypot for simple bot deflection */}
                                <input {...register("honeypot")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-brand-blue text-white font-bold py-3 px-6 rounded-xl hover:bg-deep-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                                        ) : (
                                            "Send Message"
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
