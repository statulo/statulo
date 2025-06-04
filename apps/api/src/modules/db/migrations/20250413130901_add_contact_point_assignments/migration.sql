-- CreateTable
CREATE TABLE "monitor_contact_point_assignment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monitor_id" TEXT NOT NULL,
    "contact_point_id" TEXT NOT NULL,

    CONSTRAINT "monitor_contact_point_assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "monitor_contact_point_assignment" ADD CONSTRAINT "monitor_contact_point_assignment_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitor_contact_point_assignment" ADD CONSTRAINT "monitor_contact_point_assignment_contact_point_id_fkey" FOREIGN KEY ("contact_point_id") REFERENCES "contact_point"("id") ON DELETE CASCADE ON UPDATE CASCADE;
