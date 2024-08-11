import { Injectable } from '@nestjs/common';
import { Passenger } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PassengerService {

    constructor(private prisma: PrismaService) {}

    //obtener una lista de todos los pasajeros
    async getPassengers(): Promise<Passenger[]>{
        return this.prisma.passenger.findMany();
    }

    //obtener un pasajero por ID 
    async getPassengerbyID(id:number): Promise<Passenger> {
        return this.prisma.passenger.findFirst({
            where:{
                passenger_id: id
            }
        })
    }

      // obtenga una lista de todos los conductores disponibles en un radio de 3km para una ubicacion especifica 
  
  async getDriversInRadiusForPassenger(latitude: number, longitude: number): Promise<any> {
    const drivers = await this.prisma.$queryRaw`
    SELECT *,
       (
           6371 * acos(
               cos(radians(${latitude})) * cos(radians((location->'coordinates'->>1)::float)) * 
               cos(radians((location->'coordinates'->>0)::float) - radians(${longitude})) + 
               sin(radians(${latitude})) * sin(radians((location->'coordinates'->>1)::float))
           )
       ) AS distance
FROM "Driver"
WHERE (
           6371 * acos(
               cos(radians(${latitude})) * cos(radians((location->'coordinates'->>1)::float)) * 
               cos(radians((location->'coordinates'->>0)::float) - radians(${longitude})) + 
               sin(radians(${latitude})) * sin(radians((location->'coordinates'->>1)::float))
           )
       ) <= ${3000} -- Distancia en kilómetros 
      and  isStatus = 1
ORDER BY distance
LIMIT 3;
`;

return drivers;

  }
}
