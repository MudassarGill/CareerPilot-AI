"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("http://localhost:8000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            setMessage(data.message || "Instructions sent if email exists.");
        } catch (err: any) {
            setError("Failed to request password reset. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full justify-center w-full max-w-md mx-auto py-12">
            <Link href="/login" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>

            <div className="mb-8">
                <h2 className="font-sora text-3xl font-extrabold text-orange-500 mb-2">Forgot Password?</h2>
                <p className="text-zinc-400 text-sm">Enter your registered email address and we'll send you a link to reset your password.</p>
            </div>

            {message ? (
                <div className="bg-green-900/30 border border-green-800 text-green-200 p-6 rounded-2xl text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                    <h3 className="font-sora font-bold text-lg">Check Your Email</h3>
                    <p className="text-sm text-zinc-300">{message}</p>
                    <p className="text-xs text-zinc-400">If you don't see the email, check your spam/junk folder or try again.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="e.g. alex@example.com"
                            className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white tracking-widest font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all uppercase text-sm shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                    </button>
                </form>
            )}
        </div>
    );
}
