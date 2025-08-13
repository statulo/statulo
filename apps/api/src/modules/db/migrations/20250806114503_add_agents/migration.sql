-- CreateTable
CREATE TABLE "check" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monitor_id" TEXT,
    "cost" INTEGER NOT NULL,
    "body" JSONB NOT NULL,

    CONSTRAINT "check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_registration" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,

    CONSTRAINT "agent_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connected_agent" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registration_id" TEXT NOT NULL,

    CONSTRAINT "connected_agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_assignment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agent_id" TEXT NOT NULL,
    "check_id" TEXT NOT NULL,

    CONSTRAINT "check_assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "check" ADD CONSTRAINT "check_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "monitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connected_agent" ADD CONSTRAINT "connected_agent_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "agent_registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_assignment" ADD CONSTRAINT "check_assignment_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "connected_agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_assignment" ADD CONSTRAINT "check_assignment_check_id_fkey" FOREIGN KEY ("check_id") REFERENCES "check"("id") ON DELETE CASCADE ON UPDATE CASCADE;
