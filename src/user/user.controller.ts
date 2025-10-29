import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateUserDto } from './dto/validate-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('validate/:identification/:dateOfBirth')
  async validateUser(
    @Param('identification') identification: string,
    @Param('dateOfBirth') dateOfBirth: string,
  ) {
    const user = await this.userService.validateUser(identification, dateOfBirth);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
