import type { LatestAudit } from './audit';

export interface ProjectStatsOverviewProps {
    stats: {
        pagesAudited: number;
        openTasks: number;
    };
}

export interface ActionCenterCardProps {
    projectId: string;
    pendingTasks: number;
}

export interface ContentAnalyzerCardProps {
    projectId: string;
    audit?: LatestAudit | null;
}
