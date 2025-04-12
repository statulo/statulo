/*
  Warnings:

  - Added the required column `interval` to the `http_monitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "http_monitor" ADD COLUMN     "interval" JSONB NOT NULL;
