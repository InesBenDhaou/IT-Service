import { Role } from "src/interfaces/Role";
import { Entity, PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userName: string;

    @Column()
    userLastName: string;

    @Column()
    email: string;

    @Column()
    numTel: string;

    @Column()
    poste: string;

    @Column()
    department: string;

    @Column()
    password: string;
    
    @Column()
    role: Role;

    @Column({default : "Paris,France"})
    localisation: string;

    @Column({default: 'defaultProfilePhoto.jpg' })
    profileImg: string;

    @Column({nullable : true})
    contactManager: string;

    
}