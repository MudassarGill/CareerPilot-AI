"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border-soft text-center">
                <div className="w-20 h-20 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertOctagon className="w-10 h-10" />
                </div>

                <h2 className="font-sora text-2xl font-bold text-text-primary mb-4">Something went wrong!</h2>

                <p className="text-text-muted text-sm leading-relaxed mb-8">
                    An unexpected error has occurred in the application. Our engineering team has been notified.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-3 px-6 rounded-xl hover:bg-deep-blue transition-colors shadow-sm w-full"
                    >
                        <RotateCcw className="w-4 h-4" /> Try again
                    </button>
                    <Link href="/dashboard" className="text-sm font-semibold text-text-muted hover:text-text-primary py-3 transition-colors bg-page-bg rounded-xl border border-border-soft w-full block text-center">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
