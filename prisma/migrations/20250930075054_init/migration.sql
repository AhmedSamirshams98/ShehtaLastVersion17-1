-- CreateTable
CREATE TABLE "public"."car_orders" (
    "id" SERIAL NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "car_brand" TEXT NOT NULL,
    "car_model" TEXT NOT NULL,
    "car_description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_orders_pkey" PRIMARY KEY ("id")
);
