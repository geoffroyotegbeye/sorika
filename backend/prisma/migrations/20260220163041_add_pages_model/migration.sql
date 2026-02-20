-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "elements" JSONB NOT NULL DEFAULT '[]',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "isHomePage" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Page_companyId_isHomePage_idx" ON "Page"("companyId", "isHomePage");

-- CreateIndex
CREATE UNIQUE INDEX "Page_companyId_slug_key" ON "Page"("companyId", "slug");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
