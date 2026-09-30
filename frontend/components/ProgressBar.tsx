"use client";

interface ProgressBarProps {
    value: number; // 0-100
    label?: string;
    showValue?: boolean;
}

export function ProgressBar({ value, label, showValue = true }: ProgressBarProps) {
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className="w-full">
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-1.5 text-sm font-medium">
                    {label && <span className="text-text-primary">{label}</span>}
                    {showValue && <span className="text-brand-blue">{clampedValue}%</span>}
                </div>
            )}
            <div className="h-2 w-full bg-border-soft rounded-full overflow-hidden flex">
                <div
                    className="h-full bg-brand-blue rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
        </div>
    );
}
