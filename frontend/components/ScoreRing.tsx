"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
    score: number; // 0-100
    size?: number; // size in px, defaults to 120
}

export function ScoreRing({ score, size = 120 }: ScoreRingProps) {
    const strokeWidth = size * 0.1;
    const radius = size * 0.4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background Ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#E6EBF2" // border-soft
                    strokeWidth={strokeWidth}
                />

                {/* Progress Ring */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#1EA7E8" // brand-blue
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ strokeDasharray: circumference }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-sora font-bold text-white drop-shadow-md">
                    {score}
                </span>
            </div>
        </div>
    );
}
