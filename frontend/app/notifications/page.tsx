"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Loader2, Bell, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { images } from "@/lib/content";

interface NotifItem {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    created_at: string;
}

function getIconInfo(type: string) {
    switch (type) {
        case "success": return { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, bg: "bg-green-50", border: "border-green-200" };
        case "warning": return { icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />, bg: "bg-yellow-50", border: "border-yellow-200" };
        case "error": return { icon: <AlertCircle className="w-5 h-5 text-red-500" />, bg: "bg-red-50", border: "border-red-200" };
        default: return { icon: <Info className="w-5 h-5 text-brand-blue" />, bg: "bg-blue-50", border: "border-blue-200" };
    }
}

function NotifCard({ notif, onMark }: { notif: NotifItem; onMark: (id: string) => void }) {
    const ui = getIconInfo(notif.type);
    const wrapperClass = notif.read
        ? "flex items-start gap-4 p-5 rounded-2xl border bg-white border-border-soft opacity-70 transition-all cursor-pointer"
        : "flex items-start gap-4 p-5 rounded-2xl border bg-page-bg border-brand-blue/30 shadow-sm transition-all cursor-pointer";
    const iconWrapClass = "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border " + ui.bg + " " + ui.border;
    const titleClass = notif.read
        ? "font-sora font-semibold truncate text-text-primary"
        : "font-sora font-semibold truncate text-brand-blue";

    return (
        <div onClick={() => { if (!notif.read) onMark(notif.id); }} className={wrapperClass}>
            <div className={iconWrapClass}>
                {ui.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={titleClass}>{notif.title}</h4>
                    <span className="text-xs text-text-muted shrink-0 whitespace-nowrap">
                        {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-text-muted text-sm">{notif.message}</p>
            </div>
            {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-accent-orange mt-2 shrink-0"></div>
            )}
        </div>
    );
}

export default function NotificationsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<NotifItem[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            loadNotifications();
        }
    }, [user, loading, router]);

    const loadNotifications = async () => {
        try {
            const data = await fetchAPI("/notifications");
            setNotifications(data);
        } catch (e) {
            console.error("Failed to load notifications", e);
        } finally {
            setIsFetching(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            await fetchAPI("/notifications/" + id + "/read", { method: "PUT" });
        } catch (e) {
            console.error("Failed to mark as read", e);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
        }
    };

    const markAllRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            await fetchAPI("/notifications/read-all", { method: "PUT" });
        } catch (e) {
            console.error("Failed to mark all read", e);
        }
    };

    if (loading || !user) {
        return <div className="min-h-screen bg-page-bg flex items-center justify-center">Loading...</div>;
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="w-full flex flex-col bg-page-bg min-h-screen pb-20">
            <PageHero
                title="Notifications"
                description="Stay updated on your career progress and platform alerts."
                imageSrc={images.phase3.profileHero}
            />

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 w-full">
                <div className="bg-white rounded-3xl shadow-sm border border-border-soft overflow-hidden">
                    <div className="p-6 md:p-8 flex items-center justify-between border-b border-border-soft">
                        <div className="flex items-center gap-3">
                            <h2 className="font-sora text-2xl font-bold text-text-primary">All Notifications</h2>
                            {unreadCount > 0 && (
                                <span className="bg-accent-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-sm font-semibold text-brand-blue hover:text-deep-blue transition-colors px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="p-4 md:p-6 flex flex-col gap-4 min-h-[400px]">
                        {isFetching ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-text-muted">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <p>Loading notifications...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-page-bg rounded-full flex items-center justify-center text-text-muted mb-4">
                                    <Bell className="w-10 h-10" />
                                </div>
                                <h3 className="font-sora text-xl font-bold text-text-primary mb-2">You are all caught up!</h3>
                                <p className="text-text-muted">No new notifications at this time.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <NotifCard key={notif.id} notif={notif} onMark={markAsRead} />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
