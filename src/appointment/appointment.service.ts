import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AgendaAppointmentDto } from './dto/agenda-appointment.dto';

@Injectable()
export class AppointmentService {

  constructor(
    @InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>,
  ) {}

  async getAppointmentsWithAgenda(specialty: string, timeSlot?: 'AM' | 'PM'): Promise<AgendaAppointmentDto[]> {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.physician', 'physician')
      .leftJoinAndSelect('appointment.agenda', 'agenda')
      .leftJoinAndSelect('agenda.medicalCenter', 'medicalCenter')
      .where('physician.specialty = :specialty', { specialty })
      .andWhere('agenda.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('appointment.date >= :today', { today: new Date().toISOString().split('T')[0] })
      .orderBy('appointment.date', 'ASC');

    if (timeSlot) {
      if (timeSlot === 'AM') {
        query.andWhere('appointment.time < :noon', { noon: '12:00:00' });
      } else if (timeSlot === 'PM') {
        query.andWhere('appointment.time >= :noon', { noon: '12:00:00' });
      }
    }
    const result = await query.getMany();
    return this.handleResult(result);
  }

  private handleResult(result: Appointment[]): AgendaAppointmentDto[] {

    return result.map(appointment => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      isConfirmed: appointment.isConfirmed,
      physicianName: appointment.physician.name,
      physicianSpecialty: appointment.physician.specialty,
      medicalCenter: appointment.agenda.medicalCenter.name,
      medicalCenterAddress: appointment.agenda.medicalCenter.address,
    })); 
      
  }

  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

  findAll() {
    return `This action returns all appointment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
