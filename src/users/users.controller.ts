import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { CreateUserDtoSwagger, CreateUserDtoSchema } from './create-user.dto';
import { UpdateUserDtoSwagger, UpdateUserDtoSchema } from './update-user.dto';
import { ApiKeyGuard } from '../gurd/api-key.guard';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';

@ApiTags('users')
@ApiSecurity('api-key')
@Controller('users')
@UseGuards(ApiKeyGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body(new ZodValidationPipe(CreateUserDtoSchema)) createUserDto: CreateUserDtoSwagger) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  update(@Param('id') id: string, @Body(new ZodValidationPipe(UpdateUserDtoSchema)) updateUserDto: UpdateUserDtoSwagger) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
