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

    if (!user) return <div className="text-center">Loading...</div>;

    return (
        <div className="flex flex-col h-full justify-center">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
                <p className="text-zinc-500">Hi {user.name}, let's get you set up!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Phone Number (Optional)</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500  dark:bg-zinc-800 outline-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 234 567 8900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Target Role / Industry</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 outline-none"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Software Engineer, Data Scientist"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium mt-6 disabled:opacity-70"
                >
                    {loading ? "Saving..." : "Save and Continue"}
                </button>
            </form>
        </div>
    );
}
