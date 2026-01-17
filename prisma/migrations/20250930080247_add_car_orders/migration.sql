/*
  Warnings:

  - You are about to drop the `car_orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."car_orders";

-- CreateTable
CREATE TABLE "public"."forms" (
    "id" SERIAL NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "car_brand" TEXT NOT NULL,
    "car_model" TEXT NOT NULL,
    "car_description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);
