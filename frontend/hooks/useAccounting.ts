'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type {
  Invoice, Quote, Bill, Supplier, TaxRate, Payment,
  AccountingStats, CreateInvoiceDto, CreateQuoteDto,
  CreateBillDto, CreatePaymentDto,
} from '@/types/accounting';

const BASE = (companyId: string) => `/companies/${companyId}/accounting`;

export function useAccounting(companyId: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [stats, setStats] = useState<AccountingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: any) {
      setError(err.message || 'Erreur');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Stats ────────────────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    const data = await wrap(() => api.get<AccountingStats>(`${BASE(companyId)}/stats`));
    setStats(data);
  }, [companyId, wrap]);

  // ─── Tax Rates ────────────────────────────────────────────────────────────────

  const fetchTaxRates = useCallback(async () => {
    const data = await wrap(() => api.get<TaxRate[]>(`${BASE(companyId)}/tax-rates`));
    setTaxRates(data);
  }, [companyId, wrap]);

  const createTaxRate = useCallback(async (dto: { name: string; rate: number; isDefault?: boolean }) => {
    await wrap(() => api.post(`${BASE(companyId)}/tax-rates`, dto));
    await fetchTaxRates();
  }, [companyId, wrap, fetchTaxRates]);

  const deleteTaxRate = useCallback(async (id: string) => {
    await wrap(() => api.del(`${BASE(companyId)}/tax-rates/${id}`));
    await fetchTaxRates();
  }, [companyId, wrap, fetchTaxRates]);

  // ─── Suppliers ────────────────────────────────────────────────────────────────

  const fetchSuppliers = useCallback(async () => {
    const data = await wrap(() => api.get<Supplier[]>(`${BASE(companyId)}/suppliers`));
    setSuppliers(data);
  }, [companyId, wrap]);

  const createSupplier = useCallback(async (dto: Partial<Supplier>) => {
    await wrap(() => api.post(`${BASE(companyId)}/suppliers`, dto));
    await fetchSuppliers();
  }, [companyId, wrap, fetchSuppliers]);

  const updateSupplier = useCallback(async (id: string, dto: Partial<Supplier>) => {
    await wrap(() => api.patch(`${BASE(companyId)}/suppliers/${id}`, dto));
    await fetchSuppliers();
  }, [companyId, wrap, fetchSuppliers]);

  const deleteSupplier = useCallback(async (id: string) => {
    await wrap(() => api.del(`${BASE(companyId)}/suppliers/${id}`));
    await fetchSuppliers();
  }, [companyId, wrap, fetchSuppliers]);

  // ─── Quotes ───────────────────────────────────────────────────────────────────

  const fetchQuotes = useCallback(async (filters?: { status?: string; clientId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.clientId) params.append('clientId', filters.clientId);
    const qs = params.toString();
    const data = await wrap(() => api.get<Quote[]>(`${BASE(companyId)}/quotes${qs ? `?${qs}` : ''}`));
    setQuotes(data);
  }, [companyId, wrap]);

  const createQuote = useCallback(async (dto: CreateQuoteDto) => {
    const data = await wrap(() => api.post<Quote>(`${BASE(companyId)}/quotes`, dto));
    await fetchQuotes();
    return data;
  }, [companyId, wrap, fetchQuotes]);

  const updateQuote = useCallback(async (id: string, dto: Partial<CreateQuoteDto> & { status?: string }) => {
    await wrap(() => api.patch(`${BASE(companyId)}/quotes/${id}`, dto));
    await fetchQuotes();
  }, [companyId, wrap, fetchQuotes]);

  const convertQuote = useCallback(async (id: string) => {
    const invoice = await wrap(() => api.post<Invoice>(`${BASE(companyId)}/quotes/${id}/convert`, {}));
    await fetchQuotes();
    await fetchInvoices();
    return invoice;
  }, [companyId, wrap]);

  const deleteQuote = useCallback(async (id: string) => {
    await wrap(() => api.del(`${BASE(companyId)}/quotes/${id}`));
    await fetchQuotes();
  }, [companyId, wrap, fetchQuotes]);

  // ─── Invoices ─────────────────────────────────────────────────────────────────

  const fetchInvoices = useCallback(async (filters?: { status?: string; clientId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.clientId) params.append('clientId', filters.clientId);
    const qs = params.toString();
    const data = await wrap(() => api.get<Invoice[]>(`${BASE(companyId)}/invoices${qs ? `?${qs}` : ''}`));
    setInvoices(data);
  }, [companyId, wrap]);

  const createInvoice = useCallback(async (dto: CreateInvoiceDto) => {
    const data = await wrap(() => api.post<Invoice>(`${BASE(companyId)}/invoices`, dto));
    await fetchInvoices();
    return data;
  }, [companyId, wrap, fetchInvoices]);

  const updateInvoice = useCallback(async (id: string, dto: Partial<CreateInvoiceDto> & { status?: string }) => {
    await wrap(() => api.patch(`${BASE(companyId)}/invoices/${id}`, dto));
    await fetchInvoices();
  }, [companyId, wrap, fetchInvoices]);

  const deleteInvoice = useCallback(async (id: string) => {
    await wrap(() => api.del(`${BASE(companyId)}/invoices/${id}`));
    await fetchInvoices();
  }, [companyId, wrap, fetchInvoices]);

  // ─── Payments ─────────────────────────────────────────────────────────────────

  const addPayment = useCallback(async (invoiceId: string, dto: CreatePaymentDto) => {
    await wrap(() => api.post(`${BASE(companyId)}/invoices/${invoiceId}/payments`, dto));
    await fetchInvoices();
  }, [companyId, wrap, fetchInvoices]);

  const deletePayment = useCallback(async (invoiceId: string, paymentId: string) => {
    await wrap(() => api.del(`${BASE(companyId)}/invoices/${invoiceId}/payments/${paymentId}`));
    await fetchInvoices();
  }, [companyId, wrap, fetchInvoices]);

  // ─── Bills ────────────────────────────────────────────────────────────────────

  const fetchBills = useCallback(async (filters?: { status?: string; supplierId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.supplierId) params.append('supplierId', filters.supplierId);
    const qs = params.toString();
    const data = await wrap(() => api.get<Bill[]>(`${BASE(companyId)}/bills${qs ? `?${qs}` : ''}`));
    setBills(data);
  }, [companyId, wrap]);

  const createBill = useCallback(async (dto: CreateBillDto) => {
    await wrap(() => api.post(`${BASE(companyId)}/bills`, dto));
    await fetchBills();
  }, [companyId, wrap, fetchBills]);

  const updateBill = useCallback(async (id: string, dto: Partial<CreateBillDto> & { status?: string }) => {
    await wrap(() => api.patch(`${BASE(companyId)}/bills/${id}`, dto));
    await fetchBills();
  }, [companyId, wrap, fetchBills]);

  const deleteBill = useCallback(async (id: string) => {
    await wrap(() => api.del(`${BASE(companyId)}/bills/${id}`));
    await fetchBills();
  }, [companyId, wrap, fetchBills]);

  return {
    // State
    invoices, quotes, bills, suppliers, taxRates, stats, loading, error,
    // Stats
    fetchStats,
    // Tax rates
    fetchTaxRates, createTaxRate, deleteTaxRate,
    // Suppliers
    fetchSuppliers, createSupplier, updateSupplier, deleteSupplier,
    // Quotes
    fetchQuotes, createQuote, updateQuote, convertQuote, deleteQuote,
    // Invoices
    fetchInvoices, createInvoice, updateInvoice, deleteInvoice,
    // Payments
    addPayment, deletePayment,
    // Bills
    fetchBills, createBill, updateBill, deleteBill,
  };
}
