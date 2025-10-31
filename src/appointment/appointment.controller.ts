import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AssignAppointmentDto } from './dto/assign-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}


  @Get('agenda/:specialty')
  getAppointmentsWithAgenda(@Param('specialty') specialty: string, @Query('timeSlot') timeSlot?: 'AM' | 'PM') {
    return this.appointmentService.getAppointmentsWithAgenda(specialty, timeSlot);
  }


  @Post('assign')
  async create(@Body() assignAppointmentDto: AssignAppointmentDto) {
    const result = await this.appointmentService.assign(assignAppointmentDto);
    if (result.statusCode === 404) {
      throw new NotFoundException(result.message);
    }
    if (result.statusCode === 400) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Get('check/:userId')
  check(@Param('userId') userId: string) {
    return this.appointmentService.check(userId);
  }

  @Post('cancel')
  async cancel(@Body() cancelAppointmentDto: CancelAppointmentDto) {
    const result = await this.appointmentService.cancel(cancelAppointmentDto);
    if (result.statusCode === 404) {
      throw new NotFoundException(result.message);
    }
    if (result.statusCode === 400) {
      throw new BadRequestException(result.message);
    }
    return result;
  }
}
