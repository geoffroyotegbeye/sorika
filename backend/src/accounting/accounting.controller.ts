import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Headers } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';
import { CreateTaxRateDto } from './dto/create-tax-rate.dto';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/create-supplier.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { CreateQuoteDto, UpdateQuoteDto } from './dto/quote.dto';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('companies/:companyId/accounting')
@UseGuards(PermissionGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  // ─── Stats ────────────────────────────────────────────────────────────────────

  @Get('stats')
  @RequirePermission('ACCOUNTING', 'READ')
  getStats(@Param('companyId') companyId: string) {
    return this.accountingService.getStats(companyId);
  }

  // ─── Tax Rates ────────────────────────────────────────────────────────────────

  @Get('tax-rates')
  @RequirePermission('ACCOUNTING', 'READ')
  listTaxRates(@Param('companyId') companyId: string) {
    return this.accountingService.listTaxRates(companyId);
  }

  @Post('tax-rates')
  @RequirePermission('ACCOUNTING', 'CREATE')
  createTaxRate(@Param('companyId') companyId: string, @Body() dto: CreateTaxRateDto) {
    return this.accountingService.createTaxRate(companyId, dto);
  }

  @Delete('tax-rates/:id')
  @RequirePermission('ACCOUNTING', 'DELETE')
  deleteTaxRate(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.accountingService.deleteTaxRate(companyId, id);
  }

  // ─── Suppliers ────────────────────────────────────────────────────────────────

  @Get('suppliers')
  @RequirePermission('ACCOUNTING', 'READ')
  listSuppliers(@Param('companyId') companyId: string) {
    return this.accountingService.listSuppliers(companyId);
  }

  @Post('suppliers')
  @RequirePermission('ACCOUNTING', 'CREATE')
  createSupplier(@Param('companyId') companyId: string, @Body() dto: CreateSupplierDto) {
    return this.accountingService.createSupplier(companyId, dto);
  }

  @Patch('suppliers/:id')
  @RequirePermission('ACCOUNTING', 'UPDATE')
  updateSupplier(@Param('companyId') companyId: string, @Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.accountingService.updateSupplier(companyId, id, dto);
  }

  @Delete('suppliers/:id')
  @RequirePermission('ACCOUNTING', 'DELETE')
  deleteSupplier(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.accountingService.deleteSupplier(companyId, id);
  }

  // ─── Quotes ───────────────────────────────────────────────────────────────────

  @Get('quotes')
  @RequirePermission('ACCOUNTING', 'READ')
  listQuotes(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.accountingService.listQuotes(companyId, { status, clientId });
  }

  @Get('quotes/:id')
  @RequirePermission('ACCOUNTING', 'READ')
  getQuote(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.accountingService.getQuote(companyId, id);
  }

  @Post('quotes')
  @RequirePermission('ACCOUNTING', 'CREATE')
  createQuote(@Param('companyId') companyId: string, @Body() dto: CreateQuoteDto) {
    return this.accountingService.createQuote(companyId, dto);
  }

  @Patch('quotes/:id')
  @RequirePermission('ACCOUNTING', 'UPDATE')
  updateQuote(@Param('companyId') companyId: string, @Param('id') id: string, @Body() dto: UpdateQuoteDto) {
    return this.accountingService.updateQuote(companyId, id, dto);
  }

  @Post('quotes/:id/convert')
  @RequirePermission('ACCOUNTING', 'CREATE')
  convertQuote(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.accountingService.convertQuoteToInvoice(companyId, id);
  }

  @Delete('quotes/:id')
  @RequirePermission('ACCOUNTING', 'DELETE')
  deleteQuote(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.accountingService.deleteQuote(companyId, id);
  }

  // ─── Invoices ─────────────────────────────────────────────────────────────────

  @Get('invoices')
  @RequirePermission('ACCOUNTING', 'READ')
  listInvoices(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.accountingService.listInvoices(companyId, { status, clientId });
  }

  @Get('invoices/:id')
  @RequirePermission('ACCOUNTING', 'READ')
  getInvoice(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.accountingService.getInvoice(companyId, id);
  }

  @Post('invoices')
  @RequirePermission('ACCOUNTING', 'CREATE')
  createInvoice(@Param('companyId') companyId: string, @Body() dto: CreateInvoiceDto) {
    return this.accountingService.createInvoice(companyId, dto);
  }

  @Patch('invoices/:id')
  @RequirePermission('ACCOUNTING', 'UPDATE')
  updateInvoice(@Param('companyId') companyId: string, @Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.accountingService.updateInvoice(companyId, id, dto);
  }

  @Delete('invoices/:id')
  @RequirePermission('ACCOUNTING', 'DELETE')
  deleteInvoice(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.accountingService.deleteInvoice(companyId, id);
  }

  // ─── Payments ─────────────────────────────────────────────────────────────────

  @Post('invoices/:id/payments')
  @RequirePermission('ACCOUNTING', 'CREATE')
  addPayment(@Param('companyId') companyId: string, @Param('id') invoiceId: string, @Body() dto: CreatePaymentDto) {
    return this.accountingService.addPayment(companyId, invoiceId, dto);
  }

  @Delete('invoices/:id/payments/:paymentId')
  @RequirePermission('ACCOUNTING', 'DELETE')
  deletePayment(
    @Param('companyId') companyId: string,
    @Param('id') invoiceId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.accountingService.deletePayment(companyId, invoiceId, paymentId);
  }

  // ─── Bills ────────────────────────────────────────────────────────────────────

  @Get('bills')
  @RequirePermission('ACCOUNTING', 'READ')
  listBills(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('supplierId') supplierId?: string,
  ) {
    return this.accountingService.listBills(companyId, { status, supplierId });
  }

  @Post('bills')
  @RequirePermission('ACCOUNTING', 'CREATE')
  createBill(@Param('companyId') companyId: string, @Body() dto: CreateBillDto) {
    return this.accountingService.createBill(companyId, dto);
  }

  @Patch('bills/:id')
  @RequirePermission('ACCOUNTING', 'UPDATE')
  updateBill(@Param('companyId') companyId: string, @Param('id') id: string, @Body() dto: UpdateBillDto) {
    return this.accountingService.updateBill(companyId, id, dto);
  }

  @Delete('bills/:id')
  @RequirePermission('ACCOUNTING', 'DELETE')
  deleteBill(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.accountingService.deleteBill(companyId, id);
  }
}
