import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/Card';
import type { ProjectStatsOverviewProps } from '@/types/dashboard';

export function ProjectStatsOverview({ stats }: ProjectStatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="opacity-50 pointer-events-none">
                <CardHeader className="pb-3">
                    <CardDescription>Total Keywords</CardDescription>
                    <CardTitle className="text-3xl">0</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">
                        Coming in future updates
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardDescription>Pages Audited</CardDescription>
                    <CardTitle className="text-3xl">{stats.pagesAudited}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">
                        {stats.pagesAudited === 0 ? 'No pages audited yet' : `Total audits performed`}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardDescription>Open Tasks</CardDescription>
                    <CardTitle className="text-3xl">{stats.openTasks}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">
                        {stats.openTasks === 0 ? 'No tasks created yet' : `Active tasks to complete`}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
