-- CreateTable
CREATE TABLE "status_page_monitor" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_page_id" TEXT NOT NULL,
    "monitor_id" TEXT NOT NULL,

    CONSTRAINT "status_page_monitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_page_monitor_status_page_id_monitor_id_key" ON "status_page_monitor"("status_page_id", "monitor_id");

-- AddForeignKey
ALTER TABLE "status_page_monitor" ADD CONSTRAINT "status_page_monitor_status_page_id_fkey" FOREIGN KEY ("status_page_id") REFERENCES "status_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_page_monitor" ADD CONSTRAINT "status_page_monitor_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
