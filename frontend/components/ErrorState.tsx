"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    message = "We couldn't load this information. Please try again.",
    onRetry
}: ErrorStateProps) {
    return (
        <div className="w-full flex justify-center py-12">
            <div className="bg-red-50 text-red-800 rounded-2xl p-8 max-w-lg w-full flex flex-col items-center text-center border border-red-100 shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-sora font-semibold text-lg mb-2">{title}</h3>
                <p className="text-red-700 mb-6">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md focus:ring-4 focus:ring-red-200"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}
