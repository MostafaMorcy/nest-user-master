// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNumber()
  streetNumber: number;
}

class BasicInfoDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

export class CreateUserDto {
  @ApiProperty({ type: BasicInfoDto })
  @ValidateNested()
  @Type(() => BasicInfoDto)
  basicInfo: BasicInfoDto;

  @ApiProperty({ enum: ['USER', 'ADMIN'], default: 'USER' })
  @IsEnum(['USER', 'ADMIN'])
  role: 'USER' | 'ADMIN';
}
