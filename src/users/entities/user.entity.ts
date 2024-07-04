import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: number;

  @ApiProperty({
    example: { name: 'John Doe', address: { city: 'New York', streetNumber: '123' } },
    description: 'Basic information of the user',
  })
  basicInfo: {
    name: string;
    address: {
      city: string;
      streetNumber: string;
    };
  };

  @ApiProperty({ example: 'USER', description: 'The role of the user' })
  role: string;

  @ApiProperty({ example: '2023-07-02T00:00:00.000Z', description: 'The date the user was created' })
  createdAt: Date;

  @ApiProperty({ example: '2023-07-02T00:00:00.000Z', description: 'The date the user was last updated' })
  updatedAt: Date;
}
