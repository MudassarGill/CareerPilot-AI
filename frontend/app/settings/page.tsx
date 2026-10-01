"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [activeTab, setActiveTab] = useState("profile");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user, loading, router]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: "", type: "" });

        try {
            await fetchAPI("/users/me", { method: "PUT", body: JSON.stringify({ name }) });
            setMessage({ text: "Profile updated successfully.", type: "success" });
            await refreshUser();
        } catch (err) {
            setMessage({ text: "Failed to update profile.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <h1 className="font-sora text-3xl font-extrabold text-text-primary mb-8">Settings</h1>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-64 shrink-0 flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={"text-left px-4 py-3 rounded-lg font-medium transition-colors " + (activeTab === "profile" ? "bg-brand-blue text-white" : "hover:bg-page-bg text-text-primary")}
                    >
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveTab("account")}
                        className={"text-left px-4 py-3 rounded-lg font-medium transition-colors " + (activeTab === "account" ? "bg-brand-blue text-white" : "hover:bg-page-bg text-text-primary")}
                    >
                        Account & Security
                    </button>
                </div>

                <div className="flex-1 bg-white border border-border-soft rounded-2xl p-6 md:p-8 shadow-sm w-full">
                    {message.text && (
                        <div className={"p-4 rounded-lg mb-6 text-sm font-medium " + (message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200')}>
                            {message.text}
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <h2 className="font-sora text-xl font-bold text-text-primary border-b border-border-soft pb-4">Profile Information</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">Avatar</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-brand-blue text-white flex items-center justify-center text-xl font-bold">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                    <button type="button" className="text-sm font-semibold px-4 py-2 bg-page-bg border border-border-soft rounded-lg hover:border-brand-blue transition-colors">
                                        Change Avatar
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">Bio</label>
                                <textarea rows={4} placeholder="Tell us a little about your career goals..." className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none" />
                            </div>
                            <div className="pt-4 border-t border-border-soft">
                                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-deep-blue transition-colors disabled:opacity-70 flex items-center gap-2">
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === "account" && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="font-sora text-xl font-bold text-text-primary border-b border-border-soft pb-4 mb-6">Account Limits</h2>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Email Address</label>
                                    <input type="email" disabled value={email} className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 opacity-60 cursor-not-allowed" />
                                </div>
                            </div>
                            <div>
                                <h2 className="font-sora text-xl font-bold text-red-600 border-b border-border-soft pb-4 mb-6">Danger Zone</h2>
                                <div className="border border-red-100 bg-red-50/50 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-red-800">Delete Account</h3>
                                    </div>
                                    <button className="whitespace-nowrap shrink-0 px-4 py-2 border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
