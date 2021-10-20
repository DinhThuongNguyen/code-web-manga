-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'AUTHOR');

-- CreateEnum
CREATE TYPE "QuocGia" AS ENUM ('NhatBan', 'HanQuoc', 'TrungQuoc', 'VietNam');

-- CreateEnum
CREATE TYPE "NhomTruyen" AS ENUM ('TruyenTranh', 'truyenChu');

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Truyen" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tentruyen" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "theloaiId" UUID[],
    "authorId" UUID NOT NULL,
    "view" INTEGER NOT NULL DEFAULT 0,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "country" "QuocGia" NOT NULL DEFAULT E'NhatBan',
    "loaitruyen" "NhomTruyen" NOT NULL DEFAULT E'TruyenTranh',
    "trangthai" TEXT NOT NULL DEFAULT E'Đang cập nhật',

    CONSTRAINT "Truyen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChuongTruyen" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "images" TEXT[],
    "textChuong" TEXT[],
    "truyenId" UUID NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChuongTruyen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TheLoai" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "get" BOOLEAN NOT NULL,

    CONSTRAINT "TheLoai_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Truyen_tentruyen_key" ON "Truyen"("tentruyen");

-- CreateIndex
CREATE UNIQUE INDEX "TheLoai_name_key" ON "TheLoai"("name");

-- AddForeignKey
ALTER TABLE "Truyen" ADD CONSTRAINT "Truyen_theloaiId_fkey" FOREIGN KEY ("theloaiId") REFERENCES "TheLoai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Truyen" ADD CONSTRAINT "Truyen_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChuongTruyen" ADD CONSTRAINT "ChuongTruyen_truyenId_fkey" FOREIGN KEY ("truyenId") REFERENCES "Truyen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
