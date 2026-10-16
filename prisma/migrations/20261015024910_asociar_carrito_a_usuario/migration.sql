/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId]` on the table `Carrito` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Carrito" ADD COLUMN     "usuarioId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Carrito_usuarioId_key" ON "Carrito"("usuarioId");

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
