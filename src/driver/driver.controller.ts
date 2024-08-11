import {
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  Query,


} from "@nestjs/common";
import { DriverService } from "./driver.service";



@Controller("drivers")  // Cambiado para reflejar la ruta base para todos los métodos
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  // Obtener todos los conductores
  @Get()
  async getDrivers() {
    return this.driverService.getDriver();
  }

  // Obtener conductor por ID
  @Get('driver/:id') 
  async getDriverByID(@Param('id') id: string) {
    return this.driverService.getDriverbyID(Number(id)); 
  }

  // Obtener conductores por disponiblidad 
  @Get("status") 
  async getActives() {
    return this.driverService.getDriverActives(); 
  }

  
  // Obtener conductores por localization
  @Get("localization") 
  async getDriverByLocalization(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {
    return this.driverService.getDriversInRadius(Number(latitude), Number(longitude)); 
  }




}
