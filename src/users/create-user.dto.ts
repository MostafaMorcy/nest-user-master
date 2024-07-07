import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const AddressSchema = z.object({
  city: z.string(),
  streetNumber: z.number(),
});

const BasicInfoSchema = z.object({
  name: z.string(),
  address: AddressSchema,
});

export const CreateUserDtoSchema = z.object({
  basicInfo: BasicInfoSchema,
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

class AddressDto {
  @ApiProperty()
  city: string;

  @ApiProperty()
  streetNumber: number;
}

class BasicInfoDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: AddressDto })
  address: AddressDto;
}

export class CreateUserDtoSwagger {
  @ApiProperty({ type: BasicInfoDto })
  basicInfo: BasicInfoDto;

  @ApiProperty({ enum: ['USER', 'ADMIN'], default: 'USER' })
  role: 'USER' | 'ADMIN';
}
