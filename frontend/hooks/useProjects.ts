import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Project, Task, TimeEntry, ProjectStats } from '@/types/projects';

export function useProjects(companyId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(false);

  // ============================================
  // PROJETS
  // ============================================

  const fetchProjects = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await api.get<Project[]>(
        `/companies/${companyId}/projects`,
      );
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchStats = useCallback(async () => {
    if (!companyId) return;
    try {
      const data = await api.get<ProjectStats>(
        `/companies/${companyId}/projects/stats`,
      );
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [companyId]);

  const createProject = useCallback(
    async (data: Partial<Project>) => {
      if (!companyId) return;
      try {
        const newProject = await api.post<Project>(
          `/companies/${companyId}/projects`,
          data,
        );
        setProjects((prev) => [newProject, ...prev]);
        return newProject;
      } catch (error) {
        console.error('Error creating project:', error);
        throw error;
      }
    },
    [companyId],
  );

  const updateProject = useCallback(
    async (projectId: string, data: Partial<Project>) => {
      if (!companyId) return;
      try {
        const updated = await api.put<Project>(
          `/companies/${companyId}/projects/${projectId}`,
          data,
        );
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updated : p)),
        );
        return updated;
      } catch (error) {
        console.error('Error updating project:', error);
        throw error;
      }
    },
    [companyId],
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      if (!companyId) return;
      try {
        await api.del(`/companies/${companyId}/projects/${projectId}`);
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
    },
    [companyId],
  );

  // ============================================
  // TÂCHES
  // ============================================

  const fetchAllTasks = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await api.get<Task[]>(
        `/companies/${companyId}/projects/all-tasks`,
      );
      setTasks(data);
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchTasks = useCallback(
    async (projectId: string) => {
      if (!companyId) return;
      setLoading(true);
      try {
        const data = await api.get<Task[]>(
          `/companies/${companyId}/projects/${projectId}/tasks`,
        );
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    },
    [companyId],
  );

  const createTask = useCallback(
    async (projectId: string, data: Partial<Task>) => {
      if (!companyId) return;
      try {
        const newTask = await api.post<Task>(
          `/companies/${companyId}/projects/${projectId}/tasks`,
          data,
        );
        setTasks((prev) => [...prev, newTask]);
        return newTask;
      } catch (error) {
        console.error('Error creating task:', error);
        throw error;
      }
    },
    [companyId],
  );

  const updateTask = useCallback(
    async (projectId: string, taskId: string, data: Partial<Task>) => {
      if (!companyId) return;
      try {
        const updated = await api.put<Task>(
          `/companies/${companyId}/projects/${projectId}/tasks/${taskId}`,
          data,
        );
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        return updated;
      } catch (error) {
        console.error('Error updating task:', error);
        throw error;
      }
    },
    [companyId],
  );

  const deleteTask = useCallback(
    async (projectId: string, taskId: string) => {
      if (!companyId) return;
      try {
        await api.del(
          `/companies/${companyId}/projects/${projectId}/tasks/${taskId}`,
        );
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    },
    [companyId],
  );

  // ============================================
  // SUIVI DU TEMPS
  // ============================================

  const fetchTimeEntries = useCallback(
    async (projectId: string) => {
      if (!companyId) return;
      try {
        const data = await api.get<TimeEntry[]>(
          `/companies/${companyId}/projects/${projectId}/time-entries`,
        );
        setTimeEntries(data);
      } catch (error) {
        console.error('Error fetching time entries:', error);
      }
    },
    [companyId],
  );

  const createTimeEntry = useCallback(
    async (projectId: string, data: Partial<TimeEntry>) => {
      if (!companyId) return;
      try {
        const newEntry = await api.post<TimeEntry>(
          `/companies/${companyId}/projects/${projectId}/time-entries`,
          data,
        );
        setTimeEntries((prev) => [newEntry, ...prev]);
        return newEntry;
      } catch (error) {
        console.error('Error creating time entry:', error);
        throw error;
      }
    },
    [companyId],
  );

  return {
    projects,
    tasks,
    timeEntries,
    stats,
    loading,
    fetchProjects,
    fetchStats,
    createProject,
    updateProject,
    deleteProject,
    fetchAllTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTimeEntries,
    createTimeEntry,
  };
}
