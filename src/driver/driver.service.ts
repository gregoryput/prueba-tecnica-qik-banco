import { Injectable } from "@nestjs/common";
import { Driver } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class DriverService {
  
  constructor(private prisma: PrismaService) {}

  //obtener una lista de todos los conductores 
  async getDriver(): Promise<Driver[]>{
    return this.prisma.driver.findMany();

  }

  //obtener una lista de todos los controladores disponibles 
  async getDriverActives(): Promise<Driver[]>{
    return this.prisma.driver.findMany({
      where: {
        isStatus: false // esto solo traera los que no estan en un viaje 
      }
    });

  }
  
  /// obtener un conductor por ID 
  async getDriverbyID(id: number): Promise<Driver>{
    return this.prisma.driver.findUnique({
      where: {
        driver_id:id
      }
    });
    
  }
  // obtenga una lista de todos los conductores disponibles en un radio de 3km para una ubicacion especifica 
  
  async getDriversInRadius(latitude: number, longitude: number): Promise<any> {
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
    ORDER BY distance;
`;

return drivers;

  }
}


