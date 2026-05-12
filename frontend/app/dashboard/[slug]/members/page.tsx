'use client';

import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { toast } from 'sonner';
import { useMembers } from '@/hooks/useMembers';
import { MembersList } from '@/components/members/MembersList';
import { InvitationsList } from '@/components/members/InvitationsList';
import { AddMemberDialog } from '@/components/members/AddMemberDialog';
import { EditPermissionsDialog } from '@/components/members/EditPermissionsDialog';
import { ResetPasswordDialog } from '@/components/members/ResetPasswordDialog';
import { PermissionsDialog } from '@/components/members/PermissionsDialog';
import type { Member, PredefinedRole } from '@/types/members';

export default function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [addOpen, setAddOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [resetMember, setResetMember] = useState<Member | null>(null);
  const [permissionsMember, setPermissionsMember] = useState<Member | null>(null);
  const [roles, setRoles] = useState<PredefinedRole[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setCurrentUserId(parsed.user?.id ?? '');
    const currentCompany = parsed.companies?.find((c: any) => c.slug === slug);
    setCompany(currentCompany ?? null);
  }, [slug]);

  const {
    members,
    invitations,
    loading,
    fetchMembers,
    createMember,
    updateMember,
    removeMember,
    cancelInvitation,
    resetPassword,
    listRoles,
    updatePermissions,
  } = useMembers(company?.id ?? '');

  useEffect(() => {
    if (company?.id) {
      fetchMembers();
      listRoles().then(setRoles).catch(console.error);
    }
  }, [company?.id]);

  const handleRemove = async (membershipId: string) => {
    try {
      await removeMember(membershipId);
      toast.success('Membre retiré');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du retrait');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitation(invitationId);
      toast.success('Invitation annulée');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'annulation');
    }
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Membres</h1>
        <Button onClick={() => setAddOpen(true)}>
          Ajouter un membre
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Members list */}
      {!loading && (
        <MembersList
          members={members}
          currentUserId={currentUserId}
          onEdit={(member) => setEditMember(member)}
          onRemove={handleRemove}
          onResetPassword={(member) => setResetMember(member)}
          onManagePermissions={(member) => setPermissionsMember(member)}
        />
      )}

      {/* Invitations list */}
      {!loading && invitations.length > 0 && (
        <InvitationsList
          invitations={invitations}
          onCancel={handleCancelInvitation}
        />
      )}

      {/* Dialogs */}
      <AddMemberDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={createMember}
      />

      <EditPermissionsDialog
        open={editMember !== null}
        onOpenChange={(open) => { if (!open) setEditMember(null); }}
        member={editMember}
        onUpdate={updateMember}
      />

      <ResetPasswordDialog
        open={resetMember !== null}
        onOpenChange={(open) => { if (!open) setResetMember(null); }}
        member={resetMember}
        onReset={resetPassword}
      />

      <PermissionsDialog
        open={permissionsMember !== null}
        onOpenChange={(open) => { if (!open) setPermissionsMember(null); }}
        member={permissionsMember}
        roles={roles}
        onUpdate={updatePermissions}
      />
    </div>
  );
}
