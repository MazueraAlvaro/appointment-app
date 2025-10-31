import { Physician } from 'src/user/entities/physician.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { MedicalCenter } from './medical-center.entity';

@Entity()
export class Agenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @Column()
  isAvailable: boolean;

  @ManyToOne(() => Physician, (physician) => physician.agendas)
  physician: Physician;

  @OneToMany(() => Appointment, (appointment) => appointment.agenda)
  appointments: Appointment[];

  @ManyToOne(() => MedicalCenter, (medicalCenter) => medicalCenter.agendas)
  medicalCenter: MedicalCenter;
}
