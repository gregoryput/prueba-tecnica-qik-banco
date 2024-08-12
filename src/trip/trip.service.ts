import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Trip } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TripDto } from './dto/createTrip.dto';
import { changerTripStatusDto } from './dto/changeTrip.dto';

@Injectable()
export class TripService {
  constructor(private readonly prisma: PrismaService) { }


  //obtener los viajes activos 
  async getTripProgress(): Promise<Trip[]> {
    
    const trips = this.prisma.trip.findMany({
      where: {
        status: "in_progress"
      }
    })

    if (!trips) {
      throw new NotFoundException('No trips in progress found');
    }
    
    return trips
  }

  //crear nuevo viaje para asignando un conductor y un pasajero 
  async createTrip(data: TripDto): Promise<Trip> {
    const { start_location, end_location, ...tripData } = data;

    // Verifica si el viaje existe antes de actualizarlo
    const existingDriver = await this.prisma.driver.findUnique({
      where: { driver_id: data.driver_id },
    });

    const existingPassenger = await this.prisma.passenger.findUnique({
      where: { passenger_id: data.passenger_id },
    });


    if(!existingDriver){
      throw new NotFoundException(`Driver with ID ${data.driver_id} not found`);
    }

    if (!existingDriver.isStatus) {
      throw new BadRequestException(`Driver with ID ${existingDriver.driver_id} is currently on a trip and cannot be updated.`);
    }

    if(!existingPassenger){
      throw new NotFoundException(`Passenger with ID ${data.driver_id} not found`);
    }

      // Verifica si el estado es "In_progress" antes de actualizar
      if (data.status !== 'In_progress') {
        throw new BadRequestException(`Trip cannot be updated to status "${data.status}"`);
      }



    // Mapeo para la estructura esperada por Prisma
    const mappedData = {
      ...tripData,
      start_location: {
        type: start_location.type,
        coordinates: [start_location.coordinates[1], start_location.coordinates[0]],
      },
      end_location: {
        type: end_location.type,
        coordinates: [end_location.coordinates[1], end_location.coordinates[0]],
      },
    };
 // aqui cambiamos el estado de driver que comenzo un viaje en progreso
    await this.prisma.driver.update({
      where:{
        driver_id:data.driver_id
      },
      data:{
        isStatus:false
      }
    })



    return this.prisma.trip.create({
      data: mappedData,
    });


  }

  async changeTrip(data: changerTripStatusDto): Promise<Trip> {
    const { trip_id, status } = data;

    // Verifica si el viaje existe antes de actualizarlo
    const existingTrip = await this.prisma.trip.findUnique({
      where: { trip_id: trip_id },
    });

    if (!existingTrip) {
      throw new NotFoundException(`Trip with ID ${trip_id} not found`);
    }

    

    // Verifica si el estado es "Complete" antes de actualizar
    if (status !== 'Complete') {
      throw new BadRequestException(`Trip cannot be updated to status "${status}"`);
    }

    // Actualiza el estado del viaje
    const updatedTrip = await this.prisma.trip.update({
      where: { trip_id: trip_id },
      data: { status },
    });

    return updatedTrip;
  }

}

