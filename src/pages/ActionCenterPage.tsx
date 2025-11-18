import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, List, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { TaskList } from '@/components/organisms/TaskList';
import { TaskFilters } from '@/components/organisms/TaskFilters';
import { Pagination } from '@/components/molecules/Pagination';
import { CreateTaskModal } from '@/components/organisms/CreateTaskModal';
import { EmptyState } from '@/components/molecules/EmptyState';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { TaskCalendar } from '@/components/organisms/TaskCalendar';
import { Task, getTasksByProject, TaskFilters as TaskFiltersType } from '@/services/task/taskService';
import { useProject } from '@/hooks/useProject';
import { showErrorToast } from '@/lib/toast';

export function ActionCenterPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, projects, setCurrentProject } = useProject();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');

  const activeFiltersCount = Object.keys(filters).length;

  useEffect(() => {
    if (projectId && projects.length > 0 && !currentProject) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projectId, projects, currentProject, setCurrentProject]);

  const loadTasks = async () => {
    if (!currentProject?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getTasksByProject(
        currentProject.id,
        filters,
        currentPage
      );
      setTasks(response.tasks);
      setTotalTasks(response.total);
      setTotalPages(response.totalPages);
    } catch {
      showErrorToast('Failed to load tasks. Please try again.');
      setTasks([]);
      setTotalTasks(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [currentProject?.id, filters, currentPage]);

  const handleFiltersChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTaskEdit = (task: Task) => {
    setTaskToEdit(task);
    setCreateModalOpen(true);
  };

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <EmptyState
            icon={Plus}
            title="No Project Selected"
            description="Please select a project to view and manage tasks."
          />
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading tasks...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
      {currentProject && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/dashboard/projects/${currentProject.id}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>
      )}
      
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

      <div className="flex items-center gap-2 mb-6">
        <Button
          variant={activeTab === 'list' ? 'default' : 'outline'}
          onClick={() => setActiveTab('list')}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          Tasks
        </Button>
        <Button
          variant={activeTab === 'calendar' ? 'default' : 'outline'}
          onClick={() => setActiveTab('calendar')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Calendar
        </Button>
      </div>

      {activeTab === 'list' && (
        <>
          <TaskFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {tasks.length === 0 ? (
            <EmptyState
              icon={Plus}
              title={activeFiltersCount > 0 ? "No tasks found" : "No tasks yet"}
              description={
                activeFiltersCount > 0
                  ? "No tasks match the selected filters. Try adjusting your filters."
                  : "Create your first task to start tracking your SEO improvements and fixes."
              }
              actionLabel={activeFiltersCount > 0 ? undefined : "Create Task"}
              onAction={activeFiltersCount > 0 ? undefined : () => setCreateModalOpen(true)}
            />
          ) : (
            <>
              <TaskList
                tasks={tasks}
                onTaskUpdate={loadTasks}
                onTaskEdit={handleTaskEdit}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalTasks}
                pageSize={15}
              />
            </>
          )}
        </>
      )}

      {activeTab === 'calendar' && (
        <TaskCalendar
          tasks={tasks}
          onTaskClick={handleTaskEdit}
          onDateSelect={() => {
            setCreateModalOpen(true);
          }}
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
        taskToEdit={taskToEdit}
      />
    </div>
    </DashboardLayout>
  );
}
