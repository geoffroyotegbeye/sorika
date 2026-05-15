export class CreateAdvanceRuleDto {
  name: string;
  description?: string;
  baseSalary?: number;
  maxPercentage?: number;
  minDaysWorked?: number;
  allowedDaysOfMonth?: number[];
  requireManagerApproval?: boolean;
}
