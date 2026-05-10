import { useState, useCallback } from 'react';
import type { Position, CreatePositionDto, UpdatePositionDto } from '@/types/hr';

export function usePositions(companyId: string) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPositions = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(`http://localhost:3001/companies/${companyId}/hr/positions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement');

      const data = await res.json();
      setPositions(data);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createPosition = useCallback(
    async (dto: CreatePositionDto) => {
      if (!companyId) return;

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(`http://localhost:3001/companies/${companyId}/hr/positions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la création');
      }

      const newPosition = await res.json();
      setPositions((prev) => [...prev, newPosition]);
      return newPosition;
    },
    [companyId]
  );

  const updatePosition = useCallback(
    async (positionId: string, dto: UpdatePositionDto) => {
      if (!companyId) return;

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(
        `http://localhost:3001/companies/${companyId}/hr/positions/${positionId}`,
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
      setPositions((prev) => prev.map((p) => (p.id === positionId ? updated : p)));
      return updated;
    },
    [companyId]
  );

  const deletePosition = useCallback(
    async (positionId: string) => {
      if (!companyId) return;

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const res = await fetch(
        `http://localhost:3001/companies/${companyId}/hr/positions/${positionId}`,
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

      setPositions((prev) => prev.filter((p) => p.id !== positionId));
    },
    [companyId]
  );

  return {
    positions,
    loading,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
  };
}
