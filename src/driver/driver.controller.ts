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
  constructor(private readonly driverService: DriverService) { }

  // Obtener todos los conductores
  @Get()
  async getDrivers() {
      return await this.driverService.getDriver();
  }

  // Obtener conductores por disponibilidad
  @Get("/status")
  async getActives() {
    const driverStatus = await this.driverService.getDriverActives();

    return driverStatus;
  }


  // Obtener conductores por localización
  @Get("/localization")
  async getDriverByLocalization(
    @Query('latitude', ParseFloatPipe) latitude: ParseFloatPipe,
    @Query('longitude', ParseFloatPipe) longitude: ParseFloatPipe,
  ) {
    const drivers = await this.driverService.getDriversInRadius(latitude, longitude);
    return drivers;
  }


  // Obtener conductor por ID
  @Get('/:id')
  async getDriverByID(@Param('id') id: string) {

    const driver = await this.driverService.getDriverbyID(Number(id));
    return driver;

  }


}
