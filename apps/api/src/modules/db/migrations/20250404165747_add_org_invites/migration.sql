-- CreateTable
CREATE TABLE "org_invite" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT,
    "org_id" TEXT NOT NULL,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "org_invite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "org_invite_code_key" ON "org_invite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "org_invite_email_org_id_key" ON "org_invite"("email", "org_id");

-- AddForeignKey
ALTER TABLE "org_invite" ADD CONSTRAINT "org_invite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_invite" ADD CONSTRAINT "org_invite_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
