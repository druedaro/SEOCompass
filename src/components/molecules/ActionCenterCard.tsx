import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import type { ActionCenterCardProps } from '@/types/dashboard';

export function ActionCenterCard({ projectId, pendingTasks }: ActionCenterCardProps) {
    const navigate = useNavigate();

    return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/projects/${projectId}/actions`)}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Action Center
                    {pendingTasks > 0 && (
                        <Badge variant="secondary">{pendingTasks} pending</Badge>
                    )}
                </CardTitle>
                <CardDescription>
                    Manage tasks and action items
                </CardDescription>
            </CardHeader>
            <CardContent>
                {pendingTasks > 0 ? (
                    <p className="text-sm text-muted-foreground mb-4">
                        You have {pendingTasks} pending {pendingTasks === 1 ? 'task' : 'tasks'} assigned to you
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground mb-4">
                        No pending tasks assigned to you
                    </p>
                )}
                <Button variant="outline" className="w-full">
                    Go to Action Center →
                </Button>
            </CardContent>
        </Card>
    );
}
