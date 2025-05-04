import 'reflect-metadata';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CryptoRequest {
    @IsString()
    @Transform(({ value }) =>
      typeof value === 'string' && value.trim().length > 0
        ? value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
        : value
    )
    @IsNotEmpty({ message: 'cryptoName should not be empty' })
    cryptoName!: string;
  
    @IsEmail()
    @IsString()
    @Transform(({ value }) =>
      typeof value === 'string' ? value.trim().toLowerCase() : value
    )
    @IsNotEmpty({ message: 'email should not be empty' })
    email!: string;
  }
  