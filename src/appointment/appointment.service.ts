import { Injectable } from '@nestjs/common';
import { AssignAppointmentDto } from './dto/assign-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AgendaAppointmentDto } from './dto/agenda-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';

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
      .andWhere('appointment.user IS NULL')
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
      appointmentId: appointment.id,
      date: appointment.date,
      time: appointment.time,
      isConfirmed: appointment.isConfirmed,
      physicianName: appointment.physician.name,
      physicianSpecialty: appointment.physician.specialty,
      medicalCenter: appointment.agenda.medicalCenter.name,
      medicalCenterAddress: appointment.agenda.medicalCenter.address,
    })); 
      
  }

  async assign(assignAppointmentDto: AssignAppointmentDto) {
    const appointment = await this.appointmentRepository.findOne({where: { id: assignAppointmentDto.appointmentId, user: IsNull()}, relations: ['physician']});

    if (!appointment) {
      return { message: 'Appointment not found or already assigned', statusCode: 404};
    }
    
    const assigned = await this.check(assignAppointmentDto.userId);
    const assignedSameSpecialty = assigned.find(appt => appt.physicianSpecialty === appointment.physician.specialty);
    
    if (assignedSameSpecialty) {
      return { message: 'User already has an appointment with the same specialty', statusCode: 400};
    }

    const result = await this.appointmentRepository.update(assignAppointmentDto.appointmentId, {
      user: { id: assignAppointmentDto.userId },
      isConfirmed: true,
    });
    return { message: 'Appointment assigned successfully', statusCode: 200, result };
  }

  async check(userId: string) {
    const appointments = await this.appointmentRepository.find({
      where: {
        user: { id: userId },
        date: MoreThanOrEqual(new Date().toISOString().split('T')[0]),
      },
      relations: ['physician', 'agenda', 'agenda.medicalCenter'],
    });

    return this.handleResult(appointments);
  }

  async cancel({userId, appointmentId}: CancelAppointmentDto) {
    const assigned = await this.check(userId);
    const appointmentToCancel = assigned.find(appt => appt.appointmentId === appointmentId);

    if (!appointmentToCancel) {
      return { message: 'Appointment not found for this user', statusCode: 404};
    }

    const cancelResult = await this.appointmentRepository.update({ id: appointmentId, user: { id: userId } }, {
      user: null,
      isConfirmed: false,
    });

    return { message: 'Appointment cancelled successfully', statusCode: 200, cancelResult };
  }
}
