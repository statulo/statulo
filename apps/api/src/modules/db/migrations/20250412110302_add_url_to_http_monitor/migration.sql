/*
  Warnings:

  - Added the required column `url` to the `http_monitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "http_monitor" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "monitor" ADD COLUMN     "name" TEXT;
