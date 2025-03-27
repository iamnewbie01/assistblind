/*
  Warnings:

  - You are about to drop the column `touchIdHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `NavigationHistory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[publicKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NavigationHistory" DROP CONSTRAINT "NavigationHistory_userId_fkey";

-- DropIndex
DROP INDEX "User_touchIdHash_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "touchIdHash",
ADD COLUMN     "publicKey" TEXT NOT NULL;

-- DropTable
DROP TABLE "NavigationHistory";

-- CreateIndex
CREATE UNIQUE INDEX "User_publicKey_key" ON "User"("publicKey");
