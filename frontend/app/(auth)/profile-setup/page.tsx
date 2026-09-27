"use client";

import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export default function ProfileSetup() {
    const { user, login } = useAuth();
    const router = useRouter();

    const [phone, setPhone] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const updatedUser = await fetchAPI("/auth/profile", {
                method: "PUT",
                body: JSON.stringify({ phone, target_role: targetRole }),
            });
            // Update local context
            const token = localStorage.getItem("token") || "";
            const refToken = localStorage.getItem("refresh_token") || "";
            login(token, refToken, updatedUser);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center w-full mt-20 text-orange-500 font-bold">Loading...</div>;

    return (
        <div className="flex flex-col h-full justify-center w-full">
            <div className="mb-10 flex flex-col items-center">
                <div className="relative inline-block pb-3 group">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-wide uppercase text-orange-500 cursor-default drop-shadow-sm">
                        Setup Profile
                    </h2>
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-orange-500/20 rounded-full overflow-hidden opacity-70">
                        <div className="h-full w-1/3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-slide-bounce"></div>
                    </div>
                </div>
                <p className="text-zinc-400 mt-4 text-sm font-medium tracking-wide">Tell us your goals, {user.name}!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm text-center shadow">
                        {error}
                    </div>
                )}

                <div className="relative">
                    <label className="block text-sm font-medium mb-2 text-zinc-300 px-2 tracking-wider uppercase text-xs">Phone Number (Optional)</label>
                    <input
                        type="text"
                        placeholder="+1 234 567 8900"
                        className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner transition"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="relative pt-2">
                    <label className="block text-sm font-medium mb-2 text-zinc-300 px-2 tracking-wider uppercase text-xs">Target Role / Position</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Software Engineer, Data Scientist"
                        className="w-full h-12 px-5 bg-[#e8eced] text-zinc-900 placeholder-zinc-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner transition"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-10 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white tracking-widest font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all uppercase text-sm shadow-md disabled:opacity-70"
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}
