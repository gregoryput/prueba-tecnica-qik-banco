import { Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query } from '@nestjs/common';
import { PassengerService } from './passenger.service';

@Controller("passengers")
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}


  @Get()
async getPassengers() {
  const passengers = await this.passengerService.getPassengers();
  
  

  return passengers;
}

@Get("/localization")
async getDriversForPassenger(
  @Query('latitude', ParseFloatPipe) latitude: ParseFloatPipe,
  @Query('longitude', ParseFloatPipe) longitude: ParseFloatPipe,
) {
  const drivers = await this.passengerService.getDriversInRadiusForPassenger(latitude, longitude);
  return drivers;
}

@Get("/:id")
async getPassengerByID(@Param('id', ParseIntPipe) id: string) {
  const passenger = await this.passengerService.getPassengerbyID(Number(id));

  return passenger;
}


}
