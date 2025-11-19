import { Filter, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/Select';
import type { TaskStatus } from '@/services/task/taskService';
import { STATUS_OPTIONS } from '@/constants/tasks';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import type { TaskFiltersProps } from '@/types/componentTypes';

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const { teamMembers } = useWorkspace();
  const hasActiveFilters = Object.keys(filters).length > 0;

  const handleStatusChange = (status: string) => {
    if (status === 'all') {
      const newFilters = { ...filters };
      delete newFilters.status;
      onFiltersChange(newFilters);
    } else {
      onFiltersChange({ ...filters, status: status as TaskStatus });
    }
  };

  const handleAssigneeChange = (assignee: string) => {
    if (assignee === 'all') {
      const newFilters = { ...filters };
      delete newFilters.assigned_to;
      onFiltersChange(newFilters);
    } else if (assignee === 'unassigned') {
      onFiltersChange({ ...filters, assigned_to: null });
    } else {
      onFiltersChange({ ...filters, assigned_to: assignee });
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="flex gap-1">
        <Button
          variant={!filters.status ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusChange('all')}
        >
          All
        </Button>
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={filters.status === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm">Assigned to:</Label>
        <Select
          value={
            filters.assigned_to === undefined ? 'all' :
            filters.assigned_to === null ? 'unassigned' :
            filters.assigned_to
          }
          onValueChange={handleAssigneeChange}
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="All members" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All members</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.user_id} value={member.user_id}>
                {member.profile?.full_name || member.profile?.email || 'Unknown'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange({})}
          className="ml-auto"
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
