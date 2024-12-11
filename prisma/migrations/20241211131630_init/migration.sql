-- CreateTable
CREATE TABLE "users" (
    "id" CHAR NOT NULL,
    "name" CHAR NOT NULL,
    "lastname" CHAR NOT NULL,
    "email" CHAR NOT NULL,
    "password" CHAR NOT NULL,
    "age" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
