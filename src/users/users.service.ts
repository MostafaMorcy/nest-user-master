import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
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
        ...data,
        basicInfo: JSON.stringify(data.basicInfo), // Ensure JSON compatibility
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
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingBasicInfo = typeof user.basicInfo === 'string' ? JSON.parse(user.basicInfo) : user.basicInfo;
    
    const updatedBasicInfo = {
      ...existingBasicInfo,
      ...data.basicInfo,
      address: {
        ...existingBasicInfo.address,
        ...data.basicInfo?.address,
      },
    };

    const updatedData = {
      basicInfo: updatedBasicInfo,
      role: data.role ?? user.role,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
    return updatedUser
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
