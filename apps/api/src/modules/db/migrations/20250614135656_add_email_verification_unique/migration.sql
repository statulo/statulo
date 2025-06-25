/*
  Warnings:

  - A unique constraint covering the columns `[email,code]` on the table `pending_email_verification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "pending_email_verification_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "pending_email_verification_email_code_key" ON "pending_email_verification"("email", "code");
