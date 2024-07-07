import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto, CreateUserDtoSchema } from './create-user.dto';
import { UpdateUserDto, UpdateUserDtoSchema } from './update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const parsedData = CreateUserDtoSchema.parse(data);

    const existingUser = await this.prisma.user.findFirst({
      where: {
        basicInfo: {
          path: ['name'],
          equals: data.basicInfo.name,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return this.prisma.user.create({
      data: {
        ...parsedData,
        basicInfo: JSON.stringify(parsedData.basicInfo),
      },
    });
  }

  async findAll(): Promise<any> {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => {
        const basicInfo = typeof user.basicInfo === 'string' ? JSON.parse(user.basicInfo) : user.basicInfo;

        return {
          id: user.id,
          name: basicInfo.name,
          city: basicInfo.address.city,
          streetNumber: basicInfo.address.streetNumber,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });
    } catch (error) {
      console.error('Error in findAll method:', error);
      throw new Error('Error fetching users');
    }
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const basicInfo = typeof user.basicInfo === 'string' ? JSON.parse(user.basicInfo) : user.basicInfo;

    return {
      id: user.id,
      name: basicInfo.name,
      city: basicInfo.address.city,
      streetNumber: basicInfo.address.streetNumber,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id: number, data: UpdateUserDto): Promise<any> {
    const parsedData = UpdateUserDtoSchema.parse(data);

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingBasicInfo = typeof user.basicInfo === 'string' ? JSON.parse(user.basicInfo) : user.basicInfo;

    const updatedBasicInfo = {
      ...existingBasicInfo,
      ...parsedData.basicInfo,
      address: {
        ...existingBasicInfo.address,
        ...parsedData.basicInfo?.address,
      },
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        basicInfo: JSON.stringify(updatedBasicInfo),
        role: parsedData.role ?? user.role,
      },
    });

    return updatedUser;
  }

  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.delete({ where: { id } });
  }
}
