import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'], default: 'USER' })
  role?: 'USER' | 'ADMIN';
}


