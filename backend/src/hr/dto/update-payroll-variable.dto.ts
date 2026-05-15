import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollVariableDto } from './create-payroll-variable.dto';

export class UpdatePayrollVariableDto extends PartialType(CreatePayrollVariableDto) {}
