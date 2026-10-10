"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Loader2, Download, Trash2, Lock, User as UserIcon, Bell, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
    const { user, loading, refreshUser, logout } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Profile state
    const [name, setName] = useState("");
    const [headline, setHeadline] = useState("");
    const [phone, setPhone] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [currentLevel, setCurrentLevel] = useState("");
    const [location, setLocation] = useState("");
    const [education, setEducation] = useState("");
    const [bio, setBio] = useState("");

    // Avatar state
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Preferences state
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(true);
    const [interviewConsent, setInterviewConsent] = useState(false);

    // Delete Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            setName(user.name || "");
            setHeadline(user.headline || "");
            setPhone(user.phone || "");
            setTargetRole(user.target_role || "");
            setCurrentLevel(user.current_level || "");
            setLocation(user.location || "");
            setEducation(user.education || "");
            setBio(user.bio || "");

            // Fetch current preferences
            fetchAPI("/users/me/preferences").then((prefs) => {
                setEmailNotifs(prefs.email_notifications);
                setWeeklyReport(prefs.weekly_report_email);
                setInterviewConsent(prefs.interview_recording_consent);
            }).catch(() => { });
        }
    }, [user, loading, router]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: "", type: "" });

        try {
            await fetchAPI("/users/me", {
                method: "PUT",
                body: JSON.stringify({
                    name, headline, phone, target_role: targetRole,
                    current_level: currentLevel, location, education, bio
                })
            });

            if (avatarFile) {
                const formData = new FormData();
                formData.append("file", avatarFile);
                const token = localStorage.getItem("access_token");
                await fetch("http://localhost:8000/api/users/me/avatar", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                });
            }

            setMessage({ text: "Profile updated successfully.", type: "success" });
            await refreshUser();
        } catch (err: any) {
            setMessage({ text: err.detail || "Failed to update profile.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: "New passwords do not match.", type: "error" });
            return;
        }

        setIsSaving(true);
        setMessage({ text: "", type: "" });

        try {
            await fetchAPI("/users/me/password", {
                method: "PUT",
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                })
            });
            setMessage({ text: "Password changed successfully.", type: "success" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setMessage({ text: err.detail || "Failed to change password.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePreferences = async () => {
        setIsSaving(true);
        setMessage({ text: "", type: "" });

        try {
            await fetchAPI("/users/me/preferences", {
                method: "PUT",
                body: JSON.stringify({
                    email_notifications: emailNotifs,
                    weekly_report_email: weeklyReport,
                    interview_recording_consent: interviewConsent,
                    language: "en",
                    timezone: "UTC"
                })
            });
            setMessage({ text: "Preferences saved successfully.", type: "success" });
        } catch (err: any) {
            setMessage({ text: "Failed to save preferences.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch("http://localhost:8000/api/users/me/export", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `careerpilot_data_${user?.id}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            setMessage({ text: "Failed to export data.", type: "error" });
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await fetchAPI("/users/me", { method: "DELETE" });
            logout();
            router.push("/login");
        } catch (err) {
            setMessage({ text: "Failed to delete account.", type: "error" });
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading || !user) return <div className="min-h-screen bg-page-bg flex items-center justify-center">Loading...</div>;

    const navItems = [
        { id: "profile", label: "Profile Info", icon: UserIcon },
        { id: "preferences", label: "Preferences", icon: Bell },
        { id: "security", label: "Security & Export", icon: Lock },
        { id: "danger", label: "Account Deletion", icon: Shield },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
            <h1 className="font-sora text-3xl font-extrabold text-text-primary mb-8">Settings</h1>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Left Sidebar */}
                <div className="w-full md:w-64 shrink-0 flex gap-2 overflow-x-auto md:flex-col md:overflow-visible bg-white p-2 border border-border-soft rounded-2xl">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setMessage({ text: "", type: "" }); }}
                            className={"flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left w-full " + (activeTab === item.id ? "bg-brand-blue text-white shadow-sm" : "hover:bg-page-bg text-text-primary")}
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Right Content */}
                <div className="flex-1 bg-white border border-border-soft rounded-3xl p-6 md:p-8 shadow-sm w-full">
                    {message.text && (
                        <div role="alert" className={"p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 " + (message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200')}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" /> : <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />}
                            {message.text}
                        </div>
                    )}

                    {/* Tab: Profile */}
                    {activeTab === "profile" && (
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <h2 className="font-sora text-xl font-bold text-text-primary border-b border-border-soft pb-4">Edit Profile</h2>

                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-brand-blue text-white flex items-center justify-center text-xl font-bold overflow-hidden relative">
                                    {user.avatar_path ? (
                                        <img src={`http://localhost:8000${user.avatar_path}`} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-text-primary block mb-1">Avatar Image</label>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                                        className="text-xs text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-page-bg file:text-brand-blue hover:file:bg-blue-100"
                                    />
                                    <p className="text-[11px] text-text-muted mt-1">Allowed: JPG, PNG, WEBP. Max 2MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Full Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Headline</label>
                                    <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Target Role</label>
                                    <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. AI Engineer" className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Experience Level</label>
                                    <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                                        <option value="">Select level...</option>
                                        <option value="Entry-level">Entry-level</option>
                                        <option value="Mid-level">Mid-level</option>
                                        <option value="Senior">Senior</option>
                                        <option value="Lead/Manager">Lead/Manager</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Phone</label>
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Location</label>
                                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote / New York" className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">Education</label>
                                <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. BS Computer Science" className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">Bio</label>
                                <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Write a short summary of your career background..." className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none" />
                            </div>

                            <div className="pt-4 border-t border-border-soft">
                                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-deep-blue transition-colors disabled:opacity-70 flex items-center gap-2">
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Profile Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Tab: Preferences */}
                    {activeTab === "preferences" && (
                        <div className="space-y-6">
                            <h2 className="font-sora text-xl font-bold text-text-primary border-b border-border-soft pb-4">User Preferences</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-page-bg rounded-2xl border border-border-soft">
                                    <div>
                                        <h4 className="font-bold text-text-primary text-sm">Email Notifications</h4>
                                        <p className="text-xs text-text-muted">Receive updates about module analysis, feedback, and security alerts.</p>
                                    </div>
                                    <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="h-5 w-5 text-brand-blue rounded focus:ring-brand-blue" />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-page-bg rounded-2xl border border-border-soft">
                                    <div>
                                        <h4 className="font-bold text-text-primary text-sm">Weekly Career Progress Report</h4>
                                        <p className="text-xs text-text-muted">Get a weekly email digest summarizing your ATS improvement and interview practice.</p>
                                    </div>
                                    <input type="checkbox" checked={weeklyReport} onChange={(e) => setWeeklyReport(e.target.checked)} className="h-5 w-5 text-brand-blue rounded focus:ring-brand-blue" />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-page-bg rounded-2xl border border-border-soft">
                                    <div>
                                        <h4 className="font-bold text-text-primary text-sm">AI Interview Recording Consent</h4>
                                        <p className="text-xs text-text-muted">Allow optional audio/video processing during mock interview sessions for feedback.</p>
                                    </div>
                                    <input type="checkbox" checked={interviewConsent} onChange={(e) => setInterviewConsent(e.target.checked)} className="h-5 w-5 text-brand-blue rounded focus:ring-brand-blue" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border-soft">
                                <button onClick={handleSavePreferences} disabled={isSaving} className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-deep-blue transition-colors disabled:opacity-70 flex items-center gap-2">
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab: Security & Export */}
                    {activeTab === "security" && (
                        <div className="space-y-8">
                            <form onSubmit={handleChangePassword} className="space-y-5">
                                <h2 className="font-sora text-xl font-bold text-text-primary border-b border-border-soft pb-4">Change Password</h2>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">Current Password</label>
                                    <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary">New Password</label>
                                        <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Min 8 chars, letters & numbers" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary">Confirm New Password</label>
                                        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-page-bg border border-border-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                    </div>
                                </div>
                                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-deep-blue transition-colors disabled:opacity-70 flex items-center gap-2">
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
                                </button>
                            </form>

                            <div className="pt-6 border-t border-border-soft">
                                <h3 className="font-sora text-lg font-bold text-text-primary mb-2">Export Personal Data</h3>
                                <p className="text-xs text-text-muted mb-4">Download a complete JSON export of your profile, preferences, and activity records for privacy compliance.</p>
                                <button onClick={handleExportData} className="flex items-center gap-2 bg-page-bg border border-border-soft text-text-primary px-5 py-2.5 rounded-xl font-bold hover:border-brand-blue transition-colors text-sm">
                                    <Download className="w-4 h-4 text-brand-blue" /> Download Data Export (JSON)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab: Danger Zone */}
                    {activeTab === "danger" && (
                        <div className="space-y-6">
                            <h2 className="font-sora text-xl font-bold text-red-600 border-b border-border-soft pb-4">Danger Zone</h2>

                            <div className="border border-red-200 bg-red-50/40 rounded-2xl p-6 space-y-4">
                                <h3 className="font-sora font-bold text-red-800 text-base">Permanently Delete Account</h3>
                                <p className="text-xs text-red-700 leading-relaxed">
                                    Once you delete your account, all your stored profile info, resumes, ATS evaluation history, and mock interview logs will be permanently removed. This action cannot be undone.
                                </p>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Account Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-border-soft shadow-2xl space-y-6">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-sora text-2xl font-bold text-text-primary">Are you sure?</h3>
                            <p className="text-text-muted text-sm mt-2">
                                This will permanently delete your account (<span className="font-semibold text-text-primary">{user.email}</span>) and all associated data.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 py-3 bg-page-bg border border-border-soft rounded-xl font-bold text-text-primary hover:bg-zinc-100 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
