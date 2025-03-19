/*
  Warnings:

  - Added the required column `posterUrl` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "posterUrl" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "videoUrl" TEXT NOT NULL DEFAULT '';
