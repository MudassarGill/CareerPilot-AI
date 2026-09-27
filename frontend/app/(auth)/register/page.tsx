"use client";

import { useState } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);

        try {
            await fetchAPI("/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password, confirm_password: confirmPassword }),
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg shadow-orange-500/30">✓</div>
                <h2 className="text-3xl font-bold text-orange-500 tracking-wide uppercase mt-4">Registered!</h2>
                <p className="text-zinc-300 text-sm mt-2">
                    Your account for <strong>{email}</strong> has been created.
                </p>
                <Link href="/login" className="mt-8 inline-block px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl uppercase tracking-wider text-sm shadow hover:bg-orange-600 transition">
                    Proceed to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full justify-center">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-wide uppercase text-orange-500">Sign Up</h2>
                <p className="text-zinc-400 mt-2 text-sm">Create your new account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm text-center shadow">
                        {error}
                    </div>
                )}

                <div className="relative">
                    <input
                        type="text"
                        required
                        placeholder="Full Name"
                        className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner transition"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <input
                        type="email"
                        required
                        placeholder="Email Address"
                        className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                        className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner pr-12 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-zinc-500 hover:text-zinc-800 h-full p-2"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                        )}
                    </button>
                </div>

                <div className="relative">
                    <input
                        type={showConfirm ? "text" : "password"}
                        required
                        placeholder="Confirm Password"
                        className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner pr-12 transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-zinc-500 hover:text-zinc-800 h-full p-2"
                    >
                        {showConfirm ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                        )}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white tracking-widest font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all uppercase text-sm shadow-md disabled:opacity-70"
                >
                    {loading ? "Creating..." : "SIGN UP"}
                </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-[#2b3a40]">
                <p className="text-zinc-400 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-orange-500 font-bold hover:underline tracking-wide uppercase text-xs ml-2">
                        Login Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
