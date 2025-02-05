/*
  Warnings:

  - Added the required column `status_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('TEXT', 'VIDEO', 'PHOTO', 'LINK', 'QUOTE');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "announcement" TEXT DEFAULT '',
ADD COLUMN     "author" TEXT DEFAULT '',
ADD COLUMN     "original_post_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "photo_src" TEXT DEFAULT '',
ADD COLUMN     "status_id" TEXT NOT NULL,
ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "url" TEXT DEFAULT '',
ADD COLUMN     "video_url" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "post_statuses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_statuses_name_key" ON "post_statuses"("name");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "post_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
