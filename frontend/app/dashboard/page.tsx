"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (!user.profile_completed) {
            router.push("/profile-setup");
        }
    }, [user, router]);

    if (!user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white dark:bg-zinc-900 rounded-xl shadow p-8 shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to CareerPilot AI, {user.name}!</h1>

                <div className="bg-blue-50 text-blue-800 p-6 rounded-lg my-8 dark:bg-blue-900/20 dark:text-blue-300">
                    <p className="font-medium text-lg mb-2">Phase 1 Complete</p>
                    <p>
                        You are successfully logged in. Your email is <strong>{user.email}</strong>,
                        and your target role is <strong>{user.target_role || "Not specified"}</strong>.
                    </p>
                </div>

                <button
                    onClick={logout}
                    className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition font-medium"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
