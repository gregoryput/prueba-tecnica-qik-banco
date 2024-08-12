import { Body, Controller, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripDto } from './dto/createTrip.dto';
import { changerTripStatusDto } from './dto/changeTrip.dto';

@Controller("trip")
export class TripController {
  constructor(private readonly tripService: TripService) { }

  // Obtener lista de viajes en proceso
  @Get()
  async getTripInProgress() {
    const trips = await this.tripService.getTripProgress();
    return trips;
  }

  // Crear nuevo viaje
  @Post()
  @UsePipes(new ValidationPipe())
  async createTrip(@Body() data: TripDto) {
    const newTrip = await this.tripService.createTrip(data);
    return newTrip;

  }

  // Cambiar el estado de un viaje para completarlo
  @Patch()
  @UsePipes(new ValidationPipe())
  async changeTripstatus(@Body() data: changerTripStatusDto) {

    const updatedTrip = await this.tripService.changeTrip(data);
    return updatedTrip;

  }

}
