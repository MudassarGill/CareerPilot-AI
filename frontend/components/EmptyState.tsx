"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="w-full flex justify-center py-12">
            <div className="bg-card rounded-2xl p-10 max-w-lg w-full flex flex-col items-center text-center border border-border-soft shadow-sm border-dashed">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-brand-blue" />
                </div>
                <h3 className="font-sora font-semibold text-text-primary text-xl mb-2">{title}</h3>
                <p className="text-text-muted mb-6">{description}</p>
                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="px-6 py-2.5 bg-brand-blue hover:bg-deep-blue text-white rounded-lg font-medium shadow-md transition-all focus:ring-4 focus:ring-brand-blue/30"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
