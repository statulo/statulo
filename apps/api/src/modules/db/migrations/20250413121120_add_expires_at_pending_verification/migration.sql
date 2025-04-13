/*
  Warnings:

  - Added the required column `expires_at` to the `pending_email_verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pending_email_verification" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
