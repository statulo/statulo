-- CreateTable
CREATE TABLE "contact_point" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "contact_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_contact_point" (
    "id" TEXT NOT NULL,
    "contact_point_id" TEXT NOT NULL,
    "org_member_id" TEXT NOT NULL,

    CONSTRAINT "member_contact_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discord_contact_point" (
    "id" TEXT NOT NULL,
    "contact_point_id" TEXT NOT NULL,
    "webhook_url" TEXT NOT NULL,

    CONSTRAINT "discord_contact_point_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_contact_point_contact_point_id_key" ON "member_contact_point"("contact_point_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_contact_point_org_member_id_key" ON "member_contact_point"("org_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "discord_contact_point_contact_point_id_key" ON "discord_contact_point"("contact_point_id");

-- AddForeignKey
ALTER TABLE "contact_point" ADD CONSTRAINT "contact_point_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_contact_point" ADD CONSTRAINT "member_contact_point_contact_point_id_fkey" FOREIGN KEY ("contact_point_id") REFERENCES "contact_point"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_contact_point" ADD CONSTRAINT "member_contact_point_org_member_id_fkey" FOREIGN KEY ("org_member_id") REFERENCES "org_member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_contact_point" ADD CONSTRAINT "discord_contact_point_contact_point_id_fkey" FOREIGN KEY ("contact_point_id") REFERENCES "contact_point"("id") ON DELETE CASCADE ON UPDATE CASCADE;
