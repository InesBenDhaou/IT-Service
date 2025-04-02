import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class Localisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  placeName: string;

}

