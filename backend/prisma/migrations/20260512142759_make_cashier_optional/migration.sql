-- DropForeignKey
ALTER TABLE "CashSession" DROP CONSTRAINT "CashSession_cashierId_fkey";

-- AlterTable
ALTER TABLE "CashSession" ALTER COLUMN "cashierId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CashSession" ADD CONSTRAINT "CashSession_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
