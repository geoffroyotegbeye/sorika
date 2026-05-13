import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { HRService } from './hr.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateAdvanceDto } from './dto/create-advance.dto';
import { UpdateAdvanceDto } from './dto/update-advance.dto';
import { CreateAdvanceRuleDto } from './dto/create-advance-rule.dto';
import { CreatePayrollVariableDto } from './dto/create-payroll-variable.dto';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';

@Controller('companies/:companyId/hr')
@UseGuards(PermissionGuard)
export class HRController {
  constructor(private readonly hrService: HRService) {}

  // ─── Employees ───────────────────────────────────────────────────────────────

  @Get('employees')
  @RequirePermission('HR', 'READ')
  listEmployees(@Param('companyId') companyId: string) {
    return this.hrService.listEmployees(companyId);
  }

  @Post('employees')
  @RequirePermission('HR', 'CREATE')
  createEmployee(@Param('companyId') companyId: string, @Body() dto: CreateEmployeeDto) {
    return this.hrService.createEmployee(companyId, dto);
  }

  @Patch('employees/:id')
  @RequirePermission('HR', 'UPDATE')
  updateEmployee(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.hrService.updateEmployee(companyId, id, dto);
  }

  @Delete('employees/:id')
  @RequirePermission('HR', 'DELETE')
  deleteEmployee(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.deleteEmployee(companyId, id);
  }

  @Get('employees/export')
  @RequirePermission('HR', 'READ')
  async exportEmployees(@Param('companyId') companyId: string, @Res() res: Response) {
    const csv = await this.hrService.exportEmployeesToCSV(companyId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
    res.send(csv);
  }

  @Post('employees/import')
  @RequirePermission('HR', 'CREATE')
  async importEmployees(
    @Param('companyId') companyId: string,
    @Body() data: { csvContent: string },
  ) {
    return this.hrService.importEmployeesFromCSV(companyId, data.csvContent);
  }

  @Patch('employees/:id/link-user')
  linkEmployeeToUser(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Req() req: any,
  ) {
    // OWNER uniquement — vérifié dans le service via membership
    return this.hrService.linkEmployeeToUser(companyId, id, userId);
  }

  // ─── Departments ─────────────────────────────────────────────────────────────

  @Get('departments')
  @RequirePermission('HR', 'READ')
  listDepartments(@Param('companyId') companyId: string) {
    return this.hrService.listDepartments(companyId);
  }

  @Post('departments')
  @RequirePermission('HR', 'CREATE')
  createDepartment(@Param('companyId') companyId: string, @Body() dto: CreateDepartmentDto) {
    return this.hrService.createDepartment(companyId, dto);
  }

  @Patch('departments/:id')
  @RequirePermission('HR', 'UPDATE')
  updateDepartment(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.hrService.updateDepartment(companyId, id, dto);
  }

  @Delete('departments/:id')
  @RequirePermission('HR', 'DELETE')
  deleteDepartment(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.deleteDepartment(companyId, id);
  }

  // ─── Postes/Fonctions ────────────────────────────────────────────────────────

  @Get('positions')
  @RequirePermission('HR', 'READ')
  listPositions(@Param('companyId') companyId: string) {
    return this.hrService.listPositions(companyId);
  }

  @Post('positions')
  @RequirePermission('HR', 'CREATE')
  createPosition(@Param('companyId') companyId: string, @Body() dto: any) {
    return this.hrService.createPosition(companyId, dto);
  }

  @Patch('positions/:id')
  @RequirePermission('HR', 'UPDATE')
  updatePosition(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.hrService.updatePosition(companyId, id, dto);
  }

  @Delete('positions/:id')
  @RequirePermission('HR', 'DELETE')
  deletePosition(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.deletePosition(companyId, id);
  }

  // ─── Congés & Absences ───────────────────────────────────────────────────────

  @Get('leave-types')
  @RequirePermission('HR', 'READ')
  async listLeaveTypes(@Param('companyId') companyId: string) {
    // Initialiser les types par défaut si nécessaire
    await this.hrService.initializeDefaultLeaveTypes(companyId);
    return this.hrService.listLeaveTypes(companyId);
  }

  @Post('leave-types')
  @RequirePermission('HR', 'CREATE')
  createLeaveType(@Param('companyId') companyId: string, @Body() dto: any) {
    return this.hrService.createLeaveType(companyId, dto);
  }

  @Delete('leave-types/:leaveTypeId')
  @RequirePermission('HR', 'DELETE')
  deleteLeaveType(
    @Param('companyId') companyId: string,
    @Param('leaveTypeId') leaveTypeId: string,
  ) {
    return this.hrService.deleteLeaveType(companyId, leaveTypeId);
  }

  @Get('leaves')
  @RequirePermission('HR', 'READ')
  listLeaves(@Param('companyId') companyId: string) {
    return this.hrService.listLeaves(companyId);
  }

  @Post('employees/:employeeId/leaves')
  @RequirePermission('HR', 'CREATE')
  createLeave(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
    @Body() dto: any,
  ) {
    return this.hrService.createLeave(companyId, employeeId, dto);
  }

  @Patch('leaves/:leaveId/status')
  @RequirePermission('HR', 'UPDATE')
  updateLeaveStatus(
    @Param('companyId') companyId: string,
    @Param('leaveId') leaveId: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    const approverId = req.headers['x-user-id'];
    return this.hrService.updateLeaveStatus(companyId, leaveId, dto, approverId);
  }

  @Delete('leaves/:leaveId')
  @RequirePermission('HR', 'DELETE')
  deleteLeave(
    @Param('companyId') companyId: string,
    @Param('leaveId') leaveId: string,
  ) {
    return this.hrService.deleteLeave(companyId, leaveId);
  }

  // ─── Documents Employés ──────────────────────────────────────────────────────

  @Get('employees/:employeeId/documents')
  @RequirePermission('HR', 'READ')
  listEmployeeDocuments(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.hrService.listEmployeeDocuments(companyId, employeeId);
  }

  @Post('employees/:employeeId/documents')
  @RequirePermission('HR', 'CREATE')
  createEmployeeDocument(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    const uploadedBy = req.headers['x-user-id'];
    return this.hrService.createEmployeeDocument(companyId, employeeId, dto, uploadedBy);
  }

  @Delete('documents/:documentId')
  @RequirePermission('HR', 'DELETE')
  deleteEmployeeDocument(
    @Param('companyId') companyId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.hrService.deleteEmployeeDocument(companyId, documentId);
  }

  // ─── Notes de Frais ──────────────────────────────────────────────────────────

  @Get('expenses')
  @RequirePermission('HR', 'READ')
  listExpenses(@Param('companyId') companyId: string) {
    return this.hrService.listExpenses(companyId);
  }

  @Post('employees/:employeeId/expenses')
  @RequirePermission('HR', 'CREATE')
  createExpense(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
    @Body() dto: any,
  ) {
    return this.hrService.createExpense(companyId, employeeId, dto);
  }

  @Patch('expenses/:expenseId/status')
  @RequirePermission('HR', 'UPDATE')
  updateExpenseStatus(
    @Param('companyId') companyId: string,
    @Param('expenseId') expenseId: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    const approverId = req.headers['x-user-id'];
    return this.hrService.updateExpenseStatus(companyId, expenseId, dto, approverId);
  }

  @Delete('expenses/:expenseId')
  @RequirePermission('HR', 'DELETE')
  deleteExpense(
    @Param('companyId') companyId: string,
    @Param('expenseId') expenseId: string,
  ) {
    return this.hrService.deleteExpense(companyId, expenseId);
  }

  // ─── Attendance (Présences) ──────────────────────────────────────────────────

  @Get('attendances')
  @RequirePermission('HR', 'READ')
  listAttendances(
    @Param('companyId') companyId: string,
    @Req() req: any,
  ) {
    const { startDate, endDate, employeeId } = req.query;
    return this.hrService.listAttendances(companyId, startDate, endDate, employeeId);
  }

  @Post('employees/:employeeId/attendances')
  @RequirePermission('HR', 'CREATE')
  createAttendance(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
    @Body() dto: any,
  ) {
    return this.hrService.createAttendance(companyId, employeeId, dto);
  }

  @Patch('attendances/:id')
  @RequirePermission('HR', 'UPDATE')
  updateAttendance(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.hrService.updateAttendance(companyId, id, dto);
  }

  @Delete('attendances/:id')
  @RequirePermission('HR', 'DELETE')
  deleteAttendance(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.deleteAttendance(companyId, id);
  }

  @Post('employees/:employeeId/quick-check')
  @RequirePermission('HR', 'CREATE')
  quickCheckIn(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.hrService.quickCheckIn(companyId, employeeId);
  }

  // ─── Affectations (Historique) ──────────────────────────────────────────────

  @Get('assignments')
  @RequirePermission('HR', 'READ')
  listAssignments(@Param('companyId') companyId: string, @Req() req: any) {
    const { employeeId } = req.query;
    return this.hrService.listAssignments(companyId, employeeId);
  }

  @Get('employees/:employeeId/assignments')
  @RequirePermission('HR', 'READ')
  listEmployeeAssignments(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.hrService.listAssignments(companyId, employeeId);
  }

  @Post('employees/:employeeId/assignments')
  @RequirePermission('HR', 'CREATE')
  createAssignment(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    const createdBy = req.headers['x-user-id'];
    return this.hrService.createAssignment(companyId, employeeId, dto, createdBy);
  }

  @Delete('assignments/:assignmentId')
  @RequirePermission('HR', 'DELETE')
  deleteAssignment(
    @Param('companyId') companyId: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.hrService.deleteAssignment(companyId, assignmentId);
  }

  // ─── Dashboard Stats ─────────────────────────────────────────────────────────

  @Get('stats')
  @RequirePermission('HR', 'READ')
  getHRStats(@Param('companyId') companyId: string) {
    return this.hrService.getHRStats(companyId);
  }

  // ─── Acomptes (Advances) ─────────────────────────────────────────────────────────

  @Get('advances')
  @RequirePermission('HR', 'READ')
  listAdvances(@Param('companyId') companyId: string) {
    return this.hrService.listAdvances(companyId);
  }

  @Post('advances')
  @RequirePermission('HR', 'CREATE')
  createAdvance(@Param('companyId') companyId: string, @Body() dto: CreateAdvanceDto) {
    return this.hrService.createAdvance(companyId, dto);
  }

  @Patch('advances/:id')
  @RequirePermission('HR', 'UPDATE')
  updateAdvance(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAdvanceDto,
  ) {
    return this.hrService.updateAdvance(companyId, id, dto);
  }

  @Delete('advances/:id')
  @RequirePermission('HR', 'DELETE')
  deleteAdvance(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.deleteAdvance(companyId, id);
  }

  @Get('advance-rules')
  @RequirePermission('HR', 'READ')
  listAdvanceRules(@Param('companyId') companyId: string) {
    return this.hrService.listAdvanceRules(companyId);
  }

  @Post('advance-rules')
  @RequirePermission('HR', 'CREATE')
  createAdvanceRule(@Param('companyId') companyId: string, @Body() dto: CreateAdvanceRuleDto) {
    return this.hrService.createAdvanceRule(companyId, dto);
  }

  @Patch('advance-rules/:id')
  @RequirePermission('HR', 'UPDATE')
  updateAdvanceRule(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateAdvanceRuleDto>,
  ) {
    return this.hrService.updateAdvanceRule(companyId, id, dto);
  }

  @Delete('advance-rules/:id')
  @RequirePermission('HR', 'DELETE')
  deleteAdvanceRule(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.deleteAdvanceRule(companyId, id);
  }

  // ─── Paie (Payroll) ─────────────────────────────────────────────────────────────

  @Get('payroll-periods')
  @RequirePermission('HR', 'READ')
  listPayrollPeriods(@Param('companyId') companyId: string) {
    return this.hrService.listPayrollPeriods(companyId);
  }

  @Post('payroll-periods')
  @RequirePermission('HR', 'CREATE')
  createPayrollPeriod(@Param('companyId') companyId: string, @Body() dto: CreatePayrollPeriodDto) {
    return this.hrService.createPayrollPeriod(companyId, dto);
  }

  @Patch('payroll-periods/:id')
  @RequirePermission('HR', 'UPDATE')
  updatePayrollPeriod(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreatePayrollPeriodDto>,
  ) {
    return this.hrService.updatePayrollPeriod(companyId, id, dto);
  }

  @Delete('payroll-periods/:id')
  @RequirePermission('HR', 'DELETE')
  deletePayrollPeriod(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.deletePayrollPeriod(companyId, id);
  }

  @Get('payroll-variables')
  @RequirePermission('HR', 'READ')
  listPayrollVariables(@Param('companyId') companyId: string) {
    return this.hrService.listPayrollVariables(companyId);
  }

  @Post('payroll-variables')
  @RequirePermission('HR', 'CREATE')
  createPayrollVariable(@Param('companyId') companyId: string, @Body() dto: CreatePayrollVariableDto) {
    return this.hrService.createPayrollVariable(companyId, dto);
  }

  @Patch('payroll-variables/:id')
  @RequirePermission('HR', 'UPDATE')
  updatePayrollVariable(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreatePayrollVariableDto>,
  ) {
    return this.hrService.updatePayrollVariable(companyId, id, dto);
  }

  @Delete('payroll-variables/:id')
  @RequirePermission('HR', 'DELETE')
  deletePayrollVariable(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.deletePayrollVariable(companyId, id);
  }

  @Post('payroll-periods/:id/calculate')
  @RequirePermission('HR', 'UPDATE')
  calculatePayroll(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.calculatePayroll(companyId, id);
  }

  @Post('payroll-periods/:id/validate')
  @RequirePermission('HR', 'UPDATE')
  validatePayroll(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.hrService.validatePayroll(companyId, id);
  }

  @Get('payroll-entries')
  @RequirePermission('HR', 'READ')
  listPayrollEntries(@Param('companyId') companyId: string, @Req() req: any) {
    const { periodId } = req.query;
    return this.hrService.listPayrollEntries(companyId, periodId);
  }
}
