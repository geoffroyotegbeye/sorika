export class CreatePayrollVariableDto {
  name: string;
  code: string;
  type: 'FIXED' | 'PERCENTAGE';
  value?: number;
  description?: string;
}
