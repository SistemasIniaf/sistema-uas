-- CreateTable
CREATE TABLE "semilleras" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "unidadId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semilleras_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "semilleras" ADD CONSTRAINT "semilleras_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "unidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
