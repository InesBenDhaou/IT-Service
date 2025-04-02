import { Categorie } from 'src/interfaces/KnowledgeCategory';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Type } from 'src/interfaces/Type';

@Entity()
export class Knowledgebase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  lien: string;

  @Column()
  categorie: Categorie; //Technologies et Outils , Sécurité Informatique ,Ressources Humaines ,Support Technique,Gestion de Projet,Formation et Développement...

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  added_at: Date;

  @Column()
  isConfirmed: boolean;

  @Column()
  type: Type;

  @Column()
  createrId: number;

}
