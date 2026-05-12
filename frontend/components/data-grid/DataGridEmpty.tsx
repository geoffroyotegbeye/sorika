"use client";
import { LucideIcon, Inbox } from "lucide-react";

interface Props {
  message?: string;
  icon?: LucideIcon;
}

export function DataGridEmpty({ message = "Aucune donnée", icon: Icon = Inbox }: Props) {
  return (
    <tr>
      <td colSpan={999}>
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Icon className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
}
