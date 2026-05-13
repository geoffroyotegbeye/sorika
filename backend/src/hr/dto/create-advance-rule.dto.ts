export class CreateAdvanceRuleDto {
  name: string;
  description?: string;
  maxPercentage?: number;
  minDaysWorked?: number;
  allowedDaysOfMonth?: number[];
  requireManagerApproval?: boolean;
}
