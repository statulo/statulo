-- CreateTable
CREATE TABLE "status_page" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "status_page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_page_external_id_key" ON "status_page"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_page_name_org_id_key" ON "status_page"("name", "org_id");

-- AddForeignKey
ALTER TABLE "status_page" ADD CONSTRAINT "status_page_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
