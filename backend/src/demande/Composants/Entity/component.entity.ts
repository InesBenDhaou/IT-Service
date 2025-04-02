import { Category } from 'src/demande/Categories/Entity/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class Component {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable : true})
  componentImg : string ;

  @Column('text', { nullable: true }) 
  description: string;

  // Many components belong to one category
  @ManyToOne(() => Category, category => category.components)
  category: Category;
}
