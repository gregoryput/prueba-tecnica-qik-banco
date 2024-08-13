import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Trip } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TripDto } from './dto/createTrip.dto';
import { changerTripStatusDto } from './dto/changeTrip.dto';
import { JsonValue } from '@prisma/client/runtime/library';

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

    if ((await trips).length === 0) {
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


    if (!existingDriver) {
      throw new NotFoundException(`Driver with ID ${data.driver_id} not found`);
    }

    if (existingDriver.isStatus === false) {
      throw new BadRequestException(`Driver with ID ${existingDriver.driver_id} is currently on a trip and cannot be updated.`);
    }

    if (!existingPassenger) {
      throw new NotFoundException(`Passenger with ID ${data.passenger_id} not found`);
    }

    if (existingPassenger.isStatus === false) {
      throw new BadRequestException(`Passenger with ID ${existingPassenger.passenger_id} is currently on a trip and cannot be updated.`);
    }


    // Verifica si el estado es "in_progress" antes de actualizar
    if (data.status !== 'in_progress') {
      throw new BadRequestException(`Trip cannot be updated to status "${data.status}"`);
    }


    const statusPassenger = await this.prisma.passenger.findFirst({
      where: {
        passenger_id: existingPassenger.passenger_id
      }
    })

    if (statusPassenger.isStatus == false) {
      throw new BadRequestException("passenger is on a trip");

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
      where: {
        driver_id: data.driver_id
      },
      data: {
        isStatus: false
      }
    })

    await this.prisma.passenger.update({
      where: {
        passenger_id: existingPassenger.passenger_id
      },
      data: {
        isStatus: false
      }
    })



    return this.prisma.trip.create({
      data: mappedData,
    });


  }



  async changeTrip(data: changerTripStatusDto) {
    const { trip_id, status } = data;

    // Verifica si el viaje existe antes de actualizarlo
    const existingTrip = await this.prisma.trip.findUnique({
      where: { trip_id: trip_id },
    });

    if (!existingTrip) {
      throw new NotFoundException(`Trip with ID ${trip_id} not found`);
    }

    // Verifica si el estado es "Complete" antes de actualizar
    if (status !== 'completed') {
      throw new BadRequestException(`Trip cannot be updated to status "${status}"`);
    }

    // Actualiza el estado del viaje
    const updatedTrip = await this.prisma.trip.update({
      where: { trip_id: trip_id },
      data: { status },
    });

    // aqui cambiamos el estado de driver que comenzo un viaje en "Complete" y tambien el conductor estado true de disponible para otro pasajero
    await this.prisma.driver.update({
      where: {
        driver_id: existingTrip.driver_id
      },
      data: {
        isStatus: true
      }
    })

    await this.prisma.passenger.update({
      where: {
        passenger_id: existingTrip.passenger_id
      },
      data: {
        isStatus: true
      }
    })

    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Radio de la Tierra en kilómetros
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distancia en kilómetros
    };
    
    const toRadians = (degrees: number): number => {
      return degrees * (Math.PI / 180);
    };
    
    const isLocation = (value: JsonValue): value is { type: string; coordinates: [number, number] } =>{
      return typeof value === 'object' && value !== null &&
             'type' in value && 'coordinates' in value &&
             Array.isArray(value.coordinates) && value.coordinates.length === 2 &&
             typeof value.coordinates[0] === 'number' && typeof value.coordinates[1] === 'number';
    }

    let result: number;
    if (isLocation(existingTrip.start_location) && isLocation(existingTrip.end_location)) {
      const distance = haversineDistance(
        existingTrip.start_location.coordinates[1], // latitud
        existingTrip.start_location.coordinates[0], // longitud
        existingTrip.end_location.coordinates[1], // latitud
        existingTrip.end_location.coordinates[0]  // longitud
    );
    
      // Calcular el precio
      const pricePerKm = 10; // Precio por kilómetro ejemplo en dolar 
      const totalPrice = distance * pricePerKm;
      result = totalPrice;
    
  } 

    const invoice = {
      "trip_id": existingTrip.trip_id,
      "amount": result,
      "issue_date": new Date(),
    }


    const newInvoice = await this.prisma.invoice.create({ data: invoice })



    return { "trip": updatedTrip, "invoice": newInvoice };
  }

}

