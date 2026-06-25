/*
  Warnings:

  - The values [CUSTOMER,OWNER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `needPasswordChange` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "customer" DROP CONSTRAINT "customer_user_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "needPasswordChange",
ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "customer";
