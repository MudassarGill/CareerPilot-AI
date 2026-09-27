"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

function VerifyEmailInner() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email address...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token provided.");
            return;
        }

        fetchAPI("/auth/verify-email", {
            method: "POST",
            body: JSON.stringify({ token }),
        })
            .then(() => {
                setStatus("success");
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.message || "Failed to verify email. The link might be expired.");
            });
    }, [token]);

    return (
        <div className="text-center space-y-6">
            {status === "loading" && (
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent flex items-center justify-center rounded-full mx-auto" />
            )}

            {status === "success" && (
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
            )}

            {status === "error" && (
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">!</div>
            )}

            <div>
                <h2 className="text-2xl font-bold mb-2">
                    {status === "success" ? "Email Verified!" : status === "error" ? "Verification Failed" : "Verifying..."}
                </h2>
                <p className="text-zinc-500">{message}</p>
            </div>

            {status !== "loading" && (
                <Link href="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Continue to Login
                </Link>
            )}
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <VerifyEmailInner />
        </Suspense>
    )
}
