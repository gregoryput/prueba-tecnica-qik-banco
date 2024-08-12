import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Insertar conductores
  await prisma.driver.createMany({
    data: [
      {
        first_name: "Manuel",
        last_name: "Montilla",
        license_number: "A1234567",
        phone_number: "809-456-5591",
        email_address: "montilla@example.com",
        registration_date: new Date("2024-08-10T08:30:00Z"),
        location: {
          type: "Point",
          coordinates: [18.433001540514425, -68.99323459460189], ///multiplaza la romana 
        },
        isStatus: false,
      },
      {
        first_name: "Enrique",
        last_name: "Montez",
        license_number: "B1654321",
        phone_number: "809-665-7382",
        email_address: "Enrique@example.com",
        registration_date: new Date("2024-08-10T09:00:00Z"),
        location: {
          type: "Point",
          coordinates: [18.427763373825332, -68.96400383399572], /// super mercado iberia la romana
        },
        isStatus: false,
      },
      {
        first_name: "Jorge",
        last_name: "Guerrero",
        license_number: "C12354321",
        phone_number: "809-432-7983",
        email_address: "jorge@example.com",
        registration_date: new Date("2024-08-10T09:00:00Z"),
        location: {
          type: "Point",
          coordinates: [18.424168461216198, -68.96515862947645], /// plaza lama la romana 
        },
        isStatus: true,
      },
      {
        first_name: "Oscar",
        last_name: "Martinez",
        license_number: "D177754421",
        phone_number: "809-576-9054",
        email_address: "oscar@example.com",
        registration_date: new Date("2024-08-10T09:00:00Z"),
        location: {
          type: "Point",
          coordinates: [18.423322653420424, -68.96750550842292], /// parque central la romana 
        },
        isStatus: true,
      },
      {
        first_name: "Ramon",
        last_name: "Peralta",
        license_number: "E127753331",
        phone_number: "809-165-7625",
        email_address: "ramon@example.com",
        registration_date: new Date("2024-08-10T09:00:00Z"),
        location: {
          type: "Point",
          coordinates: [18.42276754824165, -68.99160436157057], /// universidad o&m la romana 
        },
        isStatus: true,
      },
      {
        first_name: "Maria",
        last_name: "Altagracia",
        license_number: "T1230899",
        phone_number: "809-345-7776",
        email_address: "maria@example.com",
        registration_date: new Date("2024-08-10T09:00:00Z"),
        location: {
          type: "Point",
          coordinates: [18.44405656711194, -69.03843841352318], /// villa hermosa  la romana 
        },
        isStatus: true,
      },
    ],
  });

  // Insertar pasajeros
  await prisma.passenger.createMany({
    data: [
      {
        first_name: "Frandy",
        last_name: "Cedano",
        phone_number: "809-444-9870",
        email_address: "Frandy@example.com",
        registration_date: new Date("2024-08-10T10:15:00Z"),
        location: {
          type: "Point",
          coordinates: [18.42662967404637, -68.96731797690217], /// de aza tecnoloiga 
        },
        isStatus: false,
      },
      {
        first_name: "Ana",
        last_name: "Rodriguez",
        phone_number: "809-126-4321",
        email_address: "ana@example.com",
        registration_date: new Date("2024-08-10T11:30:00Z"),
        location: {
          type: "Point",
          coordinates: [18.433001540514425, -68.99323459460189], /// multiplaza la romana 
        },
        isStatus: false,
      },
      {
        first_name: "Leandro",
        last_name: "Reyes",
        phone_number: "809-126-4567",
        email_address: "leandro@example.com",
        registration_date: new Date("2024-08-10T11:30:00Z"),
        location: {
          type: "Point",
          coordinates: [18.418669519250365, -68.96727392552728], /// jumbo la romana 
        },
        isStatus: true,
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
        status: "in_progress",
        start_location: {
          type: "Point",
          coordinates: [18.433001540514425, -68.99323459460189], //multiplaza la romana 
        },
        end_location: {
          type: "Point",
          coordinates: [18.42275390129619, -68.99145334187007], /// universidad o&m la romana 
        },
        total_distance: 5.0,
      },
      {
        passenger_id: 2,
        driver_id: 2,
        start_time: new Date("2024-08-10T11:00:00Z"),
        status: "in_progress",
        start_location: {
          type: "Point",
          coordinates: [18.42662967404637, -68.96731797690217], /// de aza tecnologia
        },
        end_location:[18.440168187878292, -69.01734777181639], /// hospital villa hermosa 
        total_distance: 3.0,
      }
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
