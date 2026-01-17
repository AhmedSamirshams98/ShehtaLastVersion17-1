/*
  Warnings:

  - Made the column `condition` on table `cars` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `cars` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."cars" ALTER COLUMN "condition" SET NOT NULL,
ALTER COLUMN "year" SET NOT NULL;
