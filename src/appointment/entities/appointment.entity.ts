import { Physician } from 'src/user/entities/physician.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Agenda } from './agenda.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  date: string;

  @Column('time')
  time: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @ManyToOne(() => User, (user) => user.appointments, {nullable: true})
  user?: User;

  @ManyToOne(() => Physician, (physician) => physician.appointments)
  physician: Physician;

  @ManyToOne(() => Agenda, (agenda) => agenda.appointments)
  agenda: Agenda;
}
