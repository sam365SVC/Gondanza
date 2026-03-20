-- CreateEnum
CREATE TYPE "ZonaGeografica" AS ENUM ('LA_PAZ', 'EL_ALTO');

-- CreateEnum
CREATE TYPE "TipoDeInstitucion" AS ENUM ('SALUD', 'POLICIAL', 'LEGAL_JUSTICIA', 'DEFENSORIA', 'ONG_FUNDACION');

-- CreateTable
CREATE TABLE "Usuario" (
    "Id" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Apellido" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(100) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Password" (
    "Id" SERIAL NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "IdUsuario" INTEGER NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Institucion" (
    "Id" SERIAL NOT NULL,
    "NombreInstitucion" TEXT NOT NULL,
    "TipoInstitucion" "TipoDeInstitucion" NOT NULL,

    CONSTRAINT "Institucion_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "Id" SERIAL NOT NULL,
    "Longitud" DOUBLE PRECISION NOT NULL,
    "Latitud" DOUBLE PRECISION NOT NULL,
    "Zona" "ZonaGeografica" NOT NULL,
    "IdInstitucion" INTEGER NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Email_key" ON "Usuario"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_IdUsuario_key" ON "Password"("IdUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "Ubicacion_IdInstitucion_key" ON "Ubicacion"("IdInstitucion");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_IdUsuario_fkey" FOREIGN KEY ("IdUsuario") REFERENCES "Usuario"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_IdInstitucion_fkey" FOREIGN KEY ("IdInstitucion") REFERENCES "Institucion"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
