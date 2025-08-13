/*
  Warnings:

  - You are about to drop the column `body` on the `check` table. All the data in the column will be lost.
  - Added the required column `correlationId` to the `check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_at` to the `check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `check` table without a default value. This is not possible if the table is not empty.
  - Made the column `monitor_id` on table `check` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "check" DROP CONSTRAINT "check_monitor_id_fkey";

-- AlterTable
ALTER TABLE "check" DROP COLUMN "body",
ADD COLUMN     "correlationId" TEXT NOT NULL,
ADD COLUMN     "end_at" TIMESTAMP(3),
ADD COLUMN     "start_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL,
ALTER COLUMN "monitor_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "check_assignment" ADD COLUMN     "end_at" TIMESTAMP(3),
ALTER COLUMN "start_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "connected_agent" ADD COLUMN     "total_cost" INTEGER NOT NULL DEFAULT 0;
