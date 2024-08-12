import { Module } from "@nestjs/common";
import { DriverModule } from "./driver/driver.module";
import { PassengerModule } from './passenger/passenger.module';
import { TripModule } from './trip/trip.module';


@Module({
  imports: [DriverModule, PassengerModule, TripModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
