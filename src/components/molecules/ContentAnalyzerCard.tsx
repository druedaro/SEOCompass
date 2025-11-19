import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import type { ContentAnalyzerCardProps } from '@/types/dashboard';

export function ContentAnalyzerCard({ projectId, audit }: ContentAnalyzerCardProps) {
    const navigate = useNavigate();

    return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/projects/${projectId}/content`)}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Content Analyzer
                </CardTitle>
                <CardDescription>
                    Audit and optimize your content for SEO
                    {audit && (
                        <div className="mt-2 text-sm flex items-center justify-between">
                            <div className="truncate mr-2">
                                Last audit: <span className="font-medium">{audit.url}</span>
                            </div>
                            <div className="font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs whitespace-nowrap">
                                {audit.scores.overall}%
                            </div>
                        </div>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {audit && (
                    <div className="grid grid-cols-2 gap-y-2 gap-x-[4.5rem] mb-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Content:</span>
                            <span className="font-medium">{audit.scores.content}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Meta:</span>
                            <span className="font-medium">{audit.scores.meta}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">On-Page:</span>
                            <span className="font-medium">{audit.scores.onPage}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Technical:</span>
                            <span className="font-medium">{audit.scores.technical}%</span>
                        </div>
                    </div>
                )}
                <Button variant="outline" className="w-full">
                    Go to Content Analyzer →
                </Button>
            </CardContent>
        </Card>
    );
}
