"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await fetchAPI("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            login(data.access_token, data.refresh_token, data.user);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full justify-center w-full">
            <div className="mb-10 flex flex-col items-center">
                <div className="relative inline-block pb-3 group">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-wide uppercase text-orange-500 cursor-default transition-transform transform group-hover:scale-105 duration-300 drop-shadow-sm">
                        User Login
                    </h2>
                    {/* Animated Hover Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-orange-500/20 rounded-full overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="h-full w-1/3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-slide-bounce shadow-[0_0_8px_#f97316]"></div>
                    </div>
                </div>
                <p className="text-zinc-400 mt-4 text-sm font-medium tracking-wide">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                    <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm text-center shadow">
                        {error}
                    </div>
                )}

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

                <div className="flex justify-between items-center text-sm text-zinc-400 px-1 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="form-checkbox rounded bg-transparent border-zinc-500 text-orange-500" />
                        <span>Remember me</span>
                    </label>
                    <a href="#" className="hover:text-orange-400 transition text-orange-500 font-medium tracking-wide">Forgot Password?</a>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white tracking-widest font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all uppercase text-sm shadow-md"
                >
                    {loading ? "Logging in..." : "LOGIN"}
                </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-[#2b3a40]">
                <p className="text-zinc-400 text-sm">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-orange-500 font-bold hover:underline tracking-wide uppercase text-xs ml-2">
                        Register Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
