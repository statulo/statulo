-- CreateTable
CREATE TABLE "monitor" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "monitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "http_monitor" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monitor_id" TEXT,
    "expected_keywords" TEXT[],
    "allowed_status_codes" TEXT[],

    CONSTRAINT "http_monitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "http_monitor_monitor_id_key" ON "http_monitor"("monitor_id");

-- AddForeignKey
ALTER TABLE "monitor" ADD CONSTRAINT "monitor_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "http_monitor" ADD CONSTRAINT "http_monitor_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
