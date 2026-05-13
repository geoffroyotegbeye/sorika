'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { KeyRound, Shield } from 'lucide-react';
import type { Member, Role } from '@/types/members';

interface MembersListProps {
  members: Member[];
  currentUserId: string;
  onEdit: (member: Member) => void;
  onRemove: (membershipId: string) => void;
  onResetPassword: (member: Member) => void;
  onManagePermissions: (member: Member) => void;
}

const ROLE_BADGE: Record<Role, string> = {
  OWNER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  STAFF: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const ROLE_LABEL: Record<Role, string> = {
  OWNER: 'Propriétaire',
  ADMIN: 'Admin',
  STAFF: 'Staff',
};

export function MembersList({ members, currentUserId, onEdit, onRemove, onResetPassword, onManagePermissions }: MembersListProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Membres</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {members.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-600 text-center py-8">Aucun membre</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((member) => {
              const isOwner = member.role === 'OWNER';
              const isSelf = member.userId === currentUserId;
              const disabled = isOwner || isSelf;
              const displayName =
                member.firstName || member.lastName
                  ? `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim()
                  : member.email;

              return (
                <div key={member.id} className="flex items-center gap-4 px-6 py-4">
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {displayName[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>

                  {/* Nom / email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-600 truncate">{member.email}</p>
                  </div>

                  {/* Badge rôle */}
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_BADGE[member.role]}`}>
                    {ROLE_LABEL[member.role]}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onManagePermissions(member)}
                      title="Gérer les permissions"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      onClick={() => onEdit(member)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      onClick={() => onResetPassword(member)}
                      title="Réinitialiser le mot de passe"
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                      onClick={() => onRemove(member.id)}
                    >
                      Retirer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
