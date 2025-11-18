import { createContext, useState, useEffect } from 'react';
import { getProjectsByTeam, createProject as createProjectService, updateProject as updateProjectService, deleteProject as deleteProjectService } from '@/services/project';
import type { Project } from '@/types/project';
import type { ProjectContextType } from '@/types/context';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { currentTeam } = useWorkspace();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async (teamId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProjectsByTeam(teamId);
      setProjects(data);
      
      if (currentProject) {
        const updatedProject = data.find(p => p.id === currentProject.id);
        setCurrentProject(updatedProject || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
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

    try {
      setError(null);
      const newProject = await createProjectService(
        currentTeam.id,
        name,
        description,
        domain
      );
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    }
  };

  const updateProject = async (
    projectId: string,
    updates: { name?: string; description?: string; domain?: string }
  ): Promise<Project> => {
    try {
      setError(null);
      const updatedProject = await updateProjectService(projectId, updates);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      setError(null);
      await deleteProjectService(projectId);
      
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw err;
    }
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
