import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/molecules/Table';
import { Card } from '@/components/molecules/Card';
import { AlertTriangle, Info, Plus, AlertCircle } from 'lucide-react';
import type { Recommendation } from '@/types/seoTypes';
import { CATEGORY_STYLES } from '@/constants/seo';
import type { AuditResultsTableProps } from '@/types/componentTypes';

function getSeverityBadge(severity: 'critical' | 'warning' | 'info') {
  switch (severity) {
    case 'critical':
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Critical
        </Badge>
      );
    case 'warning':
      return (
        <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3" />
          Warning
        </Badge>
      );
    case 'info':
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          Info
        </Badge>
      );
  }
}

function getCategoryBadge(category: Recommendation['category']) {
  return (
    <Badge variant="outline" className={CATEGORY_STYLES[category]}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  );
}

function getScoreBadge(score: number) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let className = '';

  if (score >= 90) {
    className = 'bg-green-500 text-white';
  } else if (score >= 80) {
    className = 'bg-blue-500 text-white';
  } else if (score >= 70) {
    className = 'bg-yellow-500 text-white';
  } else if (score >= 60) {
    className = 'bg-orange-500 text-white';
  } else {
    variant = 'destructive';
  }

  return (
    <Badge variant={variant} className={className}>
      {score}
    </Badge>
  );
}

export function AuditResultsTable({
  recommendations,
  overallScore,
  categoryScores,
  onAddTask,
}: AuditResultsTableProps) {
  const criticalIssues = recommendations.filter((r) => r.severity === 'critical');
  const warnings = recommendations.filter((r) => r.severity === 'warning');
  const info = recommendations.filter((r) => r.severity === 'info');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Overall Score</div>
          <div className="text-3xl font-bold flex items-center gap-2">
            {overallScore}
            {getScoreBadge(overallScore)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Meta</div>
          <div className="text-2xl font-bold">{categoryScores.meta}</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Content</div>
          <div className="text-2xl font-bold">{categoryScores.content}</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Technical</div>
          <div className="text-2xl font-bold">{categoryScores.technical}</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">On-Page</div>
          <div className="text-2xl font-bold">{categoryScores.onPage}</div>
        </Card>
      </div>

      <div className="flex gap-4">
        <Badge variant="destructive" className="px-4 py-2">
          {criticalIssues.length} Critical
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 bg-yellow-100 text-yellow-800">
          {warnings.length} Warnings
        </Badge>
        <Badge variant="outline" className="px-4 py-2">
          {info.length} Info
        </Badge>
      </div>

      <Card className="max-h-[600px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Severity</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Action Required</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recommendations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No issues found. Great job! 🎉
                </TableCell>
              </TableRow>
            ) : (
              recommendations.map((recommendation) => (
                <TableRow key={recommendation.id}>
                  <TableCell>{getSeverityBadge(recommendation.severity)}</TableCell>
                  <TableCell>{getCategoryBadge(recommendation.category)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{recommendation.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {recommendation.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{recommendation.action}</TableCell>
                  <TableCell>
                    {recommendation.severity !== 'info' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddTask?.(recommendation)}
                        disabled={!onAddTask}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Task
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
