import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const AddressSchema = z.object({
  city: z.string().optional(),
  streetNumber: z.number().optional(),
});

const BasicInfoSchema = z.object({
  name: z.string().optional(),
  address: AddressSchema.optional(),
});

export const UpdateUserDtoSchema = z.object({
  basicInfo: BasicInfoSchema.optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;

class AddressDto {
  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  streetNumber?: number;
}

class BasicInfoDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ type: AddressDto })
  address?: AddressDto;
}

export class UpdateUserDtoSwagger {
  @ApiPropertyOptional({ type: BasicInfoDto })
  basicInfo?: BasicInfoDto;

  @ApiPropertyOptional({ enum: ['USER', 'ADMIN'] })
  role?: 'USER' | 'ADMIN';
}
