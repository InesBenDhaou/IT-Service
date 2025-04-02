import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Poste } from '../Poste/poste.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @OneToMany(() => Poste, (poste) => poste.department)
  postes: Poste[];
}
