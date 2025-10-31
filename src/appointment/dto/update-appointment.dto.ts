import { PartialType } from '@nestjs/mapped-types';
import { AssignAppointmentDto } from './assign-appointment.dto';

export class UpdateAppointmentDto extends PartialType(AssignAppointmentDto) {}
