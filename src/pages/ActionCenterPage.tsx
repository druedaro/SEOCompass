import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { TaskList } from '@/components/organisms/TaskList';
import { CreateTaskModal } from '@/components/organisms/CreateTaskModal';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Task, taskService } from '@/services/taskService';
import { useProject } from '@/hooks/useProject';

export function ActionCenterPage() {
  const { currentProject } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const loadTasks = async () => {
    if (!currentProject?.id) return;

    setIsLoading(true);
    try {
      const data = await taskService.getTasksByProject(currentProject.id);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [currentProject?.id]);

  const handleTaskEdit = (task: Task) => {
    setTaskToEdit(task);
    setCreateModalOpen(true);
  };

  if (!currentProject) {
    return (
      <div className="container mx-auto py-8">
        <EmptyState
          icon={Plus}
          title="No Project Selected"
          description="Please select a project to view and manage tasks."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Action Center</h1>
          <p className="text-muted-foreground mt-1">
            Manage your SEO tasks and track progress
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No tasks yet"
          description="Create your first task to start tracking your SEO improvements and fixes."
          actionLabel="Create Task"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onTaskUpdate={loadTasks}
          onTaskEdit={handleTaskEdit}
        />
      )}

      <CreateTaskModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) setTaskToEdit(null);
        }}
        projectId={currentProject.id}
        onTaskCreated={loadTasks}
      />
    </div>
  );
}
