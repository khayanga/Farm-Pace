-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('daily', 'weekly', 'monthly', 'yearly', 'custom');

-- CreateTable
CREATE TABLE "RecurringTask" (
    "id" SERIAL NOT NULL,
    "farm_id" TEXT NOT NULL,
    "farmCrop_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskType" "TaskType" NOT NULL,
    "color" TEXT,
    "frequency" "RecurrenceFrequency" NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringTaskException" (
    "id" SERIAL NOT NULL,
    "recurringTask_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isSkipped" BOOLEAN NOT NULL DEFAULT false,
    "modifiedTitle" TEXT,
    "modifiedTime" TEXT,
    "modifiedDate" TIMESTAMP(3),

    CONSTRAINT "RecurringTaskException_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_farmCrop_id_fkey" FOREIGN KEY ("farmCrop_id") REFERENCES "FarmCrop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTaskException" ADD CONSTRAINT "RecurringTaskException_recurringTask_id_fkey" FOREIGN KEY ("recurringTask_id") REFERENCES "RecurringTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
