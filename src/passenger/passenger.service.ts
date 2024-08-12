import { Driver, Passenger } from '@prisma/client';
import { Injectable, NotFoundException, ParseFloatPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PassengerService {

    constructor(private prisma: PrismaService) { }

    //obtener una lista de todos los pasajeros
    async getPassengers(): Promise<Passenger[]> {

        const passengers = this.prisma.passenger.findMany();
        if (!passengers) {
            throw new NotFoundException('No passengers found');
          }
        return passengers;
    }

    //obtener un pasajero por ID 
    async getPassengerbyID(id: number): Promise<Passenger> {
        const passenger = this.prisma.passenger.findFirst({
            where: {
                passenger_id: id
            }
        })
        
        
        if ((await passenger)?.passenger_id == undefined) {
            throw new NotFoundException(`Passenger with ID ${id} not found`);
          }
        
        return passenger
    }

    // obtenga una lista de  los 3  conductores disponibles en un radio de 3km  
    async getDriversInRadiusForPassenger(latitude: ParseFloatPipe, longitude: ParseFloatPipe): Promise<Driver[]> {

        
        const drivers = await this.prisma.$queryRaw<Driver[]>`
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
                ) <= ${3} -- Distancia en kilómetros 
                AND  "isStatus" = true
            ORDER BY distance
            LIMIT 3;
            `;

        if (!drivers || drivers.length === 0) {
            throw new NotFoundException('No drivers found  location');
        }

        return drivers;

    }
}
