import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAuditHistory, type AuditHistoryEntry } from '@/services/contentScraping';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import type { AuditHistoryChartProps } from '@/types/componentTypes';

export function AuditHistoryChart({ projectUrlId, urlLabel }: AuditHistoryChartProps) {
  const [history, setHistory] = useState<AuditHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [projectUrlId]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getAuditHistory(projectUrlId);
      setHistory(data);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = history.map((entry) => ({
    date: new Date(entry.created_at).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    }),
    Overall: entry.overall_score,
    Meta: entry.meta_score,
    Content: entry.content_score,
    Technical: entry.technical_score,
    'On-Page': entry.on_page_score,
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
          <CardDescription>{urlLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No audit history yet. Run your first audit to see trends.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit History</CardTitle>
        <CardDescription>{urlLabel} - Last {history.length} audits</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Overall" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="Meta" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Content" stroke="#ffc658" />
            <Line type="monotone" dataKey="Technical" stroke="#ff7c7c" />
            <Line type="monotone" dataKey="On-Page" stroke="#a28dd8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
