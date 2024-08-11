import { Controller, Get, Param, ParseFloatPipe, Query } from '@nestjs/common';
import { PassengerService } from './passenger.service';

@Controller("passengers")
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}


  @Get()
  async getPassenger(){
    return this.passengerService.getPassengers();
  }

  @Get("passenger/:id")
  async getPassengerbyID(@Param("id") id:string){
    return this.passengerService.getPassengerbyID(Number(id));
  }


  @Get("localization")
  async getDriversForPassenger( 
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,)
     {
    return this.passengerService.getDriversInRadiusForPassenger(Number(latitude), Number(longitude));
  }
}
