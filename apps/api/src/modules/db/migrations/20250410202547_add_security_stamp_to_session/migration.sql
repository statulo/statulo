/*
  Warnings:

  - Added the required column `securityStamp` to the `user_session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_session" ADD COLUMN     "securityStamp" TEXT NOT NULL;
