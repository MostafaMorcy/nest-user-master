// update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  streetNumber?: number;
}

class BasicInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;
}

export class UpdateUserDto {
  @ApiProperty({ type: BasicInfoDto })
  @ValidateNested()
  @Type(() => BasicInfoDto)
  @IsOptional()
  basicInfo?: BasicInfoDto;

  @ApiProperty({ enum: ['USER', 'ADMIN'] })
  @IsEnum(['USER', 'ADMIN'])
  @IsOptional()
  role?: 'USER' | 'ADMIN';
}
