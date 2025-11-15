import { useState } from 'react';
import { format } from 'date-fns';
import { MoreVertical, Pencil, Trash2, CheckCircle2, PlayCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/Table';
import { Badge } from '@/components/atoms/Badge';
import { PriorityBadge } from '@/components/molecules/PriorityBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/molecules/DropdownMenu';
import { Button } from '@/components/atoms/Button';
import { DeleteConfirmationDialog } from '@/components/molecules/DeleteConfirmationDialog';
import { Task, deleteTask, startTask, completeTask } from '@/services/taskService';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { STATUS_CONFIG } from '@/constants/tasks';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  onTaskEdit: (task: Task) => void;
}

export function TaskList({ tasks, onTaskUpdate, onTaskEdit }: TaskListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { teamMembers } = useWorkspace();

  const getAssigneeName = (userId: string | null) => {
    if (!userId) return 'Unassigned';
    const member = teamMembers.find(m => m.user_id === userId);
    return member?.profile?.full_name || member?.profile?.email || 'Unknown';
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      onTaskUpdate();
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: 'in_progress' | 'completed') => {
    if (newStatus === 'in_progress') {
      await startTask(task.id);
    } else {
      await completeTask(task.id);
    }
    onTaskUpdate();
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No tasks found. Create your first task to get started.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_CONFIG[task.status].className}>
                    {STATUS_CONFIG[task.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getAssigneeName(task.assigned_to)}
                  </span>
                </TableCell>
                <TableCell>
                  {task.due_date ? (
                    <span
                      className={
                        new Date(task.due_date) < new Date() &&
                        task.status !== 'completed'
                          ? 'text-red-600 font-medium'
                          : ''
                      }
                    >
                      {format(new Date(task.due_date), 'MMM d, yyyy')}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.audit_reference ? (
                    <span className="text-xs text-muted-foreground">
                      {task.audit_reference}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {task.status === 'todo' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(task, 'in_progress')}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Task
                        </DropdownMenuItem>
                      )}
                      {task.status !== 'completed' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(task, 'completed')}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Complete
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onTaskEdit(task)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(task)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}
