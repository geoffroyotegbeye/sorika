'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type {
  Member,
  Invitation,
  MembersListResponse,
  Role,
  Permissions,
  CreateMemberDto,
  CreateMemberResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
  PredefinedRole,
  UpdatePermissionsDto,
} from '@/types/members';

interface UseMembersState {
  members: Member[];
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
}

interface InviteMemberDto {
  email: string;
  role: Role;
  permissions?: Permissions;
}

interface UpdateMemberDto {
  role?: Role;
  permissions?: Permissions;
}

export function useMembers(companyId: string) {
  const [state, setState] = useState<UseMembersState>({
    members: [],
    invitations: [],
    loading: false,
    error: null,
  });

  const fetchMembers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.get<MembersListResponse>(`/companies/${companyId}/members`);
      setState({ members: data.members, invitations: data.invitations, loading: false, error: null });
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Erreur lors du chargement' }));
    }
  }, [companyId]);

  const inviteMember = useCallback(async (dto: InviteMemberDto) => {
    await api.post(`/companies/${companyId}/members/invite`, dto);
    await fetchMembers();
  }, [companyId, fetchMembers]);

  const updateMember = useCallback(async (membershipId: string, dto: UpdateMemberDto) => {
    await api.patch(`/companies/${companyId}/members/${membershipId}`, dto);
    await fetchMembers();
  }, [companyId, fetchMembers]);

  const removeMember = useCallback(async (membershipId: string) => {
    await api.del(`/companies/${companyId}/members/${membershipId}`);
    await fetchMembers();
  }, [companyId, fetchMembers]);

  const cancelInvitation = useCallback(async (invitationId: string) => {
    await api.del(`/companies/${companyId}/members/invitations/${invitationId}`);
    await fetchMembers();
  }, [companyId, fetchMembers]);

  const createMember = useCallback(async (dto: CreateMemberDto): Promise<CreateMemberResponse> => {
    const result = await api.post<CreateMemberResponse>(`/companies/${companyId}/members`, dto);
    await fetchMembers();
    return result;
  }, [companyId, fetchMembers]);

  const resetPassword = useCallback(async (membershipId: string, dto: ResetPasswordDto): Promise<ResetPasswordResponse> => {
    const result = await api.post<ResetPasswordResponse>(`/companies/${companyId}/members/${membershipId}/reset-password`, dto);
    await fetchMembers();
    return result;
  }, [companyId, fetchMembers]);

  const listRoles = useCallback(async (): Promise<PredefinedRole[]> => {
    return api.get<PredefinedRole[]>(`/companies/${companyId}/members/roles`);
  }, [companyId]);

  const updatePermissions = useCallback(async (membershipId: string, dto: UpdatePermissionsDto) => {
    await api.patch(`/companies/${companyId}/members/${membershipId}/permissions`, dto);
    await fetchMembers();
  }, [companyId, fetchMembers]);

  return {
    ...state,
    fetchMembers,
    inviteMember,
    createMember,
    updateMember,
    removeMember,
    cancelInvitation,
    resetPassword,
    listRoles,
    updatePermissions,
  };
}
