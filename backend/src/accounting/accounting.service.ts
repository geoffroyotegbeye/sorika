import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxRateDto } from './dto/create-tax-rate.dto';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/create-supplier.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { CreateQuoteDto, UpdateQuoteDto } from './dto/quote.dto';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class AccountingService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async getCompanyCurrency(companyId: string): Promise<string> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { currency: true },
    });
    return company?.currency ?? 'XOF';
  }

  private async generateInvoiceNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.invoice.count({ where: { companyId } });
    return `FAC-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  private async generateQuoteNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.quote.count({ where: { companyId } });
    return `DEV-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  private async computeItemTotals(
    items: { quantity: number; unitPrice: number; taxRateId?: string }[],
    companyId: string,
  ) {
    let subtotal = 0;
    let taxAmount = 0;

    const computed = await Promise.all(
      items.map(async (item, idx) => {
        const lineSubtotal = item.quantity * item.unitPrice;
        let lineTax = 0;

        if (item.taxRateId) {
          const taxRate = await this.prisma.taxRate.findFirst({
            where: { id: item.taxRateId, companyId },
          });
          if (taxRate) {
            lineTax = lineSubtotal * (taxRate.rate / 100);
          }
        }

        subtotal += lineSubtotal;
        taxAmount += lineTax;

        return {
          description: (item as any).description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRateId: item.taxRateId ?? null,
          taxAmount: lineTax,
          total: lineSubtotal + lineTax,
          position: (item as any).position ?? idx,
        };
      }),
    );

    return { computed, subtotal, taxAmount, total: subtotal + taxAmount };
  }

  // ─── Tax Rates ────────────────────────────────────────────────────────────────

  async listTaxRates(companyId: string) {
    return this.prisma.taxRate.findMany({
      where: { companyId },
      orderBy: { rate: 'asc' },
    });
  }

  async createTaxRate(companyId: string, dto: CreateTaxRateDto) {
    if (dto.isDefault) {
      await this.prisma.taxRate.updateMany({
        where: { companyId, isDefault: true },
        data: { isDefault: false },
      });
    }
    return this.prisma.taxRate.create({ data: { ...dto, companyId } });
  }

  async deleteTaxRate(companyId: string, id: string) {
    const taxRate = await this.prisma.taxRate.findFirst({ where: { id, companyId } });
    if (!taxRate) throw new NotFoundException('Taux de TVA introuvable');
    return this.prisma.taxRate.delete({ where: { id } });
  }

  // ─── Suppliers ────────────────────────────────────────────────────────────────

  async listSuppliers(companyId: string) {
    return this.prisma.supplier.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });
  }

  async createSupplier(companyId: string, dto: CreateSupplierDto) {
    return this.prisma.supplier.create({ data: { ...dto, companyId } });
  }

  async updateSupplier(companyId: string, id: string, dto: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findFirst({ where: { id, companyId } });
    if (!supplier) throw new NotFoundException('Fournisseur introuvable');
    return this.prisma.supplier.update({ where: { id }, data: dto });
  }

  async deleteSupplier(companyId: string, id: string) {
    const supplier = await this.prisma.supplier.findFirst({ where: { id, companyId } });
    if (!supplier) throw new NotFoundException('Fournisseur introuvable');
    return this.prisma.supplier.delete({ where: { id } });
  }

  // ─── Quotes ───────────────────────────────────────────────────────────────────

  async listQuotes(companyId: string, filters?: { status?: string; clientId?: string }) {
    const where: any = { companyId };
    if (filters?.status) where.status = filters.status;
    if (filters?.clientId) where.clientId = filters.clientId;

    return this.prisma.quote.findMany({
      where,
      include: {
        client: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getQuote(companyId: string, id: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, companyId },
      include: {
        client: true,
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
        invoice: true,
      },
    });
    if (!quote) throw new NotFoundException('Devis introuvable');
    return quote;
  }

  async createQuote(companyId: string, dto: CreateQuoteDto) {
    const currency = await this.getCompanyCurrency(companyId);
    const quoteNumber = await this.generateQuoteNumber(companyId);
    const { computed, subtotal, taxAmount, total } = await this.computeItemTotals(dto.items, companyId);

    return this.prisma.quote.create({
      data: {
        quoteNumber,
        currency,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        clientId: dto.clientId ?? null,
        clientName: dto.clientName ?? null,
        clientEmail: dto.clientEmail ?? null,
        clientAddress: dto.clientAddress ?? null,
        notes: dto.notes ?? null,
        termsAndConditions: dto.termsAndConditions ?? null,
        subtotal,
        taxAmount,
        total,
        companyId,
        items: { create: computed },
      },
      include: {
        client: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
      },
    });
  }

  async updateQuote(companyId: string, id: string, dto: UpdateQuoteDto) {
    const quote = await this.prisma.quote.findFirst({ where: { id, companyId } });
    if (!quote) throw new NotFoundException('Devis introuvable');
    if (quote.status === 'CONVERTED') throw new BadRequestException('Devis déjà converti en facture');

    const data: any = {};
    if (dto.status) data.status = dto.status;
    if (dto.expiryDate) data.expiryDate = new Date(dto.expiryDate);
    if (dto.clientId !== undefined) data.clientId = dto.clientId;
    if (dto.clientName !== undefined) data.clientName = dto.clientName;
    if (dto.clientEmail !== undefined) data.clientEmail = dto.clientEmail;
    if (dto.clientAddress !== undefined) data.clientAddress = dto.clientAddress;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.termsAndConditions !== undefined) data.termsAndConditions = dto.termsAndConditions;

    if (dto.items) {
      const { computed, subtotal, taxAmount, total } = await this.computeItemTotals(dto.items, companyId);
      data.subtotal = subtotal;
      data.taxAmount = taxAmount;
      data.total = total;
      await this.prisma.quoteItem.deleteMany({ where: { quoteId: id } });
      await this.prisma.quoteItem.createMany({ data: computed.map(item => ({ ...item, quoteId: id })) });
    }

    return this.prisma.quote.update({
      where: { id },
      data,
      include: {
        client: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
      },
    });
  }

  async convertQuoteToInvoice(companyId: string, quoteId: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id: quoteId, companyId },
      include: { items: true },
    });
    if (!quote) throw new NotFoundException('Devis introuvable');
    if (quote.status === 'CONVERTED') throw new BadRequestException('Devis déjà converti');

    const invoiceNumber = await this.generateInvoiceNumber(companyId);

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        currency: quote.currency,
        issueDate: new Date(),
        clientId: quote.clientId,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        clientAddress: quote.clientAddress,
        notes: quote.notes,
        termsAndConditions: quote.termsAndConditions,
        subtotal: quote.subtotal,
        taxAmount: quote.taxAmount,
        total: quote.total,
        amountDue: quote.total,
        quoteId: quote.id,
        companyId,
        items: {
          create: quote.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRateId: item.taxRateId,
            taxAmount: item.taxAmount,
            total: item.total,
            position: item.position,
          })),
        },
      },
      include: {
        client: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
      },
    });

    await this.prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'CONVERTED', convertedAt: new Date() },
    });

    return invoice;
  }

  async deleteQuote(companyId: string, id: string) {
    const quote = await this.prisma.quote.findFirst({ where: { id, companyId } });
    if (!quote) throw new NotFoundException('Devis introuvable');
    return this.prisma.quote.delete({ where: { id } });
  }

  // ─── Invoices ─────────────────────────────────────────────────────────────────

  async listInvoices(companyId: string, filters?: { status?: string; clientId?: string }) {
    const where: any = { companyId };
    if (filters?.status) where.status = filters.status;
    if (filters?.clientId) where.clientId = filters.clientId;

    return this.prisma.invoice.findMany({
      where,
      include: {
        client: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoice(companyId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, companyId },
      include: {
        client: true,
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
        payments: true,
        quote: true,
      },
    });
    if (!invoice) throw new NotFoundException('Facture introuvable');
    return invoice;
  }

  async createInvoice(companyId: string, dto: CreateInvoiceDto) {
    const currency = await this.getCompanyCurrency(companyId);
    const invoiceNumber = await this.generateInvoiceNumber(companyId);
    const { computed, subtotal, taxAmount, total } = await this.computeItemTotals(dto.items, companyId);

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        currency,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        clientId: dto.clientId ?? null,
        clientName: dto.clientName ?? null,
        clientEmail: dto.clientEmail ?? null,
        clientAddress: dto.clientAddress ?? null,
        notes: dto.notes ?? null,
        termsAndConditions: dto.termsAndConditions ?? null,
        quoteId: dto.quoteId ?? null,
        subtotal,
        taxAmount,
        total,
        amountDue: total,
        companyId,
        items: { create: computed },
      },
      include: {
        client: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
        payments: true,
      },
    });
  }

  async updateInvoice(companyId: string, id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id, companyId } });
    if (!invoice) throw new NotFoundException('Facture introuvable');
    if (invoice.status === 'PAID') throw new BadRequestException('Facture déjà payée');

    const data: any = {};
    if (dto.status) data.status = dto.status;
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    if (dto.clientId !== undefined) data.clientId = dto.clientId;
    if (dto.clientName !== undefined) data.clientName = dto.clientName;
    if (dto.clientEmail !== undefined) data.clientEmail = dto.clientEmail;
    if (dto.clientAddress !== undefined) data.clientAddress = dto.clientAddress;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.termsAndConditions !== undefined) data.termsAndConditions = dto.termsAndConditions;

    if (dto.items) {
      const { computed, subtotal, taxAmount, total } = await this.computeItemTotals(dto.items, companyId);
      data.subtotal = subtotal;
      data.taxAmount = taxAmount;
      data.total = total;
      data.amountDue = total - invoice.amountPaid;
      await this.prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
      await this.prisma.invoiceItem.createMany({ data: computed.map(item => ({ ...item, invoiceId: id })) });
    }

    return this.prisma.invoice.update({
      where: { id },
      data,
      include: {
        client: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
        payments: true,
      },
    });
  }

  async deleteInvoice(companyId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id, companyId } });
    if (!invoice) throw new NotFoundException('Facture introuvable');
    return this.prisma.invoice.delete({ where: { id } });
  }

  // ─── Payments ─────────────────────────────────────────────────────────────────

  async addPayment(companyId: string, invoiceId: string, dto: CreatePaymentDto) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id: invoiceId, companyId } });
    if (!invoice) throw new NotFoundException('Facture introuvable');
    if (invoice.status === 'PAID') throw new BadRequestException('Facture déjà entièrement payée');

    const currency = await this.getCompanyCurrency(companyId);
    const remaining = invoice.total - invoice.amountPaid;
    if (dto.amount > remaining + 0.01) {
      throw new BadRequestException(`Montant supérieur au restant dû (${remaining})`);
    }

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        amount: dto.amount,
        currency,
        method: dto.method ?? 'CASH',
        reference: dto.reference ?? null,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
        notes: dto.notes ?? null,
        companyId,
      },
    });

    const newAmountPaid = invoice.amountPaid + dto.amount;
    const newAmountDue = invoice.total - newAmountPaid;
    const newStatus = newAmountDue <= 0.01 ? 'PAID' : 'PARTIAL';

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        amountPaid: newAmountPaid,
        amountDue: Math.max(0, newAmountDue),
        status: newStatus,
        paidAt: newStatus === 'PAID' ? new Date() : null,
      },
    });

    return payment;
  }

  async deletePayment(companyId: string, invoiceId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, invoiceId, companyId },
    });
    if (!payment) throw new NotFoundException('Paiement introuvable');

    await this.prisma.payment.delete({ where: { id: paymentId } });

    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (invoice) {
      const newAmountPaid = invoice.amountPaid - payment.amount;
      const newAmountDue = invoice.total - newAmountPaid;
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: Math.max(0, newAmountPaid),
          amountDue: newAmountDue,
          status: newAmountPaid <= 0 ? 'SENT' : 'PARTIAL',
          paidAt: null,
        },
      });
    }

    return { success: true };
  }

  // ─── Bills ────────────────────────────────────────────────────────────────────

  async listBills(companyId: string, filters?: { status?: string; supplierId?: string }) {
    const where: any = { companyId };
    if (filters?.status) where.status = filters.status;
    if (filters?.supplierId) where.supplierId = filters.supplierId;

    return this.prisma.bill.findMany({
      where,
      include: {
        supplier: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBill(companyId: string, dto: CreateBillDto) {
    const currency = await this.getCompanyCurrency(companyId);
    const { computed, subtotal, taxAmount, total } = await this.computeItemTotals(dto.items, companyId);

    return this.prisma.bill.create({
      data: {
        billNumber: dto.billNumber ?? null,
        currency,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        supplierId: dto.supplierId ?? null,
        supplierName: dto.supplierName ?? null,
        notes: dto.notes ?? null,
        subtotal,
        taxAmount,
        total,
        companyId,
        items: { create: computed },
      },
      include: {
        supplier: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
      },
    });
  }

  async updateBill(companyId: string, id: string, dto: UpdateBillDto) {
    const bill = await this.prisma.bill.findFirst({ where: { id, companyId } });
    if (!bill) throw new NotFoundException('Charge introuvable');

    const data: any = {};
    if (dto.status) data.status = dto.status;
    if (dto.billNumber !== undefined) data.billNumber = dto.billNumber;
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    if (dto.supplierId !== undefined) data.supplierId = dto.supplierId;
    if (dto.supplierName !== undefined) data.supplierName = dto.supplierName;
    if (dto.notes !== undefined) data.notes = dto.notes;

    if (dto.items) {
      const { computed, subtotal, taxAmount, total } = await this.computeItemTotals(dto.items, companyId);
      data.subtotal = subtotal;
      data.taxAmount = taxAmount;
      data.total = total;
      await this.prisma.billItem.deleteMany({ where: { billId: id } });
      await this.prisma.billItem.createMany({ data: computed.map(item => ({ ...item, billId: id })) });
    }

    return this.prisma.bill.update({
      where: { id },
      data,
      include: {
        supplier: { select: { id: true, name: true } },
        items: { include: { taxRate: true }, orderBy: { position: 'asc' } },
      },
    });
  }

  async deleteBill(companyId: string, id: string) {
    const bill = await this.prisma.bill.findFirst({ where: { id, companyId } });
    if (!bill) throw new NotFoundException('Charge introuvable');
    return this.prisma.bill.delete({ where: { id } });
  }

  // ─── Dashboard Stats ──────────────────────────────────────────────────────────

  async getStats(companyId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      invoices,
      bills,
      overdueInvoices,
      monthRevenue,
      yearRevenue,
      pendingBills,
    ] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { companyId, status: { not: 'CANCELLED' } },
        select: { total: true, amountDue: true, status: true },
      }),
      this.prisma.bill.findMany({
        where: { companyId, status: { not: 'CANCELLED' } },
        select: { total: true, status: true },
      }),
      this.prisma.invoice.count({
        where: { companyId, status: 'OVERDUE' },
      }),
      this.prisma.invoice.aggregate({
        where: { companyId, status: 'PAID', paidAt: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      this.prisma.invoice.aggregate({
        where: { companyId, status: 'PAID', paidAt: { gte: startOfYear } },
        _sum: { total: true },
      }),
      this.prisma.bill.count({
        where: { companyId, status: 'PENDING' },
      }),
    ]);

    const totalReceivable = invoices
      .filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED')
      .reduce((sum, i) => sum + i.amountDue, 0);

    const totalPayable = bills
      .filter(b => b.status !== 'PAID' && b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + b.total, 0);

    return {
      monthRevenue: monthRevenue._sum.total ?? 0,
      yearRevenue: yearRevenue._sum.total ?? 0,
      totalReceivable,
      totalPayable,
      overdueInvoices,
      pendingBills,
    };
  }
}
