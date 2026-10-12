"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8000/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, new_password: newPassword })
            });

            if (res.ok) {
                setMessage("Password successfully reset! Redirecting to login...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.detail || "Invalid or expired token.");
            }
        } catch (err: any) {
            setError("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h2 className="font-sora text-2xl font-bold text-white">Invalid Reset Link</h2>
                <p className="text-zinc-400 text-sm max-w-sm">No reset token provided. Please request a new password reset link.</p>
                <Link href="/forgot-password" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                    Request Reset Link
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full justify-center w-full max-w-md mx-auto py-12">
            <Link href="/login" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>

            <div className="mb-8">
                <h2 className="font-sora text-3xl font-extrabold text-orange-500 mb-2">Reset Password</h2>
                <p className="text-zinc-400 text-sm">Set your new account password below.</p>
            </div>

            {message ? (
                <div className="bg-green-900/30 border border-green-800 text-green-200 p-6 rounded-2xl text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                    <h3 className="font-sora font-bold text-lg">Password Reset!</h3>
                    <p className="text-sm text-zinc-300">{message}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-2">New Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Min 8 characters, letters & numbers"
                            className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner transition"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Re-enter new password"
                            className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner transition"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white tracking-widest font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all uppercase text-sm shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-center text-zinc-400 py-12">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
