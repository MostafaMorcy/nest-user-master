import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
        let basicInfo;
        if (typeof user.basicInfo === 'string') {
          try {
            basicInfo = JSON.parse(user.basicInfo) as { name: string; address: { city: string; streetNumber: number } };
          } catch (error) {
            console.error('Error parsing basicInfo:', error);
            throw new Error(`Invalid JSON format for user ID ${user.id}`);
          }
        } else if (typeof user.basicInfo === 'object') {
          basicInfo = user.basicInfo as { name: string; address: { city: string; streetNumber: number } };
        } else {
          throw new Error(`Unexpected type for basicInfo for user ID ${user.id}`);
        }

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
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      let basicInfo;
      if (typeof user.basicInfo === 'string') {
        try {
          basicInfo = JSON.parse(user.basicInfo) as { name: string; address: { city: string; streetNumber: number } };
        } catch (error) {
          console.error('Error parsing basicInfo:', error);
          throw new Error(`Invalid JSON format for user ID ${user.id}`);
        }
      } else if (typeof user.basicInfo === 'object') {
        basicInfo = user.basicInfo as { name: string; address: { city: string; streetNumber: number } };
      } else {
        throw new Error(`Unexpected type for basicInfo for user ID ${user.id}`);
      }
  
      return {
        id: user.id,
        name: basicInfo.name,
        city: basicInfo.address.city,
        streetNumber: basicInfo.address.streetNumber,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error in findOne method:', error);
      throw new Error('Error fetching user');
    }
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

    const updatedData = {
      basicInfo: updatedBasicInfo,
      role: parsedData.role ?? user.role,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
    return updatedUser;
  }

  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
