import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class changerTripStatusDto {
  @IsNotEmpty()
  @IsNumber()
  trip_id: number;

  @IsNotEmpty()
  @IsString()
  status: string;
}



export class InvoiceDto {
  
}



