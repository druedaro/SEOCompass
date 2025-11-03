import { createContext, useState, useEffect, ReactNode } from 'react';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types/domain';
import { useWorkspace } from '@/context/WorkspaceContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  setCurrentProject: (project: Project | null) => void;
  createProject: (name: string, description?: string) => Promise<Project>;
  updateProject: (projectId: string, updates: { name?: string; description?: string }) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { currentTeam } = useWorkspace();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load projects function
  const loadProjects = async (teamId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectService.getProjectsByTeam(teamId);
      setProjects(data);
      
      // If we have a current project, refresh it
      if (currentProject) {
        const updatedProject = data.find(p => p.id === currentProject.id);
        setCurrentProject(updatedProject || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load projects when team changes
  useEffect(() => {
    if (currentTeam) {
      loadProjects(currentTeam.id);
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeam]);

  // Subscribe to real-time updates
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

  const createProject = async (name: string, description?: string): Promise<Project> => {
    if (!currentTeam) throw new Error('No team selected');

    try {
      setError(null);
      const newProject = await projectService.createProject(
        currentTeam.id,
        name,
        description
      );
      // Real-time subscription will handle adding to list
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    }
  };

  const updateProject = async (
    projectId: string,
    updates: { name?: string; description?: string }
  ): Promise<Project> => {
    try {
      setError(null);
      const updatedProject = await projectService.updateProject(projectId, updates);
      // Real-time subscription will handle updating the list
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
      // Real-time subscription will handle removing from list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw err;
    }
  };

  const refreshProjects = async () => {
    if (currentTeam) {
      await loadProjects(currentTeam.id);
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
    refreshProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
