/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorite_postId_userId_key" ON "Favorite"("postId", "userId");
