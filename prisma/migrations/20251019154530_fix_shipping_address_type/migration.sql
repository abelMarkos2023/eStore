/*
  Warnings:

  - Changed the type of `shippingAddress` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "shippingAddress",
ADD COLUMN     "shippingAddress" JSON NOT NULL;
