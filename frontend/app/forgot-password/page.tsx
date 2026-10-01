"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { brandConfig } from "@/lib/brand";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            await fetchAPI("/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email })
            }, false); // don't add token
            setIsSuccess(true);
        } catch (e: any) {
            setErrorMsg(e.detail || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-page-bg">
            <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 border border-border-soft shadow-sm">

                {isSuccess ? (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="font-sora text-2xl font-bold text-text-primary mb-3">Check your email</h2>
                        <p className="text-text-muted text-sm mb-8">
                            We've sent a password reset link to <span className="font-semibold text-text-primary">{email}</span>. Please check your inbox and spam folder.
                        </p>
                        <Link href="/login" className="flex items-center justify-center w-full bg-brand-blue text-white py-3 rounded-xl font-semibold hover:bg-deep-blue transition-colors">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="font-sora text-2xl font-bold text-text-primary text-center mb-2">Forgot Password?</h2>
                        <p className="text-text-muted text-center text-sm mb-8">
                            No worries, we'll send you reset instructions.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {errorMsg && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">Email address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-page-bg border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-deep-blue text-white py-3 rounded-xl font-bold mt-4 transition-colors disabled:opacity-75"
                            >
                                {isLoading ? "Sending..." : "Reset Password"} <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-text-muted">Remember password? </span>
                            <Link href="/login" className="font-bold text-brand-blue hover:underline">
                                Log In
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
