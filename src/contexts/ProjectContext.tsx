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
  }, [currentTeam]);

  useEffect(() => {
    if (!currentTeam) return;

    const subscription = projectService.subscribeToProjects(
      currentTeam.id,
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setProjects((prev) => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setProjects((prev) =>
            prev.map((p) => (p.id === payload.new.id ? payload.new : p))
          );
          if (currentProject?.id === payload.new.id) {
            setCurrentProject(payload.new);
          }
        } else if (payload.eventType === 'DELETE') {
          setProjects((prev) => prev.filter((p) => p.id !== payload.old.id));
          if (currentProject?.id === payload.old.id) {
            setCurrentProject(null);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [currentTeam, currentProject]);

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
