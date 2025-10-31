import { Agenda } from 'src/appointment/entities/agenda.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Physician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column()
  specialty: string;

  @OneToMany(() => Appointment, (appointment) => appointment.physician)
  appointments: Appointment[];

  @OneToMany(() => Agenda, (agenda) => agenda.physician)
  agendas: Agenda[];
}
