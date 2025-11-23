import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/Card';
import type { AuditHistoryChartProps } from '@/types/componentTypes';

export function AuditHistoryChart({ auditHistory, urlLabel, isLoading }: AuditHistoryChartProps) {
  const chartData = auditHistory.map((entry) => ({
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

  if (auditHistory.length === 0) {
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
        <CardDescription>{urlLabel} - Last {auditHistory.length} audits</CardDescription>
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
