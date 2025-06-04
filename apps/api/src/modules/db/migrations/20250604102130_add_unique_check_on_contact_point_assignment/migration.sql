/*
  Warnings:

  - A unique constraint covering the columns `[monitor_id,contact_point_id]` on the table `monitor_contact_point_assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "monitor_contact_point_assignment_monitor_id_contact_point_i_key" ON "monitor_contact_point_assignment"("monitor_id", "contact_point_id");
