import { Module } from "@nestjs/common";
import { DriverModule } from "./driver/driver.module";
import { PassengerModule } from './passenger/passenger.module';


@Module({
  imports: [DriverModule, PassengerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
