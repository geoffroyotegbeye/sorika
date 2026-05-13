'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Invitation, Role } from '@/types/members';

interface InvitationsListProps {
  invitations: Invitation[];
  onCancel: (invitationId: string) => void;
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function InvitationsList({ invitations, onCancel }: InvitationsListProps) {
  if (invitations.length === 0) return null;

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Invitations en attente
          <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-600">({invitations.length})</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {invitations.map((inv) => (
            <div key={inv.id} className="flex items-center gap-4 px-6 py-4">
              {/* Email */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{inv.email}</p>
                <p className="text-xs text-slate-400 dark:text-slate-600">
                  Expire le {formatDate(inv.expiresAt)}
                </p>
              </div>

              {/* Badge rôle */}
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_BADGE[inv.role]}`}>
                {ROLE_LABEL[inv.role]}
              </span>

              {/* Annuler */}
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:border-red-300 shrink-0"
                onClick={() => onCancel(inv.id)}
              >
                Annuler
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
