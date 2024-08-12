import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Insertar conductores
  await prisma.driver.createMany({
    data: [
      {
        first_name: "John",
        last_name: "Doe",
        license_number: "D1234567",
        phone_number: "123-456-7890",
        email_address: "john.doe@example.com",
        registration_date: new Date("2024-08-10T08:30:00Z"),
        location: {
          type: "Point",
          coordinates: [-73.935242, 40.73061],
        },
        isStatus: false,
      },
      {
        first_name: "Jane",
        last_name: "Smith",
        license_number: "D7654321",
        phone_number: "098-765-4321",
        email_address: "jane.smith@example.com",
        registration_date: new Date("2024-08-10T09:00:00Z"),
        location: {
          type: "Point",
          coordinates: [-74.006, 40.7128],
        },
        isStatus: false,
      },
    ],
  });

  // Insertar pasajeros
  await prisma.passenger.createMany({
    data: [
      {
        first_name: "Alice",
        last_name: "Johnson",
        phone_number: "321-654-9870",
        email_address: "alice.johnson@example.com",
        registration_date: new Date("2024-08-10T10:15:00Z"),
        location: {
          type: "Point",
          coordinates: [-73.98513, 40.758],
        },
      },
      {
        first_name: "Bob",
        last_name: "Brown",
        phone_number: "654-321-0987",
        email_address: "bob.brown@example.com",
        registration_date: new Date("2024-08-10T11:30:00Z"),
        location: {
          type: "Point",
          coordinates: [-74.01, 40.73],
        },
      },
    ],
  });

  // Insertar viajes
  await prisma.trip.createMany({
    data: [
      {
        passenger_id: 1,
        driver_id: 1,
        start_time: new Date("2024-08-10T10:00:00Z"),
        end_time: new Date("2024-08-10T10:30:00Z"),
        status: "Completed",
        start_location: {
          type: "Point",
          coordinates: [-73.98513, 40.758],
        },
        end_location: {
          type: "Point",
          coordinates: [-73.935242, 40.73061],
        },
        total_distance: 5.0,
      },
      {
        passenger_id: 2,
        driver_id: 2,
        start_time: new Date("2024-08-10T11:00:00Z"),
        status: "In_progress",
        start_location: {
          type: "Point",
          coordinates: [-74.01, 40.73],
        },
        end_location: null,
        total_distance: null,
      }
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
