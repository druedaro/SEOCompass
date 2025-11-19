import { Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/molecules/Table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/Card';


import type { ProjectUrlsTableProps } from '@/types/componentTypes';

export function ProjectUrlsTable({ urls, onDelete }: ProjectUrlsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Project URLs ({urls.length})</CardTitle>
                <CardDescription>
                    All URLs tracked in this project
                </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
                {urls.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No URLs added yet. Add your first URL above to start tracking.</p>
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
                            {urls.map((url) => (
                                <TableRow key={url.id}>
                                    <TableCell className="font-medium">
                                        {url.label || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={url.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:underline"
                                        >
                                            {url.url.length > 50 ? `${url.url.substring(0, 50)}...` : url.url}
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(url.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(url.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
