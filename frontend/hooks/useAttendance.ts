import { useState, useCallback } from 'react';
import type { Attendance, CreateAttendanceDto, UpdateAttendanceDto, HRStats } from '@/types/attendance';

export function useAttendance(companyId: string) {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [stats, setStats] = useState<HRStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendances = useCallback(async (startDate?: string, endDate?: string, employeeId?: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      let url = `http://localhost:3001/companies/${companyId}/hr/attendances`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (employeeId) params.append('employeeId', employeeId);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des présences');
      const data = await response.json();
      setAttendances(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createAttendance = useCallback(
    async (attendanceData: CreateAttendanceDto) => {
      if (!companyId) return;

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(
        `http://localhost:3001/companies/${companyId}/hr/attendances`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
          body: JSON.stringify(attendanceData),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newAttendance = await res.json();
      setAttendances((prev) => [newAttendance, ...prev]);
      return newAttendance;
    },
    [companyId]
  );

  const updateAttendance = useCallback(
    async (attendanceId: string, dto: UpdateAttendanceDto) => {
      if (!companyId) return;

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(
        `http://localhost:3001/companies/${companyId}/hr/attendances/${attendanceId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
          body: JSON.stringify(dto),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour');
      }

      const updated = await res.json();
      setAttendances((prev) => prev.map((a) => (a.id === attendanceId ? updated : a)));
      return updated;
    },
    [companyId]
  );

  const deleteAttendance = useCallback(
    async (attendanceId: string) => {
      if (!companyId) return;

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(
        `http://localhost:3001/companies/${companyId}/hr/attendances/${attendanceId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la suppression');
      }

      setAttendances((prev) => prev.filter((a) => a.id !== attendanceId));
    },
    [companyId]
  );

  const quickCheckIn = useCallback(
    async (employeeId: string) => {
      if (!companyId) return;

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(
        `http://localhost:3001/companies/${companyId}/hr/employees/${employeeId}/quick-check`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': parsed.user.id,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors du pointage');
      }

      const attendance = await res.json();
      setAttendances((prev) => {
        const existing = prev.find((a) => a.id === attendance.id);
        if (existing) {
          return prev.map((a) => (a.id === attendance.id ? attendance : a));
        }
        return [attendance, ...prev];
      });
      return attendance;
    },
    [companyId]
  );

  const fetchStats = useCallback(async () => {
    if (!companyId) return;

    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(`http://localhost:3001/companies/${companyId}/hr/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement des statistiques');

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [companyId]);

  return {
    attendances,
    stats,
    loading,
    fetchAttendances,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    quickCheckIn,
    fetchStats,
  };
}

