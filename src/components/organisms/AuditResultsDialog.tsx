import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/atoms/Dialog';
import { AuditResultsTable } from './AuditResultsTable';
import type { Recommendation } from '@/utils/recommendationsEngine';
import type { SEOScoreBreakdown } from '@/utils/scoreCalculator';

interface AuditResultsDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
  recommendations: Recommendation[];
  scoreBreakdown: SEOScoreBreakdown;
}

export function AuditResultsDialog({
  open,
  onClose,
  url,
  recommendations,
  scoreBreakdown,
}: AuditResultsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Content Analysis Results</DialogTitle>
          <DialogDescription className="text-sm break-all">
            {url}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <AuditResultsTable
            recommendations={recommendations}
            overallScore={scoreBreakdown.overall}
            categoryScores={{
              meta: scoreBreakdown.meta,
              content: scoreBreakdown.content,
              technical: scoreBreakdown.technical,
              onPage: scoreBreakdown.onPage,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
