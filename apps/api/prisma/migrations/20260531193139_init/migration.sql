-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('administrador', 'responsable_almacen', 'solicitador', 'aprobador', 'auditor');

-- CreateTable
CREATE TABLE "unidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "unidadId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidad_sigla_key" ON "unidad"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usuario_key" ON "usuario"("usuario");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
