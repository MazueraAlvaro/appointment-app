import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Agenda } from "./agenda.entity";

@Entity()
export class MedicalCenter {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phoneNumber: string;

    @OneToMany(() => Agenda, (agenda) => agenda.medicalCenter)
    agendas: Agenda[];
}