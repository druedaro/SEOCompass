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
    audit?: {
        url: string;
        scores: {
            content: number;
            meta: number;
            onPage: number;
            technical: number;
        };
    } | null;
}
