import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { ProjectCard } from '@/components/molecules/ProjectCard';
import { ProjectModal } from '@/components/organisms/ProjectModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { useProject } from '@/hooks/useProject';
import { useTeam } from '@/hooks/useTeam';
import type { Project } from '@/types/project';

export function ProjectsDashboardPage() {
  const navigate = useNavigate();
  const { currentTeam, createTeam, isOwner } = useTeam();
  const { projects, isLoading, deleteProject } = useProject();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  
  const deleteConfirmation = useDeleteConfirmation<Project>({
    onConfirm: async (project) => {
      await deleteProject(project.id);
    },
    itemName: 'project',
  });

  const handleCreateFirstTeam = async () => {
    await handleAsyncOperation(
      async () => {
        await createTeam({
          name: 'My Team',
          description: 'Default team',
        });
      },
      {
        setLoading: setIsCreatingTeam,
        successMessage: 'Team created successfully',
      }
    );
  };

  const handleSelectProject = (project: Project) => {
    navigate(`/dashboard/projects/${project.id}`);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  if (!currentTeam) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">No Team Available</h2>
            <p className="text-muted-foreground mb-6">
              You need to create a team before you can manage projects.
            </p>
            <Button 
              onClick={handleCreateFirstTeam}
              disabled={isCreatingTeam}
              size="lg"
            >
              {isCreatingTeam ? 'Creating Team...' : 'Create Your First Team'}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your SEO projects and campaigns
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => ( 
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first SEO project
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={() => handleSelectProject(project)}
                onEdit={() => handleEditProject(project)}
                onDelete={isOwner ? () => deleteConfirmation.open(project) : undefined}
              />
            ))}
          </div>
        )}

        <ProjectModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          mode="create"
        />

        <ProjectModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(undefined);
          }}
          project={selectedProject}
          mode="edit"
        />

        <deleteConfirmation.DialogComponent
          title={deleteConfirmation.itemToDelete ? `Delete "${deleteConfirmation.itemToDelete.name}"?` : 'Delete Project?'}
          description="This will permanently delete the project and all its data."
        />
      </div>
    </DashboardLayout>
  );
}
