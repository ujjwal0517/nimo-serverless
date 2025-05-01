import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CryptoSearchRequest {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt({ message: 'limit must be an integer' })
    limit?: number;
  
    @IsOptional()
    @IsString({ message: 'lastKey must be a string' })
    lastKey?: string;
}