"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, EyeOff, Eye, CheckCircle2 } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        if (!token) {
            setErrorMsg("Missing reset token");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        try {
            await fetchAPI("/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, new_password: newPassword, confirm_password: confirmPassword })
            }, false);
            setIsSuccess(true);
        } catch (e: any) {
            setErrorMsg(e.detail || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && !isSuccess) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
                <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 border border-border-soft text-center">
                    <h2 className="font-sora text-2xl font-bold text-red-600 mb-3">Invalid Link</h2>
                    <p className="text-text-muted mb-6">The password reset link is invalid or missing the token.</p>
                    <Link href="/forgot-password" className="text-brand-blue font-semibold hover:underline">Request a new link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-page-bg">
            <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 border border-border-soft shadow-sm">

                {isSuccess ? (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="font-sora text-2xl font-bold text-text-primary mb-3">Password Reset!</h2>
                        <p className="text-text-muted text-sm mb-8">
                            Your password has been successfully reset. You can now use your new password to log in.
                        </p>
                        <Link href="/login" className="flex items-center justify-center w-full bg-brand-blue text-white py-3 rounded-xl font-semibold hover:bg-deep-blue transition-colors">
                            Continue to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="font-sora text-2xl font-bold text-text-primary text-center mb-2">Create New Password</h2>
                        <p className="text-text-muted text-center text-sm mb-8">
                            Your new password must be different from previous used passwords.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {errorMsg && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="space-y-2 relative">
                                <label className="text-sm font-semibold text-text-primary">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full pl-11 pr-11 py-3 bg-page-bg border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                        placeholder="Enter new password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-brand-blue"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-sm font-semibold text-text-primary">Confirm new password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-11 pr-11 py-3 bg-page-bg border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                        placeholder="Confirm new password"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !newPassword || !confirmPassword}
                                className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-deep-blue text-white py-3 rounded-xl font-bold mt-4 transition-colors disabled:opacity-75"
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
