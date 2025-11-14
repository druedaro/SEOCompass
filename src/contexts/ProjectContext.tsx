import { createContext, useState, useEffect, ReactNode } from 'react';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types/domain';
import { useWorkspace } from '@/contexts/WorkspaceContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  setCurrentProject: (project: Project | null) => void;
  createProject: (name: string, description?: string, domain?: string) => Promise<Project>;
  updateProject: (projectId: string, updates: { name?: string; description?: string; domain?: string }) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { currentTeam } = useWorkspace();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async (teamId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectService.getProjectsByTeam(teamId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeam]);

  const createProject = async (name: string, description?: string, domain?: string): Promise<Project> => {
    if (!currentTeam) throw new Error('No team selected');

    try {
      setError(null);
      const newProject = await projectService.createProject(
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
      const updatedProject = await projectService.updateProject(projectId, updates);
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
      await projectService.deleteProject(projectId);
      
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
