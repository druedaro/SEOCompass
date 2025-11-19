import { Play, ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Link, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/molecules/Table';
import type { ProjectUrlsListProps } from '@/types/componentTypes';

export function ProjectUrlsList({
  urls,
  onAudit,
  isAuditing = false,
  currentAuditingUrlId,
}: ProjectUrlsListProps) {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">URLs to Analyze ({urls.length}/45)</h3>
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            No URLs configured for this project yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Go to Project Settings → URLs Management to add URLs to track.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url) => {
              const isCurrentlyAuditing = isAuditing && currentAuditingUrlId === url.id;

              return (
                <TableRow key={url.id}>
                  <TableCell className="font-medium">
                    {url.label || (
                      <span className="text-muted-foreground italic">No label</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <a
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline max-w-md"
                    >
                      <span className="truncate">
                        {url.url.length > 60 ? `${url.url.substring(0, 60)}...` : url.url}
                      </span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(url.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/dashboard/projects/${projectId}/url/${url.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isAuditing}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onAudit(url.id)}
                        disabled={isAuditing}
                      >
                        {isCurrentlyAuditing ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Audit
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
