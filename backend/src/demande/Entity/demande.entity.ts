
import { StatusDemande } from "src/interfaces/StatusDemande";
import { Urgence } from "src/interfaces/Urgence";
import { Entity, PrimaryGeneratedColumn,Column, CreateDateColumn } from "typeorm";

@Entity()
export class Demande {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    composant: string;

    @Column()
    categorie: string;

    @Column({default : 'en attente'})
    statusDemande: StatusDemande;

    @CreateDateColumn({ type: 'timestamp' })
    dateDemande: Date;

    @Column({ type: 'timestamp', nullable: true }) 
    dateReponse: Date;
    
    @Column()
    BenificierDemande: string;

    @Column()
    emailBenificierDemande : string;

    @Column({nullable : true})
    technicienAssocie: string;

    @Column({nullable : true})
    emailTechnicienAssocie:string ;

    @Column({nullable : true})
    contactManager: string;

    @Column()
    localisation: string;

    @Column({nullable : true})
    cmtTech : string ;

    @Column({default : 'faible'})
    urgence : Urgence;

    @Column({ nullable: true })
    commentaire : string ;

    @Column("simple-array", { nullable: true })
    piecesJointes: string[];

}