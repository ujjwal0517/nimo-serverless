import 'reflect-metadata';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CryptoRequest {
    @IsString()
    @IsNotEmpty()
    crypto!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string

}