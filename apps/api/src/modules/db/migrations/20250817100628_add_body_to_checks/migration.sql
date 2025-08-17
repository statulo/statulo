/*
  Warnings:

  - Added the required column `body` to the `check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interval` to the `check` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "check" ADD COLUMN     "body" JSONB NOT NULL,
ADD COLUMN     "interval" INTEGER NOT NULL;
