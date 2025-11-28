import { createContext, useState, useEffect } from 'react';
import { getProjectsByTeam, createProject as createProjectService, updateProject as updateProjectService, deleteProject as deleteProjectService } from '@/services/project/projectService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import type { Project } from '@/types/project';
import type { ProjectContextType } from '@/types/context';
import { useTeam } from '@/hooks/useTeam';

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { currentTeam } = useTeam();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async (teamId: string) => {
    setError(null);
    await handleAsyncOperation(
      async () => {
        const data = await getProjectsByTeam(teamId);
        setProjects(data);
        
        if (currentProject) {
          const updatedProject = data.find(p => p.id === currentProject.id);
          setCurrentProject(updatedProject || null);
        }
      },
      {
        setLoading: setIsLoading,
        showSuccessToast: false,
        onError: (error: unknown) => {
          setError(error instanceof Error ? error.message : 'Failed to load projects');
        }
      }
    );
  };

  useEffect(() => {
    if (currentTeam) {
      loadProjects(currentTeam.id);
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [currentTeam]);

  const createProject = async (name: string, description?: string, domain?: string): Promise<Project> => {
    if (!currentTeam) throw new Error('No team selected');

    setError(null);
    let newProject: Project | null = null;
    const success = await handleAsyncOperation(
      async () => {
        newProject = await createProjectService(
          currentTeam.id,
          name,
          description,
          domain
        );
        setProjects((prev) => [newProject!, ...prev]);
      },
      {
        showSuccessToast: false,
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
          setError(errorMessage);
          throw error;
        }
      }
    );
    if (!success || !newProject) throw new Error('Failed to create project');
    return newProject;
  };

  const updateProject = async (
    projectId: string,
    updates: { name?: string; description?: string; domain?: string }
  ): Promise<Project> => {
    setError(null);
    let updatedProject: Project | null = null;
    const success = await handleAsyncOperation(
      async () => {
        updatedProject = await updateProjectService(projectId, updates);
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updatedProject! : p))
        );
        if (currentProject?.id === projectId) {
          setCurrentProject(updatedProject!);
        }
      },
      {
        showSuccessToast: false,
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
          setError(errorMessage);
          throw error;
        }
      }
    );
    if (!success || !updatedProject) throw new Error('Failed to update project');
    return updatedProject;
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    setError(null);
    const success = await handleAsyncOperation(
      async () => {
        await deleteProjectService(projectId);
        
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        if (currentProject?.id === projectId) {
          setCurrentProject(null);
        }
      },
      {
        showSuccessToast: false,
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
          setError(errorMessage);
          throw error;
        }
      }
    );
    if (!success) throw new Error('Failed to delete project');
  };

  const value: ProjectContextType = {
    projects,
    currentProject,
    isLoading,
    error,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
