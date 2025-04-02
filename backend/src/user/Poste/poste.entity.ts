import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from '../Department/department.entity';


@Entity()
export class Poste {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @ManyToOne(() => Department, (department) => department.postes)
  department: Department;

  @Column({nullable : true})
  departmentId: number;
}


