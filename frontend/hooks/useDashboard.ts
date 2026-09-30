import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";

export interface DashboardSummary {
    readiness_score: number;
    readiness_trend: number;
    target_role?: string;
    current_level?: string;
    resume_status?: string;
    resume_score?: number;
    interview_count_audio: number;
    interview_count_video: number;
    interview_avg?: number;
    learning_progress_pct: number;
    skill_progress_pct: number;
}

export function useDashboard(enabled: boolean = true) {
    return useQuery<DashboardSummary, Error>({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            const data = await fetchAPI("/dashboard/summary");
            if (!data) throw new Error("No data returned");
            return data as DashboardSummary;
        },
        enabled,
        retry: 1
    });
}
