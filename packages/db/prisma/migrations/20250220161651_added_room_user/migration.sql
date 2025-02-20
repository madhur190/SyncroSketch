-- CreateEnum
CREATE TYPE "RoomMode" AS ENUM ('PRIVATE', 'VIEW_ONLY', 'OPEN');

-- AlterTable
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Chat_id_key";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "mode" "RoomMode" NOT NULL DEFAULT 'PRIVATE',
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Room_id_key" CASCADE;

-- CreateTable
CREATE TABLE "RoomUser" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "RoomUser_pkey" PRIMARY KEY ("userId","roomId")
);

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
