-- DropForeignKey
ALTER TABLE "check_assignment" DROP CONSTRAINT "check_assignment_agent_id_fkey";

-- AlterTable
ALTER TABLE "check_assignment" ALTER COLUMN "agent_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "check_assignment" ADD CONSTRAINT "check_assignment_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "connected_agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
