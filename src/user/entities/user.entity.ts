import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  identification: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ default: true })
  isActive: boolean;
}
