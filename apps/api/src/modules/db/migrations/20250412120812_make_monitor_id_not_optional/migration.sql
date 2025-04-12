/*
  Warnings:

  - Made the column `monitor_id` on table `http_monitor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "http_monitor" ALTER COLUMN "monitor_id" SET NOT NULL;
