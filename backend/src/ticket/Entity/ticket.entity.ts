import { StatusTicket } from "src/interfaces/StatusTicket";
import { Urgence } from "src/interfaces/Urgence";
import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn } from "typeorm";

@Entity()
export class Ticket {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    titre: string;

    @Column()
    description: string;

    @Column()
    urgence: Urgence;

    @Column()
    status: StatusTicket;

    @CreateDateColumn({ type: 'timestamp' })
    dateCreation: Date;

    @Column({ type: 'timestamp', nullable: true }) 
    dateResolution: Date;

    @Column()
    localisation: string;
    
    @Column()
    BenificierTicket: string;

    @Column()
    emailBenificierTicket: string;

    @Column({nullable : true})
    contactManager: string;

    @Column({nullable : true})
    technicienAssocie: string;

    @Column({nullable : true})
    emailTechnicienAssocie: string;



    @Column({nullable : true})
    cmtTech: string;

    @Column({nullable : true})
    feedBack: string;

    @Column("simple-array", { nullable: true })
    piecesJointes: string[];

}