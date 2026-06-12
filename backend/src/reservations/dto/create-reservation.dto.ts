import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  date!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  time!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  timeLabel!: string;

  @IsInt()
  @Min(1)
  @Max(50)
  guests!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;

  @IsBoolean()
  decoration!: boolean;
}
