import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PassengerController],
  providers: [PassengerService],
  imports: [PrismaModule]
})
export class PassengerModule {}
