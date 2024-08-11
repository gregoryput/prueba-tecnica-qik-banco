-- CreateTable
CREATE TABLE "Driver" (
    "driver_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "phone_number" TEXT,
    "email_address" TEXT,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" JSONB NOT NULL,
    "isStatus" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("driver_id")
);

-- CreateTable
CREATE TABLE "Passenger" (
    "passenger_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "email_address" TEXT,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" JSONB NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("passenger_id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "trip_id" SERIAL NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "status" VARCHAR(50) NOT NULL,
    "start_location" JSONB,
    "end_location" JSONB,
    "total_distance" DOUBLE PRECISION,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("trip_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_license_number_key" ON "Driver"("license_number");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_phone_number_key" ON "Driver"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_address_key" ON "Driver"("email_address");

-- CreateIndex
CREATE UNIQUE INDEX "Passenger_phone_number_key" ON "Passenger"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Passenger_email_address_key" ON "Passenger"("email_address");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "Passenger"("passenger_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;
