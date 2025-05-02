import { IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CryptoSearchRequest {
  @IsOptional()
  @Transform(({ value }) => value !== undefined ? parseInt(value, 10) : undefined)
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  lastKey?: string;
}