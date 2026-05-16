/*
  Warnings:

  - You are about to drop the column `salary` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `BillItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `QuoteItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TaxRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "BillItem" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "ClientCompany" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "salary",
ADD COLUMN     "baseSalary" DOUBLE PRECISION,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "InventoryProduct" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "baseSalary" INTEGER,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "QuoteItem" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "TaxRate" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT;

-- CreateTable
CREATE TABLE "AdvanceRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseSalary" INTEGER,
    "maxPercentage" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "minDaysWorked" INTEGER NOT NULL DEFAULT 15,
    "allowedDaysOfMonth" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]::INTEGER[],
    "requireManagerApproval" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvanceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "paidAt" TIMESTAMP(3),
    "advanceRuleId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollVariable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "formula" TEXT,
    "description" TEXT,
    "companyId" TEXT NOT NULL,
    "positionId" TEXT,
    "employeeId" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "dependsOn" JSONB,

    CONSTRAINT "PayrollVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollPeriod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollEntry" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "payrollPeriodId" TEXT NOT NULL,
    "baseSalary" DOUBLE PRECISION NOT NULL,
    "grossSalary" DOUBLE PRECISION NOT NULL,
    "deductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "hoursWorked" DOUBLE PRECISION,
    "overtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "variables" JSONB NOT NULL DEFAULT '{}',
    "formula" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PayrollVariableEntries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "AdvanceRule_companyId_idx" ON "AdvanceRule"("companyId");

-- CreateIndex
CREATE INDEX "Advance_employeeId_idx" ON "Advance"("employeeId");

-- CreateIndex
CREATE INDEX "Advance_companyId_idx" ON "Advance"("companyId");

-- CreateIndex
CREATE INDEX "Advance_status_idx" ON "Advance"("status");

-- CreateIndex
CREATE INDEX "Advance_requestDate_idx" ON "Advance"("requestDate");

-- CreateIndex
CREATE INDEX "PayrollVariable_companyId_idx" ON "PayrollVariable"("companyId");

-- CreateIndex
CREATE INDEX "PayrollVariable_positionId_idx" ON "PayrollVariable"("positionId");

-- CreateIndex
CREATE INDEX "PayrollVariable_employeeId_idx" ON "PayrollVariable"("employeeId");

-- CreateIndex
CREATE INDEX "PayrollVariable_order_idx" ON "PayrollVariable"("order");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollVariable_companyId_code_key" ON "PayrollVariable"("companyId", "code");

-- CreateIndex
CREATE INDEX "PayrollPeriod_companyId_idx" ON "PayrollPeriod"("companyId");

-- CreateIndex
CREATE INDEX "PayrollPeriod_status_idx" ON "PayrollPeriod"("status");

-- CreateIndex
CREATE INDEX "PayrollPeriod_startDate_idx" ON "PayrollPeriod"("startDate");

-- CreateIndex
CREATE INDEX "PayrollEntry_employeeId_idx" ON "PayrollEntry"("employeeId");

-- CreateIndex
CREATE INDEX "PayrollEntry_payrollPeriodId_idx" ON "PayrollEntry"("payrollPeriodId");

-- CreateIndex
CREATE INDEX "PayrollEntry_companyId_idx" ON "PayrollEntry"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollEntry_employeeId_payrollPeriodId_key" ON "PayrollEntry"("employeeId", "payrollPeriodId");

-- CreateIndex
CREATE UNIQUE INDEX "_PayrollVariableEntries_AB_unique" ON "_PayrollVariableEntries"("A", "B");

-- CreateIndex
CREATE INDEX "_PayrollVariableEntries_B_index" ON "_PayrollVariableEntries"("B");

-- AddForeignKey
ALTER TABLE "AdvanceRule" ADD CONSTRAINT "AdvanceRule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advance" ADD CONSTRAINT "Advance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advance" ADD CONSTRAINT "Advance_advanceRuleId_fkey" FOREIGN KEY ("advanceRuleId") REFERENCES "AdvanceRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advance" ADD CONSTRAINT "Advance_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollVariable" ADD CONSTRAINT "PayrollVariable_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollVariable" ADD CONSTRAINT "PayrollVariable_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollVariable" ADD CONSTRAINT "PayrollVariable_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollPeriod" ADD CONSTRAINT "PayrollPeriod_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollEntry" ADD CONSTRAINT "PayrollEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollEntry" ADD CONSTRAINT "PayrollEntry_payrollPeriodId_fkey" FOREIGN KEY ("payrollPeriodId") REFERENCES "PayrollPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollEntry" ADD CONSTRAINT "PayrollEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollVariableEntries" ADD CONSTRAINT "_PayrollVariableEntries_A_fkey" FOREIGN KEY ("A") REFERENCES "PayrollEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayrollVariableEntries" ADD CONSTRAINT "_PayrollVariableEntries_B_fkey" FOREIGN KEY ("B") REFERENCES "PayrollVariable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
